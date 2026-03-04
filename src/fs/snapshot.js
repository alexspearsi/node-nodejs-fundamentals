import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const WORKSPACE_DIR = path.join(path.resolve(), 'workspace');

const SNAPSHOT = {
  "rootPath": WORKSPACE_DIR.replaceAll(path.sep, '/'),
  "entries": []
}

const walk = async (dirPath) => {
  const items = await fs.readdir(dirPath, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    const relativePath = path.relative(WORKSPACE_DIR, fullPath).replaceAll(path.sep, '/')

    if (item.isFile()) {
      const stat = await fs.stat(fullPath);
      const buffer = await fs.readFile(fullPath);
      const content = buffer.toString('base64');

      SNAPSHOT.entries.push({
        path: relativePath,
        type: "file",
        size: stat.size,
        content
      })

    } else if (item.isDirectory()) {
      SNAPSHOT.entries.push({
        path: relativePath,
        type: "directory"
      })

      await walk(fullPath)
    }
  }
}

const snapshot = async () => {
  try {
    await fs.readdir(WORKSPACE_DIR)

    await walk(WORKSPACE_DIR)

    await fs.writeFile(
      path.join(path.resolve(), 'snapshot.json'), 
      JSON.stringify(SNAPSHOT, null, 2)
    )

  } catch {
    throw new Error('FS operation failed')
  }
};

await snapshot()