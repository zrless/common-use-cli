#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { exit } = require('node:process');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { readDirsAndFiles, installDependencies } = require('./utils');
const { checkProjectName, checkProjectDir } = require('./validate');

async function init(projectName) {
  const projectDir = process.cwd() + '/' + projectName;
  if (!checkProjectName(projectName)) {
    console.log(`${chalk.redBright(' \n 项目名称格式:包含英文字母,数字,特殊字符 \n')}`);
    exit(1);
  }
  // 判断当前文件夹下有没有项目目录,如果有终止程序并报错
  if (checkProjectDir(projectDir)) {
    console.log(`${chalk.redBright(' \n 当前目录下已存在该项目,请检查重试 \n')}`);
    exit(1);
  }

  console.log(`${chalk.greenBright('\n 请完成以下初始化项目的信息: \n')}`);
  let promptList = [];
  if (!projectName) {
    promptList.push({
      type: 'input',
      message: '设置一个项目名称:',
      name: 'projectName',
      validate: (val) => {
        if (!val) {
          return '请输入项目名称';
        } else if (!checkProjectName(val)) {
          return '项目名称格式:包含英文字母,数字,特殊字符';
        } else {
          return true;
        }
      },
    });
  }

  promptList = promptList.concat([
    {
      type: 'input',
      message: '设置项目标题/描述:',
      name: 'title',
      validate: (val) => {
        if (!val) {
          return '请设置项目标题/描述';
        } else {
          return true;
        }
      },
    },
    {
      type: 'list',
      message: '选择项目模板:',
      name: 'temp',
      choices: ['umi 3.x', 'create-react-app'],
      validate: (val) => {
        if (!val) {
          return '请选择项目模板';
        } else {
          return true;
        }
      },
    },
    {
      type: 'list',
      message: '选择安装依赖方式:',
      name: 'pm',
      choices: ['yarn', 'npm'],
      validate: (val) => {
        if (!val) {
          return '请选择安装依赖方式';
        } else {
          return true;
        }
      },
    },
  ]);

  /**
   * 1.inquirer 先交互获取用户输入信息并校验
   * 2.获取读取目录templates路径,读取目录下的文件
   * 3.文件循环
   *    1) ejs.renderFile - 把读取目录下的文件中的变量替换渲染
   *    2) fs.writeFileSync - 渲染后的结果写入文件目标目录
   * @returns
   */

  inquirer
    .prompt(promptList)
    .then((res) => {
      const answers = { projectName, ...res };
      //读取指定的文件模板目录
      const tempDir = path.resolve(__dirname, `../templates/${answers.temp}`);
      //文件写入目标目录
      try {
        fs.mkdirSync(projectName);
      } catch (error) {
        throw Error(error);
      }
      const destDir = projectDir;
      readDirsAndFiles(tempDir, destDir, answers, () => {
        console.log('\n');
        installDependencies(answers);
      });
    })
    .catch((err) => {
      console.log(`${chalk.redBright('\n' + err + '\n')}`);
      exit(1);
    });
}

module.exports = (...args) => {
  return init(...args).catch((err) => {
    console.error(err);
    exit(1);
  });
};
