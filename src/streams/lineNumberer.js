import { Transform } from 'node:stream';

let lineNumber = 1;

const transformStream = new Transform({
  transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\n')

    const result = lines
      .map((line) => `${lineNumber++} | ${line}`)
      .join('\n')

    result ? callback(null, result) : callback()
  }
})

process.stdin
  .pipe(transformStream)
  .pipe(process.stdout)

