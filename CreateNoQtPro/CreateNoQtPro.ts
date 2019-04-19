import {
  myTools
} from "../myTools/myTools"

import {
  parseProcessArgv
} from "../ParseProcessArgv/ParseProcessArgv"

import {
  setProcessInputCallBack
} from "../ParseProcessInput/ParseProcessInput"

import * as child_process from "child_process"
import * as fs from "fs"

interface iLibChild {
  defines?: Array<string>,
  lib?: string
}

interface iLibConfig {
  [key: string]: iLibChild
}

interface iBuildConfig {
  sourcePath: string,
  lib: string
}

let _buildConfig: iBuildConfig = {
  "lib": "",
  "sourcePath": ""
}
let _addNewBuildConfig: iBuildConfig = {
  "lib": "",
  "sourcePath": ""
}
let _recentBuildConfig: Array<iBuildConfig> = []
let _libConfig: iLibConfig = {}

try {
  _recentBuildConfig = require("./recentBuildConfig.json")
  _libConfig = <iLibConfig> require("./libConfig.json")
}
catch (e) {
  fs.writeFileSync("./recentBuildConfig.json", "[]")
  fs.writeFileSync("./libConfig.json", "{}")
}

let _noQtProRslt = ""

function addFilePath2Rslt(filePath: string, suffix: Array<string>) {
  if(! fs.existsSync(filePath))
    return
  let files = fs.readdirSync(filePath)
  files.forEach((i) => {
    let stat = fs.statSync(filePath + "\\" + i)
    if(stat.isDirectory())
      addFilePath2Rslt(filePath + "\\" + i, suffix)
    else {
      i = i.toLowerCase()
      suffix.some((j) => {
        if(i.endsWith(j)) {
          _noQtProRslt += "  " + filePath + "\\" + i + " \\\r\n"
          return true
        }
        return false
      })
    }
  })
}

function addIncludePath2Rslt(includePath: string) {
  if(! fs.existsSync(includePath))
    return
  let suffix = [".h", ".hpp"]
  let files = fs.readdirSync(includePath)
  files.forEach((i) => {
    let stat = fs.statSync(includePath + "\\" + i)
    if(stat.isDirectory())
      addIncludePath2Rslt(includePath + "\\" + i)
    else {
      i = i.toLowerCase()
      for(let j = 0; j < suffix.length; j ++) {
        if(i.endsWith(suffix[j])) {
          if(_noQtProRslt.indexOf("  " + includePath + " \\\r\n") === -1)
            _noQtProRslt += "  " + includePath + " \\\r\n"
          break
        }
      }
    }
  })
}

function formatPath(filePath: string) {
  let a = filePath.split("\\")
  let newPath: Array<string> = []
  a.forEach((i) => {
    if(i)
      newPath.push(i)
  })
  return newPath.join("\\")
}

function checkBuildConfig(conf: iBuildConfig) : boolean {
  if(! conf)
    return false
  if(! fs.existsSync(conf.sourcePath))
    return false
  if(! _libConfig[conf.lib])
    return false
  return true
}

function buildNoQtPro(conf: iBuildConfig) {
  if(! checkBuildConfig(conf)) {
    myTools.consoleWithColor("build config error", "red")
    return
  }

  console.log(`resourcesPath: ${conf.sourcePath}`)
  let a = formatPath(conf.sourcePath)
  _noQtProRslt += "\r\nSOURCES += \\\r\n"
  addFilePath2Rslt(a, [".ino", ".cpp", ".c"])
  _noQtProRslt += "\r\nHEADERS += \\\r\n"
  addFilePath2Rslt(a, [".h", ".hpp"])
  _noQtProRslt += "\r\nINCLUDEPATH += \\\r\n"
  addIncludePath2Rslt(a)

  a = conf.lib.toUpperCase()
  try {
    if(_libConfig[a]) {
      console.log(`load lib from ${a}`)
      let l = _libConfig[a]
      if(l.defines) {
        _noQtProRslt += "\r\nDEFINES += \\\r\n"
        l.defines.forEach((i) => {
          _noQtProRslt += "  " + i + " \\\r\n"
        })
      }
      if(l.lib) {
        _noQtProRslt += "\r\nSOURCES += \\\r\n"
        addFilePath2Rslt(l.lib, [".ino", ".cpp", ".c"])
        _noQtProRslt += "\r\nHEADERS += \\\r\n"
        addFilePath2Rslt(l.lib, [".h", ".hpp"])
        _noQtProRslt += "\r\nINCLUDEPATH += \\\r\n"
        addIncludePath2Rslt(l.lib)
      }
    }
  }
  catch (e) {}

  fs.writeFileSync("./CreateNoQtPro.txt", _noQtProRslt)
  child_process.execSync("notepad ./CreateNoQtPro.txt")
  fs.writeFileSync("./CreateNoQtPro.txt", "")
}

