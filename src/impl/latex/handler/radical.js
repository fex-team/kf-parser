/*!
 * 方根函数处理器
 */

define( function ( require, exports, module ) {

    // 处理函数接口
    return function ( processedUnits, unprocessedUnits ) {

        var exponent = unprocessedUnits.shift() || null,
            // 被开方数
            radicand = unprocessedUnits.shift() || null;

        return {
            operator: this.operator,
            operand: [ radicand, exponent ]
        };

    };

} );