/**
 * 从单元组构建树
 */

define( function ( require ) {

    var mergeHandler = require( "impl/latex/handler/combination" ),
        Utils = require( "impl/latex/base/utils" );

    function generateTree ( units ) {

        var currentUnit = null,
            tree = [];

        for ( var i = 0 , len = units.length; i < len; i++ ) {

            if ( Utils.isArray( units[ i ] ) ) {
                units[ i ] = generateTree( units[ i ] );
            }

        }

        while ( currentUnit = units.shift() ) {

            if ( typeof currentUnit === "object" && currentUnit.handler ) {

                // 后操作数
                tree.push( currentUnit.handler( currentUnit, tree, units ) );

            } else {

                tree.push( currentUnit );

            }

        }

        return mergeHandler( tree );

    }

    return generateTree;

} );