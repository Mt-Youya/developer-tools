import TreeNode from "./TreeNode";

function TreeView<T = string>({ jsonObjects }: { jsonObjects: T[] }) {
    return <TreeNode nodeKey="root" values={jsonObjects} />;
}

export default TreeView
