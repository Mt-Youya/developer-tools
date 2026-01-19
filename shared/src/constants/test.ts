import fs from "node:fs"
import path from "node:path"

// 使用 __dirname 或 import.meta.url 获取当前文件路径
const __dirname = path.dirname(new URL(import.meta.url).pathname)

const chinaCityCode = JSON.parse(fs.readFileSync(path.join(__dirname, "china-city-code.json"), "utf-8"))
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json"), "utf-8"))

// 创建映射
const cityCodeMap = new Map()
for (const item of chinaCityCode) {
  const key = `${item["省"]}-${item["市"]}-${item["县/区"]}`
  console.log("key", key)

  cityCodeMap.set(key, item["站点号"])
}

// 更新 data
for (const item of data) {
  //   console.log("item", item)

  const key = `${item.province}-${item.city}-${item.area}`
  //   console.log("key", key)
  //   console.log("key", key, cityCodeMap.has(key))

  if (cityCodeMap.has(key)) {
    item.cityCode = cityCodeMap.get(key)
  }
}
// 保存
console.log(data)

fs.writeFileSync(path.join(__dirname, "geo.json"), JSON.stringify(data, null, 2), "utf-8")

console.log(`更新完成！共处理 ${data.length} 条数据`)
