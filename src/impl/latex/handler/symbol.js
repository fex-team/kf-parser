/*!
 * 符号表达式处理器
 */

define( function ( require, exports, module ) {

    // 处理函数接口
    return function ( operatorName, unprocessedUnits ) {

        var symbolName = this.params;

        return {
            operator: operatorName,
            operand: [ symbolName ]
        };

    };

} );