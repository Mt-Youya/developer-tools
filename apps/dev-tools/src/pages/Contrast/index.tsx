import { Button } from "@devtools/ui/Button";
import { Textarea } from "@devtools/ui/Textarea";
import { Loader2Icon } from "lucide-react";
import TableView from "./components/TableView";
import TreeView from "./components/TreeView";

export default function JSONComparer() {
    const [jsonInputs, setJsonInputs] = useState(["", ""]);
    const [jsonObjects, setJsonObjects] = useState<any[]>([]);
    const [mode, setMode] = useState("table");
    const [loading, setLoading] = useState(false)

    function handleChange(index: number, value: string) {
        const newInputs = [...jsonInputs];
        newInputs[index] = value;
        setJsonInputs(newInputs);
    };

    function handleCompare() {
        setLoading(true)
        Promise.resolve().then(() => {
            const timer = setTimeout(() => {
                try {
                    const parsed = jsonInputs.map((input) => JSON.parse(input));
                    setJsonObjects(parsed);
                } catch (e: any) {
                    alert("JSON 格式错误: " + (e.message ?? e));
                } finally {
                    clearTimeout(timer)
                    setLoading(false)
                }
            }, 500);
        })
    };

    const addInput = () => setJsonInputs([...jsonInputs, ""]);


    return (
        <>
            {/* <Loader loading={loading} /> */}
            <div className="p-4">
                <h1 className="text-xl font-bold mb-4">JSON 对比工具</h1>
                <Button asChild className="mb-4">
                    <Link replace to="/" className="relative pb-1 text-[#0009] bg-size-[0_2px] bg-linear-to-r[#92db72_#90ff00] transition-all duration-300 ease-in-out bg-bottom bg-right bg-no-repeat hover:bg-size-[100%_2px] hover:bg-left hover:bg-bottom"> Back Home </Link>
                </Button>
                {jsonInputs.map((input, index) => (
                    <Textarea
                        key={index}
                        value={input}
                        onChange={(e) => handleChange(index, e.target.value)}
                        className="border w-full h-24 mb-2 p-2"
                        placeholder={`输入 JSON ${index + 1}`}
                    />
                ))}
                <Button className="mr-4" onClick={addInput}>添加 JSON</Button>
                <Button onClick={handleCompare} disabled={loading}>
                    {loading && <Loader2Icon className="animate-spin" />} 对比
                </Button>

                {jsonObjects.length > 0 && (
                    <div className="mt-4">
                        <div className="mb-2">
                            <Button onClick={() => setMode("table")}>
                                表格模式
                            </Button>
                            <Button onClick={() => setMode("tree")}>
                                树形模式
                            </Button>
                        </div>
                        {mode === "table" ? <TableView jsonObjects={jsonObjects} /> : <TreeView jsonObjects={jsonObjects} />}
                    </div>
                )}
            </div>
        </>
    );
}
