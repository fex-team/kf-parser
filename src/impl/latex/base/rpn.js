/**
 * 逆波兰表达式转换函数
 */

define( function ( require ) {

    var Utils = require( "impl/latex/base/utils" );

    return function ( units ) {

        var opStack = [],
            signStack = [],

            TYPE = require( "impl/latex/define/type"),

            currentUnit = null;

        while ( currentUnit = units.shift() ) {

            if ( Utils.isArray( currentUnit ) ) {

                signStack.push( arguments.callee( currentUnit ) );
                continue;
            }

            if ( typeof currentUnit === "object" && currentUnit.type === TYPE.FN ) {

debugger;

            } else {

                signStack.push( currentUnit );

            }

        }


        return signStack;

    };

    /**
     * 根据当前操作符和栈的情况，对操作符进行栈操作
     * @param op 当前操作符
     * @param opStack 当前操作符栈
     * @param signStack 当前符号栈
     */
    function processOperator ( op, opStack, signStack ) {

        var tmp = null,
            tmpStack = null,
            hasError = true;

        // 空栈或者左括号， 直接入栈
        if ( opStack.length === 0 || op.name === "left-brackets" ) {
            opStack.push( op );
            return;
        }

        // 右括号， 出栈
        if ( op.name === "right-brackets" ) {

            tmpStack = [];

            while ( tmp = opStack.pop() ) {

                if ( tmp.name === "left-brackets" ) {
                    hasError = false;
                    break;
                }

                tmpStack.push( tmp );

            }

            if ( hasError ) {
                throw new Error( "RPN: Unclosed parentheses" );
            }

            signStack.push( tmpStack );
            return;

        }

        while ( tmp = opStack.pop() ) {

            if ( tmp.name === "left-brackets" ) {
                break;
            }

            // 栈顶操作符优先级较高
            if ( !( tmp.priority < op.priority ) ) {
                signStack.push( tmp );
            } else {
                opStack.push( tmp );
                break;
            }

        }

        opStack.push( op );

    }

} );