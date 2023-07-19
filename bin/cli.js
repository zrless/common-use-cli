#!/usr/bin/env node
const { program } = require('commander');
const { version } = require('../package');

program.version(version).usage('<command> [options] 快速启动项目'); //-h 打印的用户提示

program
  .command('init [projectName]')
  .description('init a new subapp project')
  .alias('i')
  .action((projectName, options) => {
    require('./init')(projectName, options);
  });

program.parse(process.argv);
