/**
 * 模块暴露
 */

( function ( global ) {

    define( 'kf.start', function ( require ) {

        var Parser = require( "parser" ).Parser;

        // 初始化组件
        require( "impl/latex/latex" );

        global.kf.Parser = Parser;
        global.kf.Factory = require( "assembly" );

    } );

    // build环境中才含有use
    try {
        use( 'kf.start' );
    } catch ( e ) {
    }

} )( this );
