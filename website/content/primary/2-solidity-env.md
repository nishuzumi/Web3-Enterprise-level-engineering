---
title: "2-Solidity环境"
draft: false
---
## 前言
本篇会介绍常用的几种Solidity开发环境，同时会推荐一种最为合适的开发环境并且安装必要的内容。
## 环境介绍
目前Solidity开发环境大致分为2类
* 线上类：依赖于浏览器的一体式开发环境，可以方便的进行debug，管理账户余额，配置环境等等操作。
* 线下类：适用于本地开发的环境。
### 线上类
线上类产品主要是Remxi <https://remix.ethereum.org/ >
Remix是ETH官方提供的线上开发环境，是一个非常强大的整合云环境开发IDE。提供了文件管理，在线编译，静态分析，部署以及运行交易，测试等功能。并且内置了强大的插件系统。
Remix在各个方面都非常强大，甚至能直接修改读取本地文件。美中不足的是不支持多版本编译器。在面对一些简单开发，或者临时对链上进行一些分析或数据调用操作是非常合适的。
### 线下类
#### Truffle Suite
网址：<https://trufflesuite.com/>
Truffle Suite是一个套件名称，其中包含了truffle，ganache，drizzle等工具。
Truffle：一个适用于EVM的开发环境，包含测试等工具套件。
Ganache：一个用于测试开发的evm本地节点，可用于合约的部署开发测试等功能。
Drizzle：基于 Redux的前端组建，方便在前端进行交互。
#### Hardhat
网址：<https://hardhat.org/>
前身Builder，是一个功能超级齐全的Solidity开发框架，几乎涵盖了所有的Solidity开发需要的功能。自带智能合约的测试，编译，以及本地节点，是一个高整合的开发框架，并且具有强大的插件系统，使得开发更为简单。
#### Foundry
网址：<https://getfoundry.sh/>
基于Rust开发的一个solidity开发框架，以速度为主打。同样也是涵盖了开发，测试，本地节点功能。与Hardhat不同的是，foundry的测试代码使用的是solidity编写，但是配合vm cheat code也能和本地环境进行互动。但是相比于Hardhat还是缺少了一些功能。
还有一些使用python开发的框架，本文并不一一阐述，有兴趣的朋友可以自行搜索。
## Hardhat的环境搭建
在三种主流的开发环境下，`Hardhat`其强大的功能让他成为了开发框架的标杆，如果有人还在推荐`truffle`作为你的开发框架，请自豪的搬出Hardhat并且让他也加入Hardhat的大家族。
当然，这并不是代表Hardhat没有缺点，只不过在优点和缺点进行权衡利弊后显得微不足道。当然Foundry也是一个非常强大的框架，但是他的功能依然没有Hardhat全面，不过，将Hardhat和Foundry一起使用会有意想不到的效果。
不过，我们暂时不去做这种事情，因为Hardhat目前已经足以应对大部分情况。
废话不多说，直接进入下一步。
### 创建项目，安装Hardhat
找到一个你喜欢的目录，新建文件夹后，用vscode打开这个文件夹。你也可以使用终端，输入code \\\\path\\\\to\\\\your\\\\project，即可用vscode一键打开项目目录。
打开VSCode后，我们按下`Command+J` 这个组合键即可打开VSCode的Terminal栏。在这里我们进行安装Hardhat。
输入`npx hardhat` 等待提示按下回车，稍等片刻（如果比较慢请开启科学上网）。
![Hardhat安装](https://images.mirror-media.xyz/publication-images/BDvwHE1tPZSRGMWxon-LD.png?height=784&width=2020)
这里我们按一下 下方向键，选择`Create a TypeScript project` 当然你完全可以选择`Create a Javascript project` 只不过并不是很推荐，因为TS在多人协作比JS具有更多的优势。
![完成初步设定](https://images.mirror-media.xyz/publication-images/SZFQonj_2FBHm4tTqPhye.png?height=730&width=2184)
按照提示完成初步设定，不过注意要在`Do you want to install this sample project's dependencies with npm` 时输入n。因为我们需要用`Yarn`来管理依赖。
然后我们输入`yarn add \"hardhat@^2.11.1\" @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-network-helpers @nomicfoundation/hardhat-chai-matchers @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan chai ethers hardhat-gas-reporter solidity-coverage @typechain/hardhat typechain @typechain/ethers-v5 @ethersproject/abi @ethersproject/providers` 进行依赖安装。
#### 注意⚠️
![安装依赖](https://images.mirror-media.xyz/publication-images/ksB0tBOwTZhNP7BhVaz1Y.png?height=318&width=2362)
如果你出现了这个错误。不用慌，这在JS的世界是再常见不过的事情了，将来还会遇到各种各样的问题，比如缺少python编译环境啦，架构不对啦等等。
这里遇到的问题是当前的node版本并不符合要求。可以看到，需要node的版本为 ^14,^16,^18。所以这里我们需要重新安装node到符合条件的版本，这个问题可能是因为你安装的node版本不对，或者是你使用了`brew install nvm` ，如果是，你可以输入`brew uninstall nvm` 然后使用以下命令安装：`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash` 。然后重启终端。
#### 安装完成
![](https://images.mirror-media.xyz/publication-images/Hd_YugjUfypJfQb-3fxaK.png?height=1994&width=2716)
安装完成后，你的目录结构应该是这样。
### 安装其他必要依赖
当然，我们教程的目的是企业级工程，所以只安装本体的Hardhat是完完全全不够的，因为这还缺少一个工程可持续升级的功能。
#### Typescript
因为我们创建的是typescript项目，所以我们需要安装typescript的依赖。
```
yarn add ts-node typescript chai @types/node @types/mocha @types/chai
```
#### Hardhat deploy
这是hardhat工程化必要的插件，这个插件用来帮忙管理代码部署，你能轻松的在代码中根据名称获取到你部署的合约地址，同时也能根据上下文来决定什么合约需要部署。还能和migration一样设定只能部署一次的合约。同时也给测试提供了非常方便的函数来进行灵活的合约部署，比如你可以只部署带有某些tag的合约。
安装`Hardhat deploy`只需要输入以下命令
```
yarn add hardhat-deploy @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
```
然后在`hardhat.config.ts` 文件中添加`import \"hardhat-deploy\"` 。
到此，deploy就已经安装完成。我们在根目录下建立deploy文件夹，以后的deploy文件都会放在这个文件夹下。
#### Dotenv
dotenv是可以把`.env` 文件导入到系统环境变量中给程序使用的一个js包，这个包非常有用，因为我们在工程化开发代码的时候，一定会使用git或者其他的版本管理工具。对于私有项目来说，一些机密的变量上传到版本库可能问题不太大，但是如果是公有项目，那将会或多或少的有一些安全问题。所以我们需要把一些变量放到不会被上传到版本控制的文件。
输入
```
yarn add dotenv
```
然后修改`hardhat.config.ts` 在最上面添加`import 'dotenv/config'` 。
到此为止，我们必要的项目工程包就已经安装完成，你可以把这个包做成一个模版，保存起来以后使用。
我们运行一下测试命令来看看我们的整合包是否正常。
```
yarn hardhat test
```
![正常运行图](https://images.mirror-media.xyz/publication-images/3OVu6xEN2b4ptFstC2Di9.png?height=756&width=1486)
当你看到以上内容时，那么恭喜你，一个符合工程标准的环境就搭建好了。
## VSCode插件（可选内容）
当然，给我们的VSCode装点插件可以更好的帮助我们开发。我这里推荐几个插件。
* [Hardhat Solidity](https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity) - 这个是Hardhat团队开发的Solidity插件，非常好用
* Copilot - Github的智能补全代码插件，也是非常好用
* Material Theme Icons - 美化插件
* Material Theme - 还是个美化插件
最后安装效果如下。
![](https://images.mirror-media.xyz/publication-images/Ke_x5Zg84tTe5njftYfrI.png?height=1494&width=2458)
当然啦，每个人自己对美都有一种定义，所以如果你决定不好看，请随意的更换。
## 总结
本章讲述了如何安装Hardhat的工程环境，在后续的教程中，会通过实现一个与Uniswap进行交互的程序来开展后面的内容。
