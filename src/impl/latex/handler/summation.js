/*!
 * 求和函数处理器
 */

define( function ( require, exports, module ) {

    return function ( operatorName, unprocessedUnits, processedUnits ) {

        // 求和表达式
        var exp = null,
            // 提取出上下标记
            script = extract( unprocessedUnits );

        unprocessedUnits = script.units;

        exp = unprocessedUnits.shift();

        return {
            operator: operatorName,
            operand: [ exp, script.sup, script.sub ],
            // 返回的未处理队列可以被解析器重新利用
            unprocessed: unprocessedUnits
        };

    };

    /**
     * 从给定的语法单元组中提取出标记
     * @param sign 上标或者下标， 表示为： “^”，“_”
     * @param units 语法单元
     * @return {} 返回由标记和剩余语法单元组组成的key-value对象， 其中， key有： sub, sup, units,
     * 分别表示下标，上标，剩余语法单元组， 如果给定的语法单元组中不包含上标或者下标， 则其对应的key值为null，
     * 但key units的值始终不为null。
     */
    function extract ( units ) {

        var processedUnits = [],
            sup = null,
            sub = null;

        if ( typeof units[0] === "object" &&  units[0].operator === "superscript" ) {

            sup = units[1];

            if ( typeof units[2] === "object" && units[2].operator === "subscript" ) {
                sub = units[3];
                units = units.slice( 4 );
            } else {
                units = units.slice( 2 );
            }

        } else if ( typeof units[0] === "object" && units[0].operator === "subscript" ) {

            sub = units[1];
            if ( typeof units[2] === "object" && units[2].operator === "superscript" ) {
                sup = units[3];
                units = units.slice( 4 );
            } else {
                units = units.slice( 2 );
            }

        }

        return {
            sub: sub,
            sup: sup,
            units: units
        };

    }

} );