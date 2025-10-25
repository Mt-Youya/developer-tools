import { FormatDetectors, type FormatDetectorsType } from "@/constants/FormatDetectors"
import type { Writeable } from "@/types/utils"
import { isJSON } from "./is"

interface ParsedResult {
  [key: string]: any
}

function parseValue(value: string) {
  if (value.startsWith('"') && value.endsWith('"')) {
    value = value.slice(1, -1)
  }
  switch (value.trim()) {
    case "":
      return ""
    case "true":
      return true
    case "false":
      return false
    case "null":
      return null
    case "undefined":
      return void 0
    default: {
      // 数字检测
      if (/^-?\d+$/.test(value)) return parseInt(value, 10)
      if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value)
      return isJSON(value) ?? value
    }
  }
}

function parseJSON(text: string) {
  const result: ParsedResult = {}
  const jsonPatterns = [
    /"([^"]+)"\s*:\s*"([^"]*)"/g, // 字符串值
    /"([^"]+)"\s*:\s*(\d+\.?\d*)/g, // 数字值
    /"([^"]+)"\s*:\s*(true|false)/g, // 布尔值
    /"([^"]+)"\s*:\s*null/g, // null值
  ]

  for (const pattern of jsonPatterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const key = match[1]
      let value: any = match[2]

      if (value === "true") value = true
      else if (value === "false") value = false
      else if (value === "null") value = null
      else if (!isNaN(Number(value)) && value !== "") value = Number(value)

      result[key] = value
    }
  }
  return result
}

function parseKeyValue(text: string) {
  const result: ParsedResult = {}
  const keyValuePatterns = [
    /(\w+[\w\u4e00-\u9fa5]*)\s*[:=]\s*"([^"]*)"/g, // 带引号的值
    /(\w+[\w\u4e00-\u9fa5]*)\s*[:=]\s*'([^']*)'/g, // 单引号的值
    /(\w+[\w\u4e00-\u9fa5]*)\s*[:=]\s*([^=\s][^]*?)(?=\s+\w+[:=]|$)/g, // 无引号的值
  ]

  for (const pattern of keyValuePatterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const key = match[1].trim()
      let value = match[2].trim()

      // 清理值并尝试转换类型
      value = value.replace(/^["']|["']$/g, "")
      result[key] = parseValue(value)
    }
  }
  return result
}

function parseUrlParams(text: string) {
  const result: ParsedResult = {}
  const urlPattern = /[?&]([^=]+)=([^&]*)/g

  let match
  while ((match = urlPattern.exec(text)) !== null) {
    try {
      const key = decodeURIComponent(match[1])
      const value = decodeURIComponent(match[2])
      result[key] = parseValue(value)
    } catch (err) {
      console.log("decodeURIComponent err.meassage", err)
    }
  }
  return result
}

function parseNormal(text: string) {
  const result: ParsedResult = {}
  const simplePattern = /(\w+[\w\u4e00-\u9fa5]*)\s+([^=\s][^]*?)(?=\s+\w+|$)/g

  let match
  while ((match = simplePattern.exec(text)) !== null) {
    const key = match[1].trim()
    const value = match[2].trim()
    result[key] = parseValue(value)
  }
  return result
}

function parseXML(text: string) {
  const result: ParsedResult = {}
  const xmlPattern = /(\w+)\s*=\s*"([^"]*)"/g

  let match
  while ((match = xmlPattern.exec(text)) !== null) {
    const key = match[1]
    const value = match[2]
    result[key] = parseValue(value)
  }
  return result
}

