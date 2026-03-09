import { spawn } from 'child_process';

const execCommand = () => {
  const [fullComand] = process.argv.slice(2);
  
  if (!fullComand) {
    process.exit(1)
  }
  
  const [command, ...args] = fullComand.split(' ');

  const child = spawn(command, args, {
    stdio: 'inherit',
    env: process.env
  });

  child.on('exit', (code) => process.exit(code))
  child.on('error', () => process.exit(1))
  
};

execCommand();