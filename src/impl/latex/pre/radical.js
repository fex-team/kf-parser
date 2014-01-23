/*!
 * 方根表达式预处理函数
 */

define( function ( require, exports, module ) {

    /**
     * 处理函数
     * @param {String} data 输入表达式
     * @return {String} 处理过后的表达式
     */
    return function ( data ) {

        var pattern = /\\sqrt\s*(?:\[([^\]]*)\])?/g;

        return data.replace( pattern, function ( match, exponent ) {

            return "\\sqrt" + ( exponent ? "{"+exponent+"}" : "{}" );

        } );

    };

} );
