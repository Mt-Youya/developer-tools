export const FormatDetectors = [
    { name: "冒号分隔格式", format: 'colonSeparated', detector: /^[^:]+:\s*[^\n]/m },
    { name: "JSON格式", format: 'json', detector: /"[\w]+"\s*:/ },
    { name: "键值对格式", format: 'keyValue', detector: /[\w]+\s*[:=]\s*[^=\s]/ },
    { name: "URL参数格式", format: 'urlParams', detector: /[?&][\w]+=/ },
    { name: "简单格式", format: 'simple', detector: /^[\w]+\s+[^:=]/m },
    { name: "XML/HTML属性格式", format: 'xmlAttributes', detector: /[\w]+\s*=\s*"/ },
    { name: "TOML格式", format: 'toml', detector: /^[\w]+\s*=\s*["'\d]/m },
    { name: "YAML格式", format: 'yaml', detector: /^[\w]+:\s*["'\d]/m },
    { name: "HOCON格式（简化版）", format: 'hocon', detector: /[\w.]+\s*[:=]\s*["'\d{]/ },
    { name: "Properties文件格式（Java）", format: 'properties', detector: /^[\w.]+\s*[=:]/m },
    { name: "INI文件格式", format: 'ini', detector: /^\[[^\]]+\]$/m },
    { name: "格命令行参数格式式", format: 'commandLine', detector: /(?:--[\w-]+\s|--[\w-]+=|-[a-zA-Z]\s)/ },
    { name: "环境变量格式", format: 'env', detector: /^[A-Z_][A-Z0-9_]*\s*=/m },
    { name: "去除行号格式", format: 'dropLineNumber', detector: /^\d+\s*/gm },
] as const;

export type FormatDetectorsType = typeof FormatDetectors
