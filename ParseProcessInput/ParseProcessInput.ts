import * as readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

export function setProcessInputCallBack(func: (arg: string) => void) {
  rl.on("line", func)
}
