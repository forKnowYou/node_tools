"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var consoleColorDefines = {
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    purple: 35,
    skyBlue: 36,
    white: 37
};
var MyTools = (function () {
    function MyTools() {
    }
    MyTools.prototype.consoleWithColor = function (content, color) {
        if (typeof (content) === "object")
            content = JSON.stringify(content);
        console.log("\x1b[" + consoleColorDefines[color] + "m%s\x1b[0m", content);
    };
    return MyTools;
}());
var myTools = new MyTools();
exports.myTools = myTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXlUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm15VG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxJQUFJLG1CQUFtQixHQUFjO0lBQ25DLEtBQUssRUFBRSxFQUFFO0lBQ1QsR0FBRyxFQUFFLEVBQUU7SUFDUCxLQUFLLEVBQUUsRUFBRTtJQUNULE1BQU0sRUFBRSxFQUFFO0lBQ1YsSUFBSSxFQUFFLEVBQUU7SUFDUixNQUFNLEVBQUUsRUFBRTtJQUNWLE9BQU8sRUFBRSxFQUFFO0lBQ1gsS0FBSyxFQUFFLEVBQUU7Q0FDVixDQUFBO0FBSUQ7SUFBQTtJQVFBLENBQUM7SUFOQyxrQ0FBZ0IsR0FBaEIsVUFBaUIsT0FBWSxFQUFFLEtBQXFCO1FBQ2xELElBQUcsT0FBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVE7WUFDN0IsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLEdBQUcsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQzNFLENBQUM7SUFFSCxjQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFFRCxJQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFBO0FBRzNCLDBCQUFPIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmxldCBjb25zb2xlQ29sb3JEZWZpbmVzOiBBbnlPYmplY3QgPSB7XHJcbiAgYmxhY2s6IDMwLFxyXG4gIHJlZDogMzEsXHJcbiAgZ3JlZW46IDMyLFxyXG4gIHllbGxvdzogMzMsXHJcbiAgYmx1ZTogMzQsXHJcbiAgcHVycGxlOiAzNSxcclxuICBza3lCbHVlOiAzNixcclxuICB3aGl0ZTogMzdcclxufVxyXG5cclxudHlwZSBjb25zb2xlQ29sb3JfdCA9IFwiYmxhY2tcIiB8IFwicmVkXCIgfCBcImdyZWVuXCIgfCBcInllbGxvd1wiIHwgXCJibHVlXCIgfCBcInB1cnBsZVwiIHwgXCJza3lCbHVlXCIgfCBcIndoaXRlXCJcclxuXHJcbmNsYXNzIE15VG9vbHMge1xyXG4gIFxyXG4gIGNvbnNvbGVXaXRoQ29sb3IoY29udGVudDogYW55LCBjb2xvcjogY29uc29sZUNvbG9yX3QpIHtcclxuICAgIGlmKHR5cGVvZihjb250ZW50KSA9PT0gXCJvYmplY3RcIilcclxuICAgICAgY29udGVudCA9IEpTT04uc3RyaW5naWZ5KGNvbnRlbnQpXHJcbiAgICBjb25zb2xlLmxvZyhcIlxceDFiW1wiICsgY29uc29sZUNvbG9yRGVmaW5lc1tjb2xvcl0gKyBcIm0lc1xceDFiWzBtXCIsIGNvbnRlbnQpXHJcbiAgfVxyXG5cclxufVxyXG5cclxuY29uc3QgbXlUb29scyA9IG5ldyBNeVRvb2xzKClcclxuXHJcbmV4cG9ydCB7XHJcbiAgbXlUb29sc1xyXG59XHJcbiJdfQ==