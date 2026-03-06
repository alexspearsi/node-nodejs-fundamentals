import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const WORKSPACE_DIR = path.join(path.resolve(), 'workspace');
const PARTS_DIR = path.join(WORKSPACE_DIR, 'parts');
const MERGED_FILE = path.join(WORKSPACE_DIR, 'merged.txt');

const merge = async () => {
  try {
    await fs.access(PARTS_DIR);

    const [arg, value] = process.argv.slice(2);

    let files = [];

    if (arg === '--files') {
      if (!value) {
        throw new Error('FS operation failed');
      }

      files = value.split(',');

      for (const file of files) {
        await fs.access(path.join(PARTS_DIR, file));
      }

    } else if (arg === undefined) {
      const items = await fs.readdir(PARTS_DIR);

      files = items
        .filter((item) => path.extname(item) === '.txt')
        .sort();

      if (files.length === 0) {
        throw new Error('FS operation failed');
      }

    } else {
      throw new Error('FS operation failed');
    }

    let text = '';

    for (const file of files) {
      const filePath = path.join(PARTS_DIR, file);
      const content = await fs.readFile(filePath, 'utf-8');
      text += content;
    }

    await fs.writeFile(MERGED_FILE, text);

  } catch {
    throw new Error('FS operation failed');
  }
};

await merge();