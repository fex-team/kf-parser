/**
 * 定义括号类型， 对于属于括号类型的符号或表达式， 则可以应用brackets函数处理
 */

define( function () {

    var t = true;

    return {
        ".": t,
        "{": t,
        "}": t,
        "[": t,
        "]": t,
        "(": t,
        ")": t,
        "|": t
    };

} );