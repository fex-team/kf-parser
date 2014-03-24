/**
 * 操作符列表
 */

define( function ( require, exports, module ) {

    var scriptHandler = require( "impl/latex/handler/script" ),
        funcHandler = require( "impl/latex/handler/func" ),
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
            handler: require( "impl/latex/handler/summation" )
        },
        "int": {
            name: "integration",
            type: TYPE.FN,
            handler: require( "impl/latex/handler/integration" )
        },

        "brackets": {
            name: "brackets",
            type: "TYPE.FN",
            handler: require( "impl/latex/handler/brackets" )
        }

    };

} );