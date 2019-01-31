import {
  parseProcessArgv
} from "../ParseProcessArgv/ParseProcessArgv"

import * as childProcess from "child_process"
import * as fs from "fs"

interface iLibChild {
  defines?: Array<string>,
  lib?: string
}

interface iLibConfig {
  [key: string]: iLibChild
}

let _libConfig = <iLibConfig> require("./libConfig.json")
let _rslt = ""

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
          _rslt += "  " + filePath + "\\" + i + " \\\r\n"
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
          if(_rslt.indexOf("  " + includePath + " \\\r\n") === -1)
            _rslt += "  " + includePath + " \\\r\n"
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

new Promise((resolve, reject) => {
  parseProcessArgv({
    aArgvConfig: [{
      arg: "-r",
      argc: 1,
      description: "set resource path",
      func: (argv) => {
        let a = argv[0]
        a = formatPath(a)
        _rslt += "\r\nSOURCES += \\\r\n"
        addFilePath2Rslt(a, [".ino", ".cpp", ".c"])
        _rslt += "\r\nHEADERS += \\\r\n"
        addFilePath2Rslt(a, [".h", ".hpp"])
        _rslt += "\r\nINCLUDEPATH += \\\r\n"
        addIncludePath2Rslt(a)
      }
    }, {
      arg: "-lf",
      argc: 1,
      description: "load lib from libConfig.json",
      func: (argv) => {
        let a = argv[0]
        a = a.toUpperCase()
        if(_libConfig[a]) {
          console.log(`load lib from ${a}`)
          let l = _libConfig[a]
          if(l.defines) {
            _rslt += "\r\nDEFINES += \\\r\n"
            l.defines.forEach((i) => {
              _rslt += "  " + i + " \\\r\n"
            })
          }
          if(l.lib) {
            _rslt += "\r\nSOURCES += \\\r\n"
            addFilePath2Rslt(l.lib, [".ino", ".cpp", ".c"])
            _rslt += "\r\nHEADERS += \\\r\n"
            addFilePath2Rslt(l.lib, [".h", ".hpp"])
            _rslt += "\r\nINCLUDEPATH += \\\r\n"
            addIncludePath2Rslt(l.lib)
          }
        }
      }
    }],

    fCompelete: () => {
      fs.writeFileSync("./CreateNoQtPro.txt", _rslt)
      childProcess.execSync("notepad ./CreateNoQtPro.txt")
      resolve()
    },

    description: "a node app to create no QT project profile content, must use absolute path",
    fUnexpectedArgv: () => {
      console.log(`Unexpected arguments`)
      resolve()
    }
  })
}).then(() => {
  process.exit()
})
