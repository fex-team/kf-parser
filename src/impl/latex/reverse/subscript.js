/*!
 * 逆解析处理函数: subscript
 */

define( function () {

    /**
     * operands中元素对照表
     * 0: 表达式
     * 1: 下标
     */
    return function ( operands ) {

        return operands[ 0 ] + "_" + operands[ 1 ];

    };

} );
