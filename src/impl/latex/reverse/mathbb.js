/*!
 * 逆解析处理函数: mathbb
 */

define( function () {

    return function ( operands ) {

        return "\\mathbb{" + operands[0] +"}";

    };

} );