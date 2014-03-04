/**
 * latex实现工具包
 */

define( function ( require, exports, module ) {

    var Checker = require( "impl/latex/base/checker" ),
        OPERATOR_LIST = require( "impl/latex/define/operator" ),
        FUNCTION_LIST = require( "impl/latex/define/func" ),
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

            getOperatorName: function ( str ) {

                str = str.replace( /^\\/, "" );

                str = OPERATOR_LIST[ str ].name;

                return str.replace( /^\w|-\w/gi, function ( match ) {

                    return match.length === 1 ? match.toUpperCase() : match.charAt( 1 ).toUpperCase();

                } );

            },


            getOperatorHandler: function ( str ) {

                return OPERATOR_LIST[ str.replace( /^\\/, "" ) ].handler;

            },

            getFunctionHandler: function () {

                return OPERATOR_LIST[ "func" ];

            }

        };


    // 附加功能到Utils对象
    for ( var key in Checker ) {

        if ( Checker[ key ] && Checker.hasOwnProperty( key ) ) {
            Utils[ key ] = Checker[ key ];
        }

    }

    return Utils;


});