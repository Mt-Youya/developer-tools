import { isFunction, isJSON, isMap, isNil, isNull, isObject, isSet } from "@devtools/utils"
import { Check, ChevronDown, ChevronRight, Copy, Search } from "lucide-react"
import type { Fn } from "@/types/utils"

// 查询结果类型定义
interface QueryResult {
  type: "key" | "value" | "map-key" | "set-value" | "function"
  path: string[]
  key?: string
  value: unknown
  fullPath: string
}

// 深度查询函数
function deepQuery(data: unknown, searchTerm: string, caseSensitive: boolean = false): QueryResult[] {
  const results: QueryResult[] = []
  const visited = new WeakSet<object>()

  function search(obj: unknown, path: string[] = []): void {
    if (obj && isObject(obj)) {
      if (visited.has(obj)) return
      visited.add(obj)
    }

    if (isNil(obj)) return

    const term = caseSensitive ? searchTerm : searchTerm.toLowerCase()

    // 检查键名
    if (isObject(obj) && !Array.isArray(obj)) {
      for (const key in obj) {
        const keyToCheck = caseSensitive ? key : key.toLowerCase()
        if (keyToCheck.includes(term)) {
          results.push({
            type: "key",
            path: [...path, key],
            key: key,
            value: obj[key],
            fullPath: [...path, key].join("."),
          })
        }
      }
    }

    // 处理不同类型的数据
    if (Array.isArray(obj)) {
      for (let index = 0; index < (obj as any[]).length; index++) {
        const item = obj[index]
        const valueStr = caseSensitive ? String(item) : String(item).toLowerCase()
        if (valueStr.includes(term)) {
          results.push({
            type: "value",
            path: [...path, `[${index}]`],
            value: item,
            fullPath: [...path, `[${index}]`].join("."),
          })
        }
        search(item, [...path, `[${index}]`])
      }
    } else if (isMap(obj)) {
      ;(obj as Map<any, any>).forEach((value, key) => {
        const keyStr = caseSensitive ? String(key) : String(key).toLowerCase()
        if (keyStr.includes(term)) {
          results.push({
            type: "map-key",
            path: [...path, `Map(${key})`],
            key: String(key),
            value: value,
            fullPath: [...path, `Map(${key})`].join("."),
          })
        }
        search(value, [...path, `Map(${key})`])
      })
    } else if (isSet(obj)) {
      Array.from(obj).forEach((item, index) => {
        const valueStr = caseSensitive ? String(item) : String(item).toLowerCase()
        if (valueStr.includes(term)) {
          results.push({
            type: "set-value",
            path: [...path, `Set[${index}]`],
            value: item,
            fullPath: [...path, `Set[${index}]`].join("."),
          })
        }
        search(item, [...path, `Set[${index}]`])
      })
    } else if (isFunction(obj)) {
      const funcStr = caseSensitive ? (obj as Fn).toString() : (obj as Fn).toString().toLowerCase()
      if (funcStr.includes(term)) {
        results.push({
          type: "function",
          path: path,
          value: (obj as Fn).toString().substring(0, 100) + "...",
          fullPath: path.join("."),
        })
      }
    } else if (isObject(obj)) {
      // 检查值
      for (const key in obj) {
        const value = obj[key]
        const valueStr = caseSensitive ? String(value) : String(value).toLowerCase()

        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          if (valueStr.includes(term)) {
            results.push({
              type: "value",
              path: [...path, key],
              key: key,
              value: value,
              fullPath: [...path, key].join("."),
            })
          }
        }

        search(value, [...path, key])
      }
    }
  }

  search(data)
  return results
}

// 结果项组件Props
interface ResultItemProps {
  result: QueryResult
  onCopy: (result: QueryResult) => void
}

// 结果项组件
function ResultItem({ result, onCopy }: ResultItemProps) {
  "use memo"
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    onCopy(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const valuePreview = (() => {
    if (typeof result.value === "object") {
      return JSON.stringify(result.value, null, 2)
    }
    return String(result.value)
  })()

  const isExpandable = !isNull(result.value) && isObject(result.value)

  function getTypeStyle(type: QueryResult["type"]) {
    const styles: Record<QueryResult["type"], string> = {
      key: "bg-blue-100 text-blue-700",
      value: "bg-green-100 text-green-700",
      "map-key": "bg-purple-100 text-purple-700",
      "set-value": "bg-orange-100 text-orange-700",
      function: "bg-gray-100 text-gray-700",
    }
    return styles[type]
  }

  return (
    <div className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${getTypeStyle(result.type)}`}>
              {result.type}
            </span>
            <code className="text-xs text-slate-600 truncate">{result.fullPath || "root"}</code>
          </div>

          {result.key && (
            <div className="text-sm mb-1">
              <span className="text-slate-500">Key: </span>
              <span className="font-semibold text-slate-900">{result.key}</span>
            </div>
          )}

          <div className="flex items-start gap-2">
            {isExpandable && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="mt-1 text-slate-400 hover:text-slate-600"
              >
                {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-slate-500 text-sm">Value: </span>
              {expanded || !isExpandable ? (
                <pre className="mt-1 text-xs bg-slate-100 p-2 rounded overflow-x-auto">{valuePreview}</pre>
              ) : (
                <span className="text-sm text-slate-700 truncate block">{valuePreview.substring(0, 100)}...</span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 p-2 hover:bg-slate-200 rounded transition-colors"
          title="复制路径"
        >
          {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-slate-600" />}
        </button>
      </div>
    </div>
  )
}

// 主组件
function DeepDataQuery() {
  "use memo"
  const [searchTerm, setSearchTerm] = useState("")
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [inputData, setInputData] = useState("")

  // 默认数据
  const defaultData: Record<string, unknown> = {
    aidata_auto_vacuum: {
      data: {
        customer: {
          avg_size_per_event_data: 4.5,
          enable_databse_pool: true,
        },
      },
    },
    aidata_data_auth: {
      data: {
        customer: {
          auth_list: {
            blue_test_token: ["waimai"],
          },
          force_db_auth: false,
        },
      },
    },
  }

  const parsedData = (() => {
    if (!inputData.trim()) return defaultData
    return isJSON(inputData) || defaultData
  })()

  const results = (() => {
    if (!searchTerm.trim()) return []
    return deepQuery(parsedData, searchTerm, caseSensitive)
  })()

  function handleCopy(result: QueryResult) {
    navigator.clipboard.writeText(result.fullPath || "root")
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">深度数据查询工具</h1>
          <p className="text-slate-600 mb-6">支持查询 Object/Array/Map/Set/Function 等复杂数据结构</p>

          {/* 搜索栏 */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="输入要搜索的键名或值，如: aidata_data_auth 或 waimai"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              区分大小写
            </label>

            {/* 自定义数据输入 */}
            <div>
              <label htmlFor="custom" className="block text-sm font-medium text-slate-700 mb-2">
                自定义数据 (JSON格式，留空使用默认数据)
              </label>
              <textarea
                id="custom"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder='{"key": "value", "array": [1, 2, 3]}'
                className="w-full h-32 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* 结果显示 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">搜索结果 {searchTerm && `(${results.length})`}</h2>
          </div>

          {!searchTerm ? (
            <div className="text-center py-12 text-slate-500">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p>请输入搜索词开始查询</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p>未找到匹配结果</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result, index) => (
                <ResultItem key={index} result={result} onCopy={handleCopy} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeepDataQuery
