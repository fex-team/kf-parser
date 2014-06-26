/**
 * 预处理器列表
 */

define( function ( require ) {

    return {

        // 积分预处理器
        int: require( "impl/latex/pre/int" ),
        // 引号预处理
        quot: require( "impl/latex/pre/quot" )

    };

} );