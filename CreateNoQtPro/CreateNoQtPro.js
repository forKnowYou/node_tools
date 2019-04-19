"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var myTools_1 = require("../myTools/myTools");
var ParseProcessArgv_1 = require("../ParseProcessArgv/ParseProcessArgv");
var ParseProcessInput_1 = require("../ParseProcessInput/ParseProcessInput");
var child_process = require("child_process");
var fs = require("fs");
var _buildConfig = {
    "lib": "",
    "sourcePath": ""
};
var _addNewBuildConfig = {
    "lib": "",
    "sourcePath": ""
};
var _recentBuildConfig = [];
var _libConfig = {};
try {
    _recentBuildConfig = require("./recentBuildConfig.json");
    _libConfig = require("./libConfig.json");
}
catch (e) {
    fs.writeFileSync("./recentBuildConfig.json", "[]");
    fs.writeFileSync("./libConfig.json", "{}");
}
var _noQtProRslt = "";
function addFilePath2Rslt(filePath, suffix) {
    if (!fs.existsSync(filePath))
        return;
    var files = fs.readdirSync(filePath);
    files.forEach(function (i) {
        var stat = fs.statSync(filePath + "\\" + i);
        if (stat.isDirectory())
            addFilePath2Rslt(filePath + "\\" + i, suffix);
        else {
            i = i.toLowerCase();
            suffix.some(function (j) {
                if (i.endsWith(j)) {
                    _noQtProRslt += "  " + filePath + "\\" + i + " \\\r\n";
                    return true;
                }
                return false;
            });
        }
    });
}
function addIncludePath2Rslt(includePath) {
    if (!fs.existsSync(includePath))
        return;
    var suffix = [".h", ".hpp"];
    var files = fs.readdirSync(includePath);
    files.forEach(function (i) {
        var stat = fs.statSync(includePath + "\\" + i);
        if (stat.isDirectory())
            addIncludePath2Rslt(includePath + "\\" + i);
        else {
            i = i.toLowerCase();
            for (var j = 0; j < suffix.length; j++) {
                if (i.endsWith(suffix[j])) {
                    if (_noQtProRslt.indexOf("  " + includePath + " \\\r\n") === -1)
                        _noQtProRslt += "  " + includePath + " \\\r\n";
                    break;
                }
            }
        }
    });
}
function formatPath(filePath) {
    var a = filePath.split("\\");
    var newPath = [];
    a.forEach(function (i) {
        if (i)
            newPath.push(i);
    });
    return newPath.join("\\");
}
function checkBuildConfig(conf) {
    if (!conf)
        return false;
    if (!fs.existsSync(conf.sourcePath))
        return false;
    if (!_libConfig[conf.lib])
        return false;
    return true;
}
function buildNoQtPro(conf) {
    if (!checkBuildConfig(conf)) {
        myTools_1.myTools.consoleWithColor("build config error", "red");
        return;
    }
    console.log("resourcesPath: " + conf.sourcePath);
    var a = formatPath(conf.sourcePath);
    _noQtProRslt += "\r\nSOURCES += \\\r\n";
    addFilePath2Rslt(a, [".ino", ".cpp", ".c"]);
    _noQtProRslt += "\r\nHEADERS += \\\r\n";
    addFilePath2Rslt(a, [".h", ".hpp"]);
    _noQtProRslt += "\r\nINCLUDEPATH += \\\r\n";
    addIncludePath2Rslt(a);
    a = conf.lib.toUpperCase();
    try {
        if (_libConfig[a]) {
            console.log("load lib from " + a);
            var l = _libConfig[a];
            if (l.defines) {
                _noQtProRslt += "\r\nDEFINES += \\\r\n";
                l.defines.forEach(function (i) {
                    _noQtProRslt += "  " + i + " \\\r\n";
                });
            }
            if (l.lib) {
                _noQtProRslt += "\r\nSOURCES += \\\r\n";
                addFilePath2Rslt(l.lib, [".ino", ".cpp", ".c"]);
                _noQtProRslt += "\r\nHEADERS += \\\r\n";
                addFilePath2Rslt(l.lib, [".h", ".hpp"]);
                _noQtProRslt += "\r\nINCLUDEPATH += \\\r\n";
                addIncludePath2Rslt(l.lib);
            }
        }
    }
    catch (e) { }
    fs.writeFileSync("./CreateNoQtPro.txt", _noQtProRslt);
    child_process.execSync("notepad ./CreateNoQtPro.txt");
    fs.writeFileSync("./CreateNoQtPro.txt", "");
}
var has_r = false;
new Promise(function (resolve, reject) {
    ParseProcessArgv_1.parseProcessArgv({
        "aArgvConfig": [{
                arg: "-r",
                argc: 0,
                description: "use recent build config",
                func: function (argv) {
                    _buildConfig = _recentBuildConfig[0];
                    has_r = true;
                }
            }],
        "fCompelete": function () {
            if (has_r) {
                buildNoQtPro(_buildConfig);
                resolve();
            }
        },
        "fUnexpectedArgv": function () {
            myTools_1.myTools.consoleWithColor("Unexpected arguments", "red");
            has_r = true;
            resolve();
        },
        "description": "A node app to create no QT project profile content"
    });
}).then(function () {
    process.exit();
});
var stateStep = 0;
var eStateMachineStep;
(function (eStateMachineStep) {
    eStateMachineStep[eStateMachineStep["main"] = 1] = "main";
    eStateMachineStep[eStateMachineStep["addNewBuildConfig_resources"] = 2] = "addNewBuildConfig_resources";
    eStateMachineStep[eStateMachineStep["addNewBuildConfig_lib"] = 3] = "addNewBuildConfig_lib";
    eStateMachineStep[eStateMachineStep["useRecentBuildConfig"] = 4] = "useRecentBuildConfig";
    eStateMachineStep[eStateMachineStep["delRecentBuildConfig"] = 5] = "delRecentBuildConfig";
})(eStateMachineStep || (eStateMachineStep = {}));
function stateMachineToMain() {
    stateStep = eStateMachineStep.main;
    myTools_1.myTools.consoleWithColor("\n  1. Add new build config and build\n  2. Use recent build config\n  3. Delete recent build config\n  4. Exit\n  ", "skyBlue");
    myTools_1.myTools.consoleWithColor("Input id to select one operate:", "green");
}
function stateMachineMain(input) {
    switch (input) {
        case "1":
            {
                stateMachineToAddNewBuildConfigResources();
            }
            break;
        case "2":
            {
                stateMachineToUseRecentBuildConfig();
            }
            break;
        case "3":
            {
                stateMachineToDelRecentBuildConfig();
            }
            break;
        case "4":
            process.exit();
            break;
        default:
            myTools_1.myTools.consoleWithColor("Unexpected input", "red");
            break;
    }
}
function stateMachineToAddNewBuildConfigResources() {
    stateStep = eStateMachineStep.addNewBuildConfig_resources;
    myTools_1.myTools.consoleWithColor("Input resources path, input 'c' to cancel:", "green");
}
function stateMachineAddNewBuildConfigResources(input) {
    if (input === "c") {
        stateMachineToMain();
        return;
    }
    if (fs.existsSync(input)) {
        _addNewBuildConfig.sourcePath = input;
        stateMachineToAddNewBuildConfigLib();
    }
    else {
        myTools_1.myTools.consoleWithColor("invalid path", "red");
    }
}
function stateMachineToAddNewBuildConfigLib() {
    stateStep = eStateMachineStep.addNewBuildConfig_lib;
    var count = 1;
    console.log("");
    for (var i in _libConfig) {
        var defines = _libConfig[i].defines ? "[" + _libConfig[i].defines + "]" : "null";
        var lib = _libConfig[i].lib ? "" + _libConfig[i].lib : "null";
        myTools_1.myTools.consoleWithColor("  " + count + ": name: " + i + ", defines: " + defines + ", lib: " + lib, "skyBlue");
        count++;
    }
    myTools_1.myTools.consoleWithColor("Input id to select one lib, input 'c' to cancel", "green");
}
function stateMachineAddNewBuildConfigLib(input) {
    if (input === "c") {
        stateMachineToMain();
        return;
    }
    if (!/^[0-9]$/.test(input)) {
        myTools_1.myTools.consoleWithColor("Unexpected input", "red");
        return;
    }
    var id = parseInt(input);
    var count = 1;
    for (var i in _libConfig) {
        if (id === count) {
            _addNewBuildConfig.lib = i;
            buildNoQtPro(_addNewBuildConfig);
            console.log(_recentBuildConfig);
            _recentBuildConfig.splice(0, 0, _addNewBuildConfig);
            console.log(_recentBuildConfig);
            fs.writeFileSync("./recentBuildConfig.json", JSON.stringify(_recentBuildConfig));
            stateMachineToMain();
            break;
        }
        count++;
    }
    if (id !== count) {
        myTools_1.myTools.consoleWithColor("ID error", "red");
    }
}
function stateMachineToAddLibDefines() {
    stateStep = eStateMachineStep.addNewLib_defines;
    myTools_1.myTools.consoleWithColor("Input defines, use ',' independent items, input 'c' to cancel:", "green");
}
function stateMachineToUseRecentBuildConfig() {
    stateStep = eStateMachineStep.useRecentBuildConfig;
    var count = 1;
    console.log("");
    _recentBuildConfig.forEach(function (i) {
        var resources = i.sourcePath;
        var lib = i.lib;
        myTools_1.myTools.consoleWithColor("  " + count + ": resources: " + resources + ", lib: " + lib, "skyBlue");
        count++;
    });
    myTools_1.myTools.consoleWithColor("Input id to select one lib, input 'c' to cancel", "green");
}
function stateMachineUseRecentBuildConfig(input) {
    if (input === "c") {
        stateMachineToMain();
        return;
    }
    if (!/^[0-9]$/.test(input)) {
        myTools_1.myTools.consoleWithColor("Unexpected input", "red");
        return;
    }
    var id = parseInt(input);
    var count = 1;
    if (_recentBuildConfig.some(function (i) {
        if (count === id)
            return true;
        count++;
        return false;
    })) {
        _recentBuildConfig.splice(0, 0, _recentBuildConfig[id - 1]);
        _recentBuildConfig.splice(id, 1);
        fs.writeFileSync("./recentBuildConfig.json", JSON.stringify(_recentBuildConfig));
        buildNoQtPro(_recentBuildConfig[0]);
        stateMachineToMain();
    }
    else {
        myTools_1.myTools.consoleWithColor("ID error", "red");
    }
}
function stateMachineToDelRecentBuildConfig() {
    stateStep = eStateMachineStep.delRecentBuildConfig;
    var count = 1;
    console.log("");
    _recentBuildConfig.forEach(function (i) {
        var resources = i.sourcePath;
        var lib = i.lib;
        myTools_1.myTools.consoleWithColor("  " + count + ": resources: " + resources + ", lib: " + lib, "skyBlue");
        count++;
    });
    myTools_1.myTools.consoleWithColor("Input id to select one lib, input 'c' to cancel", "green");
}
function stateMachineDelRecentBuildConfig(input) {
    if (input === "c") {
        stateMachineToMain();
        return;
    }
    if (!/^[0-9]$/.test(input)) {
        myTools_1.myTools.consoleWithColor("Unexpected input", "red");
        return;
    }
    var id = parseInt(input);
    var count = 1;
    if (_recentBuildConfig.some(function (i) {
        if (count === id)
            return true;
        count++;
        return false;
    })) {
        _recentBuildConfig.splice(id - 1, 1);
        fs.writeFileSync("./recentBuildConfig.json", JSON.stringify(_recentBuildConfig));
        stateMachineToMain();
    }
    else {
        myTools_1.myTools.consoleWithColor("Unexpected input", "red");
    }
}
function stateMachine(input) {
    if (!stateStep) {
        stateMachineToMain();
        return;
    }
    switch (stateStep) {
        case eStateMachineStep.main:
            {
                stateMachineMain(input);
            }
            break;
        case eStateMachineStep.addNewBuildConfig_resources:
            {
                stateMachineAddNewBuildConfigResources(input);
            }
            break;
        case eStateMachineStep.addNewBuildConfig_lib:
            {
                stateMachineAddNewBuildConfigLib(input);
            }
            break;
        case eStateMachineStep.delRecentBuildConfig:
            {
                stateMachineDelRecentBuildConfig(input);
            }
            break;
        case eStateMachineStep.useRecentBuildConfig:
            {
                stateMachineUseRecentBuildConfig(input);
            }
            break;
    }
}
ParseProcessInput_1.setProcessInputCallBack(stateMachine);
if (!has_r)
    stateMachine("");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3JlYXRlTm9RdFByby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNyZWF0ZU5vUXRQcm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4Q0FFMkI7QUFFM0IseUVBRTZDO0FBRTdDLDRFQUUrQztBQUUvQyw2Q0FBOEM7QUFDOUMsdUJBQXdCO0FBZ0J4QixJQUFJLFlBQVksR0FBaUI7SUFDL0IsS0FBSyxFQUFFLEVBQUU7SUFDVCxZQUFZLEVBQUUsRUFBRTtDQUNqQixDQUFBO0FBQ0QsSUFBSSxrQkFBa0IsR0FBaUI7SUFDckMsS0FBSyxFQUFFLEVBQUU7SUFDVCxZQUFZLEVBQUUsRUFBRTtDQUNqQixDQUFBO0FBQ0QsSUFBSSxrQkFBa0IsR0FBd0IsRUFBRSxDQUFBO0FBQ2hELElBQUksVUFBVSxHQUFlLEVBQUUsQ0FBQTtBQUUvQixJQUFJO0lBQ0Ysa0JBQWtCLEdBQUcsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUE7SUFDeEQsVUFBVSxHQUFnQixPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtDQUN0RDtBQUNELE9BQU8sQ0FBQyxFQUFFO0lBQ1IsRUFBRSxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUNsRCxFQUFFLENBQUMsYUFBYSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFBO0NBQzNDO0FBRUQsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFBO0FBRXJCLFNBQVMsZ0JBQWdCLENBQUMsUUFBZ0IsRUFBRSxNQUFxQjtJQUMvRCxJQUFHLENBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7UUFDMUIsT0FBTTtJQUNSLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDcEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUM7UUFDZCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdB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QUssaUJBQWlCLENBQUMsMkJBQTJCO1lBQUU7Z0JBQ2xELHNDQUFzQyxDQUFDLEtBQUssQ0FBQyxDQUFBO2FBQzlDO1lBQUMsTUFBSztRQUNQLEtBQUssaUJBQWlCLENBQUMscUJBQXFCO1lBQUU7Z0JBQzVDLGdDQUFnQyxDQUFDLEtBQUssQ0FBQyxDQUFBO2FBQ3hDO1lBQUMsTUFBSztRQUNQLEtBQUssaUJBQWlCLENBQUMsb0JBQW9CO1lBQUU7Z0JBQzNDLGdDQUFnQyxDQUFDLEtBQUssQ0FBQyxDQUFBO2FBQ3hDO1lBQUMsTUFBSztRQUNQLEtBQUssaUJBQWlCLENBQUMsb0JBQW9CO1lBQUU7Z0JBQzNDLGdDQUFnQyxDQUFDLEtBQUssQ0FBQyxDQUFBO2FBQ3hDO1lBQUMsTUFBSztLQUNSO0FBQ0gsQ0FBQztBQUVELDJDQUF1QixDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ3JDLElBQUcsQ0FBRSxLQUFLO0lBQ1IsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBteVRvb2xzXHJcbn0gZnJvbSBcIi4uL215VG9vbHMvbXlUb29sc1wiXHJcblxyXG5pbXBvcnQge1xyXG4gIHBhcnNlUHJvY2Vzc0FyZ3ZcclxufSBmcm9tIFwiLi4vUGFyc2VQcm9jZXNzQXJndi9QYXJzZVByb2Nlc3NBcmd2XCJcclxuXHJcbmltcG9ydCB7XHJcbiAgc2V0UHJvY2Vzc0lucHV0Q2FsbEJhY2tcclxufSBmcm9tIFwiLi4vUGFyc2VQcm9jZXNzSW5wdXQvUGFyc2VQcm9jZXNzSW5wdXRcIlxyXG5cclxuaW1wb3J0ICogYXMgY2hpbGRfcHJvY2VzcyBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiXHJcbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiXHJcblxyXG5pbnRlcmZhY2UgaUxpYkNoaWxkIHtcclxuICBkZWZpbmVzPzogQXJyYXk8c3RyaW5nPixcclxuICBsaWI/OiBzdHJpbmdcclxufVxyXG5cclxuaW50ZXJmYWNlIGlMaWJDb25maWcge1xyXG4gIFtrZXk6IHN0cmluZ106IGlMaWJDaGlsZFxyXG59XHJcblxyXG5pbnRlcmZhY2UgaUJ1aWxkQ29uZmlnIHtcclxuICBzb3VyY2VQYXRoOiBzdHJpbmcsXHJcbiAgbGliOiBzdHJpbmdcclxufVxyXG5cclxubGV0IF9idWlsZENvbmZpZzogaUJ1aWxkQ29uZmlnID0ge1xyXG4gIFwibGliXCI6IFwiXCIsXHJcbiAgXCJzb3VyY2VQYXRoXCI6IFwiXCJcclxufVxyXG5sZXQgX2FkZE5ld0J1aWxkQ29uZmlnOiBpQnVpbGRDb25maWcgPSB7XHJcbiAgXCJsaWJcIjogXCJcIixcclxuICBcInNvdXJjZVBhdGhcIjogXCJcIlxyXG59XHJcbmxldCBfcmVjZW50QnVpbGRDb25maWc6IEFycmF5PGlCdWlsZENvbmZpZz4gPSBbXVxyXG5sZXQgX2xpYkNvbmZpZzogaUxpYkNvbmZpZyA9IHt9XHJcblxyXG50cnkge1xyXG4gIF9yZWNlbnRCdWlsZENvbmZpZyA9IHJlcXVpcmUoXCIuL3JlY2VudEJ1aWxkQ29uZmlnLmpzb25cIilcclxuICBfbGliQ29uZmlnID0gPGlMaWJDb25maWc+IHJlcXVpcmUoXCIuL2xpYkNvbmZpZy5qc29uXCIpXHJcbn1cclxuY2F0Y2ggKGUpIHtcclxuICBmcy53cml0ZUZpbGVTeW5jKFwiLi9yZWNlbnRCdWlsZENvbmZpZy5qc29uXCIsIFwiW11cIilcclxuICBmcy53cml0ZUZpbGVTeW5jKFwiLi9saWJDb25maWcuanNvblwiLCBcInt9XCIpXHJcbn1cclxuXHJcbmxldCBfbm9RdFByb1JzbHQgPSBcIlwiXHJcblxyXG5mdW5jdGlvbiBhZGRGaWxlUGF0aDJSc2x0KGZpbGVQYXRoOiBzdHJpbmcsIHN1ZmZpeDogQXJyYXk8c3RyaW5nPikge1xyXG4gIGlmKCEgZnMuZXhpc3RzU3luYyhmaWxlUGF0aCkpXHJcbiAgICByZXR1cm5cclxuICBsZXQgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhmaWxlUGF0aClcclxuICBmaWxlcy5mb3JFYWNoKChpKSA9PiB7XHJcbiAgICBsZXQgc3RhdCA9IGZzLnN0YXRTeW5jKGZpbGVQYXRoICsgXCJcXFxcXCIgKyBpKVxyXG4gICAgaWYoc3RhdC5pc0RpcmVjdG9yeSgpKVxyXG4gICAgICBhZGRGaWxlUGF0aDJSc2x0KGZpbGVQYXRoICsgXCJcXFxcXCIgKyBpLCBzdWZmaXgpXHJcbiAgICBlbHNlIHtcclxuICAgICAgaSA9IGkudG9Mb3dlckNhc2UoKVxyXG4gICAgICBzdWZmaXguc29tZSgoaikgPT4ge1xyXG4gICAgICAgIGlmKGkuZW5kc1dpdGgoaikpIHtcclxuICAgICAgICAgIF9ub1F0UHJvUnNsdCArPSBcIiAgXCIgKyBmaWxlUGF0aCArIFwiXFxcXFwiICsgaSArIFwiIFxcXFxcXHJcXG5cIlxyXG4gICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkSW5jbHVkZVBhdGgyUnNsdChpbmNsdWRlUGF0aDogc3RyaW5nKSB7XHJcbiAgaWYoISBmcy5leGlzdHNTeW5jKGluY2x1ZGVQYXRoKSlcclxuICAgIHJldHVyblxyXG4gIGxldCBzdWZmaXggPSBbXCIuaFwiLCBcIi5ocHBcIl1cclxuICBsZXQgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhpbmNsdWRlUGF0aClcclxuICBmaWxlcy5mb3JFYWNoKChpKSA9PiB7XHJcbiAgICBsZXQgc3RhdCA9IGZzLnN0YXRTeW5jKGluY2x1ZGVQYXRoICsgXCJcXFxcXCIgKyBpKVxyXG4gICAgaWYoc3RhdC5pc0RpcmVjdG9yeSgpKVxyXG4gICAgICBhZGRJbmNsdWRlUGF0aDJSc2x0KGluY2x1ZGVQYXRoICsgXCJcXFxcXCIgKyBpKVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGkgPSBpLnRvTG93ZXJDYXNlKClcclxuICAgICAgZm9yKGxldCBqID0gMDsgaiA8IHN1ZmZpeC5sZW5ndGg7IGogKyspIHtcclxuICAgICAgICBpZihpLmVuZHNXaXRoKHN1ZmZpeFtqXSkpIHtcclxuICAgICAgICAgIGlmKF9ub1F0UHJvUnNsdC5pbmRleE9mKFwiICBcIiArIGluY2x1ZGVQYXRoICsgXCIgXFxcXFxcclxcblwiKSA9PT0gLTEpXHJcbiAgICAgICAgICAgIF9ub1F0UHJvUnNsdCArPSBcIiAgXCIgKyBpbmNsdWRlUGF0aCArIFwiIFxcXFxcXHJcXG5cIlxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtYXRQYXRoKGZpbGVQYXRoOiBzdHJpbmcpIHtcclxuICBsZXQgYSA9IGZpbGVQYXRoLnNwbGl0KFwiXFxcXFwiKVxyXG4gIGxldCBuZXdQYXRoOiBBcnJheTxzdHJpbmc+ID0gW11cclxuICBhLmZvckVhY2goKGkpID0+IHtcclxuICAgIGlmKGkpXHJcbiAgICAgIG5ld1BhdGgucHVzaChpKVxyXG4gIH0pXHJcbiAgcmV0dXJuIG5ld1BhdGguam9pbihcIlxcXFxcIilcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tCdWlsZENvbmZpZyhjb25mOiBpQnVpbGRDb25maWcpIDogYm9vbGVhbiB7XHJcbiAgaWYoISBjb25mKVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgaWYoISBmcy5leGlzdHNTeW5jKGNvbmYuc291cmNlUGF0aCkpXHJcbiAgICByZXR1cm4gZmFsc2VcclxuICBpZighIF9saWJDb25maWdbY29uZi5saWJdKVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgcmV0dXJuIHRydWVcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGROb1F0UHJvKGNvbmY6IGlCdWlsZENvbmZpZykge1xyXG4gIGlmKCEgY2hlY2tCdWlsZENvbmZpZyhjb25mKSkge1xyXG4gICAgbXlUb29scy5jb25zb2xlV2l0aENvbG9yKFwiYnVpbGQgY29uZmlnIGVycm9yXCIsIFwicmVkXCIpXHJcbiAgICByZXR1cm5cclxuICB9XHJcblxyXG4gIGNvbnNvbGUubG9nKGByZXNvdXJjZXNQYXRoOiAke2NvbmYuc291cmNlUGF0aH1gKVxyXG4gIGxldCBhID0gZm9ybWF0UGF0aChjb25mLnNvdXJjZVBhdGgpXHJcbiAgX25vUXRQcm9Sc2x0ICs9IFwiXFxyXFxuU09VUkNFUyArPSBcXFxcXFxyXFxuXCJcclxuICBhZGRGaWxlUGF0aDJSc2x0KGEsIFtcIi5pbm9cIiwgXCIuY3BwXCIsIFwiLmNcIl0pXHJcbiAgX25vUXRQcm9Sc2x0ICs9IFwiXFxyXFxuSEVBREVSUyArPSBcXFxcXFxyXFxuXCJcclxuICBhZGRGaWxlUGF0aDJSc2x0KGEsIFtcIi5oXCIsIFwiLmhwcFwiXSlcclxuICBfbm9RdFByb1JzbHQgKz0gXCJcXHJcXG5JTkNMVURFUEFUSCArPSBcXFxcXFxyXFxuXCJcclxuICBhZGRJbmNsdWRlUGF0aDJSc2x0KGEpXHJcblxyXG4gIGEgPSBjb25mLmxpYi50b1VwcGVyQ2FzZSgpXHJcbiAgdHJ5IHtcclxuICAgIGlmKF9saWJDb25maWdbYV0pIHtcclxuICAgICAgY29uc29sZS5sb2coYGxvYWQgbGliIGZyb20gJHthfWApXHJcbiAgICAgIGxldCBsID0gX2xpYkNvbmZpZ1thXVxyXG4gICAgICBpZihsLmRlZmluZXMpIHtcclxuICAgICAgICBfbm9RdFByb1JzbHQgKz0gXCJcXHJcXG5ERUZJTkVTICs9IFxcXFxcXHJcXG5cIlxyXG4gICAgICAgIGwuZGVmaW5lcy5mb3JFYWNoKChpKSA9PiB7XHJcbiAgICAgICAgICBfbm9RdFByb1JzbHQgKz0gXCIgIFwiICsgaSArIFwiIFxcXFxcXHJcXG5cIlxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgICAgaWYobC5saWIpIHtcclxuICAgICAgICBfbm9RdFByb1JzbHQgKz0gXCJcXHJcXG5TT1VSQ0VTICs9IFxcXFxcXHJcXG5cIlxyXG4gICAgICAgIGFkZEZpbGVQYXRoMlJzbHQobC5saWIsIFtcIi5pbm9cIiwgXCIuY3BwXCIsIFwiLmNcIl0pXHJcbiAgICAgICAgX25vUXRQcm9Sc2x0ICs9IFwiXFxyXFxuSEVBREVSUyArPSBcXFxcXFxyXFxuXCJcclxuICAgICAgICBhZGRGaWxlUGF0aDJSc2x0KGwubGliLCBbXCIuaFwiLCBcIi5ocHBcIl0pXHJcbiAgICAgICAgX25vUXRQcm9Sc2x0ICs9IFwiXFxyXFxuSU5DTFVERVBBVEggKz0gXFxcXFxcclxcblwiXHJcbiAgICAgICAgYWRkSW5jbHVkZVBhdGgyUnNsdChsLmxpYilcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBjYXRjaCAoZSkge31cclxuXHJcbiAgZnMud3JpdGVGaWxlU3luYyhcIi4vQ3JlYXRlTm9RdFByby50eHRcIiwgX25vUXRQcm9Sc2x0KVxyXG4gIGNoaWxkX3Byb2Nlc3MuZXhlY1N5bmMoXCJub3RlcGFkIC4vQ3JlYXRlTm9RdFByby50eHRcIilcclxuICBmcy53cml0ZUZpbGVTeW5jKFwiLi9DcmVhdGVOb1F0UHJvLnR4dFwiLCBcIlwiKVxyXG59XHJcblxyXG5sZXQgaGFzX3IgPSBmYWxzZVxyXG5uZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgcGFyc2VQcm9jZXNzQXJndih7XHJcbiAgICBcImFBcmd2Q29uZmlnXCI6IFt7XHJcbiAgICAgIGFyZzogXCItclwiLFxyXG4gICAgICBhcmdjOiAwLFxyXG4gICAgICBkZXNjcmlwdGlvbjogXCJ1c2UgcmVjZW50IGJ1aWxkIGNvbmZpZ1wiLFxyXG4gICAgICBmdW5jOiAoYXJndikgPT4ge1xyXG4gICAgICAgIF9idWlsZENvbmZpZyA9IF9yZWNlbnRCdWlsZENvbmZpZ1swXVxyXG4gICAgICAgIGhhc19yID0gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XSxcclxuICAgIFwiZkNvbXBlbGV0ZVwiOiAoKSA9PiB7XHJcbiAgICAgIGlmKGhhc19yKSB7XHJcbiAgICAgICAgYnVpbGROb1F0UHJvKF9idWlsZENvbmZpZylcclxuICAgICAgICByZXNvbHZlKClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiZlVuZXhwZWN0ZWRBcmd2XCI6ICgpID0+IHtcclxuICAgICAgbXlUb29scy5jb25zb2xlV2l0aENvbG9yKGBVbmV4cGVjdGVkIGFyZ3VtZW50c2AsIFwicmVkXCIpXHJcbiAgICAgIGhhc19yID0gdHJ1ZVxyXG4gICAgICByZXNvbHZlKClcclxuICAgIH0sXHJcbiAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBub2RlIGFwcCB0byBjcmVhdGUgbm8gUVQgcHJvamVjdCBwcm9maWxlIGNvbnRlbnRcIlxyXG4gIH0pXHJcbn0pLnRoZW4oKCkgPT4ge1xyXG4gIHByb2Nlc3MuZXhpdCgpXHJcbn0pXHJcblxyXG5sZXQgc3RhdGVTdGVwID0gMFxyXG5cclxuZW51bSBlU3RhdGVNYWNoaW5lU3RlcCB7XHJcbiAgbWFpbiA9IDEsXHJcbiAgYWRkTmV3QnVpbGRDb25maWdfcmVzb3VyY2VzLFxyXG4gIGFkZE5ld0J1aWxkQ29uZmlnX2xpYixcclxuICB1c2VSZWNlbnRCdWlsZENvbmZpZyxcclxuICBkZWxSZWNlbnRCdWlsZENvbmZpZ1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdGF0ZU1hY2hpbmVUb01haW4oKSB7XHJcbiAgc3RhdGVTdGVwID0gZVN0YXRlTWFjaGluZVN0ZXAubWFpblxyXG4gIG15VG9vbHMuY29uc29sZVdpdGhDb2xvcihgXHJcbiAgMS4gQWRkIG5ldyBidWlsZCBjb25maWcgYW5kIGJ1aWxkXHJcbiAgMi4gVXNlIHJlY2VudCBidWlsZCBjb25maWdcclxuICAzLiBEZWxldGUgcmVjZW50IGJ1aWxkIGNvbmZpZ1xyXG4gIDQuIEV4aXRcclxuICBgLCBcInNreUJsdWVcIilcclxuICBteVRvb2xzLmNvbnNvbGVXaXRoQ29sb3IoYElucHV0IGlkIHRvIHNlbGVjdCBvbmUgb3BlcmF0ZTpgLCBcImdyZWVuXCIpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0YXRlTWFjaGluZU1haW4oaW5wdXQ6IHN0cmluZykge1xyXG4gIHN3aXRjaChpbnB1dCkge1xyXG4gICAgY2FzZSBcIjFcIjogeyBzdGF0ZU1hY2hpbmVUb0FkZE5ld0J1aWxkQ29uZmlnUmVzb3VyY2VzKCkgfSBicmVha1xyXG4gICAgY2FzZSBcIjJcIjogeyBzdGF0ZU1hY2hpbmVUb1VzZVJlY2VudEJ1aWxkQ29uZmlnKCkgfSBicmVha1xyXG4gICAgY2FzZSBcIjNcIjogeyBzdGF0ZU1hY2hpbmVUb0RlbFJlY2VudEJ1aWxkQ29uZmlnKCkgfSBicmVha1xyXG4gICAgY2FzZSBcIjRcIjogcHJvY2Vzcy5leGl0KCk7IGJyZWFrXHJcbiAgICBkZWZhdWx0OiBteVRvb2xzLmNvbnNvbGVXaXRoQ29sb3IoYFVuZXhwZWN0ZWQgaW5wdXRgLCBcInJlZFwiKTsgYnJlYWtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0YXRlTWFjaGluZVRvQWRkTmV3QnVpbGRDb25maWdSZXNvdXJjZXMoKSB7XHJcbiAgc3RhdGVTdGVwID0gZVN0YXRlTWFjaGluZVN0ZXAuYWRkTmV3QnVpbGRDb25maWdfcmVzb3VyY2VzXHJcbiAgbXlUb29scy5jb25zb2xlV2l0aENvbG9yKGBJbnB1dCByZXNvdXJjZXMgcGF0aCwgaW5wdXQgXFwnY1xcJyB0byBjYW5jZWw6YCwgXCJncmVlblwiKVxyXG59XHJcblxyXG5mdW5jdGlvbiBzdGF0ZU1hY2hpbmVBZGROZXdCdWlsZENvbmZpZ1Jlc291cmNlcyhpbnB1dDogc3RyaW5nKSB7XHJcbiAgaWYoaW5wdXQgPT09IFwiY1wiKSB7XHJcbiAgICBzdGF0ZU1hY2hpbmVUb01haW4oKVxyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gIGlmKGZzLmV4aXN0c1N5bmMoaW5wdXQpKSB7XHJcbiAgICBfYWRkTmV3QnVpbGRDb25maWcuc291cmNlUGF0aCA9IGlucHV0XHJcbiAgICBzdGF0ZU1hY2hpbmVUb0FkZE5ld0J1aWxkQ29uZmlnTGliKClcclxuICB9IGVsc2Uge1xyXG4gICAgbXlUb29scy5jb25zb2xlV2l0aENvbG9yKFwiaW52YWxpZCBwYXRoXCIsIFwicmVkXCIpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzdGF0ZU1hY2hpbmVUb0FkZE5ld0J1aWxkQ29uZmlnTGliKCkge1xyXG4gIHN0YXRlU3RlcCA9IGVTdGF0ZU1hY2hpbmVTdGVwLmFkZE5ld0J1aWxkQ29uZmlnX2xpYlxyXG4gIGxldCBjb3VudCA9IDFcclxuICBjb25zb2xlLmxvZyhcIlwiKVxyXG4gIGZvcihsZXQgaSBpbiBfbGliQ29uZmlnKSB7XHJcbiAgICBsZXQgZGVmaW5lcyA9IF9saWJDb25maWdbaV0uZGVmaW5lcyA/IGBbJHtfbGliQ29uZmlnW2ldLmRlZmluZXN9XWAgOiBgbnVsbGBcclxuICAgIGxldCBsaWIgPSBfbGliQ29uZmlnW2ldLmxpYiA/IGAke19saWJDb25maWdbaV0ubGlifWAgOiBgbnVsbGBcclxuICAgIG15VG9vbHMuY29uc29sZVdpdGhDb2xvcihgICAke2NvdW50fTogbmFtZTogJHtpfSwgZGVmaW5lczogJHtkZWZpbmVzfSwgbGliOiAke2xpYn1gLCBcInNreUJsdWVcIilcclxuICAgIGNvdW50ICsrXHJcbiAgfVxyXG4gIG15VG9vbHMuY29uc29sZVdpdGhDb2xvcihgSW5wdXQgaWQgdG8gc2VsZWN0IG9uZSBsaWIsIGlucHV0IFxcJ2NcXCcgdG8gY2FuY2VsYCwgXCJncmVlblwiKVxyXG59XHJcblxyXG5mdW5jdGlvbiBzdGF0ZU1hY2hpbmVBZGROZXdCdWlsZENvbmZpZ0xpYihpbnB1dDogc3RyaW5nKSB7XHJcbiAgaWYoaW5wdXQgPT09IFwiY1wiKSB7XHJcbiAgICBzdGF0ZU1hY2hpbmVUb01haW4oKVxyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gIGlmKCEgL15bMC05XSQvLnRlc3QoaW5wdXQpKSB7XHJcbiAgICBteVRvb2xzLmNvbnNvbGVXaXRoQ29sb3IoXCJVbmV4cGVjdGVkIGlucHV0XCIsIFwicmVkXCIpXHJcbiAgICByZXR1cm5cclxuICB9XHJcbiAgbGV0IGlkID0gcGFyc2VJbnQoaW5wdXQpXHJcbiAgbGV0IGNvdW50ID0gMVxyXG4gIGZvcihsZXQgaSBpbiBfbGliQ29uZmlnKSB7XHJcbiAgICBpZihpZCA9PT0gY291bnQpIHtcclxuICAgICAgX2FkZE5ld0J1aWxkQ29uZmlnLmxpYiA9IGlcclxuICAgICAgYnVpbGROb1F0UHJvKF9hZGROZXdCdWlsZENvbmZpZylcclxuICAgICAgY29uc29sZS5sb2coX3JlY2VudEJ1aWxkQ29uZmlnKVxyXG4gICAgICBfcmVjZW50QnVpbGRDb25maWcuc3BsaWNlKDAsIDAsIF9hZGROZXdCdWlsZENvbmZpZylcclxuICAgICAgY29uc29sZS5sb2coX3JlY2VudEJ1aWxkQ29uZmlnKVxyXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKFwiLi9yZWNlbnRCdWlsZENvbmZpZy5qc29uXCIsIEpTT04uc3RyaW5naWZ5KF9yZWNlbnRCdWlsZENvbmZpZykpXHJcbiAgICAgIHN0YXRlTWFjaGluZVRvTWFpbigpXHJcbiAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICBjb3VudCArK1xyXG4gIH1cclxuICBpZihpZCAhPT0gY291bnQpIHtcclxuICAgIG15VG9vbHMuY29uc29sZVdpdGhDb2xvcihgSUQgZXJyb3JgLCBcInJlZFwiKVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3RhdGVNYWNoaW5lVG9BZGRMaWJEZWZpbmVzKCkge1xyXG4gIHN0YXRlU3RlcCA9IGVTdGF0ZU1hY2hpbmVTdGVwLmFkZE5ld0xpYl9kZWZpbmVzXHJcbiAgbXlUb29scy5jb25zb2xlV2l0aENvbG9yKGBJbnB1dCBkZWZpbmVzLCB1c2UgXFwnLFxcJyBpbmRlcGVuZGVudCBpdGVtcywgaW5wdXQgXFwnY1xcJyB0byBjYW5jZWw6YCwgXCJncmVlblwiKVxyXG59XHJcblxyXG5mdW5jdGlvbiBzdGF0ZU1hY2hpbmVUb1VzZVJlY2VudEJ1aWxkQ29uZmlnKCkge1xyXG4gIHN0YXRlU3RlcCA9IGVTdGF0ZU1hY2hpbmVTdGVwLnVzZVJlY2VudEJ1aWxkQ29uZmlnXHJcbiAgbGV0IGNvdW50ID0gMVxyXG4gIGNvbnNvbGUubG9nKFwiXCIpXHJcbiAgX3JlY2VudEJ1aWxkQ29uZmlnLmZvckVhY2goKGkpID0+IHtcclxuICAgIGxldCByZXNvdXJjZXMgPSBpLnNvdXJjZVBhdGhcclxuICAgIGxldCBsaWIgPSBpLmxpYlxyXG4gICAgbXlUb29scy5jb25zb2xlV2l0aENvbG9yKGAgICR7Y291bnR9OiByZXNvdXJjZXM6ICR7cmVzb3VyY2VzfSwgbGliOiAke2xpYn1gLCBcInNreUJsdWVcIilcclxuICAgIGNvdW50ICsrXHJcbiAgfSlcclxuICBteVRvb2xzLmNvbnNvbGVXaXRoQ29sb3IoYElucHV0IGlkIHRvIHNlbGVjdCBvbmUgbGliLCBpbnB1dCBcXCdjXFwnIHRvIGNhbmNlbGAsIFwiZ3JlZW5cIilcclxufVxyXG5cclxuZnVuY3Rpb24gc3RhdGVNYWNoaW5lVXNlUmVjZW50QnVpbGRDb25maWcoaW5wdXQ6IHN0cmluZykge1xyXG4gIGlmKGlucHV0ID09PSBcImNcIikge1xyXG4gICAgc3RhdGVNYWNoaW5lVG9NYWluKClcclxuICAgIHJldHVyblxyXG4gIH1cclxuICBpZighIC9eWzAtOV0kLy50ZXN0KGlucHV0KSkge1xyXG4gICAgbXlUb29scy5jb25zb2xlV2l0aENvbG9yKFwiVW5leHBlY3RlZCBpbnB1dFwiLCBcInJlZFwiKVxyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gIGxldCBpZCA9IHBhcnNlSW50KGlucHV0KVxyXG4gIGxldCBjb3VudCA9IDFcclxuICBpZihfcmVjZW50QnVpbGRDb25maWcuc29tZSgoaSkgPT4ge1xyXG4gICAgaWYoY291bnQgPT09IGlkKVxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgY291bnQgKytcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH0pKSB7XHJcbiAgICBfcmVjZW50QnVpbGRDb25maWcuc3BsaWNlKDAsIDAsIF9yZWNlbnRCdWlsZENvbmZpZ1tpZCAtIDFdKVxyXG4gICAgX3JlY2VudEJ1aWxkQ29uZmlnLnNwbGljZShpZCwgMSlcclxuICAgIGZzLndyaXRlRmlsZVN5bmMoXCIuL3JlY2VudEJ1aWxkQ29uZmlnLmpzb25cIiwgSlNPTi5zdHJpbmdpZnkoX3JlY2VudEJ1aWxkQ29uZmlnKSlcclxuICAgIGJ1aWxkTm9RdFBybyhfcmVjZW50QnVpbGRDb25maWdbMF0pXHJcbiAgICBzdGF0ZU1hY2hpbmVUb01haW4oKVxyXG4gIH0gZWxzZSB7XHJcbiAgICBteVRvb2xzLmNvbnNvbGVXaXRoQ29sb3IoYElEIGVycm9yYCwgXCJyZWRcIilcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0YXRlTWFjaGluZVRvRGVsUmVjZW50QnVpbGRDb25maWcoKSB7XHJcbiAgc3RhdGVTdGVwID0gZVN0YXRlTWFjaGluZVN0ZXAuZGVsUmVjZW50QnVpbGRDb25maWdcclxuICBsZXQgY291bnQgPSAxXHJcbiAgY29uc29sZS5sb2coXCJcIilcclxuICBfcmVjZW50QnVpbGRDb25maWcuZm9yRWFjaCgoaSkgPT4ge1xyXG4gICAgbGV0IHJlc291cmNlcyA9IGkuc291cmNlUGF0aFxyXG4gICAgbGV0IGxpYiA9IGkubGliXHJcbiAgICBteVRvb2xzLmNvbnNvbGVXaXRoQ29sb3IoYCAgJHtjb3VudH06IHJlc291cmNlczogJHtyZXNvdXJjZXN9LCBsaWI6ICR7bGlifWAsIFwic2t5Qmx1ZVwiKVxyXG4gICAgY291bnQgKytcclxuICB9KVxyXG4gIG15VG9vbHMuY29uc29sZVdpdGhDb2xvcihgSW5wdXQgaWQgdG8gc2VsZWN0IG9uZSBsaWIsIGlucHV0IFxcJ2NcXCcgdG8gY2FuY2VsYCwgXCJncmVlblwiKVxyXG59XHJcblxyXG5mdW5jdGlvbiBzdGF0ZU1hY2hpbmVEZWxSZWNlbnRCdWlsZENvbmZpZyhpbnB1dDogc3RyaW5nKSB7XHJcbiAgaWYoaW5wdXQgPT09IFwiY1wiKSB7XHJcbiAgICBzdGF0ZU1hY2hpbmVUb01haW4oKVxyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gIGlmKCEgL15bMC05XSQvLnRlc3QoaW5wdXQpKSB7XHJcbiAgICBteVRvb2xzLmNvbnNvbGVXaXRoQ29sb3IoXCJVbmV4cGVjdGVkIGlucHV0XCIsIFwicmVkXCIpXHJcbiAgICByZXR1cm5cclxuICB9XHJcbiAgbGV0IGlkID0gcGFyc2VJbnQoaW5wdXQpXHJcbiAgbGV0IGNvdW50ID0gMVxyXG4gIGlmKF9yZWNlbnRCdWlsZENvbmZpZy5zb21lKChpKSA9PiB7XHJcbiAgICBpZihjb3VudCA9PT0gaWQpXHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICBjb3VudCArK1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSkpIHtcclxuICAgIF9yZWNlbnRCdWlsZENvbmZpZy5zcGxpY2UoaWQgLSAxLCAxKVxyXG4gICAgZnMud3JpdGVGaWxlU3luYyhcIi4vcmVjZW50QnVpbGRDb25maWcuanNvblwiLCBKU09OLnN0cmluZ2lmeShfcmVjZW50QnVpbGRDb25maWcpKVxyXG4gICAgc3RhdGVNYWNoaW5lVG9NYWluKClcclxuICB9IGVsc2Uge1xyXG4gICAgbXlUb29scy5jb25zb2xlV2l0aENvbG9yKGBVbmV4cGVjdGVkIGlucHV0YCwgXCJyZWRcIilcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0YXRlTWFjaGluZShpbnB1dDogc3RyaW5nKSB7XHJcbiAgaWYoISBzdGF0ZVN0ZXApIHtcclxuICAgIHN0YXRlTWFjaGluZVRvTWFpbigpXHJcbiAgICByZXR1cm5cclxuICB9XHJcbiAgc3dpdGNoKHN0YXRlU3RlcCkge1xyXG4gICAgY2FzZSBlU3RhdGVNYWNoaW5lU3RlcC5tYWluOiB7XHJcbiAgICAgIHN0YXRlTWFjaGluZU1haW4oaW5wdXQpXHJcbiAgICB9IGJyZWFrXHJcbiAgICBjYXNlIGVTdGF0ZU1hY2hpbmVTdGVwLmFkZE5ld0J1aWxkQ29uZmlnX3Jlc291cmNlczoge1xyXG4gICAgICBzdGF0ZU1hY2hpbmVBZGROZXdCdWlsZENvbmZpZ1Jlc291cmNlcyhpbnB1dClcclxuICAgIH0gYnJlYWtcclxuICAgIGNhc2UgZVN0YXRlTWFjaGluZVN0ZXAuYWRkTmV3QnVpbGRDb25maWdfbGliOiB7XHJcbiAgICAgIHN0YXRlTWFjaGluZUFkZE5ld0J1aWxkQ29uZmlnTGliKGlucHV0KVxyXG4gICAgfSBicmVha1xyXG4gICAgY2FzZSBlU3RhdGVNYWNoaW5lU3RlcC5kZWxSZWNlbnRCdWlsZENvbmZpZzoge1xyXG4gICAgICBzdGF0ZU1hY2hpbmVEZWxSZWNlbnRCdWlsZENvbmZpZyhpbnB1dClcclxuICAgIH0gYnJlYWtcclxuICAgIGNhc2UgZVN0YXRlTWFjaGluZVN0ZXAudXNlUmVjZW50QnVpbGRDb25maWc6IHtcclxuICAgICAgc3RhdGVNYWNoaW5lVXNlUmVjZW50QnVpbGRDb25maWcoaW5wdXQpXHJcbiAgICB9IGJyZWFrXHJcbiAgfVxyXG59XHJcblxyXG5zZXRQcm9jZXNzSW5wdXRDYWxsQmFjayhzdGF0ZU1hY2hpbmUpXHJcbmlmKCEgaGFzX3IpXHJcbiAgc3RhdGVNYWNoaW5lKFwiXCIpXHJcblxyXG4vLyBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbi8vICAgcGFyc2VQcm9jZXNzQXJndih7XHJcbi8vICAgICBhQXJndkNvbmZpZzogW3tcclxuLy8gICAgICAgYXJnOiBcIi1yXCIsXHJcbi8vICAgICAgIGFyZ2M6IDEsXHJcbi8vICAgICAgIGRlc2NyaXB0aW9uOiBcInNldCByZXNvdXJjZSBwYXRoXCIsXHJcbi8vICAgICAgIGZ1bmM6IChhcmd2KSA9PiB7XHJcbi8vICAgICAgICAgbGV0IGEgPSBhcmd2WzBdXHJcbi8vICAgICAgICAgYSA9IGZvcm1hdFBhdGgoYSlcclxuLy8gICAgICAgICBfcnNsdCArPSBcIlxcclxcblNPVVJDRVMgKz0gXFxcXFxcclxcblwiXHJcbi8vICAgICAgICAgYWRkRmlsZVBhdGgyUnNsdChhLCBbXCIuaW5vXCIsIFwiLmNwcFwiLCBcIi5jXCJdKVxyXG4vLyAgICAgICAgIF9yc2x0ICs9IFwiXFxyXFxuSEVBREVSUyArPSBcXFxcXFxyXFxuXCJcclxuLy8gICAgICAgICBhZGRGaWxlUGF0aDJSc2x0KGEsIFtcIi5oXCIsIFwiLmhwcFwiXSlcclxuLy8gICAgICAgICBfcnNsdCArPSBcIlxcclxcbklOQ0xVREVQQVRIICs9IFxcXFxcXHJcXG5cIlxyXG4vLyAgICAgICAgIGFkZEluY2x1ZGVQYXRoMlJzbHQoYSlcclxuLy8gICAgICAgfVxyXG4vLyAgICAgfSwge1xyXG4vLyAgICAgICBhcmc6IFwiLWxmXCIsXHJcbi8vICAgICAgIGFyZ2M6IDEsXHJcbi8vICAgICAgIGRlc2NyaXB0aW9uOiBcImxvYWQgbGliIGZyb20gbGliQ29uZmlnLmpzb25cIixcclxuLy8gICAgICAgZnVuYzogKGFyZ3YpID0+IHtcclxuLy8gICAgICAgICBsZXQgYSA9IGFyZ3ZbMF1cclxuLy8gICAgICAgICBhID0gYS50b1VwcGVyQ2FzZSgpXHJcbi8vICAgICAgICAgaWYoX2xpYkNvbmZpZ1thXSkge1xyXG4vLyAgICAgICAgICAgY29uc29sZS5sb2coYGxvYWQgbGliIGZyb20gJHthfWApXHJcbi8vICAgICAgICAgICBsZXQgbCA9IF9saWJDb25maWdbYV1cclxuLy8gICAgICAgICAgIGlmKGwuZGVmaW5lcykge1xyXG4vLyAgICAgICAgICAgICBfcnNsdCArPSBcIlxcclxcbkRFRklORVMgKz0gXFxcXFxcclxcblwiXHJcbi8vICAgICAgICAgICAgIGwuZGVmaW5lcy5mb3JFYWNoKChpKSA9PiB7XHJcbi8vICAgICAgICAgICAgICAgX3JzbHQgKz0gXCIgIFwiICsgaSArIFwiIFxcXFxcXHJcXG5cIlxyXG4vLyAgICAgICAgICAgICB9KVxyXG4vLyAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgaWYobC5saWIpIHtcclxuLy8gICAgICAgICAgICAgX3JzbHQgKz0gXCJcXHJcXG5TT1VSQ0VTICs9IFxcXFxcXHJcXG5cIlxyXG4vLyAgICAgICAgICAgICBhZGRGaWxlUGF0aDJSc2x0KGwubGliLCBbXCIuaW5vXCIsIFwiLmNwcFwiLCBcIi5jXCJdKVxyXG4vLyAgICAgICAgICAgICBfcnNsdCArPSBcIlxcclxcbkhFQURFUlMgKz0gXFxcXFxcclxcblwiXHJcbi8vICAgICAgICAgICAgIGFkZEZpbGVQYXRoMlJzbHQobC5saWIsIFtcIi5oXCIsIFwiLmhwcFwiXSlcclxuLy8gICAgICAgICAgICAgX3JzbHQgKz0gXCJcXHJcXG5JTkNMVURFUEFUSCArPSBcXFxcXFxyXFxuXCJcclxuLy8gICAgICAgICAgICAgYWRkSW5jbHVkZVBhdGgyUnNsdChsLmxpYilcclxuLy8gICAgICAgICAgIH1cclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgIH1cclxuLy8gICAgIH1dLFxyXG5cclxuLy8gICAgIGZDb21wZWxldGU6ICgpID0+IHtcclxuLy8gICAgICAgZnMud3JpdGVGaWxlU3luYyhcIi4vQ3JlYXRlTm9RdFByby50eHRcIiwgX3JzbHQpXHJcbi8vICAgICAgIGNoaWxkX3Byb2Nlc3MuZXhlY1N5bmMoXCJub3RlcGFkIC4vQ3JlYXRlTm9RdFByby50eHRcIilcclxuLy8gICAgICAgZnMud3JpdGVGaWxlU3luYyhcIi4vQ3JlYXRlTm9RdFByby50eHRcIiwgXCJcIilcclxuLy8gICAgICAgcmVzb2x2ZSgpXHJcbi8vICAgICB9LFxyXG5cclxuLy8gICAgIGRlc2NyaXB0aW9uOiBcImEgbm9kZSBhcHAgdG8gY3JlYXRlIG5vIFFUIHByb2plY3QgcHJvZmlsZSBjb250ZW50LCBtdXN0IHVzZSBhYnNvbHV0ZSBwYXRoXCIsXHJcbi8vICAgICBmVW5leHBlY3RlZEFyZ3Y6ICgpID0+IHtcclxuLy8gICAgICAgY29uc29sZS5sb2coYFVuZXhwZWN0ZWQgYXJndW1lbnRzYClcclxuLy8gICAgICAgcmVzb2x2ZSgpXHJcbi8vICAgICB9XHJcbi8vICAgfSlcclxuLy8gfSkudGhlbigoKSA9PiB7XHJcbi8vICAgcHJvY2Vzcy5leGl0KClcclxuLy8gfSlcclxuIl19