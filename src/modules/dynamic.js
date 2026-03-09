const dynamic = async () => {
  try {
    const [plugin] = process.argv.slice(2);
  
    const pluginModule = await import(`./plugins/${plugin}.js`)
    console.log(pluginModule.run());
  } catch {
    console.log('Plugin not found');
    process.exit(1)
  }
};

await dynamic();
