/**
 * Kity Formula Latex解析器实现
 */
/* jshint forin: false */

define( function ( require ) {

    var Parser = require( "parser" ).Parser,
        LatexUtils = require( "impl/latex/base/latex-utils" ),
        PRE_HANDLER =  require( "impl/latex/define/pre" ),
        serialization = require( "impl/latex/serialization" ),
        OP_DEFINE = require( "impl/latex/define/operator" ),
        REVERSE_DEFINE = require( "impl/latex/define/reverse" ),
        SPECIAL_LIST = require( "impl/latex/define/special" ),
        Utils = require( "impl/latex/base/utils" );

    // data
    var leftChar = "\ufff8",
        rightChar = "\ufffc",
        clearCharPattern = new RegExp( leftChar+"|"+rightChar, "g"),
        leftCharPattern = new RegExp( leftChar, "g" ),
        rightCharPattern = new RegExp( rightChar, "g" );

    Parser.register( "latex", Parser.implement( {

        parse: function ( data ) {

            var units = this.split( this.format( data ) );

            units = this.parseToGroup( units );

            units = this.parseToStruct( units );

            return this.generateTree( units );

        },

        serialization: function ( tree, options ) {

            return serialization( tree, options );

        },

        expand: function ( expandObj ) {

            var parseObj = expandObj.parse,
                formatKey = null,
                preObj = expandObj.pre,
                reverseObj = expandObj.reverse;

            for ( var key in parseObj ) {

                if ( !parseObj.hasOwnProperty( key ) ) {
                    continue;
                }

                formatKey = key.replace( /\\/g, "" );

                OP_DEFINE[ formatKey ] = parseObj[ key ];

            }

            for ( var key in reverseObj ) {

                if ( !reverseObj.hasOwnProperty( key ) ) {
                    continue;
                }

                REVERSE_DEFINE[ key.replace( /\\/g, "" ) ] = reverseObj[ key ];

            }

            // 预处理
            if ( preObj ) {

                for ( var key in preObj ) {

                    if ( !preObj.hasOwnProperty( key ) ) {
                        continue;
                    }

                    PRE_HANDLER[ key.replace( /\\/g, "" ) ] = preObj[ key ];

                }

            }

        },

        // 格式化输入数据
        format: function ( input ) {

            // 清理多余的空格
            input = clearEmpty( input );

            // 处理输入的“{”和“}”
            input = input.replace( clearCharPattern, "" ).replace( /\\{/gi, leftChar ).replace( /\\}/gi, rightChar );

            // 预处理器处理
            for ( var key in PRE_HANDLER ) {

                if ( PRE_HANDLER.hasOwnProperty( key ) ) {
                    input = PRE_HANDLER[ key ]( input );
                }

            }

            return input;

        },

        split: function ( data ) {

            var units = [],
                pattern = /(?:\\[^a-z]\s*)|(?:\\[a-z]+\s*)|(?:[{}]\s*)|(?:[^\\{}]\s*)/gi,
                emptyPattern = /^\s+|\s+$/g,
                match = null;

            data = data.replace( emptyPattern, "" );

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

            var tree = [],
                currentUnit = null;

            // 递归处理
            while ( currentUnit = units.shift() ) {

                if ( Utils.isArray( currentUnit ) ) {
                    tree.push( this.generateTree( currentUnit ) );
                } else {
                    tree.push( currentUnit );
                }

            }

            tree = LatexUtils.toRPNExpression( tree );

            return LatexUtils.generateTree( tree );

        },

        parseToGroup: function ( units ) {

            var group = [],
                groupStack = [ group ],
                groupCount = 0,
                bracketsCount = 0;

            for ( var i = 0, len = units.length; i < len; i++ ) {

                switch ( units[i] ) {

                    case "{":
                        groupCount++;
                        groupStack.push( group );
                        group.push( [] );
                        group = group[ group.length - 1 ];
                        break;

                    case "}":
                        groupCount--;
                        group = groupStack.pop();
                        break;

                    // left-right分组
                    case "\\left":
                        bracketsCount++;
                        groupStack.push( group );
                        // 进入两层
                        group.push( [ [] ] );
                        group = group[ group.length - 1 ][ 0 ];
                        group.type = "brackets";
                        // 读取左括号
                        i++;
                        group.leftBrackets = units[i].replace( leftCharPattern, "{" ).replace( rightCharPattern, "}" );
                        break;

                    case "\\right":
                        bracketsCount--;
                        // 读取右括号
                        i++;
                        group.rightBrackets = units[i].replace( leftCharPattern, "{" ).replace( rightCharPattern, "}" );
                        group = groupStack.pop();
                        break;

                    default:
                        group.push( units[i].replace( leftCharPattern, "\\{" ).replace( rightCharPattern, "\\}" ) );
                        break;

                }

            }

            if ( groupCount !== 0 ) {
                throw new Error( "Group Error!" );
            }

            if ( bracketsCount !== 0 ) {
                throw new Error( "Brackets Error!" );
            }

            return groupStack[0];

        },

        parseToStruct: function ( units ) {

            var structs = [];

            for ( var i = 0, len = units.length; i < len; i++ ) {

                if ( Utils.isArray( units[ i ] ) ) {

                    if ( units[ i ].type === "brackets" ) {
                        // 处理自动调整大小的括号组
                        // 获取括号组定义
                        structs.push( Utils.getBracketsDefine( units[ i ].leftBrackets, units[ i ].rightBrackets ) );
                        // 处理内部表达式
                        structs.push( this.parseToStruct( units[ i ] ) );
                    } else {
                        // 普通组
                        structs.push( this.parseToStruct( units[ i ] ) );
                    }

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

        // 特殊控制字符优先处理
        if ( isSpecialCharacter( str ) ) {
            return str.substring( 1 );
        }

        switch ( Utils.getLatexType( str ) ) {

            case "operator":

                return Utils.getDefine( str );

            case "function":

                return Utils.getFuncDefine( str );

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

    function isSpecialCharacter ( char ) {

        if ( char.indexOf( "\\" ) === 0 ) {
            return !!SPECIAL_LIST[ char.substring( 1 ) ];
        }

        return false;

    }

    function clearEmpty ( data ) {

        return data.replace( /\\\s+/, "" ).replace( /\s*([^a-z0-9\s])\s*/gi, function ( match, symbol ) {

            return symbol;

        } );

    }

} );
