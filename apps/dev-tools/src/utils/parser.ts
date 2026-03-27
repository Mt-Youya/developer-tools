import { isMap, isNil, isObject } from "@devtools/utils"

type BracketStyle = "single" | "double" | "both"

export class Parser {
  name = "Parser"
  private keys?: string[]
  private style: BracketStyle
  text: string
  data: any

  // 单括号：(?<!\{)\{([^{}]+)\}(?!\})
  // 双括号：\{\{([^{}]+)\}\}
  private static PATTERNS: Record<Exclude<BracketStyle, "both">, RegExp> = {
    single: /(?<!\{)\{([^{}]+)\}(?!\})/g,
    double: /\{\{([^{}]+)\}\}/g,
  }

  constructor(text: string, data: any, options?: { keys?: string[]; style?: BracketStyle }) {
    this.text = text
    this.data = data
    this.keys = options?.keys
    this.style = options?.style ?? "single"
  }

  private getValueByPath(path: string, data = this.data): any {
    const keys = path
      .replace(/\[(\d+)\]/g, ".$1")
      .split(".")
      .filter(Boolean)

    return keys.reduce((acc, key) => {
      if (acc == null) return undefined
      return acc[key]
    }, data)
  }

  extractKeys() {
    const results = new Set<string>()
    const patterns = this.getPatterns()

    for (const pattern of patterns) {
      const matches = this.text.match(pattern)
      if (matches) {
        for (const m of matches) {
          const inner = m.replace(/^\{+|\}+$/g, "").trim()
          results.add(inner)
        }
      }
    }

    return [...results]
  }

  render() {
    const allowedSet = this.keys ? new Set(this.keys) : null
    const patterns = this.getPatterns()

    let result = this.text

    for (const pattern of patterns) {
      result = result.replace(pattern, (match, path) => {
        const trimmed = path.trim()
        if (allowedSet && !allowedSet.has(trimmed)) return match
        const value = this.getValueByPath(trimmed)
        console.log(this.name, "value", value)

        return value !== undefined ? String(value) : match
      })
    }

    console.log(this.name, "result", result)

    return result
  }

  private getPatterns() {
    if (this.style === "both") {
      // double 优先，避免单括号误匹配双括号内容
      return [new RegExp(Parser.PATTERNS.double.source, "g"), new RegExp(Parser.PATTERNS.single.source, "g")]
    }
    return [new RegExp(Parser.PATTERNS[this.style].source, "g")]
  }
}

export class PromptParser extends Parser {
  name = "PromptParser"
  parse() {
    return this.render()
  }
}

type ParseParams = ConstructorParameters<typeof Parser>
export class SkillParser extends Parser {
  name = "SkillParser"
  #skills: string[] = []
  constructor(...args: ParseParams) {
    super(...args)
    this.#skills = this.parseSkillPlaceholder()
  }

  parseSkillPlaceholder(text: string = this.text) {
    const regex = /\{\{SKILL:([^}]+)\}\}/g
    const results = []
    let match: RegExpExecArray | null
    while ((match = regex.exec(text)) !== null) {
      results.push(match[1].trim())
    }
    return results
  }

  parse = (template: string, params: Map<string, Models.Skill>) => {
    if (isNil(params) || !isMap(params)) {
      console.warn("[SkillParaser]: 请传递 Map 类型的 params!")
      return template
    }

    for (const skillName of this.#skills) {
      const skill = params.get(skillName)

      if (isNil(skill)) {
        continue
      }
      // step1: skill name 替换成 skill
      template = template.replace(`{{SKILL:${skillName}}}`, skill.implementation)
      console.log(this.name, " this.render before", template)
      // step2: 替换占位符
      template = new Parser(template, this.data[skillName]).render()
    }
    return template
  }
}
