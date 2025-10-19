import { Search } from 'lucide-react';
import { FieldTemplates } from '@/constants/FieldTemplates';
import { CommandStore, type Dictionary } from '@/stores/command';
import { Button } from '@devtools/button';
import { Card, CardHeader, CardTitle, CardContent } from '@devtools/card';
import { Label } from '@devtools/label';
import { Textarea } from '@devtools/textarea';
import { parseTextData } from '@/utils/parse';
import useCopy from '@/hooks/useCopy';

const sampleData = `
"bundle_version" = "";
cityId = 1;
"engine_type" = 0;
isNested = 0;
isStandardContainer = 0;
"mrn_biz" = hotel;
env = test;
"is_remote" = 0;
"local_bundle" = 0;
"retry_count" = 0;
`;

function assignKeysToValues(target: string[], source: Dictionary) {
    const keys = Object.keys(source)
    return target.reduce((prev, current) => keys.includes(current) ? { ...prev, [current]: source[current] } : prev, {} as Dictionary)
}

function InputWorkSpace() {
    const { setExtractedData, targetFields, detectors } = CommandStore()
    const [inputText, setInputText] = useState("")

    // 字段提取逻辑
    const extractFields = useMemo<Dictionary>(() => {
        if (!inputText || !targetFields) return {};

        const fieldNames = targetFields.split(",")
        const result = parseTextData(inputText, detectors.filter(d => d.checked))
        if (targetFields === FieldTemplates['所有字段']) {
            return result
        }
        return assignKeysToValues(fieldNames, result)
    }, [inputText, targetFields, detectors]);

    // 更新提取结果
    useEffect(() => {
        setExtractedData(extractFields);
    }, [extractFields]);

    const { copyToClipboard } = useCopy(inputText)
    function handleCopy() {
        const val = inputText.replaceAll(/\d+/g, '').replaceAll(/^  $/g,"")
        copyToClipboard((val))
    }

    return (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-xl flex items-center">
                    <Search className="mr-2 text-blue-500" size={20} />
                    数据输入
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="input-text">输入文本数据</Label>
                    <Textarea
                        id="input-text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[280px] font-mono text-sm resize-none"
                        placeholder="粘贴包含字段数据的文本..."
                    />
                </div>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setInputText(sampleData)}
                >
                    使用样本数据
                </Button>
                <Button onClick={handleCopy} > 复制 </Button>
            </CardContent>
        </Card>
    )
}

export default InputWorkSpace
