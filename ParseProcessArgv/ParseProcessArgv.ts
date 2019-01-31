import {
  myTools
} from "../myTools/myTools"

interface iProcessArgvConfig {
  arg: string,
  argc: number,
  description: string,
  func: (aArg: Array<string>) => any
}

interface iParseProcessArgv {
  aArgvConfig: Array<iProcessArgvConfig>,
  fCompelete: AnyFunction,

  description?: string,
  fUnexpectedArgv?: AnyFunction
}

function parseProcessArgv(iArgv: iParseProcessArgv) {
  let argv = process.argv
  console.log(``)
  myTools.consoleWithColor(`argv: ${argv}`, "green")
  console.log(``)
  let funcs: Array<AnyFunction> = []
  let aArg: Array<Array<string>> = []
  if((argv.length === 3) && (argv[2] === "--help")) {
    iArgv.description ? console.log(iArgv.description) : {}
    console.log(`--help: show this message`)
    for(let i = 0; i < iArgv.aArgvConfig.length; i ++)
      console.log(`${iArgv.aArgvConfig[i].arg}: ${iArgv.aArgvConfig[i].description}`)
    process.exit()
  }
  for(let i = 2; i < argv.length; ) {
    let err = true
    for(let j = 0; j < iArgv.aArgvConfig.length; j ++) {
      if((argv[i] === iArgv.aArgvConfig[j].arg) && ((i + iArgv.aArgvConfig[j].argc) < argv.length)) {
        err = false
        funcs.push(iArgv.aArgvConfig[j].func)
        aArg.push(argv.slice(i + 1, i + iArgv.aArgvConfig[j].argc + 1))
        i += iArgv.aArgvConfig[j].argc + 1
        break
      }
    }
    if(err) {
      iArgv.fUnexpectedArgv ? iArgv.fUnexpectedArgv() : {}
      return
    }
  }
  for(let i = 0; i < funcs.length; i ++)
    funcs[i](aArg[i])
  iArgv.fCompelete()
}

export {
  parseProcessArgv
}
