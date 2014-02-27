/**
 * 积分格式预处理器
 */

define( function () {

    return function ( input ) {

        return input.replace( /\\(i+)nt([^a-zA-Z]?)/g, function ( match, intStr, suffix ) {

            return "\\int" + intStr.length +suffix;

        } );

    };

} );
