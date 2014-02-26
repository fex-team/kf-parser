/**
 * 类型检测器
 */

define( function ( require, exports, module ) {

    var FUNC = require( "impl/latex/fun" ).func;

    return {

        // 给定数据单元是否是函数
        isFunc: function ( str ) {

            return FUNC[ str.replace( /^\\+/, "" ) ] === 1;

        }

    };

});