/*!
 * 逆解析处理函数: fraction
 */

define( function () {

    return function ( operands ) {

        return "\\frac " + operands[0] + " " + operands[ 1 ];

    };

} );