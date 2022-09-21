---
title: "3-部署一个UniswapV3"
date: 2022-09-21T16:16:37+08:00
draft: false
---
## 前沿
既然是一个循序渐进的教程，那么肯定不能一上来就开始写代码。就好比你想造一台永动机，你至少要知道这个永动机动起来是什么样子，你才能更好的去分解他。
所以这一章节我们主要是部署一个UniswapV3，所以这章节的目的是快速并且简单的部署好一个UniswapV3，用于未来我们程序和Uni的联调。
## 安装Uni包 🦄️
不过，在安装之前，我推荐你把第二章配置好的模版保存起来，以后就不用重新配置了。当然，这是**可选内容**。
首先安装UniswapV3，我们要知道一件事。Uniswap的合约分为两个，一个是`v3-periphery` 另外一个是`v3-core` 。现在简单介绍一下这两个仓库的合约是代表什么。
### v3-core
core合约是uniswap中负责掌管pool和factory的仓库。
pool：是资金存储和交换运算的合约。
factory：用于批量创造Pool的合约。
这两个合约是整个uniswap的核心。就算在没有periphery的情况下，也能正常运行的最小合约。
### v3-periphery
periphery存放的是外围合约，这些合约是给用户和开发者一个统一的接口或者是便捷的通证。核心合约有NFTManager和SwapRouter。
NFTManager：一个用于记录用户创建的流动性各类数据的合约。
SwapRouter：包装类，将交换的各种逻辑进行包装抽象。
这里我们不过度展开UniswapV3的逻辑。我们重点是如何去部署他。
通过执行
```shell
yarn add @uniswap/v3-core @uniswap/v3-periphery@1.4.1
```
先安装好两个必要的合约仓库。要注意的是，`@uniswap/v3-periphery@1.4.1` 是带了版本号的，这是因为在编写本文的时候，1.4.2版本缺少artifacts文件夹，相关issue如下。[github-issue](https://github.com/Uniswap/v3-periphery/issues/313), 如果当你看到这篇文章时，这个issue已经被解决了，那么就不用加上末尾的版本号指定了。
## 通过ByteCode部署 💻
部署合约其实只有一种方式，就是从bytecode进行部署，但是不同的工具会提供不同等级的封装。以至于封装到极致后，你只需要输入一个合约名称就可以部署。不过为了方便了解原理，我们就使用最为基础的部署方式进行部署。
我们先创建一个deploy文件。在deploy文件夹下创建一个名为00_deploy_univ3.ts的文件。
代码内容如下。
```js
import { DeployFunction } from "hardhat-deploy/types";
const func: DeployFunction = async function () {
    
}
export default func;
```
这是一个deploy文件最基础的框架函数，我们首先要部署的是core中的factory合约。所以我们修改代码为。
```js
import { DeployFunction } from "hardhat-deploy/types";
import {
    abi as FACTORY_ABI,
    bytecode as FACTORY_BYTECODE,
} from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'
import { HardhatRuntimeEnvironment } from "hardhat/types";
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments,ethers } = hre
    const [deployer] = await ethers.getSigners()
    await deployments.deploy("UniV3Factory", {
        from: deployer.address,
        contract: {
            bytecode: FACTORY_BYTECODE,
            abi: FACTORY_ABI
        },
    })
}
export default func;
```
加了”一点点”细节后，我们的代码丰富了起来。这里先解释一下关键内容。
```js
import {
    abi as FACTORY_ABI,
    bytecode as FACTORY_BYTECODE,
} from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'
```
这段代码的内容是从uniswap提供的官方包中，引入bytecode和abi数据，这样我们就能直接在下面进行内容填充。
```js
await deployments.deploy("UniV3Factory", {
    from: deployer.address,
    contract: {
        bytecode: FACTORY_BYTECODE,
        abi: FACTORY_ABI
    },
})
```
这段代码是部署V3Factory合约的代码。其中deploy是hardhat-deploy插件提供的函数，我们在第二个参数中指定了bytecode和abi——这两个必须都要有。
当然，我们还要修改tsconfig.json文件，添加 "resolveJsonModule": true的选项。修改后文件如下。
```js
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
}
```
接下来是SwapRouter合约，我们如法炮制，修改代码如下。当然你也可以尝试自己动手试试。
```js
import { DeployFunction } from "hardhat-deploy/types";
import {
    abi as FACTORY_ABI,
    bytecode as FACTORY_BYTECODE,
} from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'
import {
    abi as SWAP_ROUTER_ABI,
    bytecode as SWAP_ROUTER_BYTECODE,
} from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json'
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { constants } from "ethers";
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, ethers } = hre
    const [deployer] = await ethers.getSigners()
    const factory = await deployments.deploy("UniV3Factory", {
        from: deployer.address,
        contract: {
            bytecode: FACTORY_BYTECODE,
            abi: FACTORY_ABI
        },
    })
    await deployments.deploy("UniV3SwapRouter", {
        from: deployer.address,
        contract: {
            abi: SWAP_ROUTER_ABI,
            bytecode: SWAP_ROUTER_BYTECODE
        },
        args:[factory.address,constants.AddressZero]
        // 上面是部署合约的参数，第一个参数为factory地址，第二个为WETH地址，这里为了图方便就直接用0地址啦😁
    })
}
export default func;
```
那么我们的部署脚本到这里就编写完成了。通过命令`yarn hardhat deploy` 即可将代码部署到任何网络上。
不过，通过bytecode直接部署会有一些不好的地方，比如在出错的时候，你无法获得源码级别的错误追踪。并且，我们部署的也是一个残缺的版本，因为我们还缺少NonfungiblePositionManager，NonfungibleTokenPositionDescriptor，NFTDescriptor合约，不过，它们的部署方式都是一样的。你可以试着用上述的方法添加它们。就当是课后作业啦。
## 结语
这一个章节只构建了通过bytecode部署uniswap的基础文件，但是我们的内容其实是不够一个实际的uniswap运行的。所以在下一章节，我们会使用另外一种方式部署uniswapv3，并且编写测试用例。等测试用例通过后，我们再用源码编译的方式对UniswapV3进行部署。