/*!
 * 逆解析处理函数: script
 */

define( function () {

    /**
     * operands中元素对照表
     * 0: 表达式
     * 1: 上标
     * 2: 下标
     */
    return function ( operands ) {

        return operands[ 0 ] + "^" + operands[ 1 ] + "_" + operands[ 2 ];

    };

} );
