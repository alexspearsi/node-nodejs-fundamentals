function getRGBColor(color) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  return `\x1b[38;2;${r};${g};${b}m`;
}

const progress = () => {
  const args = process.argv.slice(2)

  const options = {
    duration: 5000,
    interval: 100,
    length: 30,
    color: '',
  }

  for (let i = 0; i < args.length; i++) {
    switch(args[i]) {
      case '--duration':
        options.duration = Number(args[i + 1])
        i++;
        break;
      case '--interval':
        options.interval = Number(args[i + 1])
        i++;
        break;
      case '--length':
        options.length = Number(args[i + 1])
        i++;
        break;
      case '--color':
        const color = args[i + 1];

        if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
          options.color = getRGBColor(color)
        } else {
          options.color = '';
        }

        i++;
        break;
    }
  }

  function stopLoading() {
    clearInterval(interval);

    process.stdout.write(`\r\x1b[0m${showProgressBar(100)}\n`);
    process.stdout.write(`Done!\n`);
  }

  setTimeout(stopLoading, options.duration)

  function showProgressBar(percentageProgress) {
    const barLength = options.length;

    const filledPart = Math.floor(percentageProgress / 100 * barLength);
    const emptyPart = barLength - filledPart;

    const filled = '█'.repeat(filledPart)
    const empty = ' '.repeat(emptyPart)

    return `[${options.color}${filled}\x1b[0m${empty}] ${percentageProgress}%`;
  }

  const waitInterval = options.interval;
  let currentValue = 0;

  function increaseValueInBar() {
    currentValue += waitInterval;
    const progressPercentage = Math.floor(currentValue / options.duration * 100)
    process.stdout.write(`\r${showProgressBar(progressPercentage)}`)
  }

  const interval = setInterval(increaseValueInBar, options.interval)
};

progress();
