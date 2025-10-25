interface TreeNodeProps {
  nodeKey: string
  values: any[]
}

function TreeNode({ nodeKey, values }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true)
  const isObjectOrArray = values.some((val) => typeof val === "object" && val !== null)

  if (isObjectOrArray) {
    const childKeys = new Set()
    for (const val of values) {
      if (val && typeof val === "object") {
        Object.keys(val).map((k) => childKeys.add(k))
      }
    }

    return (
      <div className="ml-4">
        <button type="button" className="cursor-pointer font-bold" onClick={() => setExpanded(!expanded)}>
          {expanded ? "➖" : "➕"} {nodeKey || "root"}
        </button>
        {expanded && (
          <div className="ml-6">
            {Array.from(childKeys).map((child: any, idx) => {
              const childValues = values.map((val) => (val && typeof val === "object" ? val[child] : undefined))
              return <TreeNode key={idx + child + Math.random()} nodeKey={child} values={childValues} />
            })}
          </div>
        )}
      </div>
    )
  }

  // primitive values
  const allEqual = values.every((val) => val === values[0])
  return (
    <div className={`ml-4 p-1 ${allEqual ? "" : "bg-red-200"}`}>
      <span className="font-medium">{nodeKey}: </span>
      {values.map((val, i) => (
        <span key={i}>
          {val === undefined ? "<缺失> 🙅" : String(val)}
          {i % 2 === 0 && <span className="mx-4"> {allEqual ? "✅" : "❌"}</span>}
        </span>
      ))}
    </div>
  )
}

export default TreeNode
