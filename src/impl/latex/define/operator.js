/**
 * 操作符列表
 */

define( function ( require ) {

    var scriptHandler = require( "impl/latex/handler/script" ),
        TYPE = require( "impl/latex/define/type" );

    return {

        "^": {
            name: "superscript",
            type: TYPE.OP,
            handler: scriptHandler
        },
        "_": {
            name: "subscript",
            type: TYPE.OP,
            handler: scriptHandler
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
            traversal: "rtl",
            handler: require( "impl/latex/handler/summation" )
        },
        "int": {
            name: "integration",
            type: TYPE.FN,
            traversal: "rtl",
            handler: require( "impl/latex/handler/integration" )
        },

        "brackets": {
            name: "brackets",
            type: TYPE.FN,
            handler: require( "impl/latex/handler/brackets" )
        },

        "mathcal": {
            name: "mathcal",
            type: TYPE.FN,
            sign: false,
            handler: require( "impl/latex/handler/mathcal" )
        },

        "mathfrak": {
            name: "mathfrak",
            type: TYPE.FN,
            sign: false,
            handler: require( "impl/latex/handler/mathfrak" )
        },

        "mathbb": {
            name: "mathbb",
            type: TYPE.FN,
            sign: false,
            handler: require( "impl/latex/handler/mathbb" )
        },

        "mathrm": {
            name: "mathrm",
            type: TYPE.FN,
            sign: false,
            handler: require( "impl/latex/handler/mathrm" )
        }

    };

} );