function parseColonSeparated(text: string) {
  const result: ParsedResult = {}
  const colonPattern = /([^:\n]+):\s*([^\n]*)/g

  let match
  while ((match = colonPattern.exec(text)) !== null) {
    const key = match[1].trim()
    const value = match[2].trim()
    if (key && value) {
      result[key] = parseValue(value)
    }
  }
  return result
}
function parseTOML(text: string) {
  const result: ParsedResult = {}
  const tomlPatterns = [
    /^([\w]+)\s*=\s*"([^"]*)"$/gm, // 字符串
    /^([\w]+)\s*=\s*'([^']*)'$/gm, // 原始字符串
    /^([\w]+)\s*=\s*(\d+\.?\d*)$/gm, // 数字
    /^([\w]+)\s*=\s*(true|false)$/gm, // 布尔值
    /^([\w]+)\s*=\s*\[([^\]]*)\]$/gm, // 数组
  ]

  for (const pattern of tomlPatterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const key = match[1]
      let value: any = match[2]

      if (pattern === tomlPatterns[4]) {
        // 数组处理
        value = (value as string).split(",").map((item) => parseValue(item.trim()))
      } else {
        value = parseValue(value)
      }

      result[key] = value
    }
  }
  return result
}

function parseYaml(text: string) {
  const result: ParsedResult = {}
  const yamlPatterns = [
    /^([\w]+):\s*"([^"]*)"$/gm, // 带引号字符串
    /^([\w]+):\s*'([^']*)'$/gm, // 单引号字符串
    /^([\w]+):\s*(\d+\.?\d*)$/gm, // 数字
    /^([\w]+):\s*(true|false)$/gm, // 布尔值
    /^([\w]+):\s*\[([^\]]*)\]$/gm, // 数组
    /^([\w]+):\s*([^#\n]*)$/gm, // 普通值（忽略注释）
  ]

  for (const pattern of yamlPatterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const key = match[1]
      let value: any = match[2].trim()

      // 移除注释
      value = value.replace(/#.*$/, "").trim()

      if (pattern === yamlPatterns[4]) {
        // 数组处理
        value = (value as string).split(",").map((item) => parseValue(item.trim()))
      } else {
        value = parseValue(value)
      }
      if (value !== "") {
        result[key] = value
      }
    }
  }
  return result
}

function parseHocon(text: string) {
  const result: ParsedResult = {}
  const hoconPatterns = [
    /([\w.]+)\s*[:=]\s*"([^"]*)"/g, // 带引号字符串
    /([\w.]+)\s*[:=]\s*'([^']*)'/g, // 单引号字符串
    /([\w.]+)\s*[:=]\s*(\d+\.?\d*)/g, // 数字
    /([\w.]+)\s*[:=]\s*(true|false)/g, // 布尔值
    /([\w.]+)\s*[:=]\s*\[([^\]]*)\]/g, // 数组
    /([\w.]+)\s*\{([^}]*)\}/g, // 嵌套对象
  ]

  for (const pattern of hoconPatterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const key = match[1]
      let value: any = match[2]

      if (pattern === hoconPatterns[4]) {
        // 数组
        value = (value as string).split(",").map((item) => parseValue(item.trim()))
      } else if (pattern === hoconPatterns[5]) {
        // 嵌套对象
        value = parseTextData(value, [FormatDetectors[9]]) // 递归解析
      } else {
        value = parseValue(value)
      }

      result[key] = value
    }
  }
  return result
}

