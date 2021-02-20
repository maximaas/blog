---
layout: post
tags: sfc reproduction Super-FX StarFox2 am29f016d
date: 2021-02-20 17:20
thumbnail: /blog/assets/images/posts/20210220/00.jpg
short: SFC Super-FX卡带的改造
title: 星际火狐2——SFC Super-FX卡带的改造
issue_id: 16
categories: [SFC]
published: true
---

这是一篇严重迟到的改造文章，本来在2017年10月就已经完成的改造，直到今天才想起要放上来。

星际火狐2作为SFC上的一款射击大作，原本在1995已经开发完成，但是可能由于相比当时次世代主机在3D图形方面的进步来说太寒碜，被任天堂取消发售。

<!--more-->

虽然中间也有原型泄露版，但真正重见天日是在2017年9月成为了随SFC Mini发售的内置21个游戏之一。完整版的ROM也是在这个时候被DUMP下来。而当时正在研究FC卡带改造的我带着浓厚的兴趣顺手制作了一盘StartFox2实体卡，以下就是制作的完整过程。

值得一提的是，为什么说这是一篇严重迟到的文章呢？因为在2018年7月，sd2snes烧录卡在v1.8.0固件中正式支持了Super-FX芯片，在实机上游玩星际火狐2不再只有改造卡带这一条路径了。<br/>
[https://sd2snes.de/blog/archives/980](https://sd2snes.de/blog/archives/980)

Super-FX芯片分为GSU-1和GSU-2前后两个版本，核心频率都是21MHz，但是前者被降频了一半，且只支持最大8Mbit的游戏容量。到了GSU-2，不仅可以21MHz全速运行，而且突破了之前的容量限制，所以也才有了耀西岛这个16Mbit容量的经典之作。我接下来的制作也是基于耀西岛这盘卡带进行的改造。

![image](/blog/assets/images/posts/20210220/01.jpg)

由于，GSU-2向下兼容GSU-1，并且星际火狐1和2都是8Mbit容量，那么自然就可以基于耀西岛这个16Mbit的游戏制作一盘火狐二合一。

如下开始进入改造正题。

![image](/blog/assets/images/posts/20210220/02.jpg)

拆开卡带后可以看见中间的Super-FX2芯片，编号为GSU-2-SP1。在左侧是存储游戏ROM的Mask ROM，上方则是256Kbit的SRAM，而根据我们从模拟器中看到的信息，StarFox2的SRAM是512Kbit。所以本次改造的任务就主要分为了Mask Rom改造；SRAM改造；以及最后电池座的改造了。

![image](/blog/assets/images/posts/20210220/03.png)

动手之前最好先了解一下Super-FX芯片的针脚定义，后面会用到。[http://problemkaputt.de/fullsnes.htm#snespinoutsgsuchips](http://problemkaputt.de/fullsnes.htm#snespinoutsgsuchips)

## SRAM改造

首先拆掉旧的SRAM，但记着不要扔掉，以后可能还会派上别的用场。

![image](/blog/assets/images/posts/20210220/04.jpg)

要换上的512k SRAM是KM68512A，明显比旧的256k SRAM大了一圈。从卡带上SRAM的位置能看出来，其实电路板在设计时已经考虑到了这个差异，并预留了一排焊盘，把焊盘上的绝缘层刮掉后直接焊接就可以了。

这里需要注意的是，电路板上并没有SRAM的A15针脚的走线。因此需要飞一根线到GSU-2的105针脚，如下图所示：

![image](/blog/assets/images/posts/20210220/05.jpg)

SRAM的A15针脚不要焊接，必须悬空！

![image](/blog/assets/images/posts/20210220/06.jpg)

## Mask ROM改造

卡带用的Mask ROM是40pin SOP封装，是找不到对应封装形式的eeprom的。而我需要的16Mbit(2MB)容量eeprom能买到的只有TSOP封装。所以必须要设计转接板，我这里做了两层转接设计，第一步是SOP转DIP，第二步是DIP转TSOP。

![image](/blog/assets/images/posts/20210220/07.jpg)

上图是我设计的两块转接板的实物图。

先把SOP转DIP转接板焊在卡带电路板上（此前需要先把电池取下来，否则碍事），转接板在设计时就考虑了占位，避开了其他元件，使得焊接后与电路板紧密贴合。

![image](/blog/assets/images/posts/20210220/08.jpg)

接着把AM29F016D焊接到DIP转TSOP板上，最后把两块转接板再焊接到一起。

![image](/blog/assets/images/posts/20210220/09.jpg)

从侧面看一下，板子与板子之间贴合的非常平整。

![image](/blog/assets/images/posts/20210220/10.jpg)

再解释一下eeprom的烧录。因为不像FC卡带改造有kazzo烧录器可以使用，我们只能先用编程器把芯片烧好，再进行焊接，所以最后上机的时候才发现烧录的内容有问题就只能拆芯片返工了。

我们计划制作火狐1+2合卡，所以要先合并两个ROM为一个文件，使用windows的copy命令来实现，方法如下：

c:\> copy /B "StarFox1.sfc" + "StarFox2.sfc" "StarFox.sfc"

一定要加/B参数，这样才会按照二进制文件来处理，本质上就是把两个文件合并在一起，1MB+1MB=2MB。

![image](/blog/assets/images/posts/20210220/11.jpg)

AM29F016D是比较常见的芯片，编程器自带的烧录程序通常都支持。我用的是TL866A，并且附送了TSOP的弹跳座，直接按照编程器说明烧录已经合并好的ROM文件就可以了。

## 电池座改造

在FC卡带改造过程中已经不止一次改造过电池座了，这里不多废话，直接上图。

![image](/blog/assets/images/posts/20210220/12.jpg)

正面原本电池的位置被转接板遮挡了，所以把电池座焊在了背面。


## 完成合卡改造

![image](/blog/assets/images/posts/20210220/13.jpg)

现在试着把焊好的电路板放回到卡带外壳中，转接板突出的位置刚好在卡带外壳空间范围内，这一点在设计转接板的时候就已经考虑好了。

![image](/blog/assets/images/posts/20210220/14.jpg)

我们烧录的文件是两个ROM的合并文件，火狐1在前1MB空间，火狐2在后1MB空间，通过切换eeprom最高位的电平就可以实现游戏的选择。我在转接板上预留了两个跳线A20和A21，转接板是兼容AM29F016D和AM29F032D的，而AM29F016D的最高位是A20，A21为空，所以在A20、VCC和GND之间安装一个开关实现切换。

![image](/blog/assets/images/posts/20210220/15.jpg)

在卡带外壳上开一个小槽来容纳开关拨杆，再用热熔胶把开关固定在外壳内部。

![image](/blog/assets/images/posts/20210220/16.jpg)

一切准备妥当，装上外壳，上机测试一下：

![image](/blog/assets/images/posts/20210220/17.jpg)

![image](/blog/assets/images/posts/20210220/18.jpg)

成功运行!


mask rom和sram的针脚定义：[SFC - MASKROM.txt](https://github.com/maximaas/Famicom-DIY/blob/master/repro/SFC - MASKROM.txt)

转接板的eagle文件：<br/>
[https://github.com/maximaas/Famicom-DIY/blob/master/repro/schematics/FlashAdapter/FlashAdapter_sfc.sch](https://github.com/maximaas/Famicom-DIY/blob/master/repro/schematics/FlashAdapter/FlashAdapter_sfc.sch)
[https://github.com/maximaas/Famicom-DIY/blob/master/repro/schematics/FlashAdapter/FlashAdapter_sfc.brd](https://github.com/maximaas/Famicom-DIY/blob/master/repro/schematics/FlashAdapter/FlashAdapter_sfc.brd)
[https://github.com/maximaas/Famicom-DIY/blob/master/repro/schematics/FlashAdapter/SfcDip2SoicAdapter.sch](https://github.com/maximaas/Famicom-DIY/blob/master/repro/schematics/FlashAdapter/SfcDip2SoicAdapter.sch)
[https://github.com/maximaas/Famicom-DIY/blob/master/repro/schematics/FlashAdapter/SfcDip2SoicAdapter.brd](https://github.com/maximaas/Famicom-DIY/blob/master/repro/schematics/FlashAdapter/SfcDip2SoicAdapter.brd)
