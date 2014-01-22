/*!
 * 二元操作符函数处理
 */

define( function ( require, exports, module ) {

    // 处理函数接口
    return function ( operatorName, unprocessedUnits, processedUnits ) {

        var prev = null,
            back = null;

        if ( processedUnits.length ) {
            prev = processedUnits.pop();
        }

        if ( unprocessedUnits.length ) {
            back = unprocessedUnits.shift();
        }

        return {
            operator: operatorName,
            operand: [ prev, back ]
        };

    };

} );