---
title: "1-前期准备"
image: '/images/primary_banner.png'
---
## 前言
在文章开始前，先明确好几个阅读要点。文章中会多次出现，`必要条件`，`可选内容`，`一定不要`，`注意⚠️` 等词。他们的意思分别为。
* `必要条件`：属于一定需要的内容，缺少后将会无法进行教程。
* `可选内容`：属于补充性内容，并不会对教程产生影响
* `一定不要`：属于强制规范内容，请不要做此内容下的行为
* `注意⚠️`：属于提示性内容，该内容中会进行指引，并且指出什么应该，什么不应该。
## 目标人群
本文适合以下用户阅读。`必要条件`：具备理解能力和英语阅读能力。
* 计算机专业相关人员
* Web2转向Web3的有基础开发者
* 有开发简单项目，但是缺少开发大型项目经验的开发者
* 在校大学生，需要有自制力和自学能力还有较为出色的综合能力
* 进来图一乐
本文不适合以下用户阅读。
* 毫无编程基础的用户
* 顶尖高手
## 开发环境
本文将全程用`Macos`进行开发，如果你是使用`Windows`系统，推荐两个解决方案。
* 更换`Mac`
* 自行搜索一些无法在`Windows`上执行的命令如何用其他方案替代，比如安装`Node`环境，在`Unix`类系统下可以使用`nvm`，但是`win`只能下载安装包
### 必要软件
* 科学上网工具
### 软件环境安装
一般情况下，开发一个Dapp（EVM）需要一些基础软件，下面是必要的基础软件在Macos下安装的方式。请注意全程开启科学上网，如果没有科学上网工具，请自行搜索替代源。
`必要软件`有：
* Git
* VSCode
* Nodejs（v16+）
如果你知道如何手动安装这些，可以跳过接下来的教程。
不过，为了方便安装，我们会先安装一个`可选软件`，Brew。
#### 安装Brew
输入命令到终端
```
/bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"
```
安装过程中需要输入一次系统密码，并且后续需要按一次回车键。
![注意安装后的提示](https://images.mirror-media.xyz/publication-images/wVDjH1WB6BnvQulb4yz8r.png?height=962&width=1692)
如果出现以上提示，执行下方命令即可。
#### 安装Git,Nvm
输入命令
```
brew install git
brew install nvm
```
#### 安装Nodejs
输入命令
```
nvm install --lts
```
#### 安装VSCode
输入命令
```
brew install --cask visual-studio-code
```
#### 检验
至此，我们已经安装了必要软件中的node，vscode，git。但是我们可以输入以下命令进行检验
```
git -v
node -v
code -v
```
结果应该如下。
![检验结果](https://images.mirror-media.xyz/publication-images/8plq82ZPQm_0f6l4iJYQC.png?height=350&width=810)
### 可选安装
不过，为了更好的开发体验，我们还需要安装一个`yarn`包管理工具。
输入命令
```
npm install yarn -g
######
yarn -v
```  
结果应该包含以下内容  
![yarn安装成功](https://images.mirror-media.xyz/publication-images/vxPZEwgikmh0isIkBYrzS.png?height=140&width=480)
## 总结
自此，我们已经进行了最初步的环境环境安装，这一章节并没有难度和太大的意义，但是这是对能否学习这门课程的一个初步检验，也可以认为是一个门槛。如果在这一章都遇到较大的问题，推荐静下心来仔细研究后再进行学习。
