/*!
 * 手写体处理
 */

define( function ( require, exports, module ) {

    return function ( info, processedStack, unprocessedStack ) {

        var chars = unprocessedStack.shift();

        if ( typeof chars === "object" && chars.name === "combination" ) {
            chars = chars.operand.join( "" );
        }

        info.name = "text";
        info.operand = [ chars, "KF AMS CAL" ];

        delete info.handler;

        return info;

    };

} );
