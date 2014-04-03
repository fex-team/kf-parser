/*!
 * 逆解析处理函数：combination
 */

define( function () {

    var pattern = new RegExp( "\uF155", "g" );

    return function ( operands, options ) {

        if ( this.attr[ "data-root" ] || this.attr[ "data-placeholder" ] ) {
            return operands.join( "" );
        }

        return "{" + operands.join( "" ) + "}";

    }

} );
