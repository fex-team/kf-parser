/**
 * Created by hn on 14-3-20.
 */

define( function ( require ) {

    var reverseHandlerTable = require( "impl/latex/define/reverse" ),
        SPECIAL_LIST = require( "impl/latex/define/special" ),
        specialCharPattern = /(\\(?:[\w]+)|(?:[^a-z]))\\/gi;

    return function ( tree, options ) {

        return reverseParse( tree, options );

    };


    function reverseParse ( tree, options ) {

        var operands = [],
            reverseHandlerName = null,
            originalOperands = null;

        // 字符串处理， 需要处理特殊字符
        if ( typeof tree !== "object" ) {

            if ( isSpecialCharacter( tree ) ) {
                return "\\" + tree + " ";
            }

            return tree.replace( specialCharPattern, function ( match, group ) {
                return group + " ";
            } );
            
        }

        // combination需要特殊处理, 重复嵌套的combination节点要删除
        if ( tree.name === "combination" && tree.operand.length === 1 && tree.operand[0].name === "combination" ) {
            tree = tree.operand[ 0 ];
        }

        originalOperands = tree.operand;

        for ( var i = 0, len = originalOperands.length; i < len; i++ ) {

            if ( originalOperands[ i ] ) {
                operands.push( reverseParse( originalOperands[ i ] ) );
            } else {
                operands.push( originalOperands[ i ] );
            }

        }

        if ( tree.attr && tree.attr._reverse ) {
            reverseHandlerName = tree.attr._reverse;
        } else {
            reverseHandlerName = tree.name;
        }

        return reverseHandlerTable[ reverseHandlerName ].call( tree, operands, options );

    }

    function isSpecialCharacter ( char ) {
        return !!SPECIAL_LIST[ char ];
    }

} );