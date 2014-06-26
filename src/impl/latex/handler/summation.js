/*!
 * 求和函数处理器
 */

define( function ( require ) {

    var ScriptExtractor = require( "impl/latex/handler/lib/script-extractor" );

    return function ( info, processedStack, unprocessedStack ) {

        var params = ScriptExtractor.exec( unprocessedStack );

        info.operand = [ params.expr, params.superscript, params.subscript ];

        delete info.handler;

        return info;

    };

} );