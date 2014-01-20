/**
 * Kity Formula Latex解析器实现
 */

define( function ( require, exports, module ) {

    var Parser = require( "parser" ).Parser,
        FUN = require( "impl/latex/fun" );

    Parser.register( "latex", Parser.implement( {

        parse: function ( data ) {

            var units = this.split( data );

            units = this.analyze( units );

            units = this.restructuring( units );

            return this.generateTree( units );

        },

        split: function ( data ) {

            var units = [],
                leftPattern = /\\{/g,
                rightPattern = /\\}/g,
                leftChar = "\ufeff",
                rightChar = "\ufffc",
                replacePattern = new RegExp( leftChar+"|"+rightChar, "g" ),
                pattern = /(?:\\\w+)|(?:[{}])|(?:[^\\{}])/gi,
                match = null;

            data = data.replace( /\s+/g, " " )
                       .replace( replacePattern, "" )
                       .replace( leftPattern, leftChar )
                       .replace( rightPattern, rightChar );

            while ( match = pattern.exec( data ) ) {

                match = match[ 0 ].replace( /\s+/g, "" );

                if ( match ) {

                    units.push( match.replace( replacePattern, function ( char ) {

                        return char === leftChar ? "{" : "}";

                    } ) );

                }

            }

            return units;

        },

        analyze: function ( units ) {

            var result = [];

            for ( var i = 0, curUnit; curUnit = units[ i ]; i++ ) {

                if ( this.isOperand( curUnit ) ) {

                    result = result.concat( this.formatOperand( curUnit ) );

                } else {

                    result.push( curUnit );

                }

            }

            return result;

        },

        /**
         * 对给定的单元进行重组， 使其从序列化的存储转到结构化的存储
         * @param units 需要重组的单元
         * @return {Array} 重组后的单元对象
         */
        restructuring: function ( units ) {

            var root = [],
                // group 栈
                stack = [ root ],
                curGroup = stack[ 0 ];

            for ( var i = 0, currentUnit, len = units.length; i < len; i++ ) {

                switch ( currentUnit = units[ i ] ) {

                    case "{":
                        curGroup.push( [] );
                        curGroup = curGroup[ curGroup.length - 1 ];
                        stack.push( curGroup );
                        break;

                    case "}":
                        stack.pop();
                        curGroup = stack[ stack.length - 1 ];
                        break;

                    default:
                        curGroup.push( currentUnit );

                }

            }

            return root;

        },

        // 验证分割后的单元是否是操作数单元
        isOperand: function ( str ) {

            return /^[^\\{}]/.test( str );

        },

        /**
         * 格式化操作数
         * @param operandStr 操作数字符串
         */
        formatOperand: function ( operandStr ) {

            var result = [],
                match = null,
                formatPattern = /(?:[_+\-\^])|(?:[^_+\-\^]+)/gi;

            while ( match = formatPattern.exec( operandStr ) ) {

                result.push( match[0] );

            }

            return result;

        },

        /**
         * 根据解析出来的语法单元生成树
         * @param units 单元
         * @return 生成的树对象
         */
        generateTree: function ( units ) {

            var sequenceTree = generate( units );

            return combinationTree( sequenceTree );

        }

    } ) );

    /**
     * 生成解析树的内部表示
     */
    function generate ( units ) {

        // 顺序存储的树结构
        var sequenceTree = [];

        for ( var i = 0, currentUnit, len = units.length; i < len; i++ ) {

            currentUnit = units[ i ];

            if ( typeof currentUnit === "string" ) {

                sequenceTree.push( parseStruct( currentUnit ) );

            } else {
                // group

                sequenceTree.push( generate( currentUnit ) );

            }

        }

        return sequenceTree;

    }

    /**
     * 把序列化的字符串表示法转化为中间格式的结构化表示
     */
    function parseStruct ( str ) {

        var operator = getFunctionName( str );

        if ( operator === null ) {

            return str.replace( /\s+/g, "" );

        } else {

            return {
                originOperator: str.replace( "\\", "" ),
                operator: operator,
                operand: []
            };

        }

    }

    /**
     * 根据给定的字符串获取其所对应的函数名称， 如果该字符串不能代表一个函数名称， 则返回null
     * @param str 需要判断的字符串
     */
    function getFunctionName ( str ) {

        if ( /[\\+\-_\^]/.test( str ) ) {

            return FUN[ str.replace( "\\", "" ) ].name;

        }

        return null;

    }

    /**
     * 把序列化存储的树结构进行整合， 生成最终的解析树
     * @param sequenceTree 序列化存储的树
     */
    function combinationTree ( sequenceTree ) {

        // 已处理过的结果集
        var processedResult = [],
            currUnit = null,
            text = null,
            textResult = [],
            handler = null;


        // 递归到最深的叶子节点上
        for ( var i = 0, struct, len = sequenceTree.length; i < len; i++ ) {

            struct = sequenceTree[ i ];

            if ( isArray( struct ) ) {

                sequenceTree[ i ] = combinationTree( struct );

            }

        }


        // 顺序组合序列存储的树里的语法单元
        while ( currUnit = sequenceTree[ 0 ] ) {

            sequenceTree.shift();

            if ( typeof currUnit === "string" ) {

                processedResult.push( currUnit );

            } else {

                // 函数对应的处理器
                handler = FUN[ currUnit.originOperator ].handler;
                processedResult.push( handler( currUnit.operator, sequenceTree, processedResult ) );

            }

        }

        // 合并连续的文本节点
        for ( var i = 0, len = processedResult.length; i < len; i++ ) {

            // 当前处理的语法单元
            currUnit = processedResult[ i ];

            if ( typeof currUnit === "string" ) {

                if ( text === null ) {
                    text = currUnit;
                } else {
                    text += currUnit;
                }

            } else {

                if ( text !== null ) {
                    textResult.push( text );
                    text = null;
                }

                textResult.push( currUnit );

            }

        }

        // 别忘了最后结尾的文本单元
        if ( text !== null ) {
            textResult.push( text );
        }

        // 组合文本单元和其他单元
        textResult.unshift( 'merge' );
        processedResult = FUN[ 'merge' ].handler.apply( null, textResult );

        return processedResult;

    }

    function isArray ( obj ) {

        return Object.prototype.toString.call( obj ) === '[object Array]';

    }

} );
