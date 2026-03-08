import * as fs from 'node:fs/promises'
import { createReadStream } from 'node:fs';
import * as crypto from 'node:crypto'

const verify = async () => {
  try {
    await fs.stat('./checksums.json')
  } catch {
    throw new Error('FS operation failed')
  }

  try {
    const content = await fs.readFile('checksums.json', 'utf-8');
  
    const objWithHashes = JSON.parse(content);
  
    for (const [file, hashedString] of Object.entries(objWithHashes)) {
  
      const hash = crypto.createHash('sha256');
      const stream = createReadStream(file);
  
      for await (const chunk of stream) {
        hash.update(chunk)
      }

      const actualHash = hash.digest('hex');
      console.log(`${file}: ${actualHash === hashedString ? 'OK' : 'FAIL'}`);
    }
    
  } catch {
    throw new Error('FS operation failed')
  }
};

await verify();