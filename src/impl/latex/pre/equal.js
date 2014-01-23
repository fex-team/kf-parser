/*!
 * 等号表达式预处理函数
 */

define( function ( require, exports, module ) {

    /**
     * 处理函数
     * @param {String} data 输入表达式
     * @return {String} 处理过后的表达式
     */
    return function ( data ) {

        var count = 0;

        data = data.replace( /=/g, function ( match ) {

            count++;
            return "={";

        } );

        for ( var i = 0; i < count; i++ ) {

            data += "}";

        }

        return data;

    };

} );
