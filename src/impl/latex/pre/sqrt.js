/**
 * 方根预处理器
 */

define( function () {

    return function ( input ) {

        return input.replace( /\\sqrt\b(\s*\[([^\]]*)\])?/gi, function ( match, exponentWrap, exponent ) {

            return "\\sqrt" + ( exponentWrap ? "{"+ exponent +"}" : "{}" );

        } );

    };

} );
