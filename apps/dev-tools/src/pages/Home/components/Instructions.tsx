import { Card, CardContent, CardHeader, CardTitle } from "@devtools/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@devtools/ui/Tabs"

function Instructions() {
  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl">使用说明</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="formats" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="formats">支持格式</TabsTrigger>
            <TabsTrigger value="steps">使用步骤</TabsTrigger>
            <TabsTrigger value="examples">示例</TabsTrigger>
          </TabsList>

          <TabsContent value="formats" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-slate-800">数据格式支持</h4>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>
                    • JSON格式: <code className="bg-slate-100 px-1 py-0.5 rounded">"fieldName": "value"</code>
                  </li>
                  <li>
                    • URL参数: <code className="bg-slate-100 px-1 py-0.5 rounded">?fieldName=value</code>
                  </li>
                  <li>
                    • 键值对: <code className="bg-slate-100 px-1 py-0.5 rounded">fieldName=value</code>
                  </li>
                  <li>
                    • 冒号分隔: <code className="bg-slate-100 px-1 py-0.5 rounded">fieldName: value</code>
                  </li>
                  <li>
                    • XML属性: <code className="bg-slate-100 px-1 py-0.5 rounded">fieldName="value"</code>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-slate-800">智能识别</h4>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• 自动去除引号和空格</li>
                  <li>• 多模式匹配优先级</li>
                  <li>• 支持嵌套JSON结构</li>
                  <li>• 容错性强，支持不规范格式</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="steps" className="mt-4">
            <div className="space-y-3">
              <h4 className="font-medium text-slate-800">操作步骤</h4>
              <ol className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                    1
                  </span>
                  在左侧输入区域粘贴包含数据的文本
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                    2
                  </span>
                  在右侧指定要提取的字段名（逗号分隔）
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                    3
                  </span>
                  查看提取结果，确认字段值正确
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                    4
                  </span>
                  点击"复制命令"按钮获取最终结果
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                    5
                  </span>
                  可在设置中自定义命令模板格式
                </li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="mt-4">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h5 className="font-medium text-slate-800 mb-2">JSON 示例</h5>
                <code className="text-sm text-slate-600 block whitespace-pre-wrap">
                  {`{
  "cityId": "1",
  "mboxCouponId": "1403688762",
  "spuId": "794615414"
}`}
                </code>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h5 className="font-medium text-slate-800 mb-2">URL 示例</h5>
                <code className="text-sm text-slate-600 block">
                  https://example.com/api?cityId=1&mboxCouponId=1403688762&spuId=794615414
                </code>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default Instructions
