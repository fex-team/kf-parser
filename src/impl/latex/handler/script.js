/*!
 * 上下标操作符函数处理
 */

define( function ( require, exports, module ) {

    // 处理函数接口
    return function ( processedUnits, unprocessedUnits ) {

        var script = unprocessedUnits.shift() || null,
            // 底数
            base = processedUnits.pop() || null;

        if ( base && typeof base === "object" ) {

            if ( base.operator === "Subscript" || base.operator === "Superscript" ) {
                throw new Error( 'Syntax Error: Subscript or Superscript' );
            }

        }

        return {
            operator: this.operator,
            operand: [ base, script ]
        };

    };

} );