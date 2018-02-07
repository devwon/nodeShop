/*
var p1 = new Promise(
    function (resolve, reject) {
        //0.5초 뒤에 콘솔에 찍습니다.
        setTimeout(
            function () {
                resolve({ p1: "^_^" });
            }, 500);
    }
);

var p2 = new Promise(
    function (resolve, reject) {
        console.log("프라미스 함수제작");
        //0.3초 뒤에 콘솔에 찍습니다.
        setTimeout(
            function () {
                resolve({ p2: "-_-" });
            }, 300);
    }
);

Promise.all([p1, p2]).then((result) => {
    console.log(result);
    console.log("p1 = " + result[0].p1);
    console.log("p2 = " + result[1].p2);
});
*/
function* iterFunc() {//함수를 여러번 호출할 수 있게

    yield console.log("첫번째 출력");
    yield console.log("두번째 출력");
    yield console.log("세번째 출력");
    yield console.log("네번째 출력");

}

var iter = iterFunc();
iter.next();   // 첫번째 출력
iter.next();   // 두번째 출력
