/**
 * 通用工具包
 */

define( function ( require ) {

    var OPERATOR_LIST = require( "impl/latex/define/operator" ),
        FUNCTION_LIST = require( "impl/latex/define/func" ),
        FUNCTION_HANDLER = require( "impl/latex/handler/func" ),
        Utils = {

            // 根据输入的latex字符串， 检测出该字符串所对应的kf的类型
            getLatexType: function ( str ) {

                str = str.replace( /^\\/, "" );

                // 操作符
                if ( OPERATOR_LIST[ str ] ) {
                    return "operator";
                }

                if ( FUNCTION_LIST[ str ] ) {
                    return "function";
                }

                return "text";

            },

            isArray: function ( obj ) {

                return obj && Object.prototype.toString.call( obj ) === "[object Array]";

            },

            getDefine: function ( str ) {

                return Utils.extend( {}, OPERATOR_LIST[ str.replace("\\", "") ] );

            },

            getFuncDefine: function ( str ) {

                return {
                    name: "function",
                    params: str.replace( /^\\/, "" ),
                    handler: FUNCTION_HANDLER
                };

            },

            getBracketsDefine: function ( leftBrackets, rightBrackets ) {

                return Utils.extend( {
                    params: [ leftBrackets, rightBrackets ]
                }, OPERATOR_LIST.brackets );

            },

            extend: function ( target, sources ) {

                for ( var key in sources ) {

                    if ( sources.hasOwnProperty( key ) ) {
                        target[ key ] = sources[ key ];
                    }

                }

                return target;

            }

        };


    return Utils;


});