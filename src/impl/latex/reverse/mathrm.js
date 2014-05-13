/*!
 * 逆解析处理函数: mathcal
 */

define( function () {

    return function ( operands ) {

        return "\\mathrm{" + operands[0] +"}";

    };

} );