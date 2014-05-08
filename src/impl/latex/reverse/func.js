/*!
 * 逆解析处理函数: func
 */

define( function () {

    /**
     * operands中元素对照表
     * 0: 函数名
     * 1: 上标
     * 2: 下标
     */
    return function ( operands ) {

        var result = [ "\\" + operands[ 0 ] ];

        // 上标
        if ( operands[ 2 ] ) {
            result.push( "^" + operands[ 2 ] );
        }

        // 下标
        if ( operands[ 3 ] ) {
            result.push( "_" + operands[ 3 ] );
        }

        if ( operands[ 1 ] ) {
            result.push( " " + operands[ 1 ] );
        }

        return result.join( "" );

    };

} );
