const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const ora = require('ora');
const chalk = require('chalk');
const { spawn } = require('child_process');
const { chdir, exit } = require('node:process');

//递归读取目标目录
const readDirsAndFiles = (tempDir, destDir, answers, callback) => {
  const files = fs.readdirSync(tempDir) || [];
  if (files.length <= 0) {
    return;
  }
  for (const file of files) {
    const filePath = path.join(tempDir, file);
    const writeFilePath = path.join(destDir, file);
    const fileState = fs.statSync(filePath);
    // 目录递归
    if (fileState.isDirectory()) {
      fs.mkdirSync(writeFilePath);
      readDirsAndFiles(filePath, writeFilePath, answers);
    } else {
      const spinner = ora(`reading: ${file} \n`).start();
      if (file.match(/\.(png|jpg)$/)) {
        try {
          fs.writeFileSync(writeFilePath, fs.readFileSync(filePath));
          spinner.succeed(`copied: ${writeFilePath}`);
        } catch (error) {
          throw new Error(error);
        }
      } else {
        ejs.renderFile(filePath, answers, (err, res) => {
          if (err) {
            throw new Error(err);
          }
          try {
            fs.writeFileSync(writeFilePath, res);
            spinner.succeed(`copied: ${writeFilePath}`);
          } catch (error) {
            throw new Error(error);
          }
        });
      }
    }
  }
  callback && callback.call();
};

//安装依赖
const installDependencies = (answers) => {
  const { projectName, pm } = answers;
  const PM = {
    yarn: 'yarn',
    npm: 'npm install',
  };
  try {
    chdir(projectName);
    const ins = spawn(PM[pm], ['install'], {
      shell: /^win/.test(process.platform), // windows环境要加这一句，否则会报错
    });

    let spinner = ora(`Loading 正在安装依赖..`).start();

    ins.stdout.on('data', (data) => {
      spinner.succeed(data.toString());
      spinner = ora(`Loading ${chalk.yellow('正在安装依赖...')}`).start();
    });

    ins.on('close', (code) => {
      if (code !== 0) {
        console.log(chalk.red(`安装失败，退出码 ${code}`));
        spinner.fail();
        exit(1);
      }
      const cdText = `cd ${projectName}`;
      const startText = `${pm} start`;
      spinner.stop();
      console.log(
        chalk.green(
          `\n🎉  Successfully created project ${projectName}.\n👉  Get started with the following commands:\n\n     ${chalk.blueBright(
            cdText,
          )}\n     ${chalk.blueBright(startText)}\n\n`,
        ),
      );
    });
  } catch (err) {
    console.log(`${chalk.redBright('\n' + err + '\n')}`);
    exit(1);
  }
};

module.exports = {
  readDirsAndFiles,
  installDependencies,
};
