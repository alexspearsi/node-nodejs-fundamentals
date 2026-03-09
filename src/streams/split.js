import { parseArgs } from 'node:util'
import { createReadStream, createWriteStream } from 'node:fs';

const split = async () => {
  const { values } = parseArgs({ options: { lines: { type: 'string' } } })
  const maxLines = Number(values.lines ?? 10)

  const readStream = createReadStream('./source.txt', { encoding: 'utf-8' });

  let lines = [];
  let chunkIndex = 1;

  for await (const chunk of readStream) {
    const parts = chunk.split('\n');

    for (const line of parts) {
      lines.push(line);

      if (lines.length === maxLines) {
        const content = lines.join('\n');

        const ws = createWriteStream(`chunk_${chunkIndex}.txt`);
        ws.write(content)
        ws.end()

        chunkIndex++;
        lines = [];
      }
    }
  }

  if (lines.length > 0) {
    const ws = createWriteStream(`chunk_${chunkIndex}.txt`);
    ws.write(lines.join('\n'))
    ws.end();
  }
};

await split();