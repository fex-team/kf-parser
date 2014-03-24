/*!
 * 逆解析处理函数: brackets
 */

define( function () {

    /**
     * operands中元素对照表
     * 0: 左符号
     * 1: 右符号
     * 2: 表达式
     */
    return function ( operands ) {

        return [
            "\\left",
            operands[ 0 ],
            operands[ 2 ],
            "\\right",
            operands[ 1 ]
        ].join( " " );

    };

} );