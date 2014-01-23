/**
 * Kity Formula Latex解析器实现
 */

define( function ( require, exports, module ) {

    var Parser = require( "parser" ).Parser,
        FUN = require( "impl/latex/fun" ).operator,
        // 操作符优先级
        PRI = require( "impl/latex/fun" ).priority;

    Parser.register( "latex", Parser.implement( {

        parse: function ( data ) {

            var units = this.split( this.pretreatment( data ) );

            units = this.restructuring( units );

            return this.generateTree( units );

        },

        // 预处理表达式
        pretreatment: function ( data ) {

            var preFn = null;

            // 调用各个操作符来进行预处理
            for ( var op in FUN ) {

                preFn = FUN[ op ].pre;

                if ( preFn ) {
                    data = preFn( data );
                }

            }

            return data;

        },

        split: function ( data ) {

            var units = [],
                leftPattern = /\\{/g,
                rightPattern = /\\}/g,
                leftChar = "\ufeff",
                rightChar = "\ufffc",
                replacePattern = new RegExp( leftChar+"|"+rightChar, "g" ),
                pattern = /(?:\\[a-z0-9]+)|(?:[{}])|(?:[^\\{}])/gi,
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

        /**
         * 根据解析出来的语法单元生成树
         * @param units 单元
         * @return 生成的树对象
         */
        generateTree: function ( units ) {

            var sequenceTree = generate( units );

            return combinationTree( this, sequenceTree );

        },

        // 重新组合语法单元， 但此时的语法单元有可能是经过解析过的对象集合
        recombined: function ( units ) {

            return recombinedTree( this, units );

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

        str = str.length > 1 ? str.replace( "\\", "" ) : str;
        // 对应的函数对象
        str = FUN[ str ];

        return str ? str.name : null;

    }

    /**
     * 把序列化存储的树结构进行整合， 生成最终的解析树
     * @param sequenceTree 序列化存储的树
     */
    function combinationTree ( parser, sequenceTree ) {

        // 已处理过的结果集
        var processedResult = [],
            struct = null,
            textResult = null;

        // 递归到最深的叶子节点上
        for ( var i = 0, len = sequenceTree.length; i < len; i++ ) {

            struct = sequenceTree[ i ];

            if ( isArray( struct ) ) {

                sequenceTree[ i ] = combinationTree( parser, struct );

            }

        }

        // 顺序组合序列存储的树里的语法单元
        processedResult = processOperator( parser, sequenceTree );

        // 合并文本单元
        textResult = mergeText( processedResult );

        // 返回组合了文本单元和其他单元的树对象
        return mergeAllUnits( textResult );

    }

    /**
     * 行为类似于combinationTree，但是不再进行递归处理
     * @param units 需要重组的单元集合
     */
    function recombinedTree ( parser, units ) {

        // 处理文本节点
        units = mergeText( units );

        units = processOperator( parser, units );

        return mergeAllUnits( units );

    }


    /**
     * 处理操作符， 使得语法单元中的操作数根据操作符的规则被组合在一起
     * @return {Array} 返回已经处理过数据操作符后的语法单元数组
     */
    function processOperator ( parser, units ) {

        var unit = null,
            handler = null,
        // 已处理过的结果集
            processedResult = [];

        // 顺序组合序列存储的树里的语法单元
        while ( unit = units.shift() ) {

            if ( typeof unit === "string" ) {

                processedResult.push( unit );

            } else {

                // 已处理过的操作对象， 直接略过
                if ( unit.operand && unit.operand.length > 0 ) {

                    processedResult.push( unit );

                    // 未处理过的语法单元
                } else {

                    // handler代表函数对应的处理器
                    handler = FUN[ unit.originOperator ].handler;
                    // handler代表处理过后的结果集
                    handler = handler.call( parser, unit.operator, units, processedResult );
                    // 验证操作符处理后的结果， 如果验证失败， 会抛出异常
                    validOperatorResult( handler, parser );
                    debugger;
                    processedResult.push( handler );

                }

            }

        }

        return processedResult;

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
        return FUN[ 'combination' ].handler.apply( null, units );

    }

    function validOperatorResult ( result, parser ) {

        var operands = result.operand,
            curOperand = null;

        for ( var i = 0, len = operands.length; i < len; i++ ) {

            curOperand = operands[ i ];

            if ( curOperand && typeof curOperand === 'object' ) {

                // 操作符对象还未被处理过
                if ( curOperand.hasOwnProperty( "originOperator" ) ) {

                    if ( curOperand.empty === false ) {
                        throw new Error( "operator error: " + curOperand.operator + " Untreated" );
                    } else {
                        operands[ i ] = FUN[ curOperand.originOperator ].handler.call( parser, curOperand.operator, [], [] );
                    }

                }

            }

        }

    }

    function isArray ( obj ) {

        return Object.prototype.toString.call( obj ) === '[object Array]';

    }

} );
