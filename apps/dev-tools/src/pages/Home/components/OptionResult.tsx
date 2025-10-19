import { AlertCircle, Settings } from "lucide-react";
import { isEmpty } from "lodash-es";
import { CommandStore } from "@/stores/command";
import { Card, CardHeader, CardTitle, CardContent } from "@devtools/card";
import { Badge } from "@devtools/badge";
import { Input } from "@devtools/input";
import { Label } from "@devtools/label";
import { Separator } from "@devtools/separator";
import { FieldTemplates } from "@/constants/FieldTemplates";
import { Checkbox } from "@devtools/checkbox";
import { isObject } from "@devtools/utils";
import CopyComp from "@/components/CopyComp";

function OptionResult() {
  const { extractedData, targetFields, setTargetFields, detectors, setDetectors } = CommandStore();
  interface IData {
    key: string | number;
    value: string | number;
    checked: boolean;
  }
  const [data, setData] = useState<IData[]>();

  useEffect(() => {
    setData(Object.entries(extractedData).map(([key, value]) => ({ key, value: handleValue(value), checked: true })));
  }, [extractedData]);

  function handleValue(val: any) {
    const v = val.toString();
    return v.endsWith(",") ? v.slice(0, -1) : val;
  }

  const copyValue = useMemo(() => {
    if (!data) {
      return {};
    }
    const list: typeof extractedData = {};
    for (const { key, value, checked } of data) {
      if (checked) {
        list[key] = value;
      }
    }
    return list;
  }, [data]);

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Settings className="mr-2 text-green-500" size={20} />
          字段配置
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="target-fields">目标字段 (逗号分隔)</Label>
          <Input
            id="target-fields"
            value={targetFields}
            onChange={e => setTargetFields(e.target.value)}
            className="font-mono"
            placeholder="cityId,mboxCouponId,spuId"
          />
        </div>

        {/* 字段模板 */}
        <div className="space-y-2">
          <Label>快速模板</Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(FieldTemplates).map(([name, template]) => (
              <Badge
                key={name}
                variant="secondary"
                className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 transition-colors"
                onClick={() => setTargetFields(template)}
              >
                {name}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label> 使用的解析器 </Label>
          <ul className="grid grid-cols-2">
            {detectors.map(({ name, format, checked }, idx) => (
              <li key={idx + name} className="flex flex-start gap-2 space-y-1">
                <Checkbox
                  id={idx + format}
                  checked={checked}
                  onCheckedChange={() =>
                    setDetectors(
                      detectors.map(item => ({ ...item, checked: item.format === format ? !checked : item.checked })),
                    )
                  }
                />
                <Label htmlFor={idx + format}> {name} </Label>
              </li>
            ))}
          </ul>
        </div>

        {/* 提取结果 */}
        <div className="space-y-2">
          <Label>提取结果</Label>
          <div className="bg-slate-50 p-4 rounded-lg border min-h-[120px]">
            {isEmpty(extractedData) ? (
              <div className="flex items-center justify-center h-full text-slate-500 italic">
                <AlertCircle size={16} className="mr-2" />
                暂无提取结果
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {data?.map(({ key, value, checked }, idx) => (
                    <div
                      key={key}
                      className="flex justify-between items-center bg-white p-3 rounded-md border shadow-sm"
                    >
                      <Checkbox
                        id={key + idx.toString()}
                        checked={checked}
                        onCheckedChange={() =>
                          setData(data.map(item => ({ ...item, checked: item.key === key ? !checked : item.checked })))
                        }
                      />
                      <Label htmlFor={key + idx.toString()} className="ml-2 flex-1 justify-between">
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          {key}
                        </Badge>
                        <code className="text-slate-800 bg-slate-100 px-2 py-1 rounded text-sm break-all">
                          {isObject(value) ? JSON.stringify(value) : value}
                        </code>
                      </Label>
                    </div>
                  ))}
                </div>
                <CopyComp copyValue={copyValue} text="复制为JSON" />
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default OptionResult;
