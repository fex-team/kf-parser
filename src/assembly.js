/*!
 * 装配器
 */

/* jshint forin: false */
/* global kf */

//TODO 重构generateExpression函数
/* 由于有一个大函数，临时把单个函数内的最大语句行数调整一下， 留待以后重构 */
/* jshint maxstatements: 500 */

define( function () {

    var CONSTRUCT_MAPPING = {},
        CURSOR_CHAR = "\uF155";

    /* ---------------------------------- Assembly 对象 */
    function Assembly ( formula ) {

        this.formula = formula;

    }

    Assembly.prototype.generateBy = function ( data ) {

        var tree = data.tree,
            objTree = {},
            selectInfo = {},
            mapping = {};

        if ( typeof tree === "string" ) {

            //TODO return值统一
            throw new Error( 'Unhandled error' );

        } else {

            this.formula.appendExpression( generateExpression( tree, deepCopy( tree ), objTree, mapping, selectInfo ) );

            return {
                select: selectInfo,
                parsedTree: tree,
                tree: objTree,
                mapping: mapping
            };

        }

    };

    Assembly.prototype.regenerateBy = function ( data ) {

        this.formula.clearExpressions();
        return this.generateBy( data );

    };

    /**
     * 根据提供的树信息生成表达式
     * @param tree 中间格式的解析树
     * @return {kf.Expression} 生成的表达式
     */
    function generateExpression ( originTree, tree, objTree, mapping, selectInfo ) {

        var currentOperand = null,
            exp = null,
            // 记录光标位置
            cursorLocation = [],
            operand = tree.operand || [],
            constructor = null,
            ConstructorProxy;

        objTree.operand = [];

        // 文本表达式已经不需要再处理了
        if ( tree.name.indexOf( "text" ) === -1 ) {
            // 处理操作数
            for ( var i = 0, len = operand.length; i < len; i++ ) {

                currentOperand = operand[ i ];

                //TODO 光标定位， 配合编辑器， 后期应该考虑是否有更佳的方案来实现
                if ( currentOperand === CURSOR_CHAR ) {
                    cursorLocation.push( i );
                    if ( !selectInfo.hasOwnProperty( "startOffset" ) ) {
                        // 字符串中的开始偏移是需要修正的
                        selectInfo.startOffset = i;
                    }
                    selectInfo.endOffset = i;
                    if ( tree.attr && tree.attr.id ) {
                        selectInfo.groupId = tree.attr.id;
                    }
                    continue;
                }

                if ( !currentOperand ) {

                    operand[ i ] = createObject( 'empty' );
                    objTree.operand.push( operand[ i ] );

                } else if ( typeof currentOperand === "string" ) {

                    // 括号表达式不能对前2个参数做处理， 这两个参数是代表括号类型
                    if ( tree.name === "brackets" && i < 2 ) {
                        operand[ i ] = currentOperand;

                    // 函数表达式不能对第1个参数做处理， 这个参数是代表函数类型
                    } else if ( tree.name === "function" && i === 0 ) {
                        operand[ i ] = currentOperand;
                    } else {
                        operand[ i ] = createObject( 'text', currentOperand );
                    }
                    objTree.operand.push( operand[ i ] );

                } else {

                    objTree.operand.push( {} );
                    operand[ i ] = generateExpression( originTree.operand[ i ], currentOperand, objTree.operand[ objTree.operand.length - 1 ], mapping, selectInfo );

                }

            }


            // 包含有选区时， 需要修正一下偏移
            if ( cursorLocation.length === 2 ) {
                selectInfo.endOffset -= 1;
            }

            while ( i = cursorLocation.length ) {

                i = cursorLocation[ i - 1 ];
                operand.splice( i, 1 );
                cursorLocation.length--;

                originTree.operand.splice( i, 1 );

            }

        }

        constructor = getConstructor( tree.name );

        if ( !constructor ) {
            throw new Error( 'operator type error: not found ' + tree.operator );
        }

        ConstructorProxy = function () {};
        ConstructorProxy.prototype = constructor.prototype;
        exp = new ConstructorProxy();
        constructor.apply( exp, operand );

        objTree.func = exp;

        // 调用配置函数
        for ( var fn in tree.callFn ) {

            if ( !tree.callFn.hasOwnProperty( fn ) || !exp[ fn ] ) {
                continue;
            }

            exp[ fn ].apply( exp, tree.callFn[ fn ] );

        }

        if ( tree.attr ) {
            if ( tree.attr.id ) {
                mapping[ tree.attr.id ] = {
                    objGroup: exp,
                    strGroup: originTree
                };
            }

            if ( tree.attr[ "data-root" ] ) {
                mapping.root = {
                    objGroup: exp,
                    strGroup: originTree
                };
            }

            exp.setAttr( tree.attr );
        }

        return exp;

    }

    function createObject ( type, value ) {

        switch ( type ) {

            case 'empty':
                return new kf.EmptyExpression();
            case 'text':
                return new kf.TextExpression( value );

        }

    }


    /**
     * 根据操作符获取对应的构造器
     */
    function getConstructor ( name ) {
        return CONSTRUCT_MAPPING[ name ] || kf[ name.replace( /^[a-z]/i, function ( match ) {
            return match.toUpperCase();
        } ).replace( /-([a-z])/gi, function ( match, char ) {
            return char.toUpperCase();
        } ) + "Expression" ];
    }

    function deepCopy ( source ) {

        var target = {};

        if ( ({}).toString.call( source ) === "[object Array]" ) {

            target = [];

            for ( var i = 0, len = source.length; i < len; i++ ) {

                target[ i ] = doCopy( source[ i ] );

            }

        } else {

            for ( var key in source ) {

                if ( !source.hasOwnProperty( key ) ) {
                    continue;
                }

                target[ key ] = doCopy( source[ key ] );

            }

        }

        return target;

    }

    function doCopy ( source ) {

        if ( !source ) {
            return source;
        }


        if ( typeof source !== "object" ) {
            return source;
        }

        return deepCopy( source );

    }

    return Assembly;

} );
