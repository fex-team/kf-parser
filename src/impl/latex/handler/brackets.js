/*!
 * 括号处理器
 */

define( function ( require ) {

    var BRACKETS_TYPE = require( "impl/latex/define/brackets" );

    return function ( info, processedStack, unprocessedStack ) {

        // 括号验证
        for ( var i = 0, len = info.params.length; i < len; i++ ) {

            if ( !( info.params[ i ] in BRACKETS_TYPE ) ) {
                throw new Error( "Brackets: invalid params" );
            }

        }

        info.operand = info.params;
        info.params[ 2 ] = unprocessedStack.shift();

        delete info.handler;
        delete info.params;

        return info;

    };

} );
