/**
 * Latex 函数定义
 */

define( function ( require, exports, module ) {

    var binaryHandler = require( "impl/latex/handler/binary" );

    return {
        operator: {

            "combination": {
                name: "combination",
                handler: require( "impl/latex/handler/combination" )
            },
            "+": {
                name: "addition",
                handler: binaryHandler
            },
            "-": {
                name: "subtraction",
                handler: binaryHandler
            },
            "times": {
                name: "multiplication",
                handler: binaryHandler
            },
            "div": {
                name: "division",
                handler: binaryHandler
            },
            "cdot": {
                name: "dot",
                handler: binaryHandler
            },
            "=": {
                name: "eq",
                handler: binaryHandler
            },
            "*": {
                name: "asterisk",
                handler: binaryHandler
            },
            "pm": {
                name: "plus-minus",
                handler: binaryHandler
            },
            "mp": {
                name: "minus-plus",
                handler: binaryHandler
            },
            "^": {
                name: "superscript",
                handler: binaryHandler
            },
            "_": {
                name: "subscript",
                handler: binaryHandler
            },
            "frac": {
                name: "fraction",
                handler: require( "impl/latex/handler/fraction" )
            },
            "sqrt": {
                name: "radical",
                pre: require( "impl/latex/pre/radical" ),
                handler: require( "impl/latex/handler/radical" )
            },
            "sum": {
                name: "summation",
                pre: require( "impl/latex/pre/summation" ),
                handler: require( "impl/latex/handler/summation" )
            },
            "int": {
                name: "integration",
                pre: require( "impl/latex/pre/integration" ),
                handler: require( "impl/latex/handler/integration" )
            }

        }
    };

} );
