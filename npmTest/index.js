// 现在的问题是如何讲一个组件暴露给用户
// 当用户进行import的时候是否能取到呢
// 、这是一个问题
import {
    a,
    b
} from "./tests.js"
console.log("------------------");
function add() {
    console.log("执行了t函数");
    console.log(a(5, 5));
}

function reduce() {
    console.log("执行了ts函数");
    console.log(b(5, 5));
}

console.log(window);
console.log(Object);
export default {
    add,
    reduce
};