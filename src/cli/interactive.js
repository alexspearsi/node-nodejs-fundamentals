import readline from 'node:readline';
import * as process from 'node:process';
import * as path from 'node:path';

const interactive = () => {
  const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout,
    prompt: '> '
  });

  rl.prompt()

  rl.on('line', (line) => {
    switch (line) {
      case 'uptime':
        console.log(`Uptime: ${process.uptime().toFixed(2)}s`);
        break;
      case 'cwd':
        console.log(process.cwd());
        break;
      case 'date':
        console.log(new Date().toISOString());
        break;
      case 'exit':
        console.log('Goodbye!');
        process.exit(0);
      default:
        console.log('Unknown command');
    }

    rl.prompt()
  })

  rl.on('SIGINT', () => {
    console.log('Goodbye!');
    process.exit(0);
  })

  rl.on('close', () => {
    console.log('Goodbye!')
    process.exit(0);
  })
};

interactive();