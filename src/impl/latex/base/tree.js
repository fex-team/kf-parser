/**
 * 从单元组构建树
 */

define( function ( require ) {

    var TYPE = require( "impl/latex/define/type"),
        mergeHandler = require( "impl/latex/handler/combination"),
        Utils = require( "impl/latex/base/utils" );

    return function ( units ) {

        var currentUnit = null,
            tree = [];

        for ( var i = 0 , len = units.length; i < len; i++ ) {

            if ( Utils.isArray( units[ i ] ) ) {
                units[ i ] = arguments.callee( units[ i ] );
            }

        }

        while ( currentUnit = units.shift() ) {

            if ( typeof currentUnit === "object" && currentUnit.handler ) {

                tree.push( currentUnit.handler( currentUnit, tree.pop(), units.shift() ) );

            } else {

                tree.push( currentUnit );

            }

        }

        return mergeHandler( tree );

    };

} );