---
layout: post
tags: fc reproduction Sunsoft-FME7 Sunsoft-5B Gimmick
date: 2017-11-03 16:45
thumbnail: /blog/assets/images/posts/20171103/00.jpg
short: Sunsoft FME7&5B的改造
title: Gimmick——Sunsoft FME7&5B的改造
issue_id: 14
categories: [FC]
published: true
---

Gimmick是Sunsoft在FC后期推出的一款动作游戏，公认的优点是华丽的音乐和超高的难度。因为产量不高销量不佳，现时已经几乎找不到二手的卡带，即使有也是天价。

虽然我并不爱这款游戏，但是因为稀有，且改造有一定难度，值得挑战一下。

<!--more-->

Gimmick是mapper69，用的Sunsoft-5B芯片，这个芯片和其他mapper69的fme7和5A是基本一样的，唯一区别在于5B有独立的FM音源，这也是Gimmick的音乐之所以强悍的原因。

我用来改造的牺牲品是“躲避球弹平”，Sunsoft-FME7芯片。

![image](/blog/assets/images/posts/20171103/01.jpg)

![image](/blog/assets/images/posts/20171103/02.jpg)

![image](/blog/assets/images/posts/20171103/03.jpg)

改造分成两步，首先替换flash芯片，然后烧录游戏。接下来，给卡带加上音源，还原Sunsoft-5B的完整音效。

先列出所有的参考文档：

韩国人改造FME7的帖子，只改造了flash：http://blog.naver.com/PostView.nhn?blogId=xsnake&logNo=220336838247

德国人利用8912改造的文章，这个质量最高：https://jensma.de/nesrepro/gimmick

NesDev关于改造音源的讨论帖，改造电路图就出自这里：http://forums.nesdev.com/viewtopic.php?t=3480

音源改造前后的对比：https://www.youtube.com/watch?v=BWmK5tqEgks


## 改造CHR

CHR的改造非常简单，飞线的方法如下：

![image](/blog/assets/images/posts/20171103/04.png)

我用的仍然是512KB的MX29F004，这里只需要处理A17和WE#，A17用来做合卡（后面说），WE#接到PPU /WR，其他针脚不用改动。

![image](/blog/assets/images/posts/20171103/05.jpg)

![image](/blog/assets/images/posts/20171103/06.jpg)

A17先接在VCC上，后面再处理。换好后，用kazzo单独烧一下CHR然后上机测试一下，确保每步都是ok的。

## 改造PRG

PRG的处理比较复杂。

PRG MASK ROM只有28pin，这样flash芯片会突出PCB一截，但是好在并不影响到外壳。

![image](/blog/assets/images/posts/20171103/07.png)

Flash的CE#脚的处理比较特殊，这里需要安装一个开关分别对应烧录和读取，烧录游戏时CE#连接CPU /ROMCS，而正常游戏时CE#需要接地，如上图中所示。因为最终希望把开关安装在外壳上，而由于改造过程不好计算飞线的长度，所以这个开关我是最后才接上的。

最后还要加上一块SRAM。

因为希望充分利用flash的空间，所以要把它做成合卡，用开关来操纵A17手动切换游戏。

Gimmick是用不到WRAM的，但mapper69的游戏中蝙蝠侠2是需要的。为了做出一个5A/5B/FME7全兼容的卡带，这个WRAM必须加上。按照上面的配线图焊接即可。

![image](/blog/assets/images/posts/20171103/08.jpg)

![image](/blog/assets/images/posts/20171103/09.jpg)

![image](/blog/assets/images/posts/20171103/10.jpg)

## 添加音源

