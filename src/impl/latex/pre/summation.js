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

        var pattern = /\\sum\b\s*([_^](?:(?:{[^}]*})|[\s\S]))?([_^](?:(?:{[^}]*})|[\s\S]))?((?:{[^}]*})|[\s\S])/gi;

        return data.replace( pattern, function () {

            var match = arguments,
                scripts = [].slice.call( match, 1, 3 ),
                exp = match[ 3 ],
                subscript = null,
                superscript = null;

            // 上下标处理
            if ( !scripts[ 0 ] ) {

                subscript = '{}';
                superscript = '{}';
                exp = '{' + exp + '}';

            } else {

                if ( scripts[ 0 ].indexOf( "^" ) === 0 ) {

                    superscript = '{'+ scripts[ 0 ].substring( 1 ) +'}';
                    subscript = '{' + ( scripts[ 1 ] || "" ).substring( 1 ) + '}';

                } else {

                    subscript = '{'+ scripts[ 0 ].substring( 1 ) +'}';
                    superscript = '{' + ( scripts[ 1 ] || "" ).substring( 1 ) + '}';

                }

            }

            return "\\sum" + superscript + subscript + exp;

        } );

    };

} );
