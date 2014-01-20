/**
 * Latex 函数定义
 */

define( function ( require, exports, module ) {

    var binaryHandler = require( "impl/latex/handler/binary" );

    return {

        "merge": {
            name: "merge",
            handler: require( "impl/latex/handler/merge" )
        },
        "+": {
            name: "addition",
            handler: binaryHandler
        },
        "-": {
            name: "subtraction",
            handler: binaryHandler
        },
        "frac": {
            name: "fraction",
            handler: require( "impl/latex/handler/fraction" )
        },
        "sqrt": {
            name: "radical",
            handler: require( "impl/latex/handler/radical" )
        }

    };

} );
