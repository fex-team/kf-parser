/*!
 * 合并处理(特殊处理函数)
 */

define( function ( require, exports, module ) {

    return function () {

        if ( arguments[ 0 ].length === 0 ) {
            return null;
        }

        return {
            name: "combination",
            operand: arguments[ 0 ]
        };

    };

} );
