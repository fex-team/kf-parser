/*!
 * 逆解析处理函数: integration
 */

define( function () {

    /**
     * operands中元素对照表
     * 0: 表达式
     * 1: 上标
     * 2: 下标
     */
    return function ( operands ) {

        var result = [ "\\int" ];

        // 上标
        if ( operands[ 1 ] ) {
            result.push( "^" + operands[ 1 ] );
        }

        // 下标
        if ( operands[ 2 ] ) {
            result.push( "_" + operands[ 2 ] );
        }

        result.push( " " + operands[ 0 ] );

        return result.join( "" );

    };

} );
