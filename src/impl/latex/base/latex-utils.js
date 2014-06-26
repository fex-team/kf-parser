/**
 * latex实现工具包
 */

define( function ( require ) {

    return {

        toRPNExpression: require( "impl/latex/base/rpn" ),

        generateTree: require( "impl/latex/base/tree" )

    };

});