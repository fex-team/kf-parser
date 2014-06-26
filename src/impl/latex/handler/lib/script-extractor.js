/*!
 * 通用上下标提取器
 */

define( function () {

    return {

        exec: function ( stack ) {

            // 提取上下标
            var result = extractScript( stack ),
                expr = stack.shift();

            if ( expr && expr.name && expr.name.indexOf( "script" ) !== -1 ) {
                throw new Error( "Script: syntax error!" );
            }

            result.expr = expr || null;

            return result;

        }

    };

    function extractScript ( stack ) {

        var scriptGroup = extract( stack ),
            nextGroup = null,
            result = {
                superscript: null,
                subscript: null
            };

        if ( scriptGroup ) {
            nextGroup = extract( stack );
        } else {
            return result;
        }

        result[ scriptGroup.type ] = scriptGroup.value || null;

        if ( nextGroup ) {

            if ( nextGroup.type === scriptGroup.type ) {
                throw new Error( 'Script: syntax error!' );
            }

            result[ nextGroup.type ] = nextGroup.value || null;

        }

        return result;

    }

    function extract ( stack ) {

        var forward = stack.shift();

        if ( !forward ) {
            return null;
        }

        if ( forward.name === "subscript" || forward.name === "superscript" ) {
            return {
                type: forward.name,
                value: stack.shift()
            };
        }

        stack.unshift( forward );

        return null;

    }

} );
