/*!
 * 方根函数处理器
 */

define( function ( require, exports, module ) {

    // 处理函数接口
    return function ( operatorName, unprocessedUnits, processedUnits ) {

        // 指数
        var exponent = null,
            // 被开方数
            radicand = null;


        exponent = unprocessedUnits.shift();
        radicand = unprocessedUnits.shift();

        if ( exponent === undefined || radicand === undefined ) {
            throw new Error( 'parse error: "\\sqrt", missing radicand' );
        }

        return {
            operator: operatorName,
            operand: [ radicand, exponent ]
        };

    };

} );