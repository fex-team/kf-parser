/**
 * 上下标结构预处理器
 */

define( function () {

    return function ( structs ) {

        var targetStructs = [],
            currentStruct = null,
            prev = null;

        while ( structs.length ) {

            currentStruct = structs.shift();

            if ( currentStruct && typeof currentStruct === "object" ) {

                if ( currentStruct.operator !== "Subscript" && currentStruct.operator !== "Superscript" ) {
                    targetStructs.push( currentStruct );
                    continue;
                }

                prev = targetStructs.pop() || null;

                if ( prev && ( typeof prev === "string" || prev.operator === "Combination" ) ) {
                    targetStructs.push( [ prev, currentStruct, structs.shift() || null ] );
                }

            } else {

                targetStructs.push( currentStruct );

            }

        }

        return targetStructs;

    };

} );
