/*!
 * 装配器
 */

define( function ( require, exports, module ) {

    var CONSTRUCT_MAPPING = {};

    function Assembly ( container ) {
        this.formula = new kf.Formula( container );
    }

    Assembly.prototype.generateBy = function ( data ) {

        var tree = data.tree;

        if ( typeof tree === "string" ) {
            this.formula.appendExpression( new kf.TextExpression( tree ) );
        } else {
            this.formula.appendExpression( generateExpression( tree ) );
        }

    };

    /**
     * 根据提供的树信息生成表达式
     * @param tree 中间格式的解析树
     * @return {kf.Expression} 生成的表达式
     */
    function generateExpression ( tree ) {

        var currentOperand = null,
            exp = null,
            operand = tree.operand,
            construct = null;

        // 处理操作数
        for ( var i = 0, len = operand.length; i < len; i++ ) {

            currentOperand = operand[ i ];

            if ( !currentOperand || typeof currentOperand !== "object" ) {
                continue;
            }

            operand[ i ] = arguments.callee( currentOperand );

        }

        construct = getConstructor( tree.operator );

        if ( !construct ) {
            throw new Error( 'operator type error: not found ' + tree.operator );
        }

        exp = new construct();
        construct.apply( exp, operand );

        return exp;

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

    return {
        use: function ( container ) {
            return new Assembly( container );
        }
    };

} );