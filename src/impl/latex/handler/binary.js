/*!
 * 二元操作符函数处理
 */

define( function ( require, exports, module ) {

    // 处理函数接口
    return function ( processedUnits, unprocessedUnits ) {

        var first = processedUnits.pop() || null,
            second = null;

        // 操作符的后置数据不是一个简单数据（字符串类型），则不取出操作数，直接置空
        if ( typeof unprocessedUnits[ unprocessedUnits.length - 1 ] === "object" ) {
            second = null;
        } else {
            second = unprocessedUnits.shift() || null;
        }

        return {
            operator: this.operator,
            operand: [ first, second ]
        };

    };

} );