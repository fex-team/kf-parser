/**
 * 操作符列表
 */

define( function ( require, exports, module ) {

    var scriptHandler = require( "impl/latex/handler/script" ),
        TYPE = require( "impl/latex/define/type" );

    return {

        "+": {
            name: "addition"
        },
        "-": {
            name: "subtraction"
        },
        "times": {
            name: "multiplication"
        },
        "div": {
            name: "division"
        },
        "cdot": {
            name: "dot"
        },
        "=": {
            name: "eq"
        },
        "*": {
            name: "asterisk"
        },
        "pm": {
            name: "plus-minus"
        },
        "mp": {
            name: "minus-plus"
        },
        "^": {
            name: "superscript",
            type: TYPE.OP,
            handler: scriptHandler,
            priority: 3
        },
        "_": {
            name: "subscript",
            type: TYPE.OP,
            handler: scriptHandler,
            priority: 3
        },
        "frac": {
            name: "fraction",
            type: TYPE.FN,
            sign: false,
            handler: require( "impl/latex/handler/fraction" )
        },
        "sqrt": {
            name: "radical",
            type: TYPE.FN,
            sign: false,
            handler: require( "impl/latex/handler/sqrt" )
        },
        "sum": {
            name: "summation",
            type: TYPE.FN,
            handler: require( "impl/latex/handler/summation" )
        },
        "int": {
            name: "integration",
            type: TYPE.FN,
            handler: require( "impl/latex/handler/integration" )
        }

    };

} );