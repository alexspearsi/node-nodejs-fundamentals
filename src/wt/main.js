import * as fs from 'node:fs/promises'
import * as os from 'node:os';
import { Worker } from 'worker_threads';

const main = async () => {
  const data = await fs.readFile('./data.json', 'utf-8');
  const array = JSON.parse(data);
  
  const cpuCount = os.cpus().length;
  
  const chunks = [];
  const chunkSize = Math.ceil(array.length / cpuCount)
  
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  
  const workers = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const worker = new Worker(new URL('./worker.js', import.meta.url));
    
    worker.postMessage(chunks[i])
    
    workers.push(worker)
  }
  
  const results = await Promise.all(workers.map((worker) => {
    return new Promise((resolve) => {
      worker.on('message', (msg) => resolve(msg))
    })
  }))
  
  console.log(mergedArrays(results));
};

await main();


function mergedArrays(array) {
  const result = [];
  const indexes = new Array(array.length).fill(0)

  while (true) {
    let minValue = Infinity;
    let minIndex = -1;

    for (const [i, arr] of array.entries()) {
      const index = indexes[i];

      if (index < arr.length && arr[index] < minValue) {
        minValue = arr[index];
        minIndex = i;
      }
    }

    if (minIndex === -1) {
      break;
    }

    result.push(minValue);
    indexes[minIndex]++;
  }

  return result;
}


