/*!
 * 求和表达式以及积分预处理函数
 */

define( function ( require, exports, module ) {

    /**
     * 处理函数
     * @param {String} data 输入表达式
     * @return {String} 处理过后的表达式
     */
    return function ( data ) {

        var pattern = /\\(i+nt)\s*([_^](?:(?:{[^}]*})|[\s\S]))?([_^](?:(?:{[^}]*})|[\s\S]))?((?:{[^}]*})|[\s\S])/gi;

        return data.replace( pattern, function () {

            var match = arguments,
                scripts = [].slice.call( match, 2, 4 ),
                exp = match[ 4 ],
                subscript = null,
                // 积分重数
                count = /^i+/.exec( match[1] )[0].length,
                superscript = null;

            // 上下标处理
            if ( !scripts[ 0 ] ) {

                subscript = '{}';
                superscript = '{}';
                exp = '{' + exp + '}';

            } else {

                scripts[ 0 ] = scripts[ 0 ].substring( 1 ).replace( /^{|}$/g, "" );
                scripts[ 1 ] = ( scripts[ 1 ] || "" ).substring( 1 ).replace( /^{|}$/g, "" );

                if ( scripts[ 0 ].indexOf( "^" ) !== 0 ) {

                    superscript = '{'+ scripts[ 0 ] +'}';
                    subscript = '{' + scripts[ 1 ]+ '}';

                } else {

                    subscript = '{'+ scripts[ 0 ] +'}';
                    superscript = '{' + scripts[ 1 ]+ '}';

                }

            }

            return "\\int" + "{"+ count +"}" + superscript + subscript + exp;

        } );

    };

} );
