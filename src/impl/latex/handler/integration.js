/*!
 * 积分函数处理器
 */

define( function ( require, exports, module ) {

    var extractFn = require( "impl/latex/handler/lib/int-extract" );

    return function ( processedUnits, unprocessedUnits ) {

        var params = extractFn( unprocessedUnits );

        debugger;
        return {
            operator: this.operator,
            operand: [ params.exp, params.sup, params.sub ],
            callFn: {
                setType: [ params.count ]
            }
        };

    };

} );