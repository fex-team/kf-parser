/*!
 * ====================================================
 * kitygraph - v1.0.0 - 2013-12-16
 * https://github.com/kitygraph/kitygraph
 * GitHub: https://github.com/kitygraph/kitygraph.git 
 * Copyright (c) 2013 Baidu UEditor Group; Licensed MIT
 * ====================================================
 */

(function () {
/**
 * cmd 内部定义
 */

// 模块存储
var _modules = {};

function define ( id, deps, factory ) {

    _modules[ id ] = {

        exports: {},
        value: null,
        factory: null

    };

    if ( arguments.length === 2 ) {

        factory = deps;

    }

    if ( _modules.toString.call( factory ) === '[object Object]' ) {

        _modules[ id ][ 'value' ] = factory;

    } else if ( typeof factory === 'function' ) {

        _modules[ id ][ 'factory' ] = factory;

    } else {

        throw new Error( 'define函数未定义的行为' );

    }

}

function require ( id ) {

    var module = _modules[ id ],
        exports = null;

    if ( !module ) {

        return null;

    }

    if ( module.value ) {

        return module.value;

    }


    exports = module.factory.call( null, require, module.exports, module );

    // return 值不为空， 则以return值为最终值
    if ( exports ) {

        module.exports = exports;

    }

    module.value = module.exports;

    return module.value;

}

function use ( id ) {

    return require( id );

}
define("animate/animator", [ "animate/timeline", "graphic/color", "graphic/matrix", "graphic/eventhandler", "core/class", "animate/easing", "core/config", "graphic/shape", "graphic/svg", "core/utils", "graphic/styled", "graphic/data", "graphic/pen", "graphic/brush" ], function(require, exports, module) {
    function parseTime(str) {
        var value = parseFloat(str, 10);
        if (/ms/.test(str)) {
            return value;
        }
        if (/s/.test(str)) {
            return value * 1e3;
        }
        if (/min/.test(str)) {
            return value * 60 * 1e3;
        }
        return value;
    }
    var Timeline = require("animate/timeline");
    var easingTable = require("animate/easing");
    var Animator = require("core/class").createClass("Animator", {
        constructor: function(beginValue, finishValue, setter) {
            if (arguments.length == 1) {
                var opt = arguments[0];
                this.beginVal = opt.beginValue;
                this.finishVal = opt.finishValue;
                this.setter = opt.setter;
            } else {
                this.beginVal = beginValue;
                this.finishVal = finishValue;
                this.setter = setter;
            }
        },
        start: function(target, duration, easing, delay, callback) {
            if (arguments.length === 4 && typeof delay == "function") {
                callback = delay;
                delay = 0;
            }
            var timeline = this.create(target, duration, easing, callback);
            delay = parseTime(delay);
            if (delay > 0) {
                setTimeout(function() {
                    timeline.play();
                }, delay);
            } else {
                timeline.play();
            }
            return timeline;
        },
        create: function(target, duration, easing, callback) {
            var timeline;
            duration = duration && parseTime(duration) || Animator.DEFAULT_DURATION;
            easing = easing || Animator.DEFAULT_EASING;
            if (typeof easing == "string") {
                easing = easingTable[easing];
            }
            timeline = new Timeline(this, target, duration, easing);
            if (typeof callback == "function") {
                timeline.on("finish", callback);
            }
            return timeline;
        },
        reverse: function() {
            return new Animator(this.finishVal, this.beginVal, this.setter);
        }
    });
    Animator.DEFAULT_DURATION = 300;
    Animator.DEFAULT_EASING = "linear";
    var Shape = require("graphic/shape");
    require("core/class").extendClass(Shape, {
        animate: function(animator, duration, easing, delay, callback) {
            var queue = this._KityAnimateQueue = this._KityAnimateQueue || [];
            var timeline = animator.create(this, duration, easing, callback);
            function dequeue() {
                queue.shift();
                if (queue.length) {
                    setTimeout(queue[0].t.play.bind(queue[0].t), queue[0].d);
                }
            }
            timeline.on("finish", dequeue);
            queue.push({
                t: timeline,
                d: delay
            });
            if (queue.length == 1) {
                setTimeout(timeline.play.bind(timeline), delay);
            }
            return this;
        },
        stop: function() {
            var queue = this._KityAnimateQueue;
            if (queue) {
                while (queue.length) {
                    queue.shift().stop();
                }
            }
        }
    });
    return Animator;
});
/**
 * Kity Animate Easing modified from jQuery Easing
 * Author: techird
 * Changes: 
 *     1. make easing functions standalone
 *     2. remove the 'x' parameter
 */
/* ============================================================
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * https://raw.github.com/danro/jquery-easing/master/LICENSE
 * ======================================================== */
define("animate/easing", [], function(require, exports, module) {
    var easings = {
        // t: current_time, b: begin_value, c: change_value, d: duration
        linear: function(t, b, c, d) {
            return c * (t / d) + b;
        },
        swing: function(t, b, c, d) {
            return easings.easeOutQuad(t, b, c, d);
        },
        ease: function(t, b, c, d) {
            return easings.easeInOutCubic(t, b, c, d);
        },
        easeInQuad: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad: function(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * (--t * (t - 2) - 1) + b;
        },
        easeInCubic: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOutCubic: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        easeInQuart: function(t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOutQuart: function(t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOutQuart: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        easeInQuint: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOutQuint: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOutQuint: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        easeInSine: function(t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOutSine: function(t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        easeInExpo: function(t, b, c, d) {
            return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOutExpo: function(t, b, c, d) {
            return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo: function(t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function(t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOutCirc: function(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOutCirc: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        easeInElastic: function(t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * 2 * Math.PI / p)) + b;
        },
        easeOutElastic: function(t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * 2 * Math.PI / p) + c + b;
        },
        easeInOutElastic: function(t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (!p) p = d * .3 * 1.5;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return -.5 * a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * 2 * Math.PI / p) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * 2 * Math.PI / p) * .5 + c + b;
        },
        easeInBack: function(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOutBack: function(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOutBack: function(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * t * t * (((s *= 1.525) + 1) * t - s) + b;
            return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
        },
        easeInBounce: function(t, b, c, d) {
            return c - easings.easeOutBounce(d - t, 0, c, d) + b;
        },
        easeOutBounce: function(t, b, c, d) {
            if ((t /= d) < 1 / 2.75) {
                return c * 7.5625 * t * t + b;
            } else if (t < 2 / 2.75) {
                return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
            } else if (t < 2.5 / 2.75) {
                return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
            }
        },
        easeInOutBounce: function(t, b, c, d) {
            if (t < d / 2) return easings.easeInBounce(t * 2, 0, c, d) * .5 + b;
            return easings.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    };
    return easings;
});
define("animate/opacityanimator", [ "animate/animator", "animate/timeline", "animate/easing", "core/class", "graphic/shape", "graphic/matrix", "core/utils", "core/config", "graphic/svg", "graphic/eventhandler", "graphic/styled", "graphic/data", "graphic/pen", "graphic/brush" ], function(require, exports, module) {
    var Animator = require("animate/animator");
    var Matrix = require("graphic/matrix");
    var OpacityAnimator = require("core/class").createClass("OpacityAnimator", {
        base: Animator,
        constructor: function(opacity) {
            this.callBase({
                beginValue: function(target) {
                    return target.getOpacity();
                },
                finishValue: opacity,
                setter: function(target, value) {
                    target.setOpacity(value);
                }
            });
        }
    });
    var Shape = require("graphic/shape");
    require("core/class").extendClass(Shape, {
        fxOpacity: function(opacity, duration, easing, delay, callback) {
            return this.animate(new OpacityAnimator(opacity), duration, easing, delay, callback);
        },
        fadeTo: function() {
            return this.fxOpacity.apply(this, arguments);
        },
        fadeIn: function() {
            return this.fxOpacity.apply(this, [ 1 ].concat(arguments));
        },
        fadeOut: function() {
            return this.fxOpacity.apply(this, [ 0 ].concat(arguments));
        }
    });
    return OpacityAnimator;
});
define("animate/rotateanimator", [ "animate/animator", "animate/timeline", "animate/easing", "core/class", "graphic/shape", "graphic/matrix", "core/utils", "core/config", "graphic/svg", "graphic/eventhandler", "graphic/styled", "graphic/data", "graphic/pen", "graphic/brush" ], function(require, exports, module) {
    var Animator = require("animate/animator");
    var Matrix = require("graphic/matrix");
    var RotateAnimator = require("core/class").createClass("RotateAnimator", {
        base: Animator,
        constructor: function(deg, ax, ay) {
            this.callBase({
                beginValue: 0,
                finishValue: deg,
                setter: function(target, value, timeline) {
                    var delta = timeline.getDelta();
                    target.rotate(delta, ax, ay);
                }
            });
        }
    });
    var Shape = require("graphic/shape");
    require("core/class").extendClass(Shape, {
        fxRotate: function(deg, duration, easing, delay, callback) {
            return this.animate(new RotateAnimator(deg), duration, easing, delay, callback);
        },
        fxRotateAnchor: function(deg, ax, ay, duration, easing, delay, callback) {
            return this.animate(new RotateAnimator(deg, ax, ay), duration, easing, delay, callback);
        }
    });
    return RotateAnimator;
});
define("animate/scaleanimator", [ "animate/animator", "animate/timeline", "animate/easing", "core/class", "graphic/shape", "graphic/matrix", "core/utils", "core/config", "graphic/svg", "graphic/eventhandler", "graphic/styled", "graphic/data", "graphic/pen", "graphic/brush" ], function(require, exports, module) {
    var Animator = require("animate/animator");
    var Matrix = require("graphic/matrix");
    var ScaleAnimator = require("core/class").createClass("ScaleAnimator", {
        base: Animator,
        constructor: function(sx, sy, ax, ay) {
            this.callBase({
                beginValue: 0,
                finishValue: 1,
                setter: function(target, value, timeline) {
                    var delta = timeline.getDelta();
                    var kx = Math.pow(sx, delta);
                    var ky = Math.pow(sy, delta);
                    target.scale(ky, kx, ax, ay);
                }
            });
        }
    });
    var Shape = require("graphic/shape");
    require("core/class").extendClass(Shape, {
        fxScale: function(sx, sy, duration, easing, delay, callback) {
            return this.animate(new ScaleAnimator(sx, sy), duration, easing, delay, callback);
        },
        fxScaleAnchor: function(sx, sy, ax, ay, duration, easing, delay, callback) {
            return this.animate(new ScaleAnimator(sx, sy, ax, ay), duration, easing, delay, callback);
        }
    });
    return ScaleAnimator;
});
define("animate/timeline", [ "graphic/color", "core/utils", "graphic/standardcolor", "core/class", "graphic/matrix", "graphic/eventhandler", "graphic/shapeevent", "core/config" ], function(require, exports, module) {
    var Color = require("graphic/color");
    var Matrix = require("graphic/matrix");
    var EventHandler = require("graphic/eventhandler");
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    var globalFrameAction = [];
    function execGlobalFrameAction() {
        var pending = globalFrameAction;
        globalFrameAction = [];
        while (pending.length) {
            pending.shift()();
        }
        requestAnimationFrame(execGlobalFrameAction);
    }
    execGlobalFrameAction();
    function paralle(v1, v2, op) {
        if (false === isNaN(parseFloat(v1))) {
            return op(v1, v2);
        }
        var value = {};
        for (var n in v1) {
            if (v1.hasOwnProperty(n)) {
                value[n] = paralle(v1[n], v2[n], op);
            }
        }
        return value;
    }
    function getDelta(v1, v2) {
        return paralle(v1, v2, function(v1, v2) {
            return v2 - v1;
        });
    }
    // 不会深度遍历
    function getPercentValue(b, f, p) {
        return paralle(b, f, function(b, f) {
            return b + (f - b) * p;
        });
    }
    function TimelineEvent(timeline, type, param) {
        this.timeline = timeline;
        this.target = timeline.target;
        this.type = type;
        for (var name in param) {
            if (param.hasOwnProperty(name)) {
                this[name] = param[name];
            }
        }
    }
    var Timeline = require("core/class").createClass("Timeline", {
        mixins: [ EventHandler ],
        constructor: function(animator, target, duration, easing) {
            this.callMixin();
            this.time = 0;
            this.duration = duration;
            this.target = target;
            this.easing = easing;
            this.status = "ready";
            this.animator = animator;
            this.beginVal = animator.beginVal;
            this.finishVal = animator.finishVal;
            this.setter = animator.setter;
        },
        guessValueType: function() {
            var value = this.beginVal;
            if (parseFloat(value)) {
                this.valueType = "number";
                return;
            }
            // string as color
            if (typeof value == "string" || value instanceof Color) {
                this.valueType = "color";
                return;
            }
            if (value.x && value.y) {
                this.valueType = "point";
                return;
            }
            if (value instanceof Matrix) {
                this.valueType = "matrix";
            }
        },
        nextFrame: function() {
            if (this.status != "playing") {
                return;
            }
            var ts = +new Date(), lts = this.lastFrameTS || 0, elapsed = ts - lts;
            var target = this.target, setter = this.setter;
            // 
            // 1. 首次播放 lts 为 0，则修正 elapsed 为一帧的长度
            // 
            // 2. 浏览器最小化或切换标签，requestAnimationFrame 不会执行。
            //    检测时间超过 200 ms（频率小于 5Hz ） 判定为计时器暂停，重置为一帧长度
            //    
            //    ref: http://stackoverflow.com/questions/13133434/requestanimationframe-detect-stop
            if (elapsed > 200) {
                elapsed = 1e3 / 60;
            }
            this.time += elapsed;
            this.setValue(this.getValue());
            this.lastFrameTS = ts;
            if (this.time >= this.duration) {
                this.timeUp();
            }
            globalFrameAction.push(this.nextFrame.bind(this));
        },
        getPlayTime: function() {
            return this.rollbacking ? this.duration - this.time : this.time;
        },
        getValue: function() {
            var b = this.beginVal, f = this.finishVal, p = this.easing(this.getPlayTime(), 0, 1, this.duration), v;
            switch (this.valueType) {
              case "color":
                b = b.getValues();
                f = f.getValues();
                v = getPercentValue(b, f, p);
                return Color.createRGBA(v.r, v.g, v.b, v.a);

              case "matrix":
                b = b.getMatrix();
                f = f.getMatrix();
                v = getPercentValue(b, f, p);
                return new Matrix(v);

              default:
                return getPercentValue(b, f, p);
            }
        },
        getDelta: function() {
            this.lastValue = this.lastValue || this.beginVal;
            return getDelta(this.lastValue, this.currentValue);
        },
        setValue: function(value, lastValue) {
            this.currentValue = value;
            this.setter.call(this.target, this.target, value, this);
            this.lastValue = value;
        },
        play: function() {
            var ctx = this.context;
            var me = this;
            var lastStatus = this.status;
            this.status = "playing";
            switch (lastStatus) {
              case "ready":
                this.beginVal = typeof this.beginVal == "function" ? this.beginVal.call(this.target, this.target) : this.beginVal;
                this.finishVal = typeof this.finishVal == "function" ? this.finishVal.call(this.target, this.target) : this.finishVal;
                this.time = 0;
                this.guessValueType();
                this.nextFrame();
                break;

              case "finished":
              case "stoped":
                this.time = 0;
                this.nextFrame();
                break;

              case "paused":
                this.lastFrameTS = 0;
                this.nextFrame();
            }
            this.fire("play", new TimelineEvent(this, "play", {
                lastStatus: lastStatus
            }));
            return this;
        },
        pause: function() {
            this.status = "paused";
            this.fire("pause", new TimelineEvent(this, "pause"));
            return this;
        },
        stop: function() {
            this.status = "stoped";
            this.setValue(this.finishVal);
            this.rollbacking = false;
            this.fire("stop", new TimelineEvent(this, "stop"));
            return this;
        },
        reset: function() {
            this.setValue(this.beginVal);
        },
        timeUp: function() {
            if (this.repeatOption) {
                this.time = 0;
                if (this.rollback) {
                    if (this.rollbacking) {
                        this.decreaseRepeat();
                        this.rollbacking = false;
                    } else {
                        this.rollbacking = true;
                        this.fire("rollback", new TimelineEvent(this, "rollback"));
                    }
                } else {
                    this.decreaseRepeat();
                }
                if (!this.repeatOption) {
                    this.finish();
                } else {
                    this.fire("repeat", new TimelineEvent(this, "repeat"));
                }
            } else {
                this.finish();
            }
        },
        finish: function() {
            this.setValue(this.finishVal);
            this.status = "finished";
            this.fire("finish", new TimelineEvent(this, "finish"));
        },
        decreaseRepeat: function() {
            if (this.repeatOption !== true) {
                this.repeatOption--;
            }
        },
        repeat: function(repeat, rollback) {
            this.repeatOption = repeat;
            this.rollback = rollback;
            return this;
        }
    });
    return Timeline;
});
define("animate/translateanimator", [ "animate/animator", "animate/timeline", "animate/easing", "core/class", "graphic/shape", "graphic/matrix", "core/utils", "core/config", "graphic/svg", "graphic/eventhandler", "graphic/styled", "graphic/data", "graphic/pen", "graphic/brush" ], function(require, exports, module) {
    var Animator = require("animate/animator");
    var Matrix = require("graphic/matrix");
    var TranslateAnimator = require("core/class").createClass("TranslateAnimator", {
        base: Animator,
        constructor: function(x, y) {
            this.callBase({
                x: 0,
                y: 0
            }, {
                x: x,
                y: y
            }, function(target, value, timeline) {
                var delta = timeline.getDelta();
                target.translate(delta.x, delta.y);
            });
        }
    });
    var Shape = require("graphic/shape");
    require("core/class").extendClass(Shape, {
        fxTranslate: function(x, y, duration, easing, delay, callback) {
            return this.animate(new TranslateAnimator(x, y), duration, easing, delay, callback);
        }
    });
    return TranslateAnimator;
});
/**
 * @description 创建一个类
 * @param {String}    fullClassName  类全名，包括命名空间。
 * @param {Plain}     defines        要创建的类的特性
 *     defines.constructor  {Function}       类的构造函数，实例化的时候会被调用。
 *     defines.base         {String}         基类的名称。名称要使用全名。（因为base是javascript未来保留字，所以不用base）
 *     defines.mixin        {Array<String>}  要混合到新类的类集合
 *     defines.<method>     {Function}       其他类方法
 *
 * TODO:
 *     Mixin 构造函数调用支持
 */
define("core/class", [ "core/config" ], function(require, exports) {
    // just to bind context
    Function.prototype.bind = Function.prototype.bind || function(thisObj) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.apply(thisObj, args);
    };
    var config = require("core/config");
    // 方便调试查看
    if (config.debug) {
        var origin = Object.prototype.toString;
        Object.prototype.toString = function() {
            return this.__KityClassName || origin.call(this);
        };
    }
    // 所有类的基类
    function Class() {}
    Class.__KityClassName = "Class";
    function getCallerClass(instance, caller) {
        var currentClass = instance.constructor;
    }
    // 提供 base 调用支持
    Class.prototype.base = function(name) {
        var caller = arguments.callee.caller;
        var method = caller.__KityMethodClass.__KityBaseClass.prototype[name];
        return method.apply(this, Array.prototype.slice.call(arguments, 1));
    };
    // 直接调用 base 类的同名方法
    Class.prototype.callBase = function() {
        var caller = arguments.callee.caller;
        var method = caller.__KityMethodClass.__KityBaseClass.prototype[caller.__KityMethodName];
        return method.apply(this, arguments);
    };
    Class.prototype.mixin = function(name) {
        var caller = arguments.callee.caller;
        var mixins = caller.__KityMethodClass.__KityMixins;
        if (!mixins) {
            return this;
        }
        var method = mixins[name];
        return method.apply(this, Array.prototype.slice.call(arguments, 1));
    };
    Class.prototype.callMixin = function() {
        var caller = arguments.callee.caller;
        var methodName = caller.__KityMethodName;
        var mixins = caller.__KityMethodClass.__KityMixins;
        if (!mixins) {
            return this;
        }
        var method = mixins[methodName];
        if (methodName == "constructor") {
            for (var i = 0, l = method.length; i < l; i++) {
                method[i].call(this);
            }
            return this;
        } else {
            return method.apply(this, arguments);
        }
    };
    Class.prototype.pipe = function(fn) {
        if (typeof fn == "function") {
            fn.call(this, this);
        }
        return this;
    };
    Class.prototype.getType = function() {
        return this.__KityClassName;
    };
    // 检查基类是否调用了父类的构造函数
    // 该检查是弱检查，假如调用的代码被注释了，同样能检查成功（这个特性可用于知道建议调用，但是出于某些原因不想调用的情况）
    function checkBaseConstructorCall(targetClass, classname) {
        var code = targetClass.toString();
        if (!/this\.callBase/.test(code)) {
            throw new Error(classname + " : 类构造函数没有调用父类的构造函数！为了安全，请调用父类的构造函数");
        }
    }
    function checkMixinConstructorCall(targetClass, classname) {
        var code = targetClass.toString();
        if (!/this\.callMixin/.test(code)) {
            throw new Error(classname + " : 类构造函数没有调用父类的构造函数！为了安全，请调用父类的构造函数");
        }
    }
    var KITY_INHERIT_FLAG = "__KITY_INHERIT_FLAG_" + +new Date();
    function inherit(constructor, BaseClass) {
        var KityClass = function(__inherit__flag) {
            if (__inherit__flag != KITY_INHERIT_FLAG) {
                KityClass.__KityConstructor.apply(this, arguments);
            }
            this.__KityClassName = KityClass.__KityClassName;
        };
        KityClass.__KityConstructor = constructor;
        KityClass.prototype = new BaseClass(KITY_INHERIT_FLAG);
        for (var methodName in BaseClass.prototype) {
            if (BaseClass.prototype.hasOwnProperty(methodName) && methodName.indexOf("__Kity") !== 0) {
                KityClass.prototype[methodName] = BaseClass.prototype[methodName];
            }
        }
        KityClass.prototype.constructor = KityClass;
        return KityClass;
    }
    function mixin(NewClass, mixins) {
        if (false === mixins instanceof Array) {
            return NewClass;
        }
        var i, length = mixins.length, proto, method;
        NewClass.__KityMixins = {
            constructor: []
        };
        for (i = 0; i < length; i++) {
            proto = mixins[i].prototype;
            for (method in proto) {
                if (false === proto.hasOwnProperty(method) || method.indexOf("__Kity") === 0) {
                    continue;
                }
                if (method === "constructor") {
                    // constructor 特殊处理
                    NewClass.__KityMixins.constructor.push(proto[method]);
                } else {
                    NewClass.prototype[method] = NewClass.__KityMixins[method] = proto[method];
                }
            }
        }
        return NewClass;
    }
    function extend(BaseClass, extension) {
        if (extension.__KityClassName) {
            extension = extension.prototype;
        }
        for (var methodName in extension) {
            if (extension.hasOwnProperty(methodName) && methodName.indexOf("__Kity") && methodName != "constructor") {
                var method = BaseClass.prototype[methodName] = extension[methodName];
                method.__KityMethodClass = BaseClass;
                method.__KityMethodName = methodName;
            }
        }
        return BaseClass;
    }
    exports.createClass = function(classname, defines) {
        var constructor, NewClass, BaseClass;
        if (arguments.length === 1) {
            defines = arguments[0];
            classname = "AnonymousClass";
        }
        BaseClass = defines.base || Class;
        if (defines.hasOwnProperty("constructor")) {
            constructor = defines.constructor;
            if (BaseClass != Class) {
                checkBaseConstructorCall(constructor, classname);
            }
        } else {
            constructor = function() {
                this.callBase.apply(this, arguments);
                this.callMixin.apply(this, arguments);
            };
        }
        NewClass = inherit(constructor, BaseClass);
        NewClass = mixin(NewClass, defines.mixins);
        NewClass.__KityClassName = constructor.__KityClassName = classname;
        NewClass.__KityBaseClass = constructor.__KityBaseClass = BaseClass;
        NewClass.__KityMethodName = constructor.__KityMethodName = "constructor";
        NewClass.__KityMethodClass = constructor.__KityMethodClass = NewClass;
        // 下面这些不需要拷贝到原型链上
        delete defines.mixins;
        delete defines.constructor;
        delete defines.base;
        NewClass = extend(NewClass, defines);
        return NewClass;
    };
    exports.extendClass = extend;
});
define("core/config", [], function(require, exports, module) {
    return {
        debug: true,
        version: "1.0.0"
    };
});
define("core/utils", [], function(require, exports, module) {
    var utils = {
        each: function(obj, iterator, context) {
            if (obj === null) {
                return;
            }
            if (obj.length === +obj.length) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (iterator.call(context, obj[i], i, obj) === false) {
                        return false;
                    }
                }
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (iterator.call(context, obj[key], key, obj) === false) {
                            return false;
                        }
                    }
                }
            }
        },
        extend: function(t, s) {
            var a = arguments, notCover = this.isBoolean(a[a.length - 1]) ? a[a.length - 1] : false, len = this.isBoolean(a[a.length - 1]) ? a.length - 1 : a.length;
            for (var i = 1; i < len; i++) {
                var x = a[i];
                for (var k in x) {
                    if (!notCover || !t.hasOwnProperty(k)) {
                        t[k] = x[k];
                    }
                }
            }
            return t;
        },
        clone: function(obj) {
            var cloned = {};
            for (var m in obj) {
                if (obj.hasOwnProperty(m)) {
                    cloned[m] = obj[m];
                }
            }
            return cloned;
        },
        getValue: function(value, defaultValue) {
            return value !== undefined ? value : defaultValue;
        }
    };
    utils.each([ "String", "Function", "Array", "Number", "RegExp", "Object", "Boolean" ], function(v) {
        utils["is" + v] = function(obj) {
            return Object.prototype.toString.apply(obj) == "[object " + v + "]";
        };
    });
    return utils;
});
/**
 * 颜色矩阵运算效果封装
 */
define("filter/effect/colormatrixeffect", [ "filter/effect/effect", "graphic/svg", "core/class", "core/utils", "core/config" ], function(require, exports, module) {
    var Effect = require("filter/effect/effect"), Utils = require("core/utils");
    var ColorMatrixEffect = require("core/class").createClass("ColorMatrixEffect", {
        base: Effect,
        constructor: function(type, input) {
            this.callBase(Effect.NAME_COLOR_MATRIX);
            this.set("type", Utils.getValue(type, ColorMatrixEffect.TYPE_MATRIX));
            this.set("in", Utils.getValue(input, Effect.INPUT_SOURCE_GRAPHIC));
        }
    });
    Utils.extend(ColorMatrixEffect, {
        // 类型常量
        TYPE_MATRIX: "matrix",
        TYPE_SATURATE: "saturate",
        TYPE_HUE_ROTATE: "hueRotate",
        TYPE_LUMINANCE_TO_ALPHA: "luminanceToAlpha",
        // 矩阵常量
        MATRIX_ORIGINAL: "10000010000010000010".split("").join(" "),
        MATRIX_EMPTY: "00000000000000000000".split("").join(" ")
    });
    return ColorMatrixEffect;
});
/**
 * 高斯模糊效果封装
 */
define("filter/effect/compositeeffect", [ "filter/effect/effect", "graphic/svg", "core/class", "core/utils", "core/config" ], function(require, exports, module) {
    var Effect = require("filter/effect/effect"), Utils = require("core/utils");
    var CompositeEffect = require("core/class").createClass("CompositeEffect", {
        base: Effect,
        constructor: function(operator, input, input2) {
            this.callBase(Effect.NAME_COMPOSITE);
            this.set("operator", Utils.getValue(operator, CompositeEffect.OPERATOR_OVER));
            if (input) {
                this.set("in", input);
            }
            if (input2) {
                this.set("in2", input2);
            }
        }
    });
    Utils.extend(CompositeEffect, {
        // operator 常量
        OPERATOR_OVER: "over",
        OPERATOR_IN: "in",
        OPERATOR_OUT: "out",
        OPERATOR_ATOP: "atop",
        OPERATOR_XOR: "xor",
        OPERATOR_ARITHMETIC: "arithmetic"
    });
    return CompositeEffect;
});
/**
 * 像素级别的矩阵卷积运算效果封装
 */
define("filter/effect/convolvematrixeffect", [ "filter/effect/effect", "graphic/svg", "core/class", "core/utils", "core/config" ], function(require, exports, module) {
    var Effect = require("filter/effect/effect"), Utils = require("core/utils");
    var ConvolveMatrixEffect = require("core/class").createClass("ConvolveMatrixEffect", {
        base: Effect,
        constructor: function(edgeMode, input) {
            this.callBase(Effect.NAME_CONVOLVE_MATRIX);
            this.set("edgeMode", Utils.getValue(edgeMode, ConvolveMatrixEffect.MODE_DUPLICATE));
            this.set("in", Utils.getValue(input, Effect.INPUT_SOURCE_GRAPHIC));
        }
    });
    Utils.extend(ConvolveMatrixEffect, {
        MODE_DUPLICATE: "duplicate",
        MODE_WRAP: "wrap",
        MODE_NONE: "none"
    });
    return ConvolveMatrixEffect;
});
/*
 * 效果类
 * 该类型的对象不存储任何内部属性， 所有操作都是针对该类对象所维护的节点进行的
 */
define("filter/effect/effect", [ "graphic/svg", "core/class", "core/config", "core/utils" ], function(require, exports, module) {
    var svg = require("graphic/svg"), Effect = require("core/class").createClass("Effect", {
        constructor: function(type) {
            this.node = svg.createNode(type);
        },
        getId: function() {
            return this.node.id;
        },
        setId: function(id) {
            this.node.id = id;
            return this;
        },
        set: function(key, value) {
            this.node.setAttribute(key, value);
            return this;
        },
        get: function(key) {
            return this.node.getAttribute(key);
        },
        getNode: function() {
            return this.node;
        },
        // 返回该效果的result
        toString: function() {
            return this.node.getAttribute("result") || "";
        }
    });
    require("core/utils").extend(Effect, {
        // 特效名称常量
        NAME_GAUSSIAN_BLUR: "feGaussianBlur",
        NAME_OFFSET: "feOffset",
        NAME_COMPOSITE: "feComposite",
        NAME_COLOR_MATRIX: "feColorMatrix",
        NAME_CONVOLVE_MATRIX: "feConvolveMatrix",
        // 输入常量
        INPUT_SOURCE_GRAPHIC: "SourceGraphic",
        INPUT_SOURCE_ALPHA: "SourceAlpha",
        INPUT_BACKGROUND_IMAGE: "BackgroundImage",
        INPUT_BACKGROUND_ALPHA: "BackgroundAlpha",
        INPUT_FILL_PAINT: "FillPaint",
        INPUT_STROKE_PAINT: "StrokePaint"
    });
    return Effect;
});
/**
 * 高斯模糊效果封装
 */
define("filter/effect/gaussianblureffect", [ "filter/effect/effect", "graphic/svg", "core/class", "core/utils", "core/config" ], function(require, exports, module) {
    var Effect = require("filter/effect/effect"), Utils = require("core/utils");
    return require("core/class").createClass("GaussianblurEffect", {
        base: Effect,
        constructor: function(stdDeviation, input) {
            this.callBase(Effect.NAME_GAUSSIAN_BLUR);
            this.set("stdDeviation", Utils.getValue(stdDeviation, 1));
            this.set("in", Utils.getValue(input, Effect.INPUT_SOURCE_GRAPHIC));
        }
    });
});
/**
 * 偏移效果封装
 */
define("filter/effect/offseteffect", [ "filter/effect/effect", "graphic/svg", "core/class", "core/utils", "core/config" ], function(require, exports, module) {
    var Effect = require("filter/effect/effect"), Utils = require("core/utils");
    return require("core/class").createClass("OffsetEffect", {
        base: Effect,
        constructor: function(dx, dy, input) {
            this.callBase(Effect.NAME_OFFSET);
            this.set("dx", Utils.getValue(dx, 0));
            this.set("dy", Utils.getValue(dy, 0));
            this.set("in", Utils.getValue(input, Effect.INPUT_SOURCE_GRAPHIC));
        }
    });
});
/*
 * Effect所用的container
 */
define("filter/effectcontainer", [ "core/class", "core/config", "graphic/container" ], function(require, exports, module) {
    return require("core/class").createClass("EffectContainer", {
        base: require("graphic/container"),
        addEffect: function(point, pos) {
            return this.addItem.apply(this, arguments);
        },
        prependEffect: function() {
            return this.prependItem.apply(this, arguments);
        },
        appendEffect: function() {
            return this.appendItem.apply(this, arguments);
        },
        removeEffect: function(pos) {
            return this.removeItem.apply(this, arguments);
        },
        addEffects: function() {
            return this.addItems.apply(this, arguments);
        },
        setEffects: function() {
            return this.setItems.apply(this, arguments);
        },
        getEffect: function() {
            return this.getItem.apply(this, arguments);
        },
        getEffects: function() {
            return this.getItems.apply(this, arguments);
        },
        getFirstEffect: function() {
            return this.getFirstItem.apply(this, arguments);
        },
        getLastEffect: function() {
            return this.getLastItem.apply(this, arguments);
        },
        itemAddedHandler: function(effectItem, pos) {
            var count = this.getEffects().length, nextEffectItem = this.getItem(pos + 1);
            // 最后一个节点， 直接追加
            if (count === pos + 1) {
                this.node.appendChild(effectItem.getNode());
                return;
            }
            this.node.insertBefore(effectItem.getNode(), nextEffectItem.getNode());
        }
    });
});
/**
 * Filter 基类
 */
define("filter/filter", [ "graphic/svg", "core/class", "core/config", "filter/effectcontainer", "graphic/container", "graphic/shape", "core/utils", "graphic/eventhandler", "graphic/styled", "graphic/data", "graphic/matrix", "graphic/pen", "graphic/brush" ], function(require, exports, module) {
    var svg = require("graphic/svg");
    var Class = require("core/class");
    var Filter = Class.createClass("Filter", {
        mixins: [ require("filter/effectcontainer") ],
        constructor: function(x, y, width, height) {
            this.node = svg.createNode("filter");
            if (x !== undefined) {
                this.set("x", x);
            }
            if (y !== undefined) {
                this.set("y", y);
            }
            if (width !== undefined) {
                this.set("width", width);
            }
            if (height !== undefined) {
                this.set("height", height);
            }
        },
        getId: function() {
            return this.id;
        },
        setId: function(id) {
            this.node.id = id;
            return this;
        },
        set: function(key, value) {
            this.node.setAttribute(key, value);
            return this;
        },
        get: function(key) {
            return this.node.getAttribute(key);
        },
        getNode: function() {
            return this.node;
        }
    });
    var Shape = require("graphic/shape");
    Class.extendClass(Shape, {
        applyFilter: function(filter) {
            var filterId = filter.get("id");
            if (filterId) {
                this.node.setAttribute("filter", "url(#" + filterId + ")");
            }
            return this;
        }
    });
    return Filter;
});
/*
 * 高斯模糊滤镜
 */
define("filter/gaussianblurfilter", [ "filter/effect/gaussianblureffect", "filter/effect/effect", "core/utils", "core/class", "core/config", "filter/filter", "graphic/svg", "filter/effectcontainer", "graphic/shape" ], function(require, exports, module) {
    var GaussianblurEffect = require("filter/effect/gaussianblureffect");
    return require("core/class").createClass("GaussianblurFilter", {
        base: require("filter/filter"),
        constructor: function(stdDeviation) {
            this.callBase();
            this.addEffect(new GaussianblurEffect(stdDeviation));
        }
    });
});
/*
 * 投影滤镜
 */
define("filter/projectionfilter", [ "filter/effect/gaussianblureffect", "filter/effect/effect", "core/utils", "core/class", "graphic/svg", "filter/effect/colormatrixeffect", "graphic/color", "graphic/standardcolor", "filter/effect/compositeeffect", "filter/effect/offseteffect", "core/config", "filter/filter", "filter/effectcontainer", "graphic/shape" ], function(require, exports, module) {
    var GaussianblurEffect = require("filter/effect/gaussianblureffect"), Effect = require("filter/effect/effect"), ColorMatrixEffect = require("filter/effect/colormatrixeffect"), Color = require("graphic/color"), Utils = require("core/utils"), CompositeEffect = require("filter/effect/compositeeffect"), OffsetEffect = require("filter/effect/offseteffect");
    return require("core/class").createClass("ProjectionFilter", {
        base: require("filter/filter"),
        constructor: function(stdDeviation, dx, dy) {
            this.callBase();
            this.gaussianblurEffect = new GaussianblurEffect(stdDeviation, Effect.INPUT_SOURCE_ALPHA);
            this.gaussianblurEffect.set("result", "gaussianblur");
            this.addEffect(this.gaussianblurEffect);
            this.offsetEffect = new OffsetEffect(dx, dy, this.gaussianblurEffect);
            this.offsetEffect.set("result", "offsetBlur");
            this.addEffect(this.offsetEffect);
            this.colorMatrixEffect = new ColorMatrixEffect(ColorMatrixEffect.TYPE_MATRIX, this.offsetEffect);
            this.colorMatrixEffect.set("values", ColorMatrixEffect.MATRIX_ORIGINAL);
            this.colorMatrixEffect.set("result", "colorOffsetBlur");
            this.addEffect(this.colorMatrixEffect);
            this.compositeEffect = new CompositeEffect(CompositeEffect.OPERATOR_OVER, Effect.INPUT_SOURCE_GRAPHIC, this.colorMatrixEffect);
            this.addEffect(this.compositeEffect);
        },
        // 设置投影颜色
        setColor: function(color) {
            var matrix = null, originMatrix = null, colorValue = [];
            if (Utils.isString(color)) {
                color = Color.parse(color);
            }
            if (!color) {
                return this;
            }
            matrix = ColorMatrixEffect.MATRIX_EMPTY.split(" ");
            colorValue.push(color.get("r"));
            colorValue.push(color.get("g"));
            colorValue.push(color.get("b"));
            // rgb 分量更改
            for (var i = 0, len = colorValue.length; i < len; i++) {
                matrix[i * 5 + 3] = colorValue[i] / 255;
            }
            // alpha 分量更改
            matrix[18] = color.get("a");
            this.colorMatrixEffect.set("values", matrix.join(" "));
            return this;
        },
        // 设置投影透明度
        setOpacity: function(opacity) {
            var matrix = this.colorMatrixEffect.get("values").split(" ");
            matrix[18] = opacity;
            this.colorMatrixEffect.set("values", matrix.join(" "));
            return this;
        },
        // 设置阴影偏移量
        setOffset: function(dx, dy) {
            this.setOffsetX(dx);
            this.setOffsetY(dy);
        },
        setOffsetX: function(dx) {
            this.offsetEffect.set("dx", dx);
        },
        setOffsetY: function(dy) {
            this.offsetEffect.set("dy", dy);
        },
        setDeviation: function(deviation) {
            this.gaussianblurEffect.set("stdDeviation", deviation);
        }
    });
});
/**
 * 贝塞尔曲线
 */
define("graphic/bezier", [ "core/class", "core/config", "graphic/pointcontainer", "graphic/container", "graphic/path", "core/utils", "graphic/shape", "graphic/svg" ], function(require, exports, module) {
    return require("core/class").createClass("Bezier", {
        mixins: [ require("graphic/pointcontainer") ],
        base: require("graphic/path"),
        constructor: function(bezierPoints) {
            this.callBase();
            bezierPoints = bezierPoints || [];
            this.changeable = true;
            this.setBezierPoints(bezierPoints);
        },
        getBezierPoints: function() {
            return this.getPoints();
        },
        setBezierPoints: function(bezierPoints) {
            return this.setPoints(bezierPoints);
        },
        //当点集合发生变化时采取的动作
        onContainerChanged: function() {
            if (this.changeable) {
                this.update();
            }
        },
        update: function() {
            var drawer = null, bezierPoints = this.getBezierPoints();
            //单独的一个点不画任何图形
            if (bezierPoints.length < 2) {
                return;
            }
            drawer = this.getDrawer();
            drawer.clear();
            var vertex = bezierPoints[0].getVertex(), forward = null, backward = null;
            drawer.moveTo(vertex.x, vertex.y);
            for (var i = 1, len = bezierPoints.length; i < len; i++) {
                vertex = bezierPoints[i].getVertex();
                backward = bezierPoints[i].getBackward();
                forward = bezierPoints[i - 1].getForward();
                drawer.bezierTo(forward.x, forward.y, backward.x, backward.y, vertex.x, vertex.y);
            }
            return this;
        }
    });
});
/**
 * 贝塞尔点
 */
define("graphic/bezierpoint", [ "graphic/shapepoint", "core/class", "graphic/point", "graphic/vector", "core/config" ], function(require, exports, module) {
    var ShapePoint = require("graphic/shapepoint");
    var Vector = require("graphic/vector");
    var BezierPoint = require("core/class").createClass("BezierPoint", {
        constructor: function(x, y, isSmooth) {
            //顶点
            this.vertex = new ShapePoint(x, y);
            //控制点
            this.forward = new ShapePoint(x, y);
            this.backward = new ShapePoint(x, y);
            //是否平滑
            this.setSmooth(isSmooth === undefined || isSmooth);
            this.setSymReflaction(true);
        },
        clone: function() {
            var newPoint = new BezierPoint(), tmp = null;
            tmp = this.getVertex();
            newPoint.setVertex(tmp.x, tmp.y);
            tmp = this.getForward();
            newPoint.setForward(tmp.x, tmp.y);
            tmp = this.getBackward();
            newPoint.setBackward(tmp.x, tmp.y);
            newPoint.setSmooth(newPoint.isSmooth());
            return newPoint;
        },
        setVertex: function(x, y) {
            this.vertex.setPoint(x, y);
            this.update();
            return this;
        },
        moveTo: function(x, y) {
            var oldForward = this.forward.getPoint(), oldBackward = this.backward.getPoint(), oldVertex = this.vertex.getPoint(), //移动距离
            distance = {
                left: x - oldVertex.x,
                top: y - oldVertex.y
            };
            // 更新
            this.forward.setPoint(oldForward.x + distance.left, oldForward.y + distance.top);
            this.backward.setPoint(oldBackward.x + distance.left, oldBackward.y + distance.top);
            this.vertex.setPoint(x, y);
            this.update();
        },
        setForward: function(x, y) {
            this.forward.setPoint(x, y);
            //更新后置点
            if (this.smooth) {
                this.updateAnother(this.forward, this.backward);
            }
            this.update();
            return this;
        },
        setBackward: function(x, y) {
            this.backward.setPoint(x, y);
            //更新前置点
            if (this.smooth) {
                this.updateAnother(this.backward, this.forward);
            }
            this.update();
            return this;
        },
        setSymReflaction: function(value) {
            this.symReflaction = value;
        },
        isSymReflaction: function() {
            return this.symReflaction;
        },
        updateAnother: function(p, q) {
            var v = this.getVertex(), pv = Vector.fromPoints(p.getPoint(), v), vq = Vector.fromPoints(v, q.getPoint());
            vq = Vector.normalize(pv, this.isSymReflaction() ? pv.length() : vq.length());
            q.setPoint(v.x + vq.x, v.y + vq.y);
        },
        setSmooth: function(isSmooth) {
            this.smooth = !!isSmooth;
            return this;
        },
        getVertex: function() {
            return this.vertex.getPoint();
        },
        getForward: function() {
            return this.forward.getPoint();
        },
        getBackward: function() {
            return this.backward.getPoint();
        },
        isSmooth: function() {
            return this.smooth;
        },
        update: function() {
            if (!this.container) {
                return this;
            }
            //新增参数 this， 把当前引起变化的点传递过去， 以便有需要的地方可以获取到引起变化的源
            this.container.update && this.container.update(this);
        }
    });
    return BezierPoint;
});
define("graphic/brush", [ "core/class", "core/config" ], function(require, exports, module) {
    var Brush = require("core/class").createClass("Brush", {
        constructor: function() {},
        getType: function() {
            throw new Error("abstract method call error");
        }
    });
    return Brush;
});
define("graphic/circle", [ "core/class", "core/config", "graphic/ellipse", "core/utils", "graphic/path" ], function(require, exports, module) {
    return require("core/class").createClass("Circle", {
        base: require("graphic/ellipse"),
        constructor: function(cx, cy, radius) {
            this.callBase(cx, cy, radius, radius);
            this.rx = this.ry = this.radius = radius;
            this.update();
        },
        getRadius: function() {
            return this.radius;
        },
        setRadius: function(radius) {
            this.rx = this.ry = this.radius = radius;
            this.update();
        }
    });
});
/**
 * 图形裁剪
 */
define("graphic/clip", [ "core/class", "core/config", "graphic/shape", "graphic/svg", "core/utils", "graphic/eventhandler", "graphic/styled", "graphic/data", "graphic/matrix", "graphic/pen", "graphic/brush", "graphic/shapecontainer", "graphic/container" ], function(require, exports, module) {
    var Class = require("core/class");
    var Shape = require("graphic/shape");
    var Clip = Class.createClass("Clip", {
        base: Shape,
        mixins: [ require("graphic/shapecontainer") ],
        constructor: function() {
            this.callBase("clipPath");
        },
        clip: function(shape) {
            shape.getNode().setAttribute("clip-path", "url(#" + this.getId() + ")");
            return this;
        }
    });
    Class.extendClass(Shape, {
        clipWith: function(clip) {
            clip.clip(this);
            return this;
        }
    });
    return Clip;
});
define("graphic/color", [ "core/utils", "graphic/standardcolor", "core/class", "core/config" ], function(require, exports, module) {
    var Utils = require("core/utils"), StandardColor = require("graphic/standardcolor"), ColorUtils = {}, Color = require("core/class").createClass("Color", {
        constructor: function() {
            var colorValue = null;
            //parse构造
            if (typeof arguments[0] === "string") {
                colorValue = ColorUtils.parseToValue(arguments[0]);
                //解析失败
                if (colorValue === null) {
                    colorValue = {
                        r: 0,
                        g: 0,
                        b: 0,
                        h: 0,
                        s: 0,
                        l: 0,
                        a: 1
                    };
                }
            } else {
                colorValue = {
                    r: arguments[0] | 0,
                    g: arguments[1] | 0,
                    b: arguments[2] | 0,
                    //alpha 默认为1
                    a: parseFloat(arguments[3]) || 1
                };
                colorValue = ColorUtils.overflowFormat(colorValue);
                //获取hsl分量
                colorValue = Utils.extend(colorValue, ColorUtils.rgbValueToHslValue(colorValue));
            }
            this._color = colorValue;
        },
        set: function(name, value) {
            var values = null;
            //设置的值非法
            if (!Color._MAX_VALUE[name]) {
                throw new Error("Color set(): Illegal parameter");
            }
            if (name !== "a") {
                value = Math.floor(value);
            }
            if (name == "h") {
                value = (value + 360) % 360;
            }
            this._color[name] = Math.max(Color._MIN_VALUE[name], Math.min(Color._MAX_VALUE[name], value));
            if ("rgb".indexOf(name) !== -1) {
                this._color = Utils.extend(this._color, ColorUtils.rgbValueToHslValue(this._color));
            } else if ("hsl".indexOf(name) !== -1) {
                this._color = Utils.extend(this._color, ColorUtils.hslValueToRGBValue(this._color));
            }
            return this;
        },
        inc: function(name, value) {
            value = this.get(name) + value;
            if (name == "h") {
                value = (value + 360) % 360;
            } else {
                value = Math.min(Color._MAX_VALUE[name], value);
                value = Math.max(Color._MIN_VALUE[name], value);
            }
            return this.clone().set(name, value);
        },
        dec: function(name, value) {
            return this.inc(name, -value);
        },
        clone: function() {
            return new Color(this.toRGBA());
        },
        get: function(name) {
            if (!Color._MAX_VALUE[name]) {
                return null;
            }
            return this._color[name];
        },
        getValues: function() {
            return Utils.clone(this._color);
        },
        toRGB: function() {
            return ColorUtils.toString(this._color, "rgb");
        },
        toRGBA: function() {
            return ColorUtils.toString(this._color, "rgba");
        },
        toHEX: function() {
            return ColorUtils.toString(this._color, "hex");
        },
        toHSL: function() {
            return ColorUtils.toString(this._color, "hsl");
        },
        toHSLA: function() {
            return ColorUtils.toString(this._color, "hsla");
        },
        //默认实现是调用toRGB或者toRGBA
        toString: function() {
            if (this._color.a === 1) {
                return this.toRGB();
            }
            return this.toRGBA();
        }
    });
    //Color 静态方法
    Utils.extend(Color, {
        //各分量可表示的最大值
        _MAX_VALUE: {
            r: 255,
            g: 255,
            b: 255,
            h: 360,
            s: 100,
            l: 100,
            a: 1
        },
        //各分量最小值
        _MIN_VALUE: {
            r: 0,
            g: 0,
            b: 0,
            h: 0,
            s: 0,
            l: 0,
            a: 0
        },
        //分量常量
        R: "r",
        G: "g",
        B: "b",
        H: "h",
        S: "s",
        L: "l",
        A: "a",
        parse: function(valStr) {
            var rgbValue = ColorUtils.parseToValue(valStr);
            //解析失败， 返回一个默认color实例
            if (rgbValue === null) {
                return new Color();
            }
            return new Color(rgbValue.r, rgbValue.g, rgbValue.b, rgbValue.a);
        },
        createHSL: function(h, s, l) {
            return Color.createHSLA(h, s, l, 1);
        },
        createHSLA: function(h, s, l, a) {
            var colorValue = null;
            s += "%";
            l += "%";
            colorValue = [ "hsla(" + h, s, l, a + ")" ];
            return Color.parse(colorValue.join(", "));
        },
        createRGB: function(r, g, b) {
            return Color.createRGBA(r, g, b, 1);
        },
        createRGBA: function(r, g, b, a) {
            return new Color(r, g, b, a);
        }
    });
    //内部工具对象
    Utils.extend(ColorUtils, {
        parseToValue: function(valStr) {
            var rgbaValue = {};
            /* 优先检测在调色板中是否有对应的颜色 */
            valStr = StandardColor.EXTEND_STANDARD[valStr] || StandardColor.COLOR_STANDARD[valStr] || valStr;
            /* 颜色转换 */
            //hex格式
            if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(valStr)) {
                rgbaValue = ColorUtils.hexToValue(valStr);
            } else if (/^(rgba?)/i.test(valStr)) {
                rgbaValue = ColorUtils.rgbaToValue(valStr);
            } else if (/^(hsla?)/i.test(valStr)) {
                rgbaValue = ColorUtils.hslaToValue(valStr);
            } else {
                return null;
            }
            return ColorUtils.overflowFormat(rgbaValue);
        },
        hexToValue: function(hexStr) {
            var result = {}, keys = [ "r", "g", "b" ];
            if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hexStr)) {
                hexStr = RegExp.$1.split("");
                Utils.each(keys, function(key, index) {
                    if (hexStr.length === 3) {
                        result[key] = ColorUtils.toNumber(hexStr[index] + hexStr[index]);
                    } else {
                        result[key] = ColorUtils.toNumber(hexStr[index * 2] + hexStr[index * 2 + 1]);
                    }
                });
                //转换出hsl值
                result = Utils.extend(result, ColorUtils.rgbValueToHslValue(result));
                result.a = 1;
                return result;
            }
            return null;
        },
        rgbaToValue: function(rgbaStr) {
            var result = {}, hasAlpha = false, keys = [ "r", "g", "b" ];
            if (/^(rgba?)/i.test(rgbaStr)) {
                hasAlpha = RegExp.$1.length === 4;
                rgbaStr = rgbaStr.replace(/^rgba?/i, "").replace(/\s+/g, "").replace(/[^0-9,.]/g, "").split(",");
                Utils.each(keys, function(key, index) {
                    result[key] = rgbaStr[index] | 0;
                });
                //转换出hsl值
                result = Utils.extend(result, ColorUtils.rgbValueToHslValue(result));
                result.a = hasAlpha ? parseFloat(rgbaStr[3]) : 1;
                return result;
            }
            return null;
        },
        hslaToValue: function(hslaStr) {
            var result = {}, hasAlpha = false;
            if (/^(hsla?)/i.test(hslaStr)) {
                hasAlpha = RegExp.$1.length === 4;
                hslaStr = hslaStr.replace(/^hsla?/i, "").replace(/\s+/g, "").replace(/[^0-9,.]/g, "").split(",");
                //记录hsl值
                result.h = hslaStr[0] | 0;
                result.s = hslaStr[1] | 0;
                result.l = hslaStr[2] | 0;
                //转换出rgb值
                result = Utils.extend(result, ColorUtils.hslValueToRGBValue(result));
                //hsl值转换为rgb值
                result = ColorUtils.hslValueToRGBValue(result);
                result.a = hasAlpha ? parseFloat(hslaStr[3]) : 1;
                return result;
            }
            return null;
        },
        //hsl值对象转换为rgb值对象
        hslValueToRGBValue: function(hslValue) {
            var q = null, p = null, result = {};
            hslValue = Utils.extend({}, hslValue);
            hslValue.h = hslValue.h / 360;
            hslValue.s = hslValue.s / 100;
            hslValue.l = hslValue.l / 100;
            //分量计算
            if (hslValue.s === 0) {
                result.r = result.g = result.b = hslValue.l;
            } else {
                if (hslValue.l < .5) {
                    q = hslValue.l * (1 + hslValue.s);
                } else {
                    q = hslValue.l + hslValue.s - hslValue.l * hslValue.s;
                }
                p = 2 * hslValue.l - q;
                result.r = trans(p, q, hslValue.h + 1 / 3);
                result.g = trans(p, q, hslValue.h);
                result.b = trans(p, q, hslValue.h - 1 / 3);
            }
            result.r = Math.min(Math.round(result.r * 255), 255);
            result.g = Math.min(Math.round(result.g * 255), 255);
            result.b = Math.min(Math.round(result.b * 255), 255);
            return result;
            function trans(v1, v2, vH) {
                if (vH < 0) {
                    vH += 1;
                } else if (vH > 1) {
                    vH -= 1;
                }
                if (6 * vH < 1) {
                    return v1 + (v2 - v1) * 6 * vH;
                } else if (2 * vH < 1) {
                    return v2;
                } else if (3 * vH < 2) {
                    return v1 + (v2 - v1) * (2 / 3 - vH) * 6;
                }
                return v1;
            }
        },
        //rgb值对象转换为hsl值对象
        rgbValueToHslValue: function(rgbValue) {
            var max = null, min = null, result = {};
            rgbValue = Utils.extend({}, rgbValue);
            rgbValue.r = rgbValue.r / 255;
            rgbValue.g = rgbValue.g / 255;
            rgbValue.b = rgbValue.b / 255;
            max = Math.max(rgbValue.r, rgbValue.g, rgbValue.b);
            min = Math.min(rgbValue.r, rgbValue.g, rgbValue.b);
            //h分量计算
            if (max === min) {
                result.h = 0;
            } else if (max === rgbValue.r) {
                if (rgbValue.g >= rgbValue.b) {
                    result.h = 60 * (rgbValue.g - rgbValue.b) / (max - min);
                } else {
                    result.h = 60 * (rgbValue.g - rgbValue.b) / (max - min) + 360;
                }
            } else if (max === rgbValue.g) {
                result.h = 60 * (rgbValue.b - rgbValue.r) / (max - min) + 120;
            } else if (max === rgbValue.b) {
                result.h = 60 * (rgbValue.r - rgbValue.g) / (max - min) + 240;
            }
            //l分量计算
            result.l = (max + min) / 2;
            //s分量计算
            if (result.l === 0 || max === min) {
                result.s = 0;
            } else if (result.l > 0 && result.l <= .5) {
                result.s = (max - min) / (max + min);
            } else {
                result.s = (max - min) / (2 - max - min);
            }
            //格式化hsl结果
            result.h = Math.round(result.h);
            result.s = Math.round(result.s * 100);
            result.l = Math.round(result.l * 100);
            return result;
        },
        toString: function(colorValue, type) {
            var vals = [];
            colorValue = Utils.extend({}, colorValue);
            if (type.indexOf("hsl") !== -1) {
                colorValue.s += "%";
                colorValue.l += "%";
            }
            if (type !== "hex") {
                Utils.each(type.split(""), function(key) {
                    vals.push(colorValue[key]);
                });
                return (type + "(" + vals.join(", ") + ")").toLowerCase();
            } else {
                vals.push(ColorUtils.toHexValue(+colorValue.r));
                vals.push(ColorUtils.toHexValue(+colorValue.g));
                vals.push(ColorUtils.toHexValue(+colorValue.b));
                return ("#" + vals.join("")).toLowerCase();
            }
        },
        //16进制的2个数字转化为10进制， 如果转化失败， 返回0
        toNumber: function(value) {
            return Number("0x" + value) | 0;
        },
        toHexValue: function(value) {
            var result = value.toString(16);
            return result.length === 1 ? "0" + result : result;
        },
        //溢出控制
        overflowFormat: function(value) {
            var tmpValue = Utils.extend({}, value), keys = "rgba";
            Utils.each(keys.split(""), function(key) {
                if (!tmpValue.hasOwnProperty(key)) {
                    return;
                }
                //上溢出
                tmpValue[key] = Math.min(Color._MAX_VALUE[key], tmpValue[key]);
                //下溢出
                tmpValue[key] = Math.max(Color._MIN_VALUE[key], tmpValue[key]);
            });
            return tmpValue;
        }
    });
    return Color;
});
define("graphic/colorbrush", [ "graphic/color", "core/utils", "graphic/standardcolor", "core/class", "graphic/brush", "core/config" ], function(require, exports, module) {
    var Color = require("graphic/color");
    var Brush = require("graphic/brush");
    var ColorBrush = require("core/class").createClass("ColorBrush", {
        base: Brush,
        constructor: function(color) {
            this.callBase();
            this.setColor(color || new Color());
        },
        getType: function() {
            return "ColorBrush";
        },
        setColor: function(color) {
            this.color = color;
        },
        getColor: function() {
            return this.color;
        },
        fill: function(path) {
            var node = path.node;
            node.setAttribute("fill", this.getColor());
        }
    });
    return ColorBrush;
});
define("graphic/container", [ "core/class", "core/config" ], function(require, exports, module) {
    function itemRemove() {
        this.container.removeItem(this);
        return this;
    }
    return require("core/class").createClass("Container", {
        getItems: function() {
            return this.items || (this.items = []);
        },
        getItem: function(index) {
            return this.getItems()[index];
        },
        getFirstItem: function() {
            return this.getItem(0);
        },
        getLastItem: function() {
            return this.getItem(this.getItems().length - 1);
        },
        indexOf: function(item) {
            return this.getItems().indexOf(item);
        },
        eachItem: function(fn) {
            var items = this.getItems(), length = items.length, i;
            for (i = 0; i < length; i++) {
                fn.call(this, i, items[i]);
            }
            return this;
        },
        addItem: function(item, pos, noEvent) {
            var items = this.getItems(), length = items.length, before, after;
            if (!(pos >= 0 && pos < length)) {
                pos = length;
            }
            if (pos === 0) {
                items.unshift(item);
            } else if (pos == length) {
                items.push(item);
            } else {
                before = items.slice(0, pos);
                before.push(item);
                after = items.slice(pos);
                this.items = before.concat(after);
            }
            if (typeof item === "object") {
                item.container = this;
                item.remove = itemRemove;
            }
            this.handleAdd(item, pos);
            if (!noEvent) {
                this.onContainerChanged("add", [ item ]);
            }
            return this;
        },
        addItems: function(items) {
            for (var i = 0, l = items.length; i < l; i++) {
                this.addItem(items[i], -1, true);
            }
            this.onContainerChanged("add", items);
            return this;
        },
        setItems: function(items) {
            return this.clear().addItems(items);
        },
        appendItem: function(item) {
            return this.addItem(item);
        },
        prependItem: function(item) {
            return this.addItem(item, 0);
        },
        removeItem: function(pos, noEvent) {
            if (typeof pos !== "number") {
                return this.removeItem(this.indexOf(pos));
            }
            var items = this.getItems(), length = items.length, item = items[pos], before, after;
            if (item === undefined) {
                return this;
            }
            if (pos === 0) {
                items.shift();
            } else if (pos == length - 1) {
                items.pop();
            } else {
                before = items.slice(0, pos);
                after = items.slice(pos + 1);
                this.items = before.concat(after);
            }
            if (item.container) {
                delete item.container;
            }
            if (item.remove) {
                delete item.remove;
            }
            this.handleRemove(item, pos);
            if (!noEvent) {
                this.onContainerChanged("remove", [ item ]);
            }
            return this;
        },
        clear: function() {
            var removed = [];
            var item;
            while (item = this.getFirstItem()) {
                removed.push(item);
                this.removeItem(0, true);
            }
            this.onContainerChanged("remove", removed);
            return this;
        },
        onContainerChanged: function(type, items) {},
        handleAdd: function(item, index) {},
        handleRemove: function(item, index) {}
    });
});
/*
 * 曲线
 * */
define("graphic/curve", [ "core/utils", "core/class", "core/config", "graphic/path", "graphic/shape", "graphic/svg", "graphic/pointcontainer", "graphic/container" ], function(require, exports, module) {
    var Utils = require("core/utils"), CurveUtil = {
        /*
         * 获取由两个以上的点组成的曲线的平移线
         * @param points 曲线上的点的集合， 集合中的点的数量必须大于2
         * @return 平移线数组
         */
        getCurvePanLines: function(points, smoothFactor) {
            //计算原始点的中点坐标
            var centerPoints = CurveUtil.getCenterPoints(points), //注意：计算中点连线的中点坐标， 得出平移线
            panLines = CurveUtil.getPanLine(points.length, centerPoints);
            //平移线移动到顶点
            return CurveUtil.getMovedPanLines(points, panLines, smoothFactor);
        },
        /*
         * 计算给定点集合的连线的中点
         * @param points
         */
        getCenterPoints: function(points) {
            var centerPoints = {}, key = null;
            for (var i = 0, j = 0, len = points.length; i < len; i++) {
                //j是下一个点的索引
                j = i === len - 1 ? 0 : i + 1;
                key = i + "," + j;
                //计算中点坐标
                centerPoints[key] = {
                    x: (points[i].getX() + points[j].getX()) / 2,
                    y: (points[i].getY() + points[j].getY()) / 2
                };
            }
            return centerPoints;
        },
        /*
         * 对getCenterPoints()接口获取到的数据做处理， 计算出各个顶点对应的平移线数据
         * @param length 集合中点的个数
         * @param points 点集合， 该集合应该是getCenterPoints()接口返回的数据
         */
        getPanLine: function(length, points) {
            var result = {}, //顶点索引
            pointIndex = null;
            for (var i = 0, j; i < length; i++) {
                var point1 = null, point2 = null;
                //计算当前点
                j = (i + 1) % length;
                //保存当前处理的顶点索引
                pointIndex = j;
                point1 = points[i + "," + j];
                //计算下一个点
                i = j;
                j = (i + 1) % length;
                point2 = points[i + "," + j];
                result[pointIndex] = {
                    points: [ {
                        x: point1.x,
                        y: point1.y
                    }, {
                        x: point2.x,
                        y: point2.y
                    } ],
                    center: {
                        x: (point1.x + point2.x) / 2,
                        y: (point1.y + point2.y) / 2
                    }
                };
                //还原i值
                i = (pointIndex + length - 1) % length;
            }
            return result;
        },
        /*
         * 计算平移线移动到顶点后的位置
         * @param points 顶点集合
         * @param panLines 平移线集合
         */
        getMovedPanLines: function(points, panLines, smoothFactor) {
            var result = {};
            Utils.each(points, function(point, index) {
                //当前平移线
                var currentPanLine = panLines[index], //平移线中点
                center = currentPanLine.center, //移动距离
                distance = {
                    x: center.x - point.getX(),
                    y: center.y - point.getY()
                };
                var currentResult = result[index] = {
                    points: [],
                    center: {
                        x: point.getX(),
                        y: point.getY()
                    }
                };
                //计算控制点到顶点的距离， 并且应用平滑系数到距离上
                Utils.each(currentPanLine.points, function(controlPoint, index) {
                    var moved = {
                        x: controlPoint.x - distance.x,
                        y: controlPoint.y - distance.y
                    };
                    var vertex = currentResult.center;
                    var dx = moved.x - vertex.x;
                    var dy = moved.y - vertex.y;
                    moved.x = vertex.x + smoothFactor * dx;
                    moved.y = vertex.y + smoothFactor * dy;
                    currentResult.points.push(moved);
                });
            });
            return result;
        }
    };
    return require("core/class").createClass("Curve", {
        base: require("graphic/path"),
        mixins: [ require("graphic/pointcontainer") ],
        constructor: function(points, isColse) {
            this.callBase();
            this.setPoints(points || []);
            this.closeState = !!isColse;
            this.changeable = true;
            this.smoothFactor = 1;
            this.update();
        },
        //当点集合发生变化时采取的动作
        onContainerChanged: function() {
            if (this.changeable) {
                this.update();
            }
        },
        setSmoothFactor: function(factor) {
            this.smoothFactor = factor < 0 ? 0 : factor;
            this.update();
            return this;
        },
        getSmoothFactor: function() {
            return this.smoothFactor;
        },
        update: function() {
            var points = this.getPoints(), withControlPoints = null, drawer = this.getDrawer(), curPoint = null, curControlPoint = null, prevControlPoint = null;
            drawer.clear();
            if (points.length === 0) {
                return this;
            } else {
                drawer.moveTo(points[0].getX(), points[0].getY());
            }
            if (points.length === 1) {
                return this;
            }
            if (points.length === 2) {
                drawer.lineTo(points[1].getX(), points[1].getY());
                return this;
            }
            //获取已转换过后的带控制点的所有点
            withControlPoints = CurveUtil.getCurvePanLines(points, this.getSmoothFactor());
            for (var i = 1, len = points.length; i < len; i++) {
                //当前顶点
                curPoint = withControlPoints[i].center;
                //当前控制点
                if (this.closeState || i != len - 1) {
                    curControlPoint = withControlPoints[i].points[0];
                } else {
                    //非闭合状态下最后一个点的处理
                    curControlPoint = withControlPoints[i].center;
                }
                if (this.closeState || i != 1) {
                    prevControlPoint = withControlPoints[i - 1].points[1];
                } else {
                    //非闭合状态下第一个点的处理
                    prevControlPoint = withControlPoints[i - 1].center;
                }
                drawer.bezierTo(prevControlPoint.x, prevControlPoint.y, curControlPoint.x, curControlPoint.y, curPoint.x, curPoint.y);
            }
            //处理闭合
            if (this.closeState) {
                curPoint = withControlPoints[0].center;
                curControlPoint = withControlPoints[0].points[0];
                prevControlPoint = withControlPoints[points.length - 1].points[1];
                drawer.bezierTo(prevControlPoint.x, prevControlPoint.y, curControlPoint.x, curControlPoint.y, curPoint.x, curPoint.y);
            }
            return this;
        },
        close: function() {
            this.closeState = true;
            return this.update();
        },
        open: function() {
            this.closeState = false;
            return this.update();
        },
        isClose: function() {
            return !!this.closeState;
        }
    });
});
define("graphic/data", [ "core/class", "core/config" ], function(require, exports, module) {
    return require("core/class").createClass("Data", {
        constructor: function() {
            this._data = {};
        },
        setData: function(name, value) {
            this._data[name] = value;
            return this;
        },
        getData: function(name) {
            return this._data[name];
        },
        removeData: function(name) {
            delete this._data[name];
            return this;
        }
    });
});
define("graphic/defbrush", [ "graphic/svg", "graphic/brush", "core/class", "core/config" ], function(require, exports, module) {
    var svg = require("graphic/svg");
    var Brush = require("graphic/brush");
    return require("core/class").createClass("GradientBrush", {
        base: Brush,
        constructor: function(nodeType) {
            this.callBase();
            this.node = svg.createNode(nodeType);
        },
        fill: function(path) {
            var pathNode = path.node;
            pathNode.setAttribute("fill", "url(#" + this.node.id + ")");
            return this;
        }
    });
});
define("graphic/ellipse", [ "core/utils", "core/class", "core/config", "graphic/path", "graphic/shape", "graphic/svg" ], function(require, exports, module) {
    var Utils = require("core/utils");
    return require("core/class").createClass("Ellipse", {
        base: require("graphic/path"),
        constructor: function(cx, cy, rx, ry) {
            this.callBase();
            this.cx = cx || 0;
            this.cy = cy || 0;
            this.rx = rx || 0;
            this.ry = ry || 0;
            //防止createClass构造原型链时报错
            if (arguments.length > 0) {
                this.update();
            }
        },
        update: function() {
            var pathData = [ "M " + (this.cx + this.rx) + " " + this.cy, " A " + this.rx + " " + this.ry, " 0 1 1 " + (this.cx - this.rx) + " " + this.cy, " A " + this.rx + " " + this.ry, " 0 1 1 " + (this.cx + this.rx) + " " + this.cy, " Z" ];
            this.setPathData(pathData.join(""));
        },
        getRadius: function() {
            return {
                x: this.rx,
                y: this.ry
            };
        },
        getRadiusX: function() {
            return this.rx;
        },
        getRadiusY: function() {
            return this.ry;
        },
        getCenter: function() {
            return {
                x: this.cx,
                y: this.cy
            };
        },
        getCenterX: function() {
            return this.cx;
        },
        getCenterY: function() {
            return this.cy;
        },
        setRadius: function(rx, ry) {
            this.rx = rx;
            this.ry = ry;
            this.update();
            return this;
        },
        setRadiusX: function(rx) {
            this.rx = rx;
            this.update();
            return this;
        },
        setRadiusY: function(ry) {
            this.ry = ry;
            this.update();
            return this;
        },
        setCenter: function(cx, cy) {
            this.cx = cx;
            this.cy = cy;
            this.update();
            return this;
        },
        setCenterX: function(cx) {
            this.cx = cx;
            this.update();
            return this;
        },
        setCenterY: function(cy) {
            this.cy = cy;
            this.update();
            return this;
        }
    });
});
/*
 * kity event 实现
 */
define("graphic/eventhandler", [ "core/utils", "graphic/shapeevent", "graphic/matrix", "core/class", "core/config" ], function(require, exports, module) {
    var Utils = require("core/utils"), ShapeEvent = require("graphic/shapeevent");
    // 内部处理器缓存
    var INNER_HANDLER_CACHE = {}, // 用户处理器缓存
    USER_HANDLER_CACHE = {}, guid = 0;
    // 添加事件统一入口
    function _addEvent(type, handler, isOnce) {
        isOnce = !!isOnce;
        if (Utils.isString(type)) {
            type = type.match(/\S+/g);
        }
        Utils.each(type, function(currentType) {
            listen.call(this, this.node, currentType, handler, isOnce);
        }, this);
        return this;
    }
    // 移除事件统一入口
    function _removeEvent(type, handler) {
        var userHandlerList = null, eventId = this._EVNET_UID, isRemoveAll = handler === undefined;
        try {
            userHandlerList = USER_HANDLER_CACHE[eventId][type];
        } catch (e) {
            return;
        }
        //移除指定的监听器
        if (!isRemoveAll) {
            isRemoveAll = true;
            Utils.each(userHandlerList, function(fn, index) {
                if (fn === handler) {
                    // 不能结束， 需要查找完整个list， 避免丢失移除多次绑定同一个处理器的情况
                    delete userHandlerList[index];
                } else {
                    isRemoveAll = false;
                }
            });
        }
        //删除所有监听器
        if (isRemoveAll) {
            deleteDomEvent(this.node, type, INNER_HANDLER_CACHE[eventId][type]);
            delete USER_HANDLER_CACHE[eventId][type];
            delete INNER_HANDLER_CACHE[eventId][type];
        }
        return this;
    }
    // 执行绑定, 该方法context为shape或者mixin了eventhandler的对象
    function listen(node, type, handler, isOnce) {
        var eid = this._EVNET_UID, targetObject = this;
        // 初始化内部监听器
        if (!INNER_HANDLER_CACHE[eid]) {
            INNER_HANDLER_CACHE[eid] = {};
        }
        if (!INNER_HANDLER_CACHE[eid][type]) {
            // 内部监听器
            INNER_HANDLER_CACHE[eid][type] = function(e) {
                e = new ShapeEvent(e || window.event);
                Utils.each(USER_HANDLER_CACHE[eid][type], function(fn) {
                    if (fn) {
                        result = fn.call(targetObject, e);
                        //once 绑定， 执行完后删除
                        if (isOnce) {
                            targetObject.off(type, fn);
                        }
                    }
                    // 如果用户handler里return了false， 则该节点上的此后的同类型事件将不再执行
                    return result;
                }, targetObject);
            };
        }
        // 初始化用户监听器列表
        if (!USER_HANDLER_CACHE[eid]) {
            USER_HANDLER_CACHE[eid] = {};
        }
        if (!USER_HANDLER_CACHE[eid][type]) {
            USER_HANDLER_CACHE[eid][type] = [ handler ];
            // 绑定对应类型的事件
            // dom对象利用dom event进行处理， 非dom对象， 由消息分发机制处理
            if (!!node) {
                bindDomEvent(node, type, INNER_HANDLER_CACHE[eid][type]);
            }
        } else {
            USER_HANDLER_CACHE[eid][type].push(handler);
        }
    }
    // 绑定dom事件
    function bindDomEvent(node, type, handler) {
        if (node.addEventListener) {
            node.addEventListener(type, handler, false);
        } else {
            node.attachEvent("on" + type, handler);
        }
    }
    // 删除dom事件
    function deleteDomEvent(node, type, handler) {
        if (node.removeEventListener) {
            node.removeEventListener(type, handler, false);
        } else {
            node.detachEvent(type, handler);
        }
    }
    // 触发dom事件
    function triggerDomEvent(node, type, params) {
        var event = new CustomEvent(type, {
            bubbles: true,
            cancelable: true
        });
        event.__kity_param = params;
        node.dispatchEvent(event);
    }
    // 发送消息
    function sendMessage(messageObj, type, msg) {
        var event = null, handler = null;
        try {
            handler = INNER_HANDLER_CACHE[messageObj._EVNET_UID][type];
            if (!handler) {
                return;
            }
        } catch (exception) {
            return;
        }
        event = Utils.extend({
            type: type,
            target: messageObj
        }, msg || {});
        handler.call(messageObj, event);
    }
    // 对外接口
    return require("core/class").createClass("EventHandler", {
        constructor: function() {
            this._EVNET_UID = ++guid;
        },
        addEventListener: function(type, handler) {
            return _addEvent.call(this, type, handler, false);
        },
        addOnceEventListener: function(type, handler) {
            return _addEvent.call(this, type, handler, true);
        },
        removeEventListener: function(type, handler) {
            return _removeEvent.call(this, type, handler);
        },
        on: function(type, handler) {
            return this.addEventListener.apply(this, arguments);
        },
        once: function(type, handler) {
            return this.addOnceEventListener.apply(this, arguments);
        },
        off: function() {
            return this.removeEventListener.apply(this, arguments);
        },
        fire: function(type, params) {
            return this.trigger.apply(this, arguments);
        },
        trigger: function(type, params) {
            if (this.node) {
                triggerDomEvent(this.node, type, params);
            } else {
                sendMessage(this, type, params);
            }
            return this;
        }
    });
});
define("graphic/gradientbrush", [ "graphic/svg", "graphic/defbrush", "graphic/brush", "core/class", "graphic/color", "core/utils", "graphic/standardcolor", "core/config" ], function(require, exports, module) {
    var svg = require("graphic/svg");
    var DefBrush = require("graphic/defbrush");
    var Color = require("graphic/color");
    return require("core/class").createClass("GradientBrush", {
        base: DefBrush,
        constructor: function(gradientNodeType) {
            this.callBase(gradientNodeType);
            this.stops = [];
        },
        addStop: function(offset, color, opacity) {
            var gstop = svg.createNode("stop");
            if (!(color instanceof Color)) {
                color = Color.parse(color);
            }
            if (opacity === undefined) {
                opacity = color.get("a");
            }
            gstop.setAttribute("offset", offset);
            gstop.setAttribute("stop-color", color.toRGB());
            if (opacity < 1) {
                gstop.setAttribute("stop-opacity", opacity);
            }
            this.node.appendChild(gstop);
            return this;
        }
    });
});
define("graphic/group", [ "graphic/shapecontainer", "graphic/container", "core/class", "graphic/shape", "core/config", "graphic/svg", "core/utils", "graphic/eventhandler", "graphic/styled", "graphic/data", "graphic/matrix", "graphic/pen", "graphic/brush" ], function(require, exports, module) {
    var ShapeContainer = require("graphic/shapecontainer");
    return require("core/class").createClass("Group", {
        mixins: [ ShapeContainer ],
        base: require("graphic/shape"),
        constructor: function() {
            this.callBase("g");
        }
    });
});
define("graphic/image", [ "core/class", "core/config", "graphic/shape", "graphic/svg", "core/utils", "graphic/eventhandler", "graphic/styled", "graphic/data", "graphic/matrix", "graphic/pen", "graphic/brush" ], function(require, exports, module) {
    return require("core/class").createClass("Image", {
        base: require("graphic/shape"),
        constructor: function(url, width, height, x, y) {
            this.callBase("image");
            this.url = url;
            this.width = width || 0;
            this.height = height || 0;
            this.x = x || 0;
            this.y = y || 0;
            this.update();
        },
        update: function() {
            this.node.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", this.url);
            this.node.setAttribute("x", this.x);
            this.node.setAttribute("y", this.y);
            this.node.setAttribute("width", this.width);
            this.node.setAttribute("height", this.height);
            return this;
        },
        setUrl: function(url) {
            this.url = url === "" ? null : url;
            return this.update();
        },
        getUrl: function() {
            return this.url;
        },
        setWidth: function(width) {
            this.width = width;
            return this.update();
        },
        getWidth: function() {
            return this.width;
        },
        setHeight: function(height) {
            this.height = height;
            return this.update();
        },
        getHeight: function() {
            return this.height;
        },
        setX: function(x) {
            this.x = x;
            return this.update();
        },
        getX: function() {
            return this.x;
        },
        setY: function(y) {
            this.y = y;
            return this.update();
        },
        getY: function() {
            return this.y;
        }
    });
});
define("graphic/line", [ "core/class", "core/config", "graphic/path", "core/utils", "graphic/shape", "graphic/svg" ], function(require, exports, module) {
    return require("core/class").createClass("Line", {
        base: require("graphic/path"),
        constructor: function(x1, y1, x2, y2) {
            this.callBase();
            this.point1 = {
                x: x1,
                y: y1
            };
            this.point2 = {
                x: x2,
                y: y2
            };
            this.update();
        },
        setPoint1: function(x, y) {
            this.point1.x = x;
            this.point1.y = y;
            return this.update();
        },
        setPoint2: function(x, y) {
            this.point2.x = x;
            this.point2.y = y;
            return this.update();
        },
        getPoint1: function() {
            return {
                x: this.point1.x,
                y: this.point1.y
            };
        },
        getPoint2: function() {
            return {
                x: this.point2.x,
                y: this.point2.y
            };
        },
        update: function() {
            var drawer = this.getDrawer();
            drawer.clear();
            drawer.moveTo(this.point1.x, this.point1.y);
            drawer.lineTo(this.point2.x, this.point2.y);
            return this;
        }
    });
});
define("graphic/lineargradientbrush", [ "graphic/svg", "graphic/gradientbrush", "graphic/defbrush", "graphic/color", "core/class", "core/config" ], function(require, exports, module) {
    var className = "LinearGradientBrush";
    var svg = require("graphic/svg");
    var GradientBrush = require("graphic/gradientbrush");
    return require("core/class").createClass(className, {
        base: GradientBrush,
        constructor: function(builder) {
            this.callBase("linearGradient");
            this.setStartPosition(0, 0);
            this.setEndPosition(1, 0);
            if (typeof builder == "function") {
                builder.call(this, this);
            }
        },
        setStartPosition: function(px, py) {
            this.node.setAttribute("x1", px);
            this.node.setAttribute("y1", py);
            return this;
        },
        setEndPosition: function(px, py) {
            this.node.setAttribute("x2", px);
            this.node.setAttribute("y2", py);
            return this;
        },
        getStartPosition: function() {
            return {
                x: +this.node.getAttribute("x1"),
                y: +this.node.getAttribute("y1")
            };
        },
        getEndPosition: function() {
            return {
                x: +this.node.getAttribute("x2"),
                y: +this.node.getAttribute("y2")
            };
        }
    });
});
/**
 * 蒙板
 */
define("graphic/mask", [ "core/class", "core/config", "graphic/shape", "graphic/svg", "core/utils", "graphic/eventhandler", "graphic/styled", "graphic/data", "graphic/matrix", "graphic/pen", "graphic/brush", "graphic/shapecontainer", "graphic/container" ], function(require, exports, module) {
    var Class = require("core/class");
    var Shape = require("graphic/shape");
    var Mask = Class.createClass("Mask", {
        base: Shape,
        mixins: [ require("graphic/shapecontainer") ],
        constructor: function() {
            this.callBase("mask");
        },
        mask: function(shape) {
            shape.getNode().setAttribute("mask", "url(#" + this.getId() + ")");
            return this;
        }
    });
    Class.extendClass(Shape, {
        maskWith: function(mask) {
            mask.mask(this);
            return this;
        }
    });
    return Mask;
});
define("graphic/matrix", [ "core/utils", "core/class", "core/config" ], function(require, exports, module) {
    var utils = require("core/utils");
    var mPattern = /matrix\((.+)\)/i;
    // 注意，合并的结果是先执行m2，再执行m1的结果
    function mergeMatrixData(m2, m1) {
        return {
            a: m1.a * m2.a + m1.c * m2.b,
            b: m1.b * m2.a + m1.d * m2.b,
            c: m1.a * m2.c + m1.c * m2.d,
            d: m1.b * m2.c + m1.d * m2.d,
            e: m1.a * m2.e + m1.c * m2.f + m1.e,
            f: m1.b * m2.e + m1.d * m2.f + m1.f
        };
    }
    function d2r(deg) {
        return deg * Math.PI / 180;
    }
    var Matrix = require("core/class").createClass("Matrix", {
        constructor: function() {
            if (arguments.length) {
                this.setMatrix.apply(this, arguments);
            } else {
                this.setMatrix(1, 0, 0, 1, 0, 0);
            }
        },
        translate: function(x, y) {
            this.m = mergeMatrixData(this.m, {
                a: 1,
                c: 0,
                e: x,
                b: 0,
                d: 1,
                f: y
            });
            return this;
        },
        rotate: function(deg) {
            var rad = d2r(deg);
            var sin = Math.sin(rad), cos = Math.cos(rad);
            this.m = mergeMatrixData(this.m, {
                a: cos,
                c: -sin,
                e: 0,
                b: sin,
                d: cos,
                f: 0
            });
            return this;
        },
        scale: function(sx, sy) {
            if (sy === undefined) {
                sy = sx;
            }
            this.m = mergeMatrixData(this.m, {
                a: sx,
                c: 0,
                e: 0,
                b: 0,
                d: sy,
                f: 0
            });
            return this;
        },
        skew: function(degX, degY) {
            if (degY === undefined) {
                degY = degX;
            }
            var tx = Math.tan(d2r(degX)), ty = Math.tan(d2r(degY));
            this.m = mergeMatrixData(this.m, {
                a: 1,
                c: tx,
                e: 0,
                b: ty,
                d: 1,
                f: 0
            });
            return this;
        },
        setMatrix: function(a, b, c, d, e, f) {
            if (arguments.length === 1) {
                this.m = utils.clone(arguments[0]);
            } else {
                this.m = {
                    a: a,
                    b: b,
                    c: c,
                    d: d,
                    e: e,
                    f: f
                };
            }
            return this;
        },
        getMatrix: function() {
            return utils.clone(this.m);
        },
        mergeMatrix: function(matrix) {
            return new Matrix(mergeMatrixData(this.m, matrix.m));
        },
        toString: function() {
            var m = this.m;
            return "matrix(" + [ m.a, m.b, m.c, m.d, m.e, m.f ].join(", ") + ")";
        }
    });
    Matrix.parse = function(str) {
        var match;
        var f = parseFloat;
        if (match = mPattern.exec(str)) {
            var values = match[1].split(",");
            return new Matrix({
                a: f(values[0]),
                b: f(values[1]),
                c: f(values[2]),
                d: f(values[3]),
                e: f(values[4]),
                f: f(values[5])
            });
        }
        return new Matrix();
    };
    Matrix.transformPoint = function(x, y, m) {
        return {
            x: m.a * x + m.c * y + m.e,
            y: m.b * x + m.d * y + m.f
        };
    };
    return Matrix;
});
/**
 * 调色板
 */
define("graphic/palette", [ "graphic/standardcolor", "graphic/color", "core/utils", "core/class", "core/config" ], function(require, exports, module) {
    //标准color
    var StandardColor = require("graphic/standardcolor"), Color = require("graphic/color"), Utils = require("core/utils");
    var Palette = require("core/class").createClass("Palette", {
        constructor: function() {
            this.color = {};
        },
        /*
         * 获取颜色名称所对应的颜色值的Color对象
         * @param name 需要获取的颜色名称
         * @return 对应颜色名称的color对象， 如果未找到对应的名称， 则返回null
         */
        get: function(name) {
            var colorValue = this.color[name] || StandardColor.EXTEND_STANDARD[name] || StandardColor.COLOR_STANDARD[name] || "";
            if (colorValue) {
                return new Color(colorValue);
            }
            return null;
        },
        /*
         * 获取给定名称的颜色的hex值表示
         * @param name 需要获取的颜色名称
         * @return 如果找到对应的名称， 则返回该名称所对应的hex格式的值， 否则， 返回一个空字符串
         */
        getColorValue: function(name) {
            return this.color[name] || StandardColor.EXTEND_STANDARD[name] || StandardColor.COLOR_STANDARD[name] || "";
        },
        /*
         * 向调色板实例添加自己独有的颜色名称，对已存在的颜色名称， 将会覆盖掉
         * @param name 新添加的颜色名称
         * @param value 新添加的颜色名称所对应的值， 可以是一个合法的颜色字符串或者是一个color对象
         * @return 新添加的颜色的值
         */
        add: function(name, value) {
            if (typeof value === "string") {
                this.color[name] = new Color(value).toRGBA();
            } else {
                this.color[name] = value.toRGBA();
            }
            return value;
        },
        /*
         * 删除调色板实例上用户自己添加的颜色， 该方法不能删除内置的颜色
         * @param name 需要删除的颜色名称
         * @return 删除是否成功的bool值
         */
        remove: function(name) {
            if (this.color.hasOwnProperty(name)) {
                delete this.color[name];
                return true;
            }
            return false;
        }
    });
    Utils.extend(Palette, {
        getColor: function(name) {
            var colorValue = StandardColor.EXTEND_STANDARD[name] || StandardColor.COLOR_STANDARD[name];
            if (colorValue) {
                return new Color(colorValue);
            }
            return null;
        },
        /*
         * 通过给定的名字获取标准的颜色值表示， 返回的值以hex的方式提供
         * @param name 需要获取的标准颜色名称
         * @return 名字所对应的颜色值的hex表示， 如果未找到对应名称的值， 则返回一个空字符串
         */
        getColorValue: function(name) {
            return StandardColor.EXTEND_STANDARD[name] || StandardColor.COLOR_STANDARD[name] || "";
        },
        /*
         * 向调色板添加颜色名称，新添加的颜色对所有的调色板对象都可见
         * 对已存在的颜色名称， 将会覆盖掉
         * @param name 新添加的颜色名称
         * @param value 新添加的颜色名称所对于的值， 应该是一个hex格式的颜色字符串， 如： ”#ff0000“
         * @return 新添加的颜色的值
         */
        addColor: function(name, value) {
            if (typeof value === "string") {
                StandardColor.EXTEND_STANDARD[name] = new Color(value).toRGBA();
            } else {
                StandardColor.EXTEND_STANDARD[name] = value.toRGBA();
            }
            return value;
        },
        /*
         * 删除用户自己添加的颜色， 该方法不能删除内置的颜色， 该方法不会影响调色板实例自由的颜色
         * @param name 需要删除的颜色名称
         * @return 删除是否成功的bool值
         */
        removeColor: function(name) {
            if (StandardColor.EXTEND_STANDARD.hasOwnProperty(name)) {
                delete StandardColor.EXTEND_STANDARD[name];
                return true;
            }
            return false;
        }
    });
    return Palette;
});
define("graphic/paper", [ "core/class", "core/config", "core/utils", "graphic/svg", "graphic/container", "graphic/shapecontainer", "graphic/shape", "graphic/eventhandler", "graphic/shapeevent", "graphic/styled", "graphic/matrix", "graphic/data", "graphic/pen", "graphic/brush" ], function(require, exports, module) {
    var Class = require("core/class");
    var utils = require("core/utils");
    var svg = require("graphic/svg");
    var Container = require("graphic/container");
    var ShapeContainer = require("graphic/shapecontainer");
    var EventHandler = require("graphic/eventhandler");
    var Styled = require("graphic/styled");
    var Matrix = require("graphic/matrix");
    var Paper = Class.createClass("Paper", {
        mixins: [ ShapeContainer, EventHandler, Styled ],
        constructor: function(container) {
            this.callBase();
            if (utils.isString(container)) {
                container = document.getElementById(container);
            }
            this.container = container;
            this.node = this.createSVGNode();
            this.node.paper = this;
            container.appendChild(this.node);
            this.node.appendChild(this.resourceNode = svg.createNode("defs"));
            this.node.appendChild(this.shapeNode = svg.createNode("g"));
            this.resources = new Container();
            this.setWidth("100%").setHeight("100%");
            this.callMixin();
        },
        createSVGNode: function() {
            var node = svg.createNode("svg");
            node.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            node.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
            return node;
        },
        getNode: function() {
            return this.node;
        },
        getContainer: function() {
            return this.container;
        },
        getWidth: function() {
            return +this.node.getAttribute("width");
        },
        setWidth: function(width) {
            this.node.setAttribute("width", width);
            return this;
        },
        getHeight: function() {
            return +this.node.getAttribute("height");
        },
        setHeight: function(height) {
            this.node.setAttribute("height", height);
            return this;
        },
        getViewBox: function() {
            var attr = this.node.getAttribute("viewBox");
            if (attr === null) {
                return {
                    x: 0,
                    y: 0,
                    width: this.node.clientWidth,
                    height: this.node.clientHeight
                };
            } else {
                attr = attr.split(" ");
                return {
                    x: +attr[0],
                    y: +attr[1],
                    width: +attr[2],
                    height: +attr[3]
                };
            }
        },
        setViewBox: function(x, y, width, height) {
            this.node.setAttribute("viewBox", [ x, y, width, height ].join(" "));
            return this;
        },
        setViewPort: function(cx, cy, zoom) {
            var viewport, box;
            if (arguments.length == 1) {
                viewport = arguments[0];
                cx = viewport.center.x;
                cy = viewport.center.y;
                zoom = viewport.zoom;
            }
            zoom = zoom || 1;
            box = this.getViewBox();
            viewport = this.viewport = {
                center: {
                    x: cx,
                    y: cy
                },
                zoom: zoom
            };
            var matrix = new Matrix();
            var dx = box.x + box.width / 2 - cx, dy = box.y + box.height / 2 - cy;
            matrix.translate(-cx, -cy);
            matrix.scale(zoom);
            matrix.translate(cx, cy);
            matrix.translate(dx, dy);
            this.shapeNode.setAttribute("transform", matrix);
            return this;
        },
        getViewPort: function() {
            if (!this.viewport) {
                var box = this.getViewBox();
                this.viewport = {
                    zoom: 1,
                    center: {
                        x: box.x + box.width / 2,
                        y: box.y + box.height / 2
                    }
                };
            }
            return this.viewport;
        },
        addResource: function(resource) {
            this.resources.appendItem(resource);
            if (resource.node) {
                this.resourceNode.appendChild(resource.node);
            }
            return this;
        },
        removeResource: function(resource) {
            if (resource.remove) {
                resource.remove();
            }
            if (resource.node) {
                this.resourceNode.removeChild(resource.node);
            }
            return this;
        },
        getPaper: function() {
            return this;
        }
    });
    var Shape = require("graphic/shape");
    Class.extendClass(Shape, {
        getPaper: function() {
            var parent = this.container;
            while (parent && parent instanceof Paper === false) {
                parent = parent.container;
            }
            return parent;
        }
    });
    return Paper;
});
define("graphic/path", [ "core/utils", "core/class", "core/config", "graphic/shape", "graphic/svg", "graphic/eventhandler", "graphic/styled", "graphic/data", "graphic/matrix", "graphic/pen", "graphic/brush" ], function(require, exports, module) {
    var Utils = require("core/utils");
    var createClass = require("core/class").createClass;
    var Shape = require("graphic/shape");
    var svg = require("graphic/svg");
    var config = require("core/config");
    var PathDrawer = createClass("PathDrawer", {
        constructor: function(path) {
            this.path = path;
            this.__clear = false;
        },
        appendData: function(data) {
            var originData = this.path.getPathData();
            if (this.__clear) {
                originData = "";
                this.__clear = false;
            }
            if (originData) {
                this.path.setPathData(originData + " " + data.join(" "));
            } else {
                this.path.setPathData(data.join(" "));
            }
            return this;
        },
        moveTo: function(x, y) {
            return this.appendData([ "M", x, y ]);
        },
        moveBy: function(dx, dy) {
            return this.appendData([ "m", dx, dy ]);
        },
        lineTo: function(x, y) {
            return this.appendData([ "L", x, y ]);
        },
        lineBy: function(dx, dy) {
            return this.appendData([ "l", dx, dy ]);
        },
        arcTo: function(rx, ry, xr, laf, sf, x, y) {
            return this.appendData([ "A", rx, ry, xr, laf, sf, x, y ]);
        },
        arcBy: function(rx, ry, xr, laf, sf, dx, dy) {
            return this.appendData([ "a", rx, ry, xr, laf, sf, dx, dy ]);
        },
        carcTo: function(r, x, y, laf, sf) {
            return this.arcTo(r, r, 0, laf || 0, sf || 0, x, y);
        },
        carcBy: function(r, dx, dy, laf, sf) {
            return this.arcBy(r, r, 0, laf || 0, sf || 0, dx, dy);
        },
        bezierTo: function(x1, y1, x2, y2, x, y) {
            return this.appendData([ "C", x1, y1, x2, y2, x, y ]);
        },
        bezierBy: function(dx1, dy1, dx2, dy2, dx, dy) {
            return this.appendData([ "c", dx1, dy1, dx2, dy2, dx, dy ]);
        },
        close: function() {
            return this.appendData([ "z" ]);
        },
        clear: function() {
            this.__clear = true;
            this.path.setPathData("M 0 0");
            return this;
        }
    });
    return createClass("Path", {
        base: Shape,
        constructor: function(data) {
            this.callBase("path");
            if (data) {
                this.setPathData(data);
            }
            this.node.setAttribute("fill", svg.defaults.fill);
            this.node.setAttribute("stroke", svg.defaults.stroke);
        },
        setPathData: function(data) {
            if (!data) {
                return;
            }
            this.pathdata = data;
            var path = this;
            if (config.debug) {
                path.node.setAttribute("d", data);
                this.trigger("shapeupdate", {
                    type: "pathdata"
                });
            } else {
                // lazy dump data attribute
                clearTimeout(this.lazyDumpId);
                this.lazyDumpId = setTimeout(function() {
                    path.node.setAttribute("d", data);
                    this.trigger("shapeupdate", {
                        type: "pathdata"
                    });
                });
            }
            return this;
        },
        getPathData: function() {
            return this.pathdata || "";
        },
        getDrawer: function() {
            return new PathDrawer(this);
        },
        isClosed: function() {
            var data = this.getPathData();
            return !!~data.indexOf("z") || !!~data.indexOf("Z");
        }
    });
});
define("graphic/patternbrush", [ "graphic/defbrush", "graphic/svg", "graphic/brush", "core/class", "graphic/shapecontainer", "graphic/container", "graphic/shape", "core/config" ], function(require, exports, module) {
    var DefBrush = require("graphic/defbrush");
    var ShapeContainer = require("graphic/shapecontainer");
    var svg = require("graphic/svg");
    return require("core/class").createClass("PatternBrush", {
        base: DefBrush,
        mixins: [ ShapeContainer ],
        constructor: function() {
            this.callBase("pattern");
            this.node.setAttribute("patternUnits", "userSpaceOnUse");
        },
        setX: function(x) {
            this.x = x;
            this.node.setAttribute("x", x);
            return this;
        },
        setY: function(y) {
            this.y = y;
            this.node.setAttribute("y", y);
            return this;
        },
        setWidth: function(width) {
            this.width = width;
            this.node.setAttribute("width", width);
            return this;
        },
        setHeight: function(height) {
            this.height = height;
            this.node.setAttribute("height", height);
            return this;
        },
        getWidth: function() {
            return this.width;
        },
        getHeight: function() {
            return this.height;
        }
    });
});
define("graphic/pen", [ "graphic/color", "core/utils", "graphic/standardcolor", "core/class", "core/config" ], function(require, exports, module) {
    var Color = require("graphic/color");
    return require("core/class").createClass("Pen", {
        constructor: function(color, width) {
            this.color = color instanceof Color ? color : new Color(color);
            this.width = width || 1;
            this.linecap = null;
            this.linejoin = null;
            this.dashArray = null;
            this.opacity = this.color.get("a");
        },
        getColor: function() {
            return this.color;
        },
        setColor: function(color) {
            if (typeof color == "string") {
                color = new Color(color);
            }
            this.color = color;
            this.opacity = this.color.get("a");
            return this;
        },
        getWidth: function() {
            return this.width;
        },
        setWidth: function(width) {
            this.width = width;
            return this;
        },
        getOpacity: function() {
            return this.opacity;
        },
        setOpacity: function(opacity) {
            this.opacity = opacity;
        },
        getLineCap: function() {
            return this.linecap;
        },
        setLineCap: function(linecap) {
            this.linecap = linecap;
            return this;
        },
        getLineJoin: function() {
            return this.linejoin;
        },
        setLineJoin: function(linejoin) {
            this.linejoin = linejoin;
            return this;
        },
        getDashArray: function() {
            return this.dashArray;
        },
        setDashArray: function(dashArray) {
            this.dashArray = dashArray;
            return this;
        },
        stroke: function(shape) {
            var node = shape.node;
            node.setAttribute("stroke", this.getColor());
            node.setAttribute("stroke-width", this.getWidth());
            if (this.getOpacity() < 1) {
                node.setAttribute("stroke-opacity", this.getOpacity());
            }
            if (this.getLineCap()) {
                node.setAttribute("stroke-linecap", this.getLineCap());
            }
            if (this.getLineJoin()) {
                node.setAttribute("stroke-linejoin", this.getLineJoin());
            }
            if (this.getDashArray()) {
                node.setAttribute("stroke-dasharray", this.getDashArray());
            }
        }
    });
});
/*
 * 点对象抽象
 */
define("graphic/point", [ "core/class", "core/config" ], function(require, exports, module) {
    return require("core/class").createClass("Point", {
        constructor: function(x, y) {
            this.px = x || 0;
            this.py = y || 0;
        },
        setPoint: function(x, y) {
            this.px = x;
            this.py = y;
            return this;
        },
        getPoint: function() {
            return {
                x: this.px,
                y: this.py
            };
        },
        setX: function(x) {
            this.px = x;
            return this;
        },
        getX: function() {
            return this.px;
        },
        setY: function(y) {
            this.py = y;
            return this;
        },
        getY: function() {
            return this.py;
        }
    });
});
/**
 * 点集合容器
 */
define("graphic/pointcontainer", [ "core/class", "core/config", "graphic/container" ], function(require, exports, module) {
    return require("core/class").createClass("PointContainer", {
        base: require("graphic/container"),
        constructor: function() {
            this.callBase();
        },
        addPoint: function(point, pos) {
            return this.addItem.apply(this, arguments);
        },
        prependPoint: function() {
            return this.prependItem.apply(this, arguments);
        },
        appendPoint: function() {
            return this.appendItem.apply(this, arguments);
        },
        removePoint: function(pos) {
            return this.removeItem.apply(this, arguments);
        },
        addPoints: function() {
            return this.addItems.apply(this, arguments);
        },
        setPoints: function() {
            return this.setItems.apply(this, arguments);
        },
        getPoint: function() {
            return this.getItem.apply(this, arguments);
        },
        getPoints: function() {
            return this.getItems.apply(this, arguments);
        },
        getFirstPoint: function() {
            return this.getFirstItem.apply(this, arguments);
        },
        getLastPoint: function() {
            return this.getLastItem.apply(this, arguments);
        }
    });
});
/*
 * 通过点来决定图形的公共父类
 */
define("graphic/poly", [ "core/utils", "core/class", "core/config", "graphic/path", "graphic/shape", "graphic/svg", "graphic/pointcontainer", "graphic/container" ], function(require, exports, module) {
    var Utils = require("core/utils");
    return require("core/class").createClass("Poly", {
        base: require("graphic/path"),
        mixins: [ require("graphic/pointcontainer") ],
        constructor: function(points, closeable) {
            this.callBase();
            //是否可闭合
            this.closeable = !!closeable;
            this.setPoints(points || []);
            this.changeable = true;
            this.update();
        },
        //当点集合发生变化时采取的动作
        onContainerChanged: function() {
            if (this.changeable) {
                this.update();
            }
        },
        update: function() {
            var drawer = this.getDrawer(), points = this.getPoints();
            drawer.clear();
            if (!points.length) {
                return this;
            }
            drawer.moveTo(points[0].getX(), points[0].getY());
            for (var i = 1, point, len = points.length; i < len; i++) {
                point = points[i];
                drawer.lineTo(point.getX(), point.getY());
            }
            if (this.closeable && points.length > 2) {
                drawer.close();
            }
            return this;
        }
    });
});
define("graphic/polygon", [ "core/class", "core/config", "graphic/poly", "core/utils", "graphic/path", "graphic/pointcontainer" ], function(require, exports, module) {
    return require("core/class").createClass("Polygon", {
        base: require("graphic/poly"),
        constructor: function(points) {
            this.callBase(points, true);
        }
    });
});
define("graphic/polyline", [ "core/class", "core/config", "graphic/poly", "core/utils", "graphic/path", "graphic/pointcontainer" ], function(require, exports, module) {
    return require("core/class").createClass("Polyline", {
        base: require("graphic/poly"),
        constructor: function(points) {
            this.callBase(points);
        }
    });
});
define("graphic/radialgradientbrush", [ "graphic/gradientbrush", "graphic/svg", "graphic/defbrush", "graphic/color", "core/class", "core/config" ], function(require, exports, module) {
    var GradientBrush = require("graphic/gradientbrush");
    return require("core/class").createClass("RadialGradientBrush", {
        base: GradientBrush,
        constructor: function(builder) {
            this.callBase("radialGradient");
            this.setCenter(.5, .5);
            this.setFocal(.5, .5);
            this.setRadius(.5);
            if (typeof builder == "function") {
                builder.call(this, this);
            }
        },
        setCenter: function(cx, cy) {
            this.node.setAttribute("cx", cx);
            this.node.setAttribute("cy", cy);
            return this;
        },
        getCenter: function() {
            return {
                x: +this.node.getAttribute("cx"),
                y: +this.node.getAttribute("cy")
            };
        },
        setFocal: function(fx, fy) {
            this.node.setAttribute("fx", fx);
            this.node.setAttribute("fy", fy);
            return this;
        },
        getFocal: function() {
            return {
                x: +this.node.getAttribute("fx"),
                y: +this.node.getAttribute("fy")
            };
        },
        setRadius: function(r) {
            this.node.setAttribute("r", r);
            return this;
        },
        getRadius: function() {
            return +this.node.getAttribute("r");
        }
    });
});
define("graphic/rect", [ "core/utils", "core/class", "core/config", "graphic/path", "graphic/shape", "graphic/svg" ], function(require, exports, module) {
    var RectUtils = {}, Utils = require("core/utils");
    Utils.extend(RectUtils, {
        //根据传递进来的width、height和radius属性，
        //获取最适合的radius值
        formatRadius: function(width, height, radius) {
            var minValue = Math.min(width / 2, height / 2);
            return Math.min(minValue, radius);
        },
        getPathData: function(x, y, width, height, radius) {
            var pathData = null;
            //直角
            if (radius === 0) {
                pathData = [ "M " + x + "," + y, " h " + width, " v " + height, " h " + -width, " Z" ];
            } else {
                width -= 2 * radius;
                height -= 2 * radius;
                pathData = [ "M " + (x + radius) + "," + y, " h " + width, " a " + radius + " " + radius + " 0 0 1 " + radius + " " + radius, " v " + height, " a " + radius + " " + radius + " 0 0 1 " + -radius + " " + radius, " h " + -width, " a " + radius + " " + radius + " 0 0 1 " + -radius + " " + -radius, " v " + -height, " a " + radius + " " + radius + " 0 0 1 " + radius + " " + -radius, " Z" ];
            }
            return pathData.join("");
        }
    });
    return require("core/class").createClass("Rect", {
        base: require("graphic/path"),
        constructor: function(x, y, width, height, radius) {
            this.callBase();
            this.x = x || 0;
            this.y = y || 0;
            this.width = width || 0;
            this.height = height || 0;
            this.radius = RectUtils.formatRadius(width, height, radius || 0);
            this.update();
        },
        update: function() {
            var pathData = RectUtils.getPathData(this.x, this.y, this.width, this.height, this.radius);
            this.setPathData(pathData);
            return this;
        },
        setWidth: function(width) {
            this.width = width;
            return this.update();
        },
        setHeight: function(height) {
            this.height = height;
            return this.update();
        },
        setSize: function(width, height) {
            this.width = width;
            this.height = height;
            return this.update();
        },
        getRadius: function() {
            return this.radius;
        },
        setRadius: function(radius) {
            this.radius = radius;
            return this.update();
        },
        getPosition: function() {
            return {
                x: this.x,
                y: this.y
            };
        },
        setPosition: function(x, y) {
            this.x = x;
            this.y = y;
            return this.update();
        },
        getWidth: function() {
            return this.width;
        },
        getHeight: function() {
            return this.height;
        },
        getPositionX: function() {
            return this.x;
        },
        getPositionY: function() {
            return this.y;
        },
        setPositionX: function(x) {
            this.x = x;
            return this.update();
        },
        setPositionY: function(y) {
            this.y = y;
            return this.update();
        }
    });
});
define("graphic/shape", [ "graphic/svg", "core/utils", "graphic/eventhandler", "graphic/shapeevent", "core/class", "graphic/styled", "graphic/data", "graphic/matrix", "graphic/pen", "graphic/color", "graphic/brush", "core/config" ], function(require, exports, module) {
    var svg = require("graphic/svg");
    var utils = require("core/utils");
    var EventHandler = require("graphic/eventhandler");
    var Styled = require("graphic/styled");
    var Data = require("graphic/data");
    var Matrix = require("graphic/matrix");
    var Pen = require("graphic/pen");
    var Brush = require("graphic/brush");
    return require("core/class").createClass("Shape", {
        mixins: [ EventHandler, Styled, Data ],
        constructor: function(tagName) {
            this.node = svg.createNode(tagName);
            this.node.shape = this;
            this.callMixin();
        },
        getId: function() {
            return this.node.id;
        },
        setId: function(id) {
            this.node.id = id;
            return this;
        },
        getNode: function() {
            return this.node;
        },
        getBoundaryBox: function() {
            var box = this.node.getBBox();
            return box;
        },
        getRenderBox: function() {
            var b = this.getBoundaryBox();
            var xMin = Number.MAX_VALUE, xMax = -Number.MAX_VALUE, yMin = Number.MAX_VALUE, yMax = -Number.MAX_VALUE;
            var bps = [ [ b.x, b.y ], [ b.x + b.width, b.y ], [ b.x, b.y + b.height ], [ b.x + b.width, b.y + b.height ] ];
            var matrix = this.getTransform().getMatrix();
            var bp, rp, rps = [];
            while (bp = bps.pop()) {
                rp = Matrix.transformPoint(bp[0], bp[1], matrix);
                rps.push(rp);
                xMin = Math.min(xMin, rp.x);
                xMax = Math.max(xMax, rp.x);
                yMin = Math.min(yMin, rp.y);
                yMax = Math.max(yMax, rp.y);
            }
            return {
                x: xMin,
                y: yMin,
                width: xMax - xMin,
                height: yMax - yMin,
                closurePoints: rps
            };
        },
        getWidth: function() {
            return this.getRenderBox().width;
        },
        getHeight: function() {
            return this.getRenderBox().height;
        },
        getSize: function() {
            var box = this.getRenderBox();
            delete box.x;
            delete box.y;
            return box;
        },
        setOpacity: function(value) {
            this.node.setAttribute("opacity", value);
        },
        getOpacity: function() {
            return +this.node.getAttribute("opacity") || 1;
        },
        getTransform: function() {
            return Matrix.parse(this.node.getAttribute("transform"));
        },
        setTransform: function(matrix) {
            this.node.setAttribute("transform", matrix);
            this.trigger("shapeupdate", {
                type: "transform"
            });
            return this;
        },
        resetTransform: function() {
            this.node.removeAttribute("transform");
            this.trigger("shapeupdate", {
                type: "transform"
            });
            return this;
        },
        mergeTransform: function(matrix) {
            return this.setTransform(this.getTransform().mergeMatrix(matrix));
        },
        getAnchor: function(ax, ay) {
            if (this.anchor && this.anchor.x !== undefined) {
                return this.anchor;
            }
            var anchor = anchor || "center";
            var rbox = this.getRenderBox();
            var value = {
                x: rbox.x + rbox.width / 2,
                y: rbox.y + rbox.height / 2
            };
            if (!~anchor.indexOf("left")) {
                value.x = rbox.x;
            }
            if (!~anchor.indexOf("right")) {
                value.x = rbox.x + rbox.width;
            }
            if (!~anchor.indexOf("top")) {
                value.y = rbox.y;
            }
            if (!~anchor.indexOf("bottom")) {
                value.y = rbox.y + rbox.height;
            }
            return value;
        },
        setAnchor: function(ax, ay) {
            if (arguments.length === 1) {
                this.anchor = ax;
            } else {
                this.anchor = {
                    x: ax,
                    y: ay
                };
            }
            return this;
        },
        resetAnchor: function() {
            delete this.anchor;
            return this;
        },
        translate: function(dx, dy) {
            if (dy === undefined) {
                dy = 0;
            }
            return this.mergeTransform(new Matrix().translate(dx, dy));
        },
        rotate: function(deg) {
            var a = this.getAnchor();
            return this.mergeTransform(new Matrix().translate(-a.x, -a.y).rotate(deg).translate(a.x, a.y));
        },
        scale: function(sx, sy) {
            var a = this.getAnchor();
            if (sy === undefined) {
                sy = sx;
            }
            return this.mergeTransform(new Matrix().translate(-a.x, -a.y).scale(sx, sy).translate(a.x, a.y));
        },
        skew: function(sx, sy) {
            var a = this.getAnchor();
            if (sy === undefined) {
                sy = sx;
            }
            return this.mergeTransform(new Matrix().translate(-a.x, -a.y).skew(sx, sy).translate(a.x, a.y));
        },
        stroke: function(pen, width) {
            if (pen && pen.stroke) {
                pen.stroke(this);
            } else {
                // 字符串或重写了 toString 的对象
                this.node.setAttribute("stroke", pen);
                if (width) {
                    this.node.setAttribute("stroke-width", width);
                }
            }
            return this;
        },
        fill: function(brush) {
            if (brush && brush.fill) {
                brush.fill(this);
            } else {
                // 字符串或重写了 toString 的对象
                this.node.setAttribute("fill", brush);
            }
            return this;
        }
    });
});
define("graphic/shapecontainer", [ "graphic/container", "core/class", "core/config", "graphic/shape", "graphic/svg", "core/utils", "graphic/eventhandler", "graphic/styled", "graphic/data", "graphic/matrix", "graphic/pen", "graphic/brush" ], function(require, exports, module) {
    var Container = require("graphic/container");
    var ShapeContainer = require("core/class").createClass("ShapeContainer", {
        base: Container,
        /* private */
        handleAdd: function(shape, index) {
            var parent = this.getShapeNode();
            parent.insertBefore(shape.node, parent.childNodes[index] || null);
            shape.trigger("add", {
                container: this
            });
            if (shape.notifyTreeModification) {
                shape.notifyTreeModification("treeadd", this);
            }
        },
        /* private */
        handleRemove: function(shape, index) {
            var parent = this.getShapeNode();
            parent.removeChild(shape.node);
            shape.trigger("remove", {
                container: this
            });
            if (shape.notifyTreeModification) {
                shape.notifyTreeModification("treeremove", this);
            }
        },
        /* private */
        notifyTreeModification: function(type, container) {
            this.eachItem(function(index, shape) {
                if (shape instanceof ShapeContainer) {
                    shape.notifyTreeModification(type, container);
                }
                shape.trigger(type, {
                    container: container
                });
            });
        },
        /* public */
        getShape: function(index) {
            return this.getItem(index);
        },
        /* public */
        addShape: function(shape, index) {
            return this.addItem(shape, index);
        },
        /* public */
        addShapes: function(shapes) {
            return this.addItems(shapes);
        },
        /* public */
        removeShape: function(index) {
            return this.removeItem(index);
        },
        getShapes: function() {
            return this.getItems();
        },
        /* public */
        getShapeById: function(id) {
            return this.getShapeNode().getElementById(id).shape;
        },
        bringTo: function(shape, index) {
            return this.removeShape(shape).addShape(shape, index);
        },
        bringFront: function(shape) {
            return this.bringTo(shape, this.indexOf(shape) + 1);
        },
        bringBack: function(shape) {
            return this.bringTo(shape, this.indexOf(shape) - 1);
        },
        bringTop: function(shape) {
            return this.removeShape(shape).addShape(shape);
        },
        bringRear: function(shape) {
            return this.removeShape(shape).addShape(shape, 0);
        },
        /* protected */
        getShapeNode: function() {
            return this.shapeNode || this.node;
        }
    });
    var Shape = require("graphic/shape");
    require("core/class").extendClass(Shape, {
        bringTo: function(index) {
            this.container.bringTo(this, index);
            return this;
        },
        bringFront: function() {
            this.container.bringFront(this);
            return this;
        },
        bringBack: function() {
            this.container.bringBack(this);
            return this;
        },
        bringTop: function() {
            this.container.bringTop(this);
            return this;
        },
        bringRear: function() {
            this.container.bringRear(this);
            return this;
        }
    });
    return ShapeContainer;
});
/*
 * 图形事件包装类
 * */
define("graphic/shapeevent", [ "graphic/matrix", "core/utils", "core/class", "core/config" ], function(require, exprots, module) {
    var Matrix = require("graphic/matrix"), Utils = require("core/utils");
    return require("core/class").createClass("EventHandler", {
        constructor: function(event) {
            var target = null;
            // dom 事件封装对象
            if (!Utils.isObject(event.target)) {
                target = event.target;
                // use标签有特殊属性， 需要区别对待
                if (target.correspondingUseElement) {
                    target = target.correspondingUseElement;
                }
                this.originEvent = event;
                this.targetShape = target.shape || target.paper;
                if (event.__kity_param) {
                    Utils.extend(this, event.__kity_param);
                }
            } else {
                Utils.extend(this, event);
            }
        },
        preventDefault: function() {
            var evt = this.originEvent;
            if (!evt) {
                return true;
            }
            if (evt.preventDefault) {
                evt.preventDefault();
                return evt.cancelable;
            } else {
                evt.returnValue = false;
                return true;
            }
        },
        //当前鼠标事件在用户坐标系中点击的点的坐标位置
        getPosition: function() {
            if (!this.originEvent) {
                return null;
            }
            var eventClient = this.originEvent.touches ? this.originEvent.touches[0] : this.originEvent;
            var clientX = eventClient.clientX, clientY = eventClient.clientY, paper = this.targetShape.getPaper(), //转换过后的点
            transPoint = Matrix.transformPoint(clientX, clientY, paper.node.getScreenCTM().inverse());
            var zoom = paper.getViewPort().zoom;
            return {
                x: transPoint.x / zoom,
                y: transPoint.y / zoom
            };
        },
        stopPropagation: function() {
            var evt = this.originEvent;
            if (!evt) {
                return true;
            }
            if (evt.stopPropagation) {
                evt.stopPropagation();
            } else {
                evt.cancelBubble = false;
            }
        }
    });
});
/*
 * 图形上的点抽象
 */
define("graphic/shapepoint", [ "core/class", "core/config", "graphic/point" ], function(require, exports, module) {
    return require("core/class").createClass("ShapePoint", {
        base: require("graphic/point"),
        constructor: function(px, py) {
            this.callBase(px, py);
        },
        setX: function(x) {
            this.callBase(x);
            this.update();
            return this;
        },
        setY: function(y) {
            this.callBase(y);
            this.update();
            return this;
        },
        setPoint: function(x, y) {
            this.callBase(x, y);
            this.update();
            return this;
        },
        update: function() {
            if (this.container && this.container.update) {
                this.container.update();
            }
            return this;
        }
    });
});
/**
 * 标准颜色映射
 */
define("graphic/standardcolor", [], {
    COLOR_STANDARD: {
        aliceblue: "#f0f8ff",
        antiquewhite: "#faebd7",
        aqua: "#00ffff",
        aquamarine: "#7fffd4",
        azure: "#f0ffff",
        beige: "#f5f5dc",
        bisque: "#ffe4c4",
        black: "#000000",
        blanchedalmond: "#ffebcd",
        blue: "#0000ff",
        blueviolet: "#8a2be2",
        brown: "#a52a2a",
        burlywood: "#deb887",
        cadetblue: "#5f9ea0",
        chartreuse: "#7fff00",
        chocolate: "#d2691e",
        coral: "#ff7f50",
        cornflowerblue: "#6495ed",
        cornsilk: "#fff8dc",
        crimson: "#dc143c",
        cyan: "#00ffff",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgoldenrod: "#b8860b",
        darkgray: "#a9a9a9",
        darkgreen: "#006400",
        darkgrey: "#a9a9a9",
        darkkhaki: "#bdb76b",
        darkmagenta: "#8b008b",
        darkolivegreen: "#556b2f",
        darkorange: "#ff8c00",
        darkorchid: "#9932cc",
        darkred: "#8b0000",
        darksalmon: "#e9967a",
        darkseagreen: "#8fbc8f",
        darkslateblue: "#483d8b",
        darkslategray: "#2f4f4f",
        darkslategrey: "#2f4f4f",
        darkturquoise: "#00ced1",
        darkviolet: "#9400d3",
        deeppink: "#ff1493",
        deepskyblue: "#00bfff",
        dimgray: "#696969",
        dimgrey: "#696969",
        dodgerblue: "#1e90ff",
        firebrick: "#b22222",
        floralwhite: "#fffaf0",
        forestgreen: "#228b22",
        fuchsia: "#ff00ff",
        gainsboro: "#dcdcdc",
        ghostwhite: "#f8f8ff",
        gold: "#ffd700",
        goldenrod: "#daa520",
        gray: "#808080",
        green: "#008000",
        greenyellow: "#adff2f",
        grey: "#808080",
        honeydew: "#f0fff0",
        hotpink: "#ff69b4",
        indianred: "#cd5c5c",
        indigo: "#4b0082",
        ivory: "#fffff0",
        khaki: "#f0e68c",
        lavender: "#e6e6fa",
        lavenderblush: "#fff0f5",
        lawngreen: "#7cfc00",
        lemonchiffon: "#fffacd",
        lightblue: "#add8e6",
        lightcoral: "#f08080",
        lightcyan: "#e0ffff",
        lightgoldenrodyellow: "#fafad2",
        lightgray: "#d3d3d3",
        lightgreen: "#90ee90",
        lightgrey: "#d3d3d3",
        lightpink: "#ffb6c1",
        lightsalmon: "#ffa07a",
        lightseagreen: "#20b2aa",
        lightskyblue: "#87cefa",
        lightslategray: "#778899",
        lightslategrey: "#778899",
        lightsteelblue: "#b0c4de",
        lightyellow: "#ffffe0",
        lime: "#00ff00",
        limegreen: "#32cd32",
        linen: "#faf0e6",
        magenta: "#ff00ff",
        maroon: "#800000",
        mediumaquamarine: "#66cdaa",
        mediumblue: "#0000cd",
        mediumorchid: "#ba55d3",
        mediumpurple: "#9370db",
        mediumseagreen: "#3cb371",
        mediumslateblue: "#7b68ee",
        mediumspringgreen: "#00fa9a",
        mediumturquoise: "#48d1cc",
        mediumvioletred: "#c71585",
        midnightblue: "#191970",
        mintcream: "#f5fffa",
        mistyrose: "#ffe4e1",
        moccasin: "#ffe4b5",
        navajowhite: "#ffdead",
        navy: "#000080",
        oldlace: "#fdf5e6",
        olive: "#808000",
        olivedrab: "#6b8e23",
        orange: "#ffa500",
        orangered: "#ff4500",
        orchid: "#da70d6",
        palegoldenrod: "#eee8aa",
        palegreen: "#98fb98",
        paleturquoise: "#afeeee",
        palevioletred: "#db7093",
        papayawhip: "#ffefd5",
        peachpuff: "#ffdab9",
        peru: "#cd853f",
        pink: "#ffc0cb",
        plum: "#dda0dd",
        powderblue: "#b0e0e6",
        purple: "#800080",
        red: "#ff0000",
        rosybrown: "#bc8f8f",
        royalblue: "#4169e1",
        saddlebrown: "#8b4513",
        salmon: "#fa8072",
        sandybrown: "#f4a460",
        seagreen: "#2e8b57",
        seashell: "#fff5ee",
        sienna: "#a0522d",
        silver: "#c0c0c0",
        skyblue: "#87ceeb",
        slateblue: "#6a5acd",
        slategray: "#708090",
        slategrey: "#708090",
        snow: "#fffafa",
        springgreen: "#00ff7f",
        steelblue: "#4682b4",
        tan: "#d2b48c",
        teal: "#008080",
        thistle: "#d8bfd8",
        tomato: "#ff6347",
        turquoise: "#40e0d0",
        violet: "#ee82ee",
        wheat: "#f5deb3",
        white: "#ffffff",
        whitesmoke: "#f5f5f5",
        yellow: "#ffff00"
    },
    //标准扩展
    EXTEND_STANDARD: {}
});
define("graphic/styled", [ "core/class", "core/config" ], function(require, exports, module) {
    return require("core/class").createClass("Styled", {
        addClass: function(name) {
            this.node.classList.add(name);
            return this;
        },
        removeClass: function(name) {
            this.node.classList.remove(name);
            return this;
        },
        hasClass: function(name) {
            return this.node.classList.contains(name);
        },
        setStyle: function(styles) {
            if (arguments.length == 2) {
                this.node.style[arguments[0]] = arguments[1];
                return this;
            }
            for (var name in styles) {
                if (styles.hasOwnProperty(name)) {
                    this.node.style[name] = styles[name];
                }
            }
            return this;
        }
    });
});
define("graphic/svg", [], function(require, exports, module) {
    var doc = document;
    var id = 0;
    var svg = {
        createNode: function(name) {
            var node = doc.createElementNS(svg.ns, name);
            node.id = "kity_" + name + "_" + id++;
            return node;
        },
        defaults: {
            stroke: "none",
            fill: "none"
        },
        xlink: "http://www.w3.org/1999/xlink",
        ns: "http://www.w3.org/2000/svg"
    };
    return svg;
});
define("graphic/text", [ "graphic/textcontent", "graphic/shape", "core/class", "graphic/shapecontainer", "graphic/container", "graphic/svg", "core/config" ], function(require, exports, module) {
    var TextContent = require("graphic/textcontent");
    var ShapeContainer = require("graphic/shapecontainer");
    var svg = require("graphic/svg");
    return require("core/class").createClass("Text", {
        base: TextContent,
        mixins: [ ShapeContainer ],
        constructor: function(content) {
            this.callBase("text");
            if (content !== undefined) {
                this.setContent(content);
            }
        },
        setX: function(x) {
            this.node.setAttribute("x", x);
            return this;
        },
        setY: function(y) {
            this.node.setAttribute("y", y);
            return this;
        },
        getX: function() {
            return +this.node.getAttribute("x");
        },
        getY: function() {
            return +this.node.getAttribute("y");
        },
        setAnchor: function(anchor) {
            if (anchor == "center") {
                anchor = "middle";
            }
            this.node.setAttribute("text-anchor", anchor);
            // text path
            if (this.shapeNode != this.node) {
                this.shapeNode.setAttribute("startOffset", {
                    start: "0",
                    middle: "50%",
                    end: "100%"
                }[anchor]);
            }
            return this;
        },
        getAnchor: function() {
            return this.node.getAttribute("text-anchor") || "start";
        },
        addSpan: function(span) {
            this.addShape(span);
            return this;
        },
        setPath: function(path) {
            var textpath = this.shapeNode;
            if (this.shapeNode == this.node) {
                // 当前还不是 textpath
                textpath = this.shapeNode = svg.createNode("textPath");
                while (this.node.firstChild) {
                    this.shapeNode.appendChild(this.node.firstChild);
                }
                this.node.appendChild(textpath);
            }
            textpath.setAttributeNS(svg.xlink, "xlink:href", "#" + path.node.id);
            this.setAnchor(this.getAnchor());
            return this;
        }
    });
});
define("graphic/textcontent", [ "graphic/shape", "graphic/svg", "core/utils", "graphic/eventhandler", "graphic/styled", "graphic/data", "graphic/matrix", "graphic/pen", "graphic/brush", "core/class", "core/config" ], function(require, exports, module) {
    var Shape = require("graphic/shape");
    return require("core/class").createClass("TextContent", {
        base: Shape,
        constructor: function(nodeType) {
            // call shape constructor
            this.callBase(nodeType);
            this.shapeNode = this.shapeNode || this.node;
        },
        clearContent: function() {
            while (this.shapeNode.firstChild) {
                this.shapeNode.removeChild(this.shapeNode.firstChild);
            }
            return this;
        },
        setContent: function(content) {
            this.shapeNode.textContent = content;
            return this;
        },
        getContent: function() {
            return this.shapeNode.textContent;
        },
        appendContent: function(content) {
            this.shapeNode.textContent += content;
            return this;
        },
        setSize: function(value) {
            this.fontsize = value;
            this.node.setAttribute("font-size", value);
            return this;
        },
        getSize: function() {
            return this.fontsize;
        }
    });
});
define("graphic/textspan", [ "graphic/textcontent", "graphic/shape", "core/class", "graphic/styled", "core/config" ], function(require, exports, module) {
    var TextContent = require("graphic/textcontent");
    var Styled = require("graphic/styled");
    return require("core/class").createClass("TextSpan", {
        base: TextContent,
        mixins: [ Styled ],
        constructor: function(content) {
            this.callBase("tspan");
            this.setContent(content);
        }
    });
});
/*
 * USE 功能
 */
define("graphic/use", [ "graphic/svg", "core/class", "core/config", "graphic/shape", "core/utils", "graphic/eventhandler", "graphic/styled", "graphic/data", "graphic/matrix", "graphic/pen", "graphic/brush" ], function(require, exports, module) {
    var Svg = require("graphic/svg");
    var Class = require("core/class");
    var Use = Class.createClass("Use", {
        base: require("graphic/shape"),
        constructor: function(shape) {
            var shapeId = null;
            this.callBase("use");
            shapeId = shape.getId();
            if (shapeId) {
                this.node.setAttributeNS(Svg.xlink, "xlink:href", "#" + shapeId);
            }
            // by techird
            // 作为 Use 的图形，如果没有 fill 和 stroke，移除默认的 'none' 值，用于 Use 覆盖
            if (shape.node.getAttribute("fill") === "none") {
                shape.node.removeAttribute("fill");
            }
            if (shape.node.getAttribute("stroke") === "none") {
                shape.node.removeAttribute("stroke");
            }
        }
    });
    var Shape = require("graphic/shape");
    Class.extendClass(Shape, {
        // fast-use
        use: function() {
            return new Use(this);
        }
    });
    return Use;
});
define("graphic/vector", [ "core/class", "core/config" ], function(require, exports, module) {
    var Vector = require("core/class").createClass("Vector", {
        constructor: function(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        },
        length: function() {
            return Math.sqrt(Vector.square(this));
        }
    });
    Vector.add = function(p, q) {
        return new Vector(p.x + q.x, p.y + q.y);
    };
    Vector.square = function(p) {
        return p.x * p.x + p.y * p.y;
    };
    Vector.normalize = function(p, l) {
        if (l === undefined) {
            l = 1;
        }
        var factor = l / p.length();
        return new Vector(p.x * factor, p.y * factor);
    };
    Vector.verticalVector = function(p) {
        return new Vector(p.y, -p.x);
    };
    Vector.verticalNormalize = function(p) {
        return Vector.normalize(Vector.verticalVector(p));
    };
    Vector.multipy = function(p, s) {
        return new Vector(p.x * s, p.y * s);
    };
    Vector.reverse = function(p) {
        return Vector.multipy(p, -1);
    };
    Vector.dot = function(p, q) {
        return p.x * q.x + p.y * q.y;
    };
    Vector.minus = function(p, q) {
        return new Vector(p.x - q.x, p.y - q.y);
    };
    // p 在 q 上的投影
    Vector.projection = function(p, q) {
        var factor = Vector.dot(p, q) / Vector.square(q);
        return Vector.multipy(q, factor);
    };
    // from p1 to p2
    Vector.fromPoints = function(p1, p2) {
        return new Vector(p2.x - p1.x, p2.y - p1.y);
    };
    Vector.fromPolar = function(d, a, isRad) {
        if (isRad !== true) {
            a = a * Math.PI / 180;
        }
        return new Vector(d * Math.cos(a), d * Math.sin(a));
    };
    return Vector;
});

/**
 * 模块暴露
 */

( function ( global ) {

    define( 'kity.start', function ( require ) {

        var kity = global.kity = require( 'core/class' );

        require( 'core/utils' ).extend( kity, {

            // core
            Utils: require( "core/utils" ),

            // shape
            Bezier: require( 'graphic/bezier' ),
            BezierPoint: require( 'graphic/bezierpoint' ),
            Brush: require( 'graphic/brush' ),
            Circle: require( 'graphic/circle' ),
            Clip: require( 'graphic/clip' ),
            Color: require( 'graphic/color' ),
            ColorBrush: require( 'graphic/colorbrush' ),
            Curve: require( 'graphic/curve' ),
            Ellipse: require( 'graphic/ellipse' ),
            GradientBrush: require( 'graphic/gradientbrush' ),
            Group: require( 'graphic/group' ),
            Image: require( 'graphic/image' ),
            Line: require( 'graphic/line' ),
            LinearGradientBrush: require( 'graphic/lineargradientbrush' ),
            Mask: require( 'graphic/mask' ),
            Matrix: require( 'graphic/matrix' ),
            Palette: require( 'graphic/palette' ),
            Paper: require( 'graphic/paper' ),
            Path: require( 'graphic/path' ),
            PatternBrush: require( 'graphic/patternbrush' ),
            Pen: require( 'graphic/pen' ),
            Point: require( 'graphic/point' ),
            Polygon: require( 'graphic/polygon' ),
            Polyline: require( 'graphic/polyline' ),
            RadialGradientBrush: require( 'graphic/radialgradientbrush' ),
            Rect: require( 'graphic/rect' ),
            Shape: require( 'graphic/shape' ),
            ShapePoint: require( 'graphic/shapepoint' ),
            Text: require( 'graphic/text' ),
            TextSpan: require( 'graphic/textspan' ),
            Use: require( 'graphic/use' ),
            Vector: require( 'graphic/vector' ),

            // animate
            Animator: require( 'animate/animator' ),
            Easing: require( 'animate/easing' ),
            OpacityAnimator: require( 'animate/opacityanimator' ),
            RotateAnimator: require( 'animate/rotateanimator' ),
            ScaleAnimator: require( 'animate/scaleanimator' ),
            Timeline: require( 'animate/timeline' ),
            TranslateAnimator: require( 'animate/translateanimator' ),

            // filter
            Filter: require( 'filter/filter' ),
            GaussianblurFilter: require( 'filter/gaussianblurfilter' ),
            ProjectionFilter: require( 'filter/projectionfilter' ),

            // effect
            ColorMatrixEffect: require( 'filter/effect/colormatrixeffect' ),
            CompositeEffect: require( 'filter/effect/compositeeffect' ),
            ConvolveMatrixEffect: require( 'filter/effect/convolvematrixeffect' ),
            Effect: require( 'filter/effect/effect' ),
            GaussianblurEffect: require( 'filter/effect/gaussianblureffect' ),
            OffsetEffect: require( 'filter/effect/offseteffect' )

        } );

    } );

    // build环境中才含有use
    try {
        use( 'kity.start' );
    } catch ( e ) {
    }

} )( this );
})();