function parseJavaProperties(text: string) {
  const result: ParsedResult = {}
  const propertiesPattern = /^([\w.]+)\s*[=:]\s*(.*)$/gm

  let match
  while ((match = propertiesPattern.exec(text)) !== null) {
    const key = match[1].trim()
    let value = match[2].trim()

    // 处理转义字符
    value = value
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\:/g, ":")
      .replace(/\\=/g, "=")
      .replace(/\\#/g, "#")

    // 移除行尾注释
    value = value.replace(/\s*[#!].*$/, "").replaceAll(";", "")

    result[key] = parseValue(value)
  }
  return result
}

function parseINI(text: string) {
  const result: ParsedResult = {}
  let currentSection = "global"

  const lines = text.split("\n")

  for (const line of lines) {
    const trimmedLine = line.trim()

    // 节头 [section]
    const sectionMatch = trimmedLine.match(/^\[([^\]]+)\]$/)
    if (sectionMatch) {
      currentSection = sectionMatch[1]
      if (!result[currentSection]) {
        result[currentSection] = {}
      }
      continue
    }

    // 键值对 key=value
    const keyValueMatch = trimmedLine.match(/^([^=]+)\s*=\s*(.*)$/)
    if (keyValueMatch && !trimmedLine.startsWith(";") && !trimmedLine.startsWith("#")) {
      const key = keyValueMatch[1].trim()
      let value = keyValueMatch[2].trim()

      // 移除行尾注释
      value = value.replace(/\s*[;#].*$/, "")

      if (currentSection === "global") {
        result[key] = parseValue(value)
      } else {
        result[currentSection][key] = parseValue(value)
      }
    }
  }

  return result
}

function parseCommandLine(text: string) {
  const result: ParsedResult = {}
  const cliPatterns = [
    /--([\w-]+)\s+([^-\s][^]*?)(?=\s+--|$)/g, // --key value
    /--([\w-]+)=([^=\s][^]*?)(?=\s|$)/g, // --key=value
    /-([a-zA-Z])\s+([^-\s][^]*?)(?=\s+-|$)/g, // -k value
  ]

  for (const pattern of cliPatterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const key = match[1]
      let value = match[2]

      value = value.replace(/^["']|["']$/g, "")
      result[key] = parseValue(value)
    }
  }

  // 处理布尔标志: --flag 或 -f
  const flagPattern = /(?:--([\w-]+)|-([a-zA-Z]))(?=\s|$)/g
  let flagMatch
  while ((flagMatch = flagPattern.exec(text)) !== null) {
    const key = flagMatch[1] || flagMatch[2]
    result[key] = true
  }

  return result
}

function parseENV(text: string) {
  const result: ParsedResult = {}
  const envPattern = /^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/gm

  let match
  while ((match = envPattern.exec(text)) !== null) {
    const key = match[1]
    let value = match[2].trim()

    // 处理引号
    value = value.replace(/^["']|["']$/g, "")

    result[key] = parseValue(value)
  }
  return result
}

function parseLineHead(text: string) {
  const lines = text.replace(/"val_lab":/, "").split("\n")
  const cleanString = lines.map((line) => line.replace(/^\s*\d+\s*/, "")).join("\n")
  return parseJsonObject(cleanString)
}

function parseJsonObject(text: string) {
  const result: ParsedResult = {}
  const lines = text.split("\n")
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()
    if (!line || line === "{" || line === "}" || line === "},") {
      i++
      continue
    }

    const keyValueMatch = line.match(/^"([^"]+)"\s*:\s*(.*)$/)
    if (keyValueMatch) {
      const key = keyValueMatch[1]
      const valueStr = keyValueMatch[2]?.replace(/,$/, "")
      if (valueStr === "{") {
        const { value: objectValue, nextIndex } = parseNestedObject(lines, i + 1)
        result[key] = objectValue
        i = nextIndex
      } else if (valueStr === "[") {
        const { value: arrayValue, nextIndex } = parseNestedArray(lines, i + 1)
        result[key] = arrayValue
        i = nextIndex
      } else if (valueStr.startsWith("{")) {
        result[key] = isJSON(valueStr) ?? valueStr
        i++
      } else if (valueStr.startsWith("[")) {
        result[key] = isJSON(valueStr) ?? valueStr
        i++
      } else {
        result[key] = parseValue(valueStr)
        i++
      }
    }
    i++
  }
  return result
}

function parseNestedObject(lines: string[], startIndex: number): { value: any; nextIndex: number } {
  const result: ParsedResult = {}
  let i = startIndex
  let braceCount = 1 // 已经遇到了开始的 {

  while (i < lines.length && braceCount > 0) {
    const line = lines[i].trim()
    if (!line) {
      i++
      continue
    }
    // 计算花括号
    const openBraces = (line.match(/\{/g) || []).length
    const closeBraces = (line.match(/\}/g) || []).length

    if (line === "}" || line === "},") {
      braceCount--
      if (braceCount === 0) {
        break
      }
      i++
      continue
    }

    // 匹配键值对
    const keyValueMatch = line.match(/^"([^"]+)"\s*:\s*(.*)$/)

    if (keyValueMatch) {
      const key = keyValueMatch[1]
      const valueStr = keyValueMatch[2]?.replace(/,$/, "")

      if (valueStr === "{") {
        braceCount++
        const { value: nestedValue, nextIndex } = parseNestedObject(lines, i + 1)
        result[key] = nestedValue
        i = nextIndex
        braceCount-- // parseNestedObject 已经处理了对应的 }
      } else if (valueStr === "[") {
        const { value: arrayValue, nextIndex } = parseNestedArray(lines, i + 1)
        result[key] = arrayValue
        i = nextIndex
      } else if (valueStr.startsWith("{")) {
        // 单行对象
        braceCount += openBraces - closeBraces
        result[key] = isJSON(valueStr) ?? valueStr
      } else if (valueStr.startsWith("[")) {
        // 单行数组
        result[key] = isJSON(valueStr) ?? valueStr
      } else {
        // 基本类型
        result[key] = parseValue(valueStr)
      }
    }
    i++
  }
  return { value: result, nextIndex: i + 1 }
}

function parseNestedArray(lines: string[], startIndex: number): { value: any[]; nextIndex: number } {
  const result: any[] = []
  let i = startIndex
  let bracketCount = 1 // 已经遇到了开始的 [
  let currentArrayStr = ""

  while (i < lines.length && bracketCount > 0) {
    const line = lines[i].trim()

    if (!line) {
      i++
      continue
    }

    currentArrayStr += line

    // 计算方括号
    const openBrackets = (line.match(/\[/g) || []).length
    const closeBrackets = (line.match(/\]/g) || []).length

    bracketCount += openBrackets - closeBrackets

    if (bracketCount === 0) {
      // 数组结束，尝试解析
      try {
        const parsed = JSON.parse("[" + currentArrayStr)
        return { value: parsed, nextIndex: i + 1 }
      } catch (error) {
        console.error("数组解析失败:", error)
        return { value: [currentArrayStr], nextIndex: i + 1 }
      }
    }

    i++
  }

  return { value: result, nextIndex: i }
}

const formatParsers = {
  // JSON格式: "fieldName": "value" 或 "fieldName": value
  json: parseJSON,
  // 键值对格式: fieldName=value 或 fieldName: value
  keyValue: parseKeyValue,
  // URL参数格式: ?fieldName=value 或 &fieldName=value
  urlParams: parseUrlParams,
  // 简单字段格式: fieldName value
  simple: parseNormal,
  // XML/HTML属性格式: fieldName="value"
  xmlAttributes: parseXML,
  // 冒号分隔格式: fieldName: value
  colonSeparated: parseColonSeparated,
  // TOML格式
  toml: parseTOML,
  // YAML格式
  yaml: parseYaml,
  // HOCON格式 (简化版)
  hocon: parseHocon,
  // Properties文件格式
  properties: parseJavaProperties,
  // INI文件格式
  ini: parseINI,
  // 命令行参数格式: --key value 或 -k value
  commandLine: parseCommandLine,
  // 环境变量格式: KEY=VALUE
  env: parseENV,
  // 去除行首格式
  dropLineNumber: parseLineHead,
}

// 处理嵌套结构
function processNestedStructures(obj: ParsedResult): void {
  for (const key in obj) {
    const value = obj[key]

    if (typeof value === "string") {
      // 尝试解析可能是JSON字符串的值
      if ((value.startsWith("{") && value.endsWith("}")) || (value.startsWith("[") && value.endsWith("]"))) {
        try {
          obj[key] = JSON.parse(value)
        } catch {
          // 如果不是有效的JSON，保持原样
        }
      }
    } else if (typeof value === "object" && value !== null) {
      // 递归处理嵌套对象
      processNestedStructures(value)
    }
  }
}

export function parseTextData(text: string, detectors: Writeable<FormatDetectorsType[number]>[]) {
  const result: ParsedResult = {}
  const detectedFormats: string[] = []

  for (const { format, detector } of detectors) {
    if (detector.test(text)) {
      // console.log(format);
      detectedFormats.push(format)
    }
  }

  const formatsToUse = detectedFormats.length > 0 ? detectedFormats : Object.keys(formatParsers)
  try {
    for (const format of formatsToUse) {
      const parser = formatParsers[format as keyof typeof formatParsers]
      const parsed = parser(text)
      Object.assign(result, parsed)
    }
  } catch (e) {
    console.log(e)
  }
  processNestedStructures(result)
  return result
}
