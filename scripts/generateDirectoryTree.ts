import fs from "node:fs";
import path from "node:path";

/**
 * 生成目录树结构
 * @param {string} dir - 目录路径
 * @param {string} prefix - 前缀字符
 * @param {Array} ignore - 忽略的文件/目录列表
 * @returns {string} 目录树字符串
 */
export function generateTree(dir, prefix = '', ignore = ['node_modules', '.git', 'dist', 'build']) {
  let result = '';
  
  try {
    const items = fs.readdirSync(dir);
    const filtered = items.filter(item => !ignore.includes(item));
    
    filtered.forEach((item, index) => {
      const isLast = index === filtered.length - 1;
      const itemPath = path.join(dir, item);
      const isDir = fs.statSync(itemPath).isDirectory();
      
      // 树形符号
      const connector = isLast ? '└── ' : '├── ';
      const extension = isLast ? '    ' : '│   ';
      
      // 添加当前项
      result += prefix + connector + item + (isDir ? '/' : '') + '\n';
      
      // 如果是目录，递归处理
      if (isDir) {
        result += generateTree(itemPath, prefix + extension, ignore);
      }
    });
  } catch (err) {
    console.error(`读取目录出错: ${err.message}`);
  }
  
  return result;
}

/**
 * 主函数
 */
function main() {
  const targetDir = process.argv[2] || '.';
  const dirName = path.basename(path.resolve(targetDir));
  
  console.log(dirName + '/');
  console.log(generateTree(targetDir));
  
  // 可选：保存到文件
  const output = dirName + '/\n' + generateTree(targetDir);
  fs.writeFileSync('directory-tree.txt', output, 'utf8');
  console.log('\n目录结构已保存到 directory-tree.txt');
}

// 运行程序
main();
 