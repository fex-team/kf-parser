/**
 * “双引号”预处理器
 */
define( function () {

    return function ( input ) {

        return input.replace( /``/g, "\u201c" );

    };

} );