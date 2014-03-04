/*!
 * 分数函数处理器
 */

define( function ( require, exports, module ) {

    // 处理函数接口
    return function ( processedUnits, unprocessedUnits ) {

        var numerator = unprocessedUnits.shift() || null,
            denominator = unprocessedUnits.shift() || null;

        return {
            operator: this.operator,
            operand: [ numerator, denominator ]
        };

    };

} );