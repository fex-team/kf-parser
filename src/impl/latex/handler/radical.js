/*!
 * 方根函数处理器
 */

define( function ( require, exports, module ) {

    // 处理函数接口
    return function ( operatorName, unprocessedUnits, processedUnits ) {

        // 指数
        var exponent = null,
            // 被开方数
            radicand = null,
            // 当前的解析器实例
            parser = this,
            tmp = null,
            // 指数语法单元组
            exponentUnits = [];

        if ( radicand = unprocessedUnits.shift() ) {

            // 抽取指数
            if ( radicand === "[" ) {

                while ( ( tmp = unprocessedUnits.shift() ) && tmp !== "]" ) {

                    exponentUnits.push( tmp );

                }

                // 内部重新组合
                if ( exponentUnits.length > 0 ) {
                    exponent = parser.recombined( exponentUnits );
                }

                // 验证[和]是否匹配（成对出现）
                if ( tmp !== ']' ) {
                    throw new Error( "parse error: invalid '['" );
                }

                // 重新提取被开方数
                if ( ( radicand = unprocessedUnits.shift() ) === undefined ) {
                    missingError();
                }

            }

        } else {
            missingError();
        }

        return {
            operator: operatorName,
            operand: [ radicand, exponent ]
        };

    };

    function missingError () {
        throw new Error( 'parse error: "\\sqrt", missing radicand' );
    }

} );