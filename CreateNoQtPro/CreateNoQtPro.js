"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ParseProcessArgv_1 = require("../ParseProcessArgv/ParseProcessArgv");
var childProcess = require("child_process");
var fs = require("fs");
var _libConfig = require("./libConfig.json");
var _rslt = "";
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
                    _rslt += "  " + filePath + "\\" + i + " \\\r\n";
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
                    if (_rslt.indexOf("  " + includePath + " \\\r\n") === -1)
                        _rslt += "  " + includePath + " \\\r\n";
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
new Promise(function (resolve, reject) {
    ParseProcessArgv_1.parseProcessArgv({
        aArgvConfig: [{
                arg: "-r",
                argc: 1,
                description: "set resource path",
                func: function (argv) {
                    var a = argv[0];
                    a = formatPath(a);
                    _rslt += "\r\nSOURCES += \\\r\n";
                    addFilePath2Rslt(a, [".ino", ".cpp", ".c"]);
                    _rslt += "\r\nHEADERS += \\\r\n";
                    addFilePath2Rslt(a, [".h", ".hpp"]);
                    _rslt += "\r\nINCLUDEPATH += \\\r\n";
                    addIncludePath2Rslt(a);
                }
            }, {
                arg: "-lf",
                argc: 1,
                description: "load lib from libConfig.json",
                func: function (argv) {
                    var a = argv[0];
                    a = a.toUpperCase();
                    if (_libConfig[a]) {
                        console.log("load lib from " + a);
                        var l = _libConfig[a];
                        if (l.defines) {
                            _rslt += "\r\nDEFINES += \\\r\n";
                            l.defines.forEach(function (i) {
                                _rslt += "  " + i + " \\\r\n";
                            });
                        }
                        if (l.lib) {
                            _rslt += "\r\nSOURCES += \\\r\n";
                            addFilePath2Rslt(l.lib, [".ino", ".cpp", ".c"]);
                            _rslt += "\r\nHEADERS += \\\r\n";
                            addFilePath2Rslt(l.lib, [".h", ".hpp"]);
                            _rslt += "\r\nINCLUDEPATH += \\\r\n";
                            addIncludePath2Rslt(l.lib);
                        }
                    }
                }
            }],
        fCompelete: function () {
            fs.writeFileSync("./CreateNoQtPro.txt", _rslt);
            childProcess.execSync("notepad ./CreateNoQtPro.txt");
            resolve();
        },
        description: "a node app to create no QT project profile content, must use absolute path",
        fUnexpectedArgv: function () {
            console.log("Unexpected arguments");
            resolve();
        }
    });
}).then(function () {
    process.exit();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3JlYXRlTm9RdFByby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNyZWF0ZU5vUXRQcm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5RUFFNkM7QUFFN0MsNENBQTZDO0FBQzdDLHVCQUF3QjtBQVd4QixJQUFJLFVBQVUsR0FBZ0IsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUE7QUFDekQsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFBO0FBRWQsU0FBUyxnQkFBZ0IsQ0FBQyxRQUFnQixFQUFFLE1BQXFCO0lBQy9ELElBQUcsQ0FBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztRQUMxQixPQUFNO0lBQ1IsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUNwQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBQztRQUNkLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUMzQyxJQUFHLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbkIsZ0JBQWdCLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUE7YUFDMUM7WUFDSCxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO2dCQUNaLElBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDaEIsS0FBSyxJQUFJLElBQUksR0FBRyxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUE7b0JBQy9DLE9BQU8sSUFBSSxDQUFBO2lCQUNaO2dCQUNELE9BQU8sS0FBSyxDQUFBO1lBQ2QsQ0FBQyxDQUFDLENBQUE7U0FDSDtJQUNILENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELFNBQVMsbUJBQW1CLENBQUMsV0FBbUI7SUFDOUMsSUFBRyxDQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDO1FBQzdCLE9BQU07SUFDUixJQUFJLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUMzQixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQ3ZDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDO1FBQ2QsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQzlDLElBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNuQixtQkFBbUIsQ0FBQyxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFBO2FBQ3hDO1lBQ0gsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtZQUNuQixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUcsRUFBRTtnQkFDdEMsSUFBRyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUN4QixJQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLFdBQVcsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ3JELEtBQUssSUFBSSxJQUFJLEdBQUcsV0FBVyxHQUFHLFNBQVMsQ0FBQTtvQkFDekMsTUFBSztpQkFDTjthQUNGO1NBQ0Y7SUFDSCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxRQUFnQjtJQUNsQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzVCLElBQUksT0FBTyxHQUFrQixFQUFFLENBQUE7SUFDL0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUM7UUFDVixJQUFHLENBQUM7WUFDRixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25CLENBQUMsQ0FBQyxDQUFBO0lBQ0YsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzNCLENBQUM7QUFFRCxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO0lBQzFCLG1DQUFnQixDQUFDO1FBQ2YsV0FBVyxFQUFFLENBQUM7Z0JBQ1osR0FBRyxFQUFFLElBQUk7Z0JBQ1QsSUFBSSxFQUFFLENBQUM7Z0JBQ1AsV0FBVyxFQUFFLG1CQUFtQjtnQkFDaEMsSUFBSSxFQUFFLFVBQUMsSUFBSTtvQkFDVCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7b0JBQ2YsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDakIsS0FBSyxJQUFJLHVCQUF1QixDQUFBO29CQUNoQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUE7b0JBQzNDLEtBQUssSUFBSSx1QkFBdUIsQ0FBQTtvQkFDaEMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUE7b0JBQ25DLEtBQUssSUFBSSwyQkFBMkIsQ0FBQTtvQkFDcEMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQ3hCLENBQUM7YUFDRixFQUFFO2dCQUNELEdBQUcsRUFBRSxLQUFLO2dCQUNWLElBQUksRUFBRSxDQUFDO2dCQUNQLFdBQVcsRUFBRSw4QkFBOEI7Z0JBQzNDLElBQUksRUFBRSxVQUFDLElBQUk7b0JBQ1QsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUNmLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7b0JBQ25CLElBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFpQixDQUFHLENBQUMsQ0FBQTt3QkFDakMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFBO3dCQUNyQixJQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUU7NEJBQ1osS0FBSyxJQUFJLHVCQUF1QixDQUFBOzRCQUNoQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUM7Z0NBQ2xCLEtBQUssSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQTs0QkFDL0IsQ0FBQyxDQUFDLENBQUE7eUJBQ0g7d0JBQ0QsSUFBRyxDQUFDLENBQUMsR0FBRyxFQUFFOzRCQUNSLEtBQUssSUFBSSx1QkFBdUIsQ0FBQTs0QkFDaEMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQTs0QkFDL0MsS0FBSyxJQUFJLHVCQUF1QixDQUFBOzRCQUNoQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUE7NEJBQ3ZDLEtBQUssSUFBSSwyQkFBMkIsQ0FBQTs0QkFDcEMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO3lCQUMzQjtxQkFDRjtnQkFDSCxDQUFDO2FBQ0YsQ0FBQztRQUVGLFVBQVUsRUFBRTtZQUNWLEVBQUUsQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDOUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO1lBQ3BELE9BQU8sRUFBRSxDQUFBO1FBQ1gsQ0FBQztRQUVELFdBQVcsRUFBRSw0RUFBNEU7UUFDekYsZUFBZSxFQUFFO1lBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO1lBQ25DLE9BQU8sRUFBRSxDQUFBO1FBQ1gsQ0FBQztLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNOLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUNoQixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgcGFyc2VQcm9jZXNzQXJndlxyXG59IGZyb20gXCIuLi9QYXJzZVByb2Nlc3NBcmd2L1BhcnNlUHJvY2Vzc0FyZ3ZcIlxyXG5cclxuaW1wb3J0ICogYXMgY2hpbGRQcm9jZXNzIGZyb20gXCJjaGlsZF9wcm9jZXNzXCJcclxuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCJcclxuXHJcbmludGVyZmFjZSBpTGliQ2hpbGQge1xyXG4gIGRlZmluZXM/OiBBcnJheTxzdHJpbmc+LFxyXG4gIGxpYj86IHN0cmluZ1xyXG59XHJcblxyXG5pbnRlcmZhY2UgaUxpYkNvbmZpZyB7XHJcbiAgW2tleTogc3RyaW5nXTogaUxpYkNoaWxkXHJcbn1cclxuXHJcbmxldCBfbGliQ29uZmlnID0gPGlMaWJDb25maWc+IHJlcXVpcmUoXCIuL2xpYkNvbmZpZy5qc29uXCIpXHJcbmxldCBfcnNsdCA9IFwiXCJcclxuXHJcbmZ1bmN0aW9uIGFkZEZpbGVQYXRoMlJzbHQoZmlsZVBhdGg6IHN0cmluZywgc3VmZml4OiBBcnJheTxzdHJpbmc+KSB7XHJcbiAgaWYoISBmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSlcclxuICAgIHJldHVyblxyXG4gIGxldCBmaWxlcyA9IGZzLnJlYWRkaXJTeW5jKGZpbGVQYXRoKVxyXG4gIGZpbGVzLmZvckVhY2goKGkpID0+IHtcclxuICAgIGxldCBzdGF0ID0gZnMuc3RhdFN5bmMoZmlsZVBhdGggKyBcIlxcXFxcIiArIGkpXHJcbiAgICBpZihzdGF0LmlzRGlyZWN0b3J5KCkpXHJcbiAgICAgIGFkZEZpbGVQYXRoMlJzbHQoZmlsZVBhdGggKyBcIlxcXFxcIiArIGksIHN1ZmZpeClcclxuICAgIGVsc2Uge1xyXG4gICAgICBpID0gaS50b0xvd2VyQ2FzZSgpXHJcbiAgICAgIHN1ZmZpeC5zb21lKChqKSA9PiB7XHJcbiAgICAgICAgaWYoaS5lbmRzV2l0aChqKSkge1xyXG4gICAgICAgICAgX3JzbHQgKz0gXCIgIFwiICsgZmlsZVBhdGggKyBcIlxcXFxcIiArIGkgKyBcIiBcXFxcXFxyXFxuXCJcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEluY2x1ZGVQYXRoMlJzbHQoaW5jbHVkZVBhdGg6IHN0cmluZykge1xyXG4gIGlmKCEgZnMuZXhpc3RzU3luYyhpbmNsdWRlUGF0aCkpXHJcbiAgICByZXR1cm5cclxuICBsZXQgc3VmZml4ID0gW1wiLmhcIiwgXCIuaHBwXCJdXHJcbiAgbGV0IGZpbGVzID0gZnMucmVhZGRpclN5bmMoaW5jbHVkZVBhdGgpXHJcbiAgZmlsZXMuZm9yRWFjaCgoaSkgPT4ge1xyXG4gICAgbGV0IHN0YXQgPSBmcy5zdGF0U3luYyhpbmNsdWRlUGF0aCArIFwiXFxcXFwiICsgaSlcclxuICAgIGlmKHN0YXQuaXNEaXJlY3RvcnkoKSlcclxuICAgICAgYWRkSW5jbHVkZVBhdGgyUnNsdChpbmNsdWRlUGF0aCArIFwiXFxcXFwiICsgaSlcclxuICAgIGVsc2Uge1xyXG4gICAgICBpID0gaS50b0xvd2VyQ2FzZSgpXHJcbiAgICAgIGZvcihsZXQgaiA9IDA7IGogPCBzdWZmaXgubGVuZ3RoOyBqICsrKSB7XHJcbiAgICAgICAgaWYoaS5lbmRzV2l0aChzdWZmaXhbal0pKSB7XHJcbiAgICAgICAgICBpZihfcnNsdC5pbmRleE9mKFwiICBcIiArIGluY2x1ZGVQYXRoICsgXCIgXFxcXFxcclxcblwiKSA9PT0gLTEpXHJcbiAgICAgICAgICAgIF9yc2x0ICs9IFwiICBcIiArIGluY2x1ZGVQYXRoICsgXCIgXFxcXFxcclxcblwiXHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdFBhdGgoZmlsZVBhdGg6IHN0cmluZykge1xyXG4gIGxldCBhID0gZmlsZVBhdGguc3BsaXQoXCJcXFxcXCIpXHJcbiAgbGV0IG5ld1BhdGg6IEFycmF5PHN0cmluZz4gPSBbXVxyXG4gIGEuZm9yRWFjaCgoaSkgPT4ge1xyXG4gICAgaWYoaSlcclxuICAgICAgbmV3UGF0aC5wdXNoKGkpXHJcbiAgfSlcclxuICByZXR1cm4gbmV3UGF0aC5qb2luKFwiXFxcXFwiKVxyXG59XHJcblxyXG5uZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgcGFyc2VQcm9jZXNzQXJndih7XHJcbiAgICBhQXJndkNvbmZpZzogW3tcclxuICAgICAgYXJnOiBcIi1yXCIsXHJcbiAgICAgIGFyZ2M6IDEsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiBcInNldCByZXNvdXJjZSBwYXRoXCIsXHJcbiAgICAgIGZ1bmM6IChhcmd2KSA9PiB7XHJcbiAgICAgICAgbGV0IGEgPSBhcmd2WzBdXHJcbiAgICAgICAgYSA9IGZvcm1hdFBhdGgoYSlcclxuICAgICAgICBfcnNsdCArPSBcIlxcclxcblNPVVJDRVMgKz0gXFxcXFxcclxcblwiXHJcbiAgICAgICAgYWRkRmlsZVBhdGgyUnNsdChhLCBbXCIuaW5vXCIsIFwiLmNwcFwiLCBcIi5jXCJdKVxyXG4gICAgICAgIF9yc2x0ICs9IFwiXFxyXFxuSEVBREVSUyArPSBcXFxcXFxyXFxuXCJcclxuICAgICAgICBhZGRGaWxlUGF0aDJSc2x0KGEsIFtcIi5oXCIsIFwiLmhwcFwiXSlcclxuICAgICAgICBfcnNsdCArPSBcIlxcclxcbklOQ0xVREVQQVRIICs9IFxcXFxcXHJcXG5cIlxyXG4gICAgICAgIGFkZEluY2x1ZGVQYXRoMlJzbHQoYSlcclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBhcmc6IFwiLWxmXCIsXHJcbiAgICAgIGFyZ2M6IDEsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiBcImxvYWQgbGliIGZyb20gbGliQ29uZmlnLmpzb25cIixcclxuICAgICAgZnVuYzogKGFyZ3YpID0+IHtcclxuICAgICAgICBsZXQgYSA9IGFyZ3ZbMF1cclxuICAgICAgICBhID0gYS50b1VwcGVyQ2FzZSgpXHJcbiAgICAgICAgaWYoX2xpYkNvbmZpZ1thXSkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coYGxvYWQgbGliIGZyb20gJHthfWApXHJcbiAgICAgICAgICBsZXQgbCA9IF9saWJDb25maWdbYV1cclxuICAgICAgICAgIGlmKGwuZGVmaW5lcykge1xyXG4gICAgICAgICAgICBfcnNsdCArPSBcIlxcclxcbkRFRklORVMgKz0gXFxcXFxcclxcblwiXHJcbiAgICAgICAgICAgIGwuZGVmaW5lcy5mb3JFYWNoKChpKSA9PiB7XHJcbiAgICAgICAgICAgICAgX3JzbHQgKz0gXCIgIFwiICsgaSArIFwiIFxcXFxcXHJcXG5cIlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYobC5saWIpIHtcclxuICAgICAgICAgICAgX3JzbHQgKz0gXCJcXHJcXG5TT1VSQ0VTICs9IFxcXFxcXHJcXG5cIlxyXG4gICAgICAgICAgICBhZGRGaWxlUGF0aDJSc2x0KGwubGliLCBbXCIuaW5vXCIsIFwiLmNwcFwiLCBcIi5jXCJdKVxyXG4gICAgICAgICAgICBfcnNsdCArPSBcIlxcclxcbkhFQURFUlMgKz0gXFxcXFxcclxcblwiXHJcbiAgICAgICAgICAgIGFkZEZpbGVQYXRoMlJzbHQobC5saWIsIFtcIi5oXCIsIFwiLmhwcFwiXSlcclxuICAgICAgICAgICAgX3JzbHQgKz0gXCJcXHJcXG5JTkNMVURFUEFUSCArPSBcXFxcXFxyXFxuXCJcclxuICAgICAgICAgICAgYWRkSW5jbHVkZVBhdGgyUnNsdChsLmxpYilcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1dLFxyXG5cclxuICAgIGZDb21wZWxldGU6ICgpID0+IHtcclxuICAgICAgZnMud3JpdGVGaWxlU3luYyhcIi4vQ3JlYXRlTm9RdFByby50eHRcIiwgX3JzbHQpXHJcbiAgICAgIGNoaWxkUHJvY2Vzcy5leGVjU3luYyhcIm5vdGVwYWQgLi9DcmVhdGVOb1F0UHJvLnR4dFwiKVxyXG4gICAgICByZXNvbHZlKClcclxuICAgIH0sXHJcblxyXG4gICAgZGVzY3JpcHRpb246IFwiYSBub2RlIGFwcCB0byBjcmVhdGUgbm8gUVQgcHJvamVjdCBwcm9maWxlIGNvbnRlbnQsIG11c3QgdXNlIGFic29sdXRlIHBhdGhcIixcclxuICAgIGZVbmV4cGVjdGVkQXJndjogKCkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhgVW5leHBlY3RlZCBhcmd1bWVudHNgKVxyXG4gICAgICByZXNvbHZlKClcclxuICAgIH1cclxuICB9KVxyXG59KS50aGVuKCgpID0+IHtcclxuICBwcm9jZXNzLmV4aXQoKVxyXG59KVxyXG4iXX0=