let has_r = false
new Promise((resolve, reject) => {
  parseProcessArgv({
    "aArgvConfig": [{
      arg: "-r",
      argc: 0,
      description: "use recent build config",
      func: (argv) => {
        _buildConfig = _recentBuildConfig[0]
        has_r = true
      }
    }],
    "fCompelete": () => {
      if(has_r) {
        buildNoQtPro(_buildConfig)
        resolve()
      }
    },
    "fUnexpectedArgv": () => {
      myTools.consoleWithColor(`Unexpected arguments`, "red")
      has_r = true
      resolve()
    },
    "description": "A node app to create no QT project profile content"
  })
}).then(() => {
  process.exit()
})

let stateStep = 0

enum eStateMachineStep {
  main = 1,
  addNewBuildConfig_resources,
  addNewBuildConfig_lib,
  useRecentBuildConfig,
  delRecentBuildConfig
}

function stateMachineToMain() {
  stateStep = eStateMachineStep.main
  myTools.consoleWithColor(`
  1. Add new build config and build
  2. Use recent build config
  3. Delete recent build config
  4. Exit
  `, "skyBlue")
  myTools.consoleWithColor(`Input id to select one operate:`, "green")
}

function stateMachineMain(input: string) {
  switch(input) {
    case "1": { stateMachineToAddNewBuildConfigResources() } break
    case "2": { stateMachineToUseRecentBuildConfig() } break
    case "3": { stateMachineToDelRecentBuildConfig() } break
    case "4": process.exit(); break
    default: myTools.consoleWithColor(`Unexpected input`, "red"); break
  }
}

function stateMachineToAddNewBuildConfigResources() {
  stateStep = eStateMachineStep.addNewBuildConfig_resources
  myTools.consoleWithColor(`Input resources path, input \'c\' to cancel:`, "green")
}

function stateMachineAddNewBuildConfigResources(input: string) {
  if(input === "c") {
    stateMachineToMain()
    return
  }
  if(fs.existsSync(input)) {
    _addNewBuildConfig.sourcePath = input
    stateMachineToAddNewBuildConfigLib()
  } else {
    myTools.consoleWithColor("invalid path", "red")
  }
}

function stateMachineToAddNewBuildConfigLib() {
  stateStep = eStateMachineStep.addNewBuildConfig_lib
  let count = 1
  console.log("")
  for(let i in _libConfig) {
    let defines = _libConfig[i].defines ? `[${_libConfig[i].defines}]` : `null`
    let lib = _libConfig[i].lib ? `${_libConfig[i].lib}` : `null`
    myTools.consoleWithColor(`  ${count}: name: ${i}, defines: ${defines}, lib: ${lib}`, "skyBlue")
    count ++
  }
  myTools.consoleWithColor(`Input id to select one lib, input \'c\' to cancel`, "green")
}

function stateMachineAddNewBuildConfigLib(input: string) {
  if(input === "c") {
    stateMachineToMain()
    return
  }
  if(! /^[0-9]$/.test(input)) {
    myTools.consoleWithColor("Unexpected input", "red")
    return
  }
  let id = parseInt(input)
  let count = 1
  for(let i in _libConfig) {
    if(id === count) {
      _addNewBuildConfig.lib = i
      buildNoQtPro(_addNewBuildConfig)
      console.log(_recentBuildConfig)
      _recentBuildConfig.splice(0, 0, _addNewBuildConfig)
      console.log(_recentBuildConfig)
      fs.writeFileSync("./recentBuildConfig.json", JSON.stringify(_recentBuildConfig))
      stateMachineToMain()
      break
    }
    count ++
  }
  if(id !== count) {
    myTools.consoleWithColor(`ID error`, "red")
  }
}

function stateMachineToAddLibDefines() {
  stateStep = eStateMachineStep.addNewLib_defines
  myTools.consoleWithColor(`Input defines, use \',\' independent items, input \'c\' to cancel:`, "green")
}

function stateMachineToUseRecentBuildConfig() {
  stateStep = eStateMachineStep.useRecentBuildConfig
  let count = 1
  console.log("")
  _recentBuildConfig.forEach((i) => {
    let resources = i.sourcePath
    let lib = i.lib
    myTools.consoleWithColor(`  ${count}: resources: ${resources}, lib: ${lib}`, "skyBlue")
    count ++
  })
  myTools.consoleWithColor(`Input id to select one lib, input \'c\' to cancel`, "green")
}

