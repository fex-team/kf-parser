/*!
 * 罗马处理
 */

define( function () {

    return function ( info, processedStack, unprocessedStack ) {

        var chars = unprocessedStack.shift();

        if ( typeof chars === "object" && chars.name === "combination" ) {
            chars = chars.operand.join( "" );
        }

        info.name = "text";
        info.attr = {
            _reverse: "mathrm"
        };
        info.callFn = {
            setFamily: [ "KF AMS ROMAN" ]
        };
        info.operand = [ chars ];

        delete info.handler;

        return info;

    };

} );
