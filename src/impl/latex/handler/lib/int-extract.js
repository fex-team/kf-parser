/**
 * 积分参数提取函数
 */

define( function ( require, exports, module ) {

    return function ( units ) {

        var count = units.shift(),  // 积分重数
            sup = units.shift() || null,
            sub = null,
            exp = null;

        if ( sup !== null  ) {

            if ( typeof sup === "string" ) {
                exp = sup;
                sup = null;
            } else {

                if ( sup.operator === "Superscript" ) {
                    sup = units.shift() || null;

                    if ( sup ) {

                        sub = units.shift() || null;

                        if ( sub ) {

                            if ( sub.operator === "Subscript" ) {
                                sub = units.shift() || null;
                                exp = units.shift() || null;
                            } else {
                                exp = sub;
                                sub = null;
                            }

                        }

                    }

                } else if ( sup.operator === "Subscript" ) {

                    sub = units.shift() || null;

                    if ( sub ) {

                        sup = units.shift() || null;

                        if ( sup ) {

                            if ( sup.operator === "Superscript" ) {
                                sup = units.shift() || null;
                                exp = units.shift() || null;
                            } else {
                                exp = sup;
                                sup = null;
                            }

                        }

                    }

                } else {
                    exp = sup;
                    sup = null;
                }

            }

        }

        return {
            sub: sub,
            sup: sup,
            exp: exp,
            count: count
        };

    };

} );
