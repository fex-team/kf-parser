/*!
 * 函数表达式处理器
 */

define( function ( require, exports, module ) {

    // 处理函数接口
    return function ( operatorName, unprocessedUnits ) {

        var funcName = this.params;

        return {
            operator: operatorName,
            operand: [ funcName ]
        };

    };

} );