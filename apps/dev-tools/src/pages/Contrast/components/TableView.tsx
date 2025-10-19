import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@devtools/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@devtools/tooltip";
import type { Dictionary } from "@/stores/command";
import { isStringArray, isObject } from "@/utils/is";

function flattenObject(obj: any, parentKey = "", result: Dictionary = {}) {
    for (let key in obj) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (isObject(obj[key]) && obj[key] !== null && !Array.isArray(obj[key])) {
            flattenObject(obj[key], newKey, result);
        } else if (Array.isArray(obj[key])) {
            if (isStringArray(obj[key])) {
                for (const idx in obj[key]) {
                    result[newKey + `[${idx}]`] = obj[key][idx];
                }
                continue
            }
            obj[key].forEach((item, index) => {
                flattenObject(item, `${newKey}[${index}]`, result);
            });
        } else {
            result[newKey] = obj[key];
        }
    }
    return result;
}

function TableView<T = any>({ jsonObjects }: { jsonObjects: T[] }) {
    const flattened = jsonObjects.map((obj) => flattenObject(obj));
    const keys = Array.from(
        new Set(flattened.flatMap((obj) => Object.keys(obj)))
    );

    return (
        <Table className="border-collapse border border-gray-400 w-screen max-w-screen overflow-hidden">
            <TableHeader>
                <TableRow>
                    <TableHead className="border border-gray-400 px-2">Key</TableHead>
                    {jsonObjects.map((_, i) => (
                        <TableHead key={i} className="border border-gray-400 px-2">
                            JSON {i + 1}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody className="max-w-screen overflow-hidden">
                {keys.map((key, idx) => {
                    const rowValues = flattened.map((obj) => obj[key]);
                    const allEqual = rowValues.every((val) => val === rowValues[0]);
                    return (
                        <TableRow key={key + idx} className={`${allEqual ? "" : "bg-red-200"} max-w-screen`}>
                            <TableCell className="border border-gray-400 px-2 max-w-1/3 truncate">{key}</TableCell>
                            {rowValues.map((val, i) => {
                                const content = val === undefined ? "❌ <缺失> 🙅" : val?.toString()
                                return (
                                    <Tooltip key={i.toString() + val}>
                                        <TableCell key={i} className="border border-gray-400 px-2 max-w-3xl truncate">
                                            <TooltipTrigger> {content} </TooltipTrigger>
                                        </TableCell>
                                        <TooltipContent className="max-w-screen"> {content} </TooltipContent>
                                    </Tooltip>
                                )
                            })}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

export default TableView
