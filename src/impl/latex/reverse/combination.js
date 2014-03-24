/*!
 * 逆解析处理函数：combination
 */

define( function () {

    var pattern = new RegExp( "\uF155", "g" );

    return function ( operands ) {

        if ( /^{([\s\S]*)}$/g.test( operands.join( "" ).replace( pattern, "" ) ) ) {
            return operands.join( "" );
        }

        return "{" + operands.join( "" ) + "}";

    }

} );
