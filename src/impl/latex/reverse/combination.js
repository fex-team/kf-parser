/*!
 * 逆解析处理函数：combination
 */

define( function () {

    return function ( operands ) {

        if ( this.attr[ "data-root" ] || this.attr[ "data-placeholder" ] ) {
            return operands.join( "" );
        }

        return "{" + operands.join( "" ) + "}";

    };

} );
