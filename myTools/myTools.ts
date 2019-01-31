
let consoleColorDefines: AnyObject = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  purple: 35,
  skyBlue: 36,
  white: 37
}

type consoleColor_t = "black" | "red" | "green" | "yellow" | "blue" | "purple" | "skyBlue" | "white"

class MyTools {
  
  consoleWithColor(content: any, color: consoleColor_t) {
    if(typeof(content) === "object")
      content = JSON.stringify(content)
    console.log("\x1b[" + consoleColorDefines[color] + "m%s\x1b[0m", content)
  }

}

const myTools = new MyTools()

export {
  myTools
}
