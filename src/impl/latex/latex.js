/**
 * Kity Formula Latex解析器实现
 */

define( function ( require, exports, module ) {

    var Parser = require( "parser" ).Parser,
        LatexUtils = require( "impl/latex/base/latex-utils" ),
        Utils = require( "impl/latex/base/utils" );

    // data
    var leftChar = "\ufff8",
        rightChar = "\ufffc";

    Parser.register( "latex", Parser.implement( {

        parse: function ( data ) {

            var units = this.split( this.format( data ) );

            units = this.parseToGroup( units );

            units = this.parseToStruct( units );

            return this.generateTree( units );

        },

        // 格式化输入数据
        format: function ( input ) {

            // 清理多余的空格
            input = clearEmpty( input );

            // 处理输入的“{”和“}”
            input = input.replace( /\\{/gi, leftChar ).replace( /\\}/gi, rightChar );

            return input;

        },

        split: function ( data ) {

            var units = [],
                replacePattern = new RegExp( leftChar+"|"+rightChar, "g" ),
                pattern = /(?:\\[a-z]+\s*)|(?:[{}]\s*)|(?:[^\\{}]\s*)/gi,
                emptyPattern = /^\s+|\s+$/g,
                match = null;

            data = data.replace( emptyPattern, "" )
                       .replace( replacePattern, "" );

            while ( match = pattern.exec( data ) ) {

                match = match[ 0 ].replace( emptyPattern, "" );

                if ( match ) {

                    units.push( match );

                }

            }

            return units;

        },


        /**
         * 根据解析出来的语法单元生成树
         * @param units 单元
         * @return 生成的树对象
         */
        generateTree: function ( units ) {

            units = LatexUtils.toRPNExpression( units );

            var t = LatexUtils.generateTree( units );

            debugger;

            return t;

        },

        parseToGroup: function ( units ) {

            var group = [],
                groupPointer = group,
                groupCount = 0;

            for ( var i = 0, len = units.length; i < len; i++ ) {

                switch ( units[i] ) {

                    case "{":
                        groupCount++;
                        group.push( [] );
                        group = group[ group.length - 1 ];
                        break;
                    case "}":
                        groupCount--;
                        group = groupPointer;
                        break;

                    default:
                        group.push( units[i] );
                        break;

                }

            }

            if ( groupCount !== 0 ) {
                throw new Error( "Group Error!" );
            }

            return groupPointer;

        },

        parseToStruct: function ( units ) {

            var structs = [];

            for ( var i = 0, len = units.length; i < len; i++ ) {

                if ( Utils.isArray( units[ i ] ) ) {
                    structs.push( this.parseToStruct( units[ i ] ) );
                } else {
                    structs.push( parseStruct( units[ i ] ) );
                }

            }

            return structs;

        }

    } ) );


    /**
     * 把序列化的字符串表示法转化为中间格式的结构化表示
     */
    function parseStruct ( str ) {

        var type = Utils.getLatexType( str ),
            FUNC_HANDLER = Utils.getFunctionHandler();

        switch ( type ) {

            case "operator":

                return Utils.getDefine( str );

            case "function":

                return {
                    operator: "Function",
                    handler: FUNC_HANDLER,
                    params: str.replace( /^\\/, "" )
                };

            default:
                // text
                return transformSpecialCharacters( str );

        }

    }

    // 转换特殊的文本字符
    function transformSpecialCharacters ( char ) {

        if ( char.indexOf( "\\" ) === 0 ) {
            return char + "\\";
        }

        return char;

    }

    function clearEmpty ( data ) {

        return data.replace( /\\\s+/, "" ).replace( /\s*([^a-z0-9\s])\s*/gi, function ( match, symbol ) {

            return symbol;

        } );

    }

} );
