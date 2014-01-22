/*!
 * 分数函数处理器
 */

define( function ( require, exports, module ) {

    // 处理函数接口
    return function ( operatorName, unprocessedUnits ) {

        var numerator = null,
            denominator = null;

        if ( unprocessedUnits.length ) {
            numerator = unprocessedUnits.shift();
            denominator = unprocessedUnits.shift();
        }

        return {
            operator: operatorName,
            operand: [ numerator, denominator ]
        };

    };

} );