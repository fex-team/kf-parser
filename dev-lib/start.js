/*!
 * 启动模块
 */
define( 'kf.start', function ( require ) {

    var Parser = require( "parser" ).Parser;

    // 初始化组件
    require( "impl/latex/latex" );

    window.kf.Parser = Parser;
    window.kf.Assembly = require( "assembly" );

} );