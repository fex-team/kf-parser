/**
 * 操作符列表
 */

define( function ( require, exports, module ) {

    var binaryHandler = require( "impl/latex/handler/binary" ),
        scriptHandler = require( "impl/latex/handler/script" ),
        // 上下标结构预处理
        scriptPreStructFn = require( "impl/latex/pre-struct/script" );

    return {

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
            preStructFn: scriptPreStructFn,
            handler: scriptHandler
        },
        "_": {
            name: "subscript",
            preStructFn: scriptPreStructFn,
            handler: scriptHandler
        },
        "frac": {
            name: "fraction",
            handler: require( "impl/latex/handler/fraction" )
        },
        "sqrt": {
            name: "radical",
            pre: require( "impl/latex/pre/sqrt" ),
            handler: require( "impl/latex/handler/radical" )
        },
        "sum": {
            name: "summation",
            handler: require( "impl/latex/handler/summation" )
        },
        "int": {
            name: "integration",
            pre: require( "impl/latex/pre/int" ),
            handler: require( "impl/latex/handler/integration" )
        },
        "func": {
            name: "function",
            handler: require( "impl/latex/handler/func" )
        }

    };

} );