function stateMachineUseRecentBuildConfig(input: string) {
  if(input === "c") {
    stateMachineToMain()
    return
  }
  if(! /^[0-9]$/.test(input)) {
    myTools.consoleWithColor("Unexpected input", "red")
    return
  }
  let id = parseInt(input)
  let count = 1
  if(_recentBuildConfig.some((i) => {
    if(count === id)
      return true
    count ++
    return false
  })) {
    _recentBuildConfig.splice(0, 0, _recentBuildConfig[id - 1])
    _recentBuildConfig.splice(id, 1)
    fs.writeFileSync("./recentBuildConfig.json", JSON.stringify(_recentBuildConfig))
    buildNoQtPro(_recentBuildConfig[0])
    stateMachineToMain()
  } else {
    myTools.consoleWithColor(`ID error`, "red")
  }
}

function stateMachineToDelRecentBuildConfig() {
  stateStep = eStateMachineStep.delRecentBuildConfig
  let count = 1
  console.log("")
  _recentBuildConfig.forEach((i) => {
    let resources = i.sourcePath
    let lib = i.lib
    myTools.consoleWithColor(`  ${count}: resources: ${resources}, lib: ${lib}`, "skyBlue")
    count ++
  })
  myTools.consoleWithColor(`Input id to select one lib, input \'c\' to cancel`, "green")
}

function stateMachineDelRecentBuildConfig(input: string) {
  if(input === "c") {
    stateMachineToMain()
    return
  }
  if(! /^[0-9]$/.test(input)) {
    myTools.consoleWithColor("Unexpected input", "red")
    return
  }
  let id = parseInt(input)
  let count = 1
  if(_recentBuildConfig.some((i) => {
    if(count === id)
      return true
    count ++
    return false
  })) {
    _recentBuildConfig.splice(id - 1, 1)
    fs.writeFileSync("./recentBuildConfig.json", JSON.stringify(_recentBuildConfig))
    stateMachineToMain()
  } else {
    myTools.consoleWithColor(`Unexpected input`, "red")
  }
}

function stateMachine(input: string) {
  if(! stateStep) {
    stateMachineToMain()
    return
  }
  switch(stateStep) {
    case eStateMachineStep.main: {
      stateMachineMain(input)
    } break
    case eStateMachineStep.addNewBuildConfig_resources: {
      stateMachineAddNewBuildConfigResources(input)
    } break
    case eStateMachineStep.addNewBuildConfig_lib: {
      stateMachineAddNewBuildConfigLib(input)
    } break
    case eStateMachineStep.delRecentBuildConfig: {
      stateMachineDelRecentBuildConfig(input)
    } break
    case eStateMachineStep.useRecentBuildConfig: {
      stateMachineUseRecentBuildConfig(input)
    } break
  }
}

setProcessInputCallBack(stateMachine)
if(! has_r)
  stateMachine("")

// new Promise((resolve, reject) => {
//   parseProcessArgv({
//     aArgvConfig: [{
//       arg: "-r",
//       argc: 1,
//       description: "set resource path",
//       func: (argv) => {
//         let a = argv[0]
//         a = formatPath(a)
//         _rslt += "\r\nSOURCES += \\\r\n"
//         addFilePath2Rslt(a, [".ino", ".cpp", ".c"])
//         _rslt += "\r\nHEADERS += \\\r\n"
//         addFilePath2Rslt(a, [".h", ".hpp"])
//         _rslt += "\r\nINCLUDEPATH += \\\r\n"
//         addIncludePath2Rslt(a)
//       }
//     }, {
//       arg: "-lf",
//       argc: 1,
//       description: "load lib from libConfig.json",
//       func: (argv) => {
//         let a = argv[0]
//         a = a.toUpperCase()
//         if(_libConfig[a]) {
//           console.log(`load lib from ${a}`)
//           let l = _libConfig[a]
//           if(l.defines) {
//             _rslt += "\r\nDEFINES += \\\r\n"
//             l.defines.forEach((i) => {
//               _rslt += "  " + i + " \\\r\n"
//             })
//           }
//           if(l.lib) {
//             _rslt += "\r\nSOURCES += \\\r\n"
//             addFilePath2Rslt(l.lib, [".ino", ".cpp", ".c"])
//             _rslt += "\r\nHEADERS += \\\r\n"
//             addFilePath2Rslt(l.lib, [".h", ".hpp"])
//             _rslt += "\r\nINCLUDEPATH += \\\r\n"
//             addIncludePath2Rslt(l.lib)
//           }
//         }
//       }
//     }],

//     fCompelete: () => {
//       fs.writeFileSync("./CreateNoQtPro.txt", _rslt)
//       child_process.execSync("notepad ./CreateNoQtPro.txt")
//       fs.writeFileSync("./CreateNoQtPro.txt", "")
//       resolve()
//     },

//     description: "a node app to create no QT project profile content, must use absolute path",
//     fUnexpectedArgv: () => {
//       console.log(`Unexpected arguments`)
//       resolve()
//     }
//   })
// }).then(() => {
//   process.exit()
// })