根据这篇文档[Sunsoft_5B_audio](https://wiki.nesdev.com/w/index.php/Sunsoft_5B_audio)，Sunsoft 5B内置了Yamaha YM2149F音效处理单元，而YM2149F则是AY-3-8910芯片的变种，其芯片逻辑完全一样。所以只要把AY-3-8910加到卡带上就能实现5B的音效。

![image](/blog/assets/images/posts/20171103/11.jpg)

上面就是8910芯片，40pin，现在能买到的都是二手。AY-3-8910还有一个简化版是AY-3-8912，28pin，也符合改造的条件，但这个更难买。两种芯片的改造方法稍有不同。

如果买到了8912，就按照下图来改：

![image](/blog/assets/images/posts/20171103/13.jpg)

我买到的是8910，按照下图来改：

![image](/blog/assets/images/posts/20171103/12.png)

上面的两种改造图片来自于本文开头提到的NesDev的帖子。

按照我自己的习惯，把电路转成了TXT格式，如下：

![image](/blog/assets/images/posts/20171103/14.png)

按照上面的接法改造即可。

![image](/blog/assets/images/posts/20171103/15.jpg)

![image](/blog/assets/images/posts/20171103/16.jpg)

这是迄今为止我改造过的最复杂大的卡带，改完之后整个卡带走线及其难看，不过能达到目的就可以了。

8910和8912在输出上有一定区别。卡带金手指上原本45pin和46pin是连在一起的。对于8910，只有一个输出，连接到45pin和46pin。对于8912，有两个输出，需要先把45pin和46pin断开，然后分别和两个输出连接上。

## 安装切换开关

利用卡带外壳顶上的两个开口来安装开关。一个开关用于将A17在VCC和GND之间切换来载入不同游戏；另一个开关用来切换PRG的CE#，分别用于烧录和读取。

![image](/blog/assets/images/posts/20171103/17.jpg)

先用热熔胶把开关固定在外壳上

![image](/blog/assets/images/posts/20171103/18.jpg)

然后焊接飞线，最后把外壳装好。

![image](/blog/assets/images/posts/20171103/19.jpg)

## 烧录脚本

kazzo源码里自带的ag结尾的脚本是用不了的，而使用韩国人写的脚本使用一切正常。

```
board <- {
     mappernum = 69, vram_mirrorfind = false, ppu_ramfind = false,
     cpu_rom = {
         size_base = 2 * mega, size_max = 2 * mega,
         banksize = 0x2000
     },
    cpu_ram = {
        size_base = 0x2000, size_max = 0x2000, 
        banksize = 0x2000
    },
   ppu_rom = {
       size_base = 2 * mega, size_max = 2 *mega,
       banksize = 0x0400
    }
};
function sunsoft5_write(d, register_address, data)
{
     cpu_write(d, 0x8000, register_address);
     cpu_write(d, 0xa000, data);
}
function cpu_ram_access(d, pagesize, banksize)
{
     sunsoft5_write(d, 8, 0xc0);
     cpu_ramrw(d, 0x6000, banksize);
     cpu_write(d, 0xa000, 0x00);
}

function program_initalize(d, cpu_banksize, ppu_banksize)
{
// SVN
 sunsoft5_write(d, 8, 0xC0); // enable W-RAM   0x40->0xc0
 cpu_command(d, 0x2aaa, 0xe000, cpu_banksize);
 cpu_command(d, 0x5555, 0xe000, cpu_banksize);
 sunsoft5_write(d, 0xa,1);
 sunsoft5_write(d, 0xb,2);
 ppu_command(d, 0x2aaa, 0x1000, ppu_banksize);
 ppu_command(d, 0x5555, 0x1400, ppu_banksize);
 ppu_command(d, 0x0000, 0x1800, ppu_banksize);
 sunsoft5_write(d, 4, 0x0a);
 sunsoft5_write(d, 5, 0x15);
 sunsoft5_write(d, 6, 0);

}

function cpu_dump(d, pagesize, banksize)
{
     for(local i = 0; i < pagesize - 1; i++){
          sunsoft5_write(d, 9, i);
          cpu_read(d, 0x8000, banksize);
      }
      cpu_read(d, 0xe000, banksize);
}
 
function ppu_dump(d, pagesize, banksize)
{
    local mul = 8;
    for(local i = 0; i < pagesize; i+= mul){
         for(local j = 0; j < mul; j++){
             sunsoft5_write(d, j, i + j);
         }
         ppu_read(d, 0, banksize * mul);
     }
}
 
function cpu_transfer(d, start, end, cpu_banksize)
{
     for(local i = start; i < end - 1; i += 1){
          cpu_write(d, 0x8000, 0x0b);
          cpu_write(d, 0xa000, i);
          cpu_program(d, 0xc000, cpu_banksize);
     }
     cpu_program(d, 0xe000, cpu_banksize)
}
function ppu_transfer(d, start, end, ppu_banksize)
{
     // ---------------------------------------------------
     local mul = 8;
     for(local i = start; i < end; i+= mul){
          for(local j = 0; j < mul; j++){
              sunsoft5_write(d, j, i + j);
         }
         ppu_program(d, 0, ppu_banksize * mul);
     }
     // ---------------------------------------------------
    /* 
     for(local i = start; i < end; i += 4){
         cpu_write(d, 0x8000, 4);
         cpu_write(d, 0xa000, i);
         cpu_write(d, 0x8000, 5);
         cpu_write(d, 0xa000, i | 1);
         cpu_write(d, 0x8000, 6);
         cpu_write(d, 0xa000, i | 2);
         cpu_write(d, 0x8000, 7);
         cpu_write(d, 0xa000, i | 3);
         ppu_program(d, 0x1000, ppu_banksize * 4);
     }
     */
}
```

所有改造工作完成，上机测试一下：

![image](/blog/assets/images/posts/20171103/20.jpg)

最后贴上打印的贴纸：

![sticker](/blog/assets/images/posts/20171103/21.jpg)


改造手册：[Sunsoft-FME&5B.txt](https://github.com/maximaas/Famicom-DIY/blob/master/repro/Sunsoft-FME&5B.txt)

烧录脚本：[sunsoft_fme.af](https://github.com/maximaas/Famicom-DIY/blob/master/repro/kazzo_scripts/sunsoft_fme.af)

贴纸文件：[Gimmick cover](https://github.com/maximaas/Famicom-DIY/tree/master/sticker/Gimmick)