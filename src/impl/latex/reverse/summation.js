/*!
 * 逆解析处理函数: summation
 */

define( function () {

    /**
     * operands中元素对照表
     * 0: 上标
     * 1: 下标
     */
    return function ( operands ) {

        var result = [ "\\sum " ];

        // 上标
        if ( operands[ 1 ] ) {
            result.push( "^" + operands[ 1 ] );
        }

        // 下标
        if ( operands[ 2 ] ) {
            result.push( "_" + operands[ 2 ] );
        }

        if ( operands[ 0 ] ) {
            result.push( " " + operands[ 0 ] );
        }

        return result.join( "" );

    };

} );
