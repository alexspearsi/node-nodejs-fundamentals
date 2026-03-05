import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const WORKSPACE_RESTORED_DIR = 'workspace_restored'

const restore = async () => {
  try {
    const json = await fs.readFile('./snapshot.json', 'utf-8')
  
    const { entries } = JSON.parse(json)
  
    await fs.mkdir(WORKSPACE_RESTORED_DIR)
  
    for (const entry of entries) {
      const { type, path: entryPath, content } = entry;
  
      if (type === 'file') {
        const filePath = path.join(WORKSPACE_RESTORED_DIR, entryPath)

        await fs.mkdir(path.dirname(filePath), { recursive: true })
  
        await fs.writeFile(filePath, Buffer.from(content, 'base64'))
  
      } else if (type === 'directory') {
        const folderPath = path.join(WORKSPACE_RESTORED_DIR, entryPath)

        await fs.mkdir(folderPath, { recursive: true })
      }
    }
  } catch {
    throw new Error('FS operation failed')
  }
};

await restore();