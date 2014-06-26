/*!
 * 方根函数处理器
 */

define( function ( require ) {

    var mergeHandler = require( "impl/latex/handler/combination" );

    // 处理函数接口
    return function ( info, processedStack, unprocessedStack ) {

        var exponent = unprocessedStack.shift(),
            tmp = null,
            // 被开方数
            radicand = null;

        if ( exponent === "[" ) {

            exponent = [];

            while ( tmp = unprocessedStack.shift() ) {

                if ( tmp === "]" ) {
                    break;
                }

                exponent.push( tmp );

            }

            if ( exponent.length === 0 ) {
                exponent = null;
            } else {
                exponent = mergeHandler( exponent );
            }
            radicand = unprocessedStack.shift();

        } else {
            radicand = exponent;
            exponent = null;
        }

        info.operand = [ radicand, exponent ];

        delete info.handler;

        return info;

    };

} );