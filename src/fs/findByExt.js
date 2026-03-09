import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const WORKSPACE_DIR = path.join(path.resolve(), 'workspace');
const files = [];

const walk = async (dirPath, ext = 'txt') => {
  const items = await fs.readdir(dirPath, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    const relativePath = path.relative(WORKSPACE_DIR, fullPath).replaceAll(path.sep, '/')

    if (item.isFile()) {

      if (relativePath.split('.').at(-1) === ext) {
        files.push(relativePath);
      }

    } else if (item.isDirectory()) {

      await walk(fullPath, ext)
    }
  }
}

const findByExt = async () => {
  try {
    await fs.access(WORKSPACE_DIR)
  } catch {
    throw new Error('FS operation failed')
  }

  const [arg, ext = 'txt'] = process.argv.slice(2)

  let extension = 'txt'

  if (arg === '--ext' && ext) {
    extension = ext;
  }

  await walk(WORKSPACE_DIR, extension)

  files.sort().forEach((file) => console.log(file))
};

await findByExt();