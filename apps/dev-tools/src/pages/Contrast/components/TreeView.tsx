import TreeNode from "./TreeNode"

function TreeView<T = string>({ jsonObjects }: { jsonObjects: T[] }) {
  "use memo"
  return <TreeNode nodeKey="root" values={jsonObjects} />
}

export default TreeView
