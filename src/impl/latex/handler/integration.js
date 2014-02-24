/*!
 * 积分函数处理器
 */

define( function ( require, exports, module ) {

    return function ( operatorName, unprocessedUnits, processedUnits ) {

        var count = /\d+/.exec( unprocessedUnits.shift() ) || 1,   // 积分重数
            sup = unprocessedUnits.shift(),
            sub = unprocessedUnits.shift(),
            exp = unprocessedUnits.shift();

        return {
            operator: operatorName,
            operand: [ exp, sup, sub ],
            callFn: {
                setType: [ count ]
            }
        };

    };

} );