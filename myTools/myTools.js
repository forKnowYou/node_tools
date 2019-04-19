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
    MyTools.prototype.isInArray = function (obj, arr) {
        return arr.some(function (i) {
            if (i === obj)
                return true;
            return false;
        });
    };
    MyTools.prototype.checkObjModule = function (obj, mod) {
    };
    return MyTools;
}());
exports.myTools = new MyTools();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXlUb29scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm15VG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxJQUFJLG1CQUFtQixHQUFHO0lBQ3hCLEtBQUssRUFBRSxFQUFFO0lBQ1QsR0FBRyxFQUFFLEVBQUU7SUFDUCxLQUFLLEVBQUUsRUFBRTtJQUNULE1BQU0sRUFBRSxFQUFFO0lBQ1YsSUFBSSxFQUFFLEVBQUU7SUFDUixNQUFNLEVBQUUsRUFBRTtJQUNWLE9BQU8sRUFBRSxFQUFFO0lBQ1gsS0FBSyxFQUFFLEVBQUU7Q0FDVixDQUFBO0FBSUQ7SUFBQTtJQW9CQSxDQUFDO0lBbEJDLGtDQUFnQixHQUFoQixVQUFpQixPQUFZLEVBQUUsS0FBcUI7UUFDbEQsSUFBRyxPQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssUUFBUTtZQUM3QixPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsR0FBRyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDM0UsQ0FBQztJQUVELDJCQUFTLEdBQVQsVUFBVSxHQUFRLEVBQUUsR0FBYTtRQUMvQixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO1lBQ2hCLElBQUcsQ0FBQyxLQUFLLEdBQUc7Z0JBQ1YsT0FBTyxJQUFJLENBQUE7WUFDYixPQUFPLEtBQUssQ0FBQTtRQUNkLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELGdDQUFjLEdBQWQsVUFBZSxHQUFRLEVBQUUsR0FBUTtJQUVqQyxDQUFDO0lBRUgsY0FBQztBQUFELENBQUMsQUFwQkQsSUFvQkM7QUFFWSxRQUFBLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmxldCBjb25zb2xlQ29sb3JEZWZpbmVzID0ge1xyXG4gIGJsYWNrOiAzMCxcclxuICByZWQ6IDMxLFxyXG4gIGdyZWVuOiAzMixcclxuICB5ZWxsb3c6IDMzLFxyXG4gIGJsdWU6IDM0LFxyXG4gIHB1cnBsZTogMzUsXHJcbiAgc2t5Qmx1ZTogMzYsXHJcbiAgd2hpdGU6IDM3XHJcbn1cclxuXHJcbnR5cGUgY29uc29sZUNvbG9yX3QgPSBcImJsYWNrXCIgfCBcInJlZFwiIHwgXCJncmVlblwiIHwgXCJ5ZWxsb3dcIiB8IFwiYmx1ZVwiIHwgXCJwdXJwbGVcIiB8IFwic2t5Qmx1ZVwiIHwgXCJ3aGl0ZVwiXHJcblxyXG5jbGFzcyBNeVRvb2xzIHtcclxuICBcclxuICBjb25zb2xlV2l0aENvbG9yKGNvbnRlbnQ6IGFueSwgY29sb3I6IGNvbnNvbGVDb2xvcl90KSB7XHJcbiAgICBpZih0eXBlb2YoY29udGVudCkgPT09IFwib2JqZWN0XCIpXHJcbiAgICAgIGNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeShjb250ZW50KVxyXG4gICAgY29uc29sZS5sb2coXCJcXHgxYltcIiArIGNvbnNvbGVDb2xvckRlZmluZXNbY29sb3JdICsgXCJtJXNcXHgxYlswbVwiLCBjb250ZW50KVxyXG4gIH1cclxuXHJcbiAgaXNJbkFycmF5KG9iajogYW55LCBhcnI6IEFueUFycmF5KSA6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIGFyci5zb21lKChpKSA9PiB7XHJcbiAgICAgIGlmKGkgPT09IG9iailcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBjaGVja09iak1vZHVsZShvYmo6IGFueSwgbW9kOiBhbnkpIDogYm9vbGVhbiB7XHJcbiAgICBcclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbXlUb29scyA9IG5ldyBNeVRvb2xzKClcclxuIl19