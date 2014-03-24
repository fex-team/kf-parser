/**
 * Created by hn on 14-3-20.
 */

define( function ( require ) {

    var reverseHandlerTable = require( "impl/latex/define/reverse" ),
        specialCharPattern = /(\\[\w]+)\\/g;

    return function ( tree ) {

        return reverseParse( tree ).replace( /^{|}$/g, "" );

    };


    function reverseParse ( tree ) {

        var operands = [],
            originalOperands = null;

        // 字符串处理， 需要处理特殊字符
        if ( typeof tree !== "object" ) {
            return tree.replace( specialCharPattern, function ( match, group ) {
                return group + " ";
            } );
        }

        originalOperands = tree.operand;

        for ( var i = 0, len = originalOperands.length; i < len; i++ ) {

            if ( originalOperands[ i ] ) {
                operands.push( reverseParse( originalOperands[ i ] ) );
            } else {
                operands.push( originalOperands[ i ] );
            }

        }

        return reverseHandlerTable[ tree.name ]( operands );

    }

} );