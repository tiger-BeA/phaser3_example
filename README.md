# Phaser 3
* [Phaser 3安装](#phaser-3%E5%AE%89%E8%A3%85)
* [Part 1 \- 介绍](#part-1---%E4%BB%8B%E7%BB%8D)
	* [要求](#%E8%A6%81%E6%B1%82)
* [Part 2 \- 加载资源](#part-2---%E5%8A%A0%E8%BD%BD%E8%B5%84%E6%BA%90)
* [Part 3 \- 建造世界](#part-3---%E5%BB%BA%E9%80%A0%E4%B8%96%E7%95%8C)
* [Part 4 \- 平台的解释](#part-4---%E5%B9%B3%E5%8F%B0%E7%9A%84%E8%A7%A3%E9%87%8A)
* [Part 5 \- 准备player](#part-5---%E5%87%86%E5%A4%87player)
	* [物理精灵](#%E7%89%A9%E7%90%86%E7%B2%BE%E7%81%B5)
	* [动画](#%E5%8A%A8%E7%94%BB)
* [Part 6 \- 物体速度：一个物理世界](#part-6---%E7%89%A9%E4%BD%93%E9%80%9F%E5%BA%A6%E4%B8%80%E4%B8%AA%E7%89%A9%E7%90%86%E4%B8%96%E7%95%8C)
* [Part 7 \- 用键盘操纵player](#part-7---%E7%94%A8%E9%94%AE%E7%9B%98%E6%93%8D%E7%BA%B5player)
* [Part 8 \- 星尘](#part-8---%E6%98%9F%E5%B0%98)
* [Part 9 \- 分数的实现](#part-9---%E5%88%86%E6%95%B0%E7%9A%84%E5%AE%9E%E7%8E%B0)
* [Part 10 \- 弹跳炸弹](#part-10---%E5%BC%B9%E8%B7%B3%E7%82%B8%E5%BC%B9)
* [结论](#%E7%BB%93%E8%AE%BA)

网上没翻到对应的中文版，故而我学习的时候随手翻译了一下[Phaser3的官网教程](https://phaser.io/tutorials/making-your-first-phaser-3-game/index)，没有逐句翻译，意思到位就行。

## Phaser 3安装

```shell
$ cnpm i --save phaser
```

webpack全局配置

```js
// 如有多文件开发，可以使用全局配置Phaser，否则单文件import Phaser from 'phaser'即可
const webpack = require('webpack')
...

module.exports = function () {
    ...
    plugins: [
        ...
         new webpack.ProvidePlugin({
             // 无需每个文件导入，全局直接使用Phaser
             Phaser: 'phaser',
         })
    ]
}
```

## Part 1 - 介绍

Phaser是一个h5游戏框架，旨在帮助开发者做出有力的、跨浏览器的HTML5游戏真的很快。它的建立是为了利用桌面端和移动端上浏览器的优势，唯一的要求就是浏览器canvas标签的支持。 

### 要求

[点击下载官方源码](https://phaser.io/tutorials/making-your-first-phaser-3-game/phaser3-tutorial-src.zip)
[点击下载我的webpack版本源码](https://github.com/tiger-BeA/phaser3_example)

> 下载我的git上的源码，在文件目录下运行以下源码，即可预览效果
> ```shell
> $ cnpm i
> $ cnpm run dev
> ```

在开始教程之前确保你已经了解过了[开始指南](https://phaser.io/tutorials/getting-started)

```js
 var config = {
     type: Phaser.AUTO,
     width: 800,
     height: 600,
     scene: {
         preload: preload,
         create: create,
         update: update
     }
 };

var game = new Phaser.Game(config);

function preload() {}

function create() {}

function update() {}
```

其中，`config`的`type`可以有三个值：`Phaser.CANVAS`,`Phaser.WEBGL`, `Phaser.AUTO`决定游戏渲染的上下文，其中`Phaser.AUTO`会自动尝试使用`WebGL`，如果浏览器或者设备不支持，会回退到`Canvas`渲染；

Phaser创建的`canvas`元素默认插入document中脚本被执行的地方，可以通过`parent`属性来设置其父容器（用`id`名字设置）

## Part 2 - 加载资源

所有要加载的资源需要放在`scene`的`preload`进行预加载

```js
// 在webpack中需要先import进来资源，然后用变量替换下面资源的url
function preload () {
    // 载入4张图片和1个精灵
    // 第一个参数是该资源的别名
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}
```

### 显示一张图片

```js
function create() {
    this.add.image(400, 300, 'sky');
}
```

`this.add.image(x, y, alias)`，Phaser3默认所有Game的对象的原点即为中心（这张背景图原本是800

x600的大小）

> Hint：可以用`setOrigin`来改变原点，例如：this.add.image(0, 0, 'sky').setOirigin(0, 0)

在game对象中创建对象的顺序即为显示的顺序

```js
function create() {
    // 星星在天空上
    this.add.image(400, 300, 'sky');
    this.add.image(400, 300, 'star');
}
```

## Part 3 - 建造世界

`this.add.image`创造了一个新的`图片game对象`，并将其加入`scenes`的显示列表，所有`game对象`都在这个列表上。

你可以将img放在任何地方，Phaser不会care，`scene`是没有固定大小的，且可以在任意方向上无限延伸。`camera`系统可以控制你看`scene`的视角，你随意对`camera`移动、变焦。可以创建多个`camera`，但这个话题超出了这个教程讨论的范围，足以证明Phaser3的`camera`系统较Phaser2的强大之处。

现在我们在`scene`上添加背景、图片和一些台阶：

```js
var platforms;

function create() {
    this.add.image(400, 300, 'sky');
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
}
```

其中`this.physics`表示我们用到了Arcade Physics引擎，在使用前，我们需要在`config`中将引擎加进来，故而更新`config`如下：

```js
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
```

## Part 4 - 平台的解释

对之前在`create()`函数中添加的一组代码做出解释，首先：

```js
playforms = this.physics.add.staticGroup();
```

在`Arcade Physics`中有两种物质体：动态和静态，动态物体是可以受力运动的（例如加速度和速度），它可以反弹和碰撞，且其运动受物体的质量和其他因素的影响。

形成鲜明对比，静态物体只有位置和大小，不受重力影响，不能添加速度，且受到碰撞后不会移动。对于我们的背景和平台，是非常适合的选择。

什么是`group`？顾名思义，是一组属性相似的对象，且可以用同一个单元去控制它们。与其他game对象相比，`group`可以通过创建自己的`helper函数`来方便创建自己的game对象，例如`create()`函数，一个物理`group`可以自动创建该引擎支持的子对象，从而节省你的工作量。

用我们的平台`group`，我们可以创建这些平台如下

```js
// 由于对静态对象使用了setScale(2)，故而需要用refreshBody()通知引擎
platforms.create(400, 568, 'ground').setScale(2).refreshBody();
platforms.create(600, 400, 'ground');
platforms.create(50, 250, 'ground');
platforms.create(750, 220, 'ground');
```

其中`'ground'`是绿色矩形，大小为400x32

![](https://phaser.io/content/tutorials/making-your-first-phaser-3-game/platform.png)

## Part 5 - 准备player

```js
player = this.physics.add.sprite(100, 450, 'dude');
player.setBounce(0.2);
player.setCollideWorldBounds(true);

this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', {
        start: 0,
        end: 3,
    }),
    frameRate: 10,
    repeat: -1,
});

this.anims.create({
    key: 'turn',
    frames: [{
        key: 'dude',
        frame: 4,
    }],
    frameRate: 20,
});

this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', {
        start: 5,
        end: 8,
    }),
    frameRate: 10,
    repeat: -1,
});
```

### 物理精灵

```js
// 在(100, 450)放置sprite（默认为动态物体）
player = this.physics.add.sprite(100, 450, 'dude');
// 设置反弹值0.2
player.setBounce(0.2);
// 设置为与世界的边界碰撞
player.setCollideWorldBounds(true);
```

首先这个`sprite`是通过物理game对象工厂创建的(`this.physics.add`)，故而默认为动态物体。

其中世界的边界，默认超出游戏的维度，但是我们已经将游戏设置为800x600，并设置`setCollideWorldBounds`属性，故而player不会超出这个区域。

### 动画

回顾`preload()`函数，我们将`'dude'`以`spritesheet`加载进来，而不是以`image`，这是因为`spritesheet`自带动画框架。

![](https://phaser.io/content/tutorials/making-your-first-phaser-3-game/dude.png)

（这里有9帧，4个左跑，一个面对camera，4个右跑）Phaser在动画帧上支持对`sprites`的反转，但出于这个教程的目的，我们以老办法做就可以。

```js
this.anims.create({
     key: 'left',
     frames: this.anims.generateFrameNumbers('dude', {
         // 左跑涉及到前4帧 
         start: 0,
         end: 3,
     }),
     // 每秒跑10帧
     frameRate: 10,
     // -1表示loop
     repeat: -1,
 });
```

> Extra Info：与Phaser2不同的是，Phaser3的动画管理器是全局系统，对于所有game对象，在Phaser中创建的动画都是全局的，它们共享所有的基本动画数据，且其时间表由自己管理。这就允许你定义一个动画，就可以在很多game对象中使用。

## Part 6 - 物体速度：一个物理世界

> Phaser有三个不同的物理引擎(Arcade Physics,  Impact Physics 和 Matter.js Physics )，对于我们这种简单游戏，可以使用Arcade Physics引擎，不需要任何重的几何计算

当一个物理精灵被创建时，会被赋予`body`的属性（与其Arcade Physics body相关），这代表了在Phasers Arcade Physics引擎中这个sprite被当做一个物质体，这个物质体有我们可以操纵的很多属性和方法。

例如，为了模拟重力对于sprite的印象，可以写成

```js
// 值越大，重力影响越大，下落越快
player.body.setGracityY(300);
```

在`config`中已经设置过了默认的

```js
 physics: {
     default: 'arcade',
         arcade: {
             gravity: {
                 y: 300
             },
         },
 },
```

可以看到player落在了ground的里面，这是因为我们还没测试ground和player之间的碰撞。

之前我们已经设置过ground和playforms都是静态物体，如果没有设置为静态的话，默认会创建动态物体，那么如果player和它们碰撞的话，会卡住一段时间，然后所有都会崩溃掉。这是因为，除非告诉其他，否则当player碰撞ground的时候，这个ground sprite会成为一个运动的物体对象，碰撞会导致ground下沉，player也会改变其速度。

为了允许player对platforms碰撞，我们可以创建一个`Collider`对象。这个对象会监测两个物体对象（可以包括`groups`对象）的重叠和碰撞，影响行为可以在其回调函数中自定义，但出于这个教程的简单目的，我们不需要。

```js
this.physics.add.collider(player, platforms);
```

## Part 7 - 用键盘操纵player

Phaser拥有内置的键盘管理，我们可以在`create()`中通过下面的方式轻易获取到键盘的监听器

```js
cursors = this.input.keyboard.createCursorKeys();
```

`cursors`对象有4个可取值：`up`, `down`, `left`, `right`，我们需要在`update`循环调用中轮询键盘的输入值

```js
 if (cursors.left.isDown) {
     player.setVelocityX(-160);
     player.anims.play('left', true);
 } else if (cursors.right.isDown) {
     player.setVelocityX(160);
     player.anims.play('right', true);
 } else {
     player.setVelocityX(0);
     player.anims.play('turn');
 }
if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
}
```

上面的代码很好理解，不多阐述，当然Phrase也允许你做更多复杂的操作，例如动量、加速度等等，但是上述代码已经给了我们所需的效果。你可以试着改改上面的数据，看看动作效果。

## Part 8 - 星尘

是时候该给我们的游戏添加一些小目标了，让我们在`scene`中添加一些星星，让`player`去收集它们。为了达成这个目标，我们创建一个新的`group`，并填充它。

```js
stars = this.physics.add.group({
    // 设置物体纹理，所有子对象的默认纹理都是star
    key: 'star',
    // 自动创建1个子对象，复制11个，共有12个星星
    repeat: 11,
    // 从(12, 0)开始，x轴方向每隔70放置一个子对象
    setXY: { x: 12, y: 0, stepX: 70 }
});

// 迭代对所有子对象进行设置，bounce表示碰撞的反弹程度，其范围为[0,1]
stars.children.iterate(function (child) {
    // Phaser.Math.FloatBetween返回0.4到0.8之间的随机数
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
});
```

这段code和之前创建平台的`group`十分相似，但由于我们想要star移动，故而将其创建为动态物体。

在迭代函数`iterate`中，由于每个子对象的位置都是从y=0处开始，由于重力影响，会下落碰撞到地面或者平台，故而我们还需绑定`platforms`和`star`的碰撞关系：

```js
this.physics.add.collider(platforms, stars);
```

除此之外，我们还需检测`player`是否与`star`重合

```js
this.physics.add.overlap(player, stars, collectStar, null, this);
```

我们可以通过自定义函数`collectStar()`来进行检查：

```js
function collectStar(player, star) {
    star.disableBody(true, true);
}
```

这很简单，如果某个star和player重合，这个star会隐藏掉，并且其父game对象`stars`不会受影响。

到此为止，这个游戏已经给了我们一个可以奔跑、跳跃、跳上平台、收集天上落下的星星，对于这样几行短短的代码，这个效果非常喜人了。

## Part 9 - 分数的实现

现在这个游戏还差两部分需要实现：一个可以击杀玩家的敌人以及收集星星的分数显示。首先，来实现分数的显示。

这里我们先创建两个变量：

```js
var score = 0; // 记录真实分数
var scoreText; // 承载分数的文本对象
```

在`create()`函数中定义`scoreText`对象

```js
// 从(16,16)坐标开始，放置文本对象的内容，默认文本为'score:0'
scoreText = this.add.text(16, 16, 'score: 0', {
    fontSize: '32px',
    fill: '#000'
});
```

我们设置游戏规则为，每收集一颗星星加10分，将这个逻辑添加到`collectStar()`函数中去

```js
function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
}
```

## Part 10 - 弹跳炸弹

为了完整我们的游戏，是时候加些坏蛋了，这给游戏挑战加了很多趣味性。

规则是：开局就会释放一个弹跳炸弹，这个炸弹会在这关中瞎几把转，player碰上必死无疑。在你收集完所有星星后，这些星星会重生，随着会再释放一个弹跳炸弹，这就给玩家增加挑战性：是男人就拿更高分。

首先我们需要在`create()`中添加一组炸弹并绑定碰撞关系：

```js
bombs = this.physics.add.group();
this.physics.add.collider(bombs, platforms);
this.physics.add.collider(player, bombs, hitBomb, null, this);
```

其中碰撞的回调函数自定义为，如果碰到炸弹，所有动作停止，`player`变红

```js
function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xF00);
    player.anims.play('turn');
    gameOver = true;
}
```

此外，我们还需要在`collectStar()`函数中添加释放炸弹的逻辑

```js
function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    
    // 检测display的星星个数
    if (stars.countActive(true) === 0) {
        stars.children.iterate((child) => {
            // 重启所有星星，设置初始位置(child.x, y)
            child.enableBody(true, child.x, 0, true, true);
        });
        
        // 在玩家附近放置炸弹
        let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        let bomb = bombs.create(x, 16, 'bomb');
        // 设置与世界的边界碰撞
        bomb.setCollideWorldBounds(true);
        // 设置速度
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        // 忽略重力影响
        bomb.allowGravity = false;
         // 设置炸弹弹跳程度(1让炸弹可以一直弹跳)
        bomb.setBounce(1);
    }
}
```

这个游戏一旦炸弹数量增加，难度会增强

![](https://phaser.io/content/tutorials/making-your-first-phaser-3-game/part10.png)

## 结论

现在你已经学会了如何创建一个具有物理特征的精灵，并可可以控制它的动作，与小游戏世界中的其他物体进行交互。你可以据此做更多事情，例如，增加关卡，允许camera移动？也许添加不同类型的坏蛋、不同得分的可拾取物品，或者给玩家一个医疗包什么的。

或者对于一个非暴力风格的游戏，你可以让它快速移动并单纯挑战快速拾取星星。

借助本教程中所学到的知识和数百个可供您使用的示例，您现在应该对未来的项目开发有个坚实的基础了。但一如既往，如果你有问题，需要建议或想分享你所做的工作，那么请随时在Paisher论坛寻求帮助。 