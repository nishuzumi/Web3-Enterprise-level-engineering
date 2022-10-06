---
title: '4-部署完整版UniswapV3'
image: '/images/primary_banner.png'
---
## 前言
文接上回，我们已经部署了Uniswap的核心合约，接下来我们将部署完整版的UniswapV3。  
完整版的UniswapV3包含了以下合约：
* UniswapV3Factory (Pool生成合约)
* UniswapV3SwapRouter (包装类交易合约)
* NonfungiblePositionManager (NFT管理合约)
* NonfungibleTokenPositionDescriptor (NFT仓位描述合约)
* NFTDescriptor (NFT描述合约)
* WETH9 (WrapperETH)

我们上一章节已经部署完成了前两个合约，那么我们这一章节就需要开始部署后续合约。其实部署方法都是一样的。只不过有一点点需要注意的地方是，`NonfungibleTokenPositionDescriptor`需要进行Library链接，将`NFTDescriptor`部署后作为Library链接到`NonfungibleTokenPositionDescriptor`中。接下来我们会继续完善我们的部署脚本，将这些合约都部署出来。

## 完善部署脚本
我们继续完善我们的部署脚本，将上一章节中部署的合约和这一章节中需要部署的合约都部署出来。因为部署方式和上一章节中的部署方式一样，所以我们只需要在`00_deploy_univ3.ts`中添加一些代码即可。
不过我们还需要添加一个WETH9的合约。我们上一章节中，在填写WETH9的位置直接使用了0地址代替，现在可不行了。所以我们先打开网址`https://github.com/gnosis/canonical-weth/blob/master/contracts/WETH9.sol`，复制里面的代码，然后在contracts文件夹下新建一个`WETH9.sol`文件，将代码粘贴进去。  
然后我们运行一下`yarn hardhat compile`，将合约编译一下。可以不出所料的出现一个错误。
![](2022-09-23-01-34-40.png)
这是因为我们的编译器版本不对，因为WETH9的合约是用`>=0.4.22 <0.6`的版本进行编译，而我们默认的是`^0.8.0`的版本，所以我们需要修改编译器的版本。不过得益于Hardhat的强大功能，我们可以设定多个版本的编译器，这样我们就能在多个版本的编译器下编译我们的合约了。
我们打开`hardhat.config.ts`，在`solidity`的配置项中添加一个`compilers`的配置项，将其设置为一个数组，数组中包含我们需要的编译器版本。
```typescript
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.0',
      },
      {
        version: '0.4.22',
      },
    ],
  },
};
```
修改完成后，我们再次编译。
![](2022-09-23-01-56-34.png)
轻而易举的就编译成功了。

