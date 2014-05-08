/*!
 * 通用上下标提取器
 */

define( function ( require ) {

    return {

        exec: function ( stack ) {

            var scriptGroup = extractor( stack ),
                nextGroup = null,
                result = {
                    superscript: null,
                    subscript: null
                };

            if ( scriptGroup ) {
                nextGroup = extractor( stack );
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

    };

    function extractor ( stack ) {

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
