import { Play, AlertCircle } from 'lucide-react';
import { CommandStore } from "@/stores/command";
import { Alert, AlertDescription } from "@devtools/ui/Alert";
import { Card, CardHeader, CardTitle, CardContent } from '@devtools/ui/Card';
import { ServerStore } from '@/stores/server';
import CopyComp from '@/components/CopyComp';

function GenerateCommand() {
    const { baseCommand, extractedData, commandSuffix } = CommandStore()
    const { server, port } = ServerStore()

    // 生成最终命令
    const finalCommand = useMemo(() => {
        if (Object.keys(extractedData).length === 0) return '';
        const params = Object.entries(extractedData)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
        return `${baseCommand}${server}:${port}&${params}${commandSuffix}`;
    }, [extractedData, baseCommand, commandSuffix]);

    return finalCommand && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center text-green-700">
                        <Play className="mr-2" size={24} />
                        生成的命令
                    </CardTitle>
                    <CopyComp
                        className="gap-2 bg-green-600 hover:bg-green-700"
                        copyValue={finalCommand} text="复制命令"
                    />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border">
                    <pre className="whitespace-pre-wrap break-all">{finalCommand}</pre>
                </div>

                {/* 命令解析 */}
                <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                        <ul className="space-y-2 text-sm">
                            <li><strong>基础命令:</strong> <code className="bg-blue-100 px-1 py-0.5 rounded">{baseCommand}</code></li>
                            <li><strong>参数:</strong> <code className="bg-blue-100 px-1 py-0.5 rounded">{Object.entries(extractedData).map(([k, v]) => `${k}=${v}`).join(', ')}</code></li>
                            <li><strong>后缀:</strong> <code className="bg-blue-100 px-1 py-0.5 rounded">{commandSuffix}</code></li>
                        </ul>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    )
}

export default GenerateCommand
