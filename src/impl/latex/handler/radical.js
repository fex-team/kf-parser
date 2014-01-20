/**
 * 方根函数处理器
 */

define( function ( require, exports, module ) {

    // 处理函数接口
    return function ( operatorName, unprocessedUnits, processedUnits ) {

        // 指数
        var exponent = null,
            // 被开方数
            radicand = null;

        if ( unprocessedUnits.length ) {

            radicand = unprocessedUnits.shift();

//            if ( typeof radicand === "string" && radicand.indexOf( "[" ) === "0" ) {
//
//                if ( /^\[([^\]]+)\]([\s\S]*)$/.test( radicand ) ) {
//
//                    radicand = RegExp.$1;
//
//                    if ( RegExp.$2.length ) {
//                        unprocessedUnits.unshift( RegExp.$2 );
//                    }
//
//                } else {
//
//                    throw new Error( "parse error: invalid '['" );
//
//                }
//
//            } else {
//
//
//            }

        }

        return {
            operator: operatorName,
            operand: [ numerator, denominator ]
        };

    };

} );