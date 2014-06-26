/*!
 * 花体处理
 */

define( function () {

    return function ( info, processedStack, unprocessedStack ) {

        var chars = unprocessedStack.shift();

        if ( typeof chars === "object" && chars.name === "combination" ) {
            chars = chars.operand.join( "" );
        }

        info.name = "text";
        info.attr = {
            _reverse: "mathfrak"
        };
        info.callFn = {
            setFamily: [ "KF AMS FRAK" ]
        };
        info.operand = [ chars ];

        delete info.handler;

        return info;

    };

} );
