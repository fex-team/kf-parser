/*!
 * 逆解析处理函数: fraction
 */

define( function () {

    return function ( operands ) {

        return "\\mathcal{" + operands[0] +"}";

    };

} );