## 修改deploy文件
我们打开`00_deploy_univ3.ts`，在`main`函数中添加一些代码。
```typescript showLineNumbers
import { utils } from 'ethers'
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

import {
    abi as NFTDescriptor_ABI, bytecode as NFTDescriptor_BYTECODE
} from '@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json'

import {
    abi as NFTPositionManager_ABI, bytecode as NFTPositionManager_BYTECODE
} from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'

import {
    abi as NFTPositionDescriptor_ABI, bytecode as NFTPositionDescriptor_BYTECODE
} from '@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json'


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

    const WETH9 = await deployments.deploy("WETH9", {
        from: deployer.address
    })

    await deployments.deploy("UniV3SwapRouter", {
        from: deployer.address,
        contract: {
            abi: SWAP_ROUTER_ABI,
            bytecode: SWAP_ROUTER_BYTECODE
        },
        args: [factory.address, WETH9.address]
    })

    const NFTDescriptorlibrary = await deployments.deploy('NFTDescriptorLibrary', {
        from: deployer.address,
        contract: {
            abi: NFTDescriptor_ABI,
            bytecode: NFTDescriptor_BYTECODE
        }
    })

    const linkedBytecode = linkLibrary(NFTPositionDescriptor_BYTECODE,
        {
            ['contracts/libraries/NFTDescriptor.sol:NFTDescriptor']: NFTDescriptorlibrary.address
        }
    )

    const positionDescriptor = await deployments.deploy('NFTPositionDescriptor', {
        from: deployer.address,
        contract: {
            abi: NFTPositionDescriptor_ABI,
            bytecode: linkedBytecode
        },
        args: [
            WETH9.address,
            // 'ETH' as a bytes32 string
            '0x4554480000000000000000000000000000000000000000000000000000000000'
        ]
    })

    await deployments.deploy('NFTPositionManager', {
        from: deployer.address,
        contract: {
            abi: NFTPositionManager_ABI,
            bytecode: NFTPositionManager_BYTECODE
        },
        args: [factory.address, WETH9.address, positionDescriptor.address]
    })
}

function linkLibrary(bytecode: string, libraries: {
    [name: string]: string
} = {}): string {
    let linkedBytecode = bytecode
    for (const [name, address] of Object.entries(libraries)) {
        const placeholder = `__\$${utils.solidityKeccak256(['string'], [name]).slice(2, 36)}\$__`
        const formattedAddress = utils.getAddress(address).toLowerCase().replace('0x', '')
        if (linkedBytecode.indexOf(placeholder) === -1) {
            throw new Error(`Unable to find placeholder for library ${name}`)
        }
        while (linkedBytecode.indexOf(placeholder) !== -1) {
            linkedBytecode = linkedBytecode.replace(placeholder, formattedAddress)
        }
    }
    return linkedBytecode
}

export default func;
```
其实上面很多都是些重复的代码，我们需要关注两段内容。  
第一段是这个`linkLibrary`函数。
```typescript
function linkLibrary(bytecode: string, libraries: {
    [name: string]: string
} = {}): string {
    let linkedBytecode = bytecode
    for (const [name, address] of Object.entries(libraries)) {
        const placeholder = `__\$${utils.solidityKeccak256(['string'], [name]).slice(2, 36)}\$__`
        const formattedAddress = utils.getAddress(address).toLowerCase().replace('0x', '')
        if (linkedBytecode.indexOf(placeholder) === -1) {
            throw new Error(`Unable to find placeholder for library ${name}`)
        }
        while (linkedBytecode.indexOf(placeholder) !== -1) {
            linkedBytecode = linkedBytecode.replace(placeholder, formattedAddress)
        }
    }
    return linkedBytecode
}
```
他的作用是将文件中`library`的链接到Bytecode里面去，但是一般情况下，我们不会采用这种方式。因为从源码部署的时候，我们可以借助工具来简化这个过程。而`library`是一种极为有效的减少合约字节码的方式，在后续的文章中，我们会专门讲解这个问题。  
第二段是这个`NFTDescriptorlibrary`的部署。
```typescript
const linkedBytecode = linkLibrary(NFTTokenPositionDescriptor_BYTECODE,
    {
        ['contracts/libraries/NFTDescriptor.sol:NFTDescriptor']: NFTDescriptorlibrary.address
    }
)

const positionDescriptor = await deployments.deploy('NFTPositionDescriptor', {
    from: deployer.address,
    contract: {
        abi: NFTPositionDescriptor_ABI,
        bytecode: linkedBytecode
    },
    args: [
        WETH9.address,
        // 'ETH' as a bytes32 string
        '0x4554480000000000000000000000000000000000000000000000000000000000'
    ]
})
```
其实这里就是借助`linkLibrary`函数，将`NFTDescriptor`的地址链接到`NFTTokenPositionDescriptor`的Bytecode中。

## 部署合约
到此，我们可以验证一下我们的部署脚本是否有问题。我们运行`yarn hardhat deploy`，如果一切顺利，我们可以看到如下的输出。
```bash
Nothing to compile
No need to generate any newer typings.
✨  Done in 1.45s.
```
简单来说就是没有什么特别的输出，如果这里出现了报错，那么就证明我们的部署脚本出现了问题。有人可能会有疑问，我这里什么参数都没有填，我这合约究竟部署到了什么地方去了？其实，如果我们直接执行deploy脚本，那么他会默认部署到一个本地的网络中。我们也可以通过`yarn hardhat node`来启动一个本地的网络。但是，因为我们没有启动一个本地网络，所以在deploy时会自动启动一个本地网络用于部署，当部署完成后又会自动的关闭这个网络。所以我们基本看不到任何反馈输入，不过，没有反馈其实就是最好的反馈了。

## 结语
这一个章节我们把UniswapV3进行了完整部署，有了这个部署，我们就可以在后续的章节中进行一些测试了。当然，有能力的朋友也可以在这上面进行一些初步的合约开发工作。不过我并不是很推荐使用这种方式，因为用这种方式，当合约报错时，你是无法进行精确到行的Debug的。不过这个问题我们将在后面的章节进行解决。  
在下一章，我们将会部署一个Uniswap的前端进行测试。