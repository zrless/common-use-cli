# common-use-cli

## 介绍



## 功能



## 版本

- node v16以上
- npm v8以上

## 使用

1. npm设置公司的私有库

```bash
npm config set registry [your-registry]
```

2. 全局安装common-use-cli：

```bash
npm install -g common-use-cli
# OR
yarn global add common-use-cli
```

3. 创建一个项目：

```bash
comuse init [sub-project]
# OR
comuse i [sub-project]
```

## 本地调试

```bash
yarn or npm install
```

在本地开发npm模块的时候,将npm模块链接到对应的运行项目中去，方便地对模块进行调试和测试

```bash
//连接成功之后,即可在本地使用`comuse`脚手架命令
npm link
```

```bash
//取消连接
npm unlink
```

## 发布
```bash
npm publish
```

