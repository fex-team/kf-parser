/*!
 * 合并处理(特殊处理函数)
 */

define( function ( require, exports, module ) {

    return function ( operatorName ) {

        var args = [].slice.call( arguments, 1 );

        return {
            operator: operatorName,
            operand: args
        };

    };

} );
