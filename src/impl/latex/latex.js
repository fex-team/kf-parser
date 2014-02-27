/**
 * Kity Formula Latex解析器实现
 */

define( function ( require, exports, module ) {

    var Parser = require( "parser" ).Parser,
        OP = require( "impl/latex/define/operator" ),
        Utils = require( "impl/latex/base/utils" );

    // data
    var leftChar = "\ufff8",
        rightChar = "\ufffc";

    Parser.register( "latex", Parser.implement( {

        parse: function ( data ) {

            var units = this.split( this.format( data ) );

            units = this.restructuring( units );

            return this.generateTree( units );

        },

        // 格式化输入数据
        format: function ( input ) {

            // 清理多余的空格
            input = clearEmpty( input );

            // 处理输入的“{”和“}”
            input = input.replace( /\\{/gi, leftChar ).replace( /\\}/gi, rightChar );

            // 预处理
            for ( var key in OP ) {

                if ( OP[ key ] && OP[ key ].pre && OP.hasOwnProperty( key ) ) {

                    input = OP[ key ].pre( input );

                }

            }

            return input;

        },

        split: function ( data ) {

            var units = [],
                replacePattern = new RegExp( leftChar+"|"+rightChar, "g" ),
                pattern = /(?:\\[a-z0-9]+\s*)|(?:[{}]\s*)|(?:[^\\{}]\s*)/gi,
                emptyPattern = /^\s+|\s+$/g,
                match = null;

            data = data.replace( emptyPattern, "" )
                       .replace( replacePattern, "" );

            while ( match = pattern.exec( data ) ) {

                match = match[ 0 ].replace( emptyPattern, "" );

                if ( match ) {

                    units.push( match );

                }

            }

            return units;

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
                curGroup = stack[ 0 ],
                replacePattern = new RegExp( leftChar+"|"+rightChar, "g" );

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
                        curGroup.push( currentUnit.replace( replacePattern, function ( char ) {

                            return char === leftChar ? "{" : "}";

                        } ).replace( /\s+/g, "" ) );

                }

            }

            return root;

        },

        /**
         * 根据解析出来的语法单元生成树
         * @param units 单元
         * @return 生成的树对象
         */
        generateTree: function ( units ) {

            return generate( units );

        }

    } ) );

    /**
     * 生成解析树
     */
    function generate ( units ) {

        // 顺序存储的树结构
        var sequenceTree = [];

        // 逆序递归处理每一个语法单元
        for ( var i = 0, currentUnit, len = units.length; i < len; i++ ) {

            currentUnit = units[ i ];

            if ( Utils.isArray( currentUnit ) ) {

                sequenceTree.push( generate( currentUnit ) );

            } else {

                sequenceTree.push( parseStruct( currentUnit ) );

            }

        }


        return combinationTree( preCombinationTree( sequenceTree ) );

    }

    /**
     * 把序列化的字符串表示法转化为中间格式的结构化表示
     */
    function parseStruct ( str ) {

        var type = Utils.getLatexType( str ),
            FUNC_HANDLER = Utils.getFunctionHandler();

        switch ( type ) {

            case "operator":

                return {
                    operator: Utils.getOperatorName( str ),
                    handler: Utils.getOperatorHandler( str )
                };

            case "function":

                return {
                    operator: "Function",
                    handler: FUNC_HANDLER,
                    params: str.replace( /^\\/, "" )
                };

            default:
                // text
                return transformSpecialCharacters( str );

        }

    }

    /**
     * 把序列化存储的树结构进行整合， 生成最终的解析树
     * @param sequenceTree 序列化存储的树
     */
    function combinationTree ( sequenceTree ) {

        // 已处理过的结果集
        var processedResult = [],
            struct = null,
            max_count = 2000;

        while ( sequenceTree.length && --max_count ) {

            struct = sequenceTree.shift();

            if ( Utils.isArray( struct ) ) {

                processedResult.push( combinationTree( struct ) );

            } else if ( typeof struct === "string" ) {

                processedResult.push( struct );

            } else if ( struct.handler ) {
                // 未处理操作符

                processedResult.push( struct.handler.call( struct, processedResult, sequenceTree ) );

            } else {

                //已处理操作符
                processedResult.push( struct );

            }

        }

        if ( max_count === 0 ) {
            throw new Error( 'call stack overflow' );
        }

        // 合并文本单元
        processedResult = mergeText( processedResult );

        // 返回组合了文本单元和其他单元的树对象
        return mergeAllUnits( processedResult );

    }

    /**
     * 组合前的结构预处理
     * @param sequenceStruct 顺序存储的结构
     * @return sequenceStruct 被处理过后的结构
     */
    function preCombinationTree ( sequenceStruct ) {

        for ( var key in OP ) {

            if ( OP[ key ] && OP[ key ].preStructFn && OP.hasOwnProperty( key ) ) {

                sequenceStruct = OP[ key ].preStructFn( sequenceStruct );

            }

        }

        return sequenceStruct;

    }

    /**
     * 合并多个语法单元中连续的文本
     */
    function mergeText ( units ) {

        var result = [],
            text = null,
            currUnit = null;

        // 合并连续的文本节点
        for ( var i = 0, len = units.length; i < len; i++ ) {

            // 当前处理的语法单元
            currUnit = units[ i ];

            if ( typeof currUnit === "string" ) {

                if ( text === null ) {
                    text = currUnit;
                } else {
                    text += currUnit;
                }

            } else {

                if ( text !== null ) {
                    result.push( text );
                    text = null;
                }

                result.push( currUnit );

            }

        }

        // 别忘了最后结尾的文本单元
        if ( text !== null ) {
            result.push( text );
        }

        return result;

    }

    function mergeAllUnits ( units ) {

        if ( units.length === 0 ) {
            return null;
        }

        units.unshift( 'combination' );
        return OP[ 'combination' ].handler.apply( null, units );

    }

    // 转换特殊的文本字符
    function transformSpecialCharacters ( char ) {

        if ( char.indexOf( "\\" ) === 0 ) {
            return char + "\\";
        }

        return char;

    }

    function clearEmpty ( data ) {

        return data.replace( /\\\s+/, "" ).replace( /\s*([^a-z0-9\s])\s*/gi, function ( match, symbol ) {

            return symbol;

        } );

    }

} );
