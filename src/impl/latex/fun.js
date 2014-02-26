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
            },
            "func": {
                name: "function",
                handler: require( "impl/latex/handler/func" )
            }

        },

        // 函数列表
        func: {
            sin: 1,
            cos: 1,
            arccos: 1,
            cosh: 1,
            det: 1,
            inf: 1,
            limsup: 1,
            Pr: 1,
            tan: 1,
            arcsin: 1,
            cot: 1,
            dim: 1,
            ker: 1,
            ln: 1,
            sec: 1,
            tanh: 1,
            arctan: 1,
            coth: 1,
            exp: 1,
            lg: 1,
            log: 1,
            arg: 1,
            csc: 1,
            gcd: 1,
            lim: 1,
            max: 1,
            sinh: 1,
            cos: 1,
            deg: 1,
            hom: 1,
            liminf: 1,
            min: 1,
            sup: 1
        }

    };

} );
