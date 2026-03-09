import { Transform } from "stream";
import { parseArgs } from "node:util";

const filter = () => {
  const { values } = parseArgs({ options: { pattern: { type: 'string' } } })
  const { pattern } = values;

  const transformStream = new Transform({
    transform(chunk, encoding, callback) {
      const lines = chunk.toString().split('\n')

      const result = lines
        .filter((line) => line.includes(pattern))
        .join('\n')

      result ? callback(null, result + '\n') : callback()
    }
  })

  process.stdin
    .pipe(transformStream)
    .pipe(process.stdout)
}

filter();
