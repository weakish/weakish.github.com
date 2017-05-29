# An Introduction to Law for Programmers

## 预备知识和技能

- 基本的编程知识
- 粗浅的英文阅读能力

## 书籍

法律方面有很多粗制滥造的书籍，
一个幼稚的辨别方法是排除以下 4 类书籍：

1. 面向普通大众的书（反正你们也不懂，我搞一个 quick and dirty 的东西就行，剩下的是营销的活）
2. 面向司法考试的书（教辅书本来就是粗制滥造的重灾区，而且出于应试需要，严重偏向司法考试出题人的学术倾向，较少照顾实际层面的惯例）
3. 各种学术会议的砖头书（有的注水严重，有的离实际层面的问题较远）
4. 纯法律条文书（没法跳转到定义，没有相关的 patch 信息，读起来效率太低）

当然会有误杀的情况，但总体来说效果很好。

推荐以下 2 类书籍：

1. 最近出版的法学专业的教材（帮助提炼领域知识的精华）
2. 面向法务工作者（比如律师、企业法务人员、HR 等）的手册（实务中的坑以及填坑、绕坑的经验）

## 法学理论

具有XX特色的社会主义法学理论，类似XX语言是程序员最好的朋友，都是广告。

学东西光看广告是不行的，还是要多读书提高一下知识水平。

> 这都是些初步意见，还没有作最后决定，以后可能不算数。
> 刘伯承同志经常讲一句四川话：
> 「黄猫、黑猫，只要捉住老鼠就是好猫。」
> 我们之所以能够打败蒋介石，
> 就是不讲老规矩，不按老路子打，一切看情况，打赢算数。

-- 邓小平《怎样恢复农业生产》


## 法律文本的结构

这里的法律文本，指成文法(statutes)。

由大到小，依次为编、章、节、条、款、项、目。（立法法 s. 54）

### 编

篇幅很大的法律有这个。

比如民事诉讼法分四编(part):

1. 总则
2. 审判程序
3. 执行程序
4. 涉外民事诉讼程序的特别规定

### 章

大部分法律直接由章(chapter)构成，跳过编这个层级。

### 节

篇幅较长的章分节(section).

注意，这里的 section 是一般英文文本中的 section.
某些英语国家法律语境下的 section 是有特定含义的：

> Section: a subdivision of a statute or document ...
> Most statutes and codes are divided into sections.

-- A Dictionary of the Law (Clapp, 2000, p. 389)

也就是说，这 section 其实对应中文法律语境下的「条」。

### 条

这个是法律最基本的结构，粒度大概相当于程序语言中的函数或方法。

条翻译为 article, 但如前所述，其实很多时候翻译为 section 可能更有助于交流。

因为这个是最基本的结构，所以引用法律条文往往注明条的序数，
比如前面引用《立法法》，就用`s. 54`标明是第 54 条。
除了`s.`以外，习惯上更常用`§ 54`的形式。
个人偏好`s.`, 因为输入起来比较方便。

### 款

长的条会分成款(paragraph)。款的开头缩进两格，末尾换行。
这和长的函数定义用空行划分段落的做法类似。

### 项

翻译为 subparagraph, 但其实相当于 HTML 中的`ol`.

前面我们已经提到了中文和英文里 section 的错位，
其实款和条也有错位，台湾的法律文本，款和项是倒过来的，
台湾的「项」其实是 paragraph, 而「款」才是 subparapraph,
台湾目前的这个用法，是沿用了中华民国时期的做法。
最早可能是借鉴了日本法律文本的结构。

### 目

翻译为 item, 也是一种`ol`.

「项」与「目」的区别

- 语法(syntax)层面，项用括起来的中文数字标序，目用阿拉伯数字标序。
- 语义(semantics)层面，目比项层级低。
- 使用频率层面，目很少出现。

### 例子

民法通则 s. 134

```
承担民事责任的方式主要有：     // 第一款
    （一）停止侵害；          // 第一款第一项
    （二）排除妨碍；
    （三）消除危险；
    （四）返还财产；
    （五）恢复原状；
    （六）修理、重作、更换；
    （七）赔偿损失；
    （八）支付违约金；
    （九）消除影响、恢复名誉；
    （十）赔礼道歉。
    以上承担民事责任的方式，可以单独适用，也可以合并
适用。                                            // 第二款
    人民法院审理民事案件，除适用上述规定外，还可以予以训
诫、责令具结悔过、收缴进行非法活动的财物和非法所得，并可
以依照法律规定处以罚款、拘留。
```

### 作用

下面举两个例子，分别说明法律文本的结构如何帮助/阻碍我们理解法律。

#### 个人合伙

《民法通则》里，「个人合伙」属于第二章「自然人」，
不属于第三章「法人」，
「个人合伙」前面一节是「个体工商户、农村承包经营户」。

所以，不用读具体的条文，或者其他细法（部门法），
从结构上就能看出，合伙企业和其他企业不同，并不属于法人。
合伙企业其实是将家庭经营的个体工商户模式推广到家庭之外的产物。

#### 诉讼时效

《民法通则》第七章《诉讼时效》可读性不是很好，
这是法律文本结构的限制。
法律文本只有章、条、项这些东西，表达力是很差的。
所以有时候把法律文本改写成表格、流程图或者伪代码要容易理解一点。
另外，改成伪代码也更容易暴露法条中一些含糊的地方
（其中包括法条本身表述不明确及表述明确但自己没理解两种情况）。

```
class 民事权利 {
    private Period 诉讼时效;
    private Period 完整诉讼时效;
    LocalDate 知道或应当知道被侵权;
    LocalDate 被侵权;
    boolean 当事人自愿履行;

    public 民事权利(LocalDate 知道, LocalDate 被侵, boolean 自愿) {
        this.完整诉讼时效 = Period.ofYears(2);
        this.诉讼时效 = this.完整诉讼时效;
        this.知道或应当知道被侵权 = 知道;
        this.被侵权 = 被侵;
        this.当事人自愿履行 = 自愿;
    }

    public Period get诉讼时效() {
        return this.诉讼时效;
    }
    public void set诉讼时效(Period p) {
        this.诉讼时效 = p;
    }

    public boolean is有效期内() {
        if (当事人自愿履行) {
            return true;
        }
        else {
            // 民法通则 s. 137 规定有特殊情况的，人民法院可以延期。
            // 实际诉讼中这个一般要援引司法解释具体 patch 的情况才能延期。
            // 因此下面不考虑这个情况。
            LocalDate today = LocalDate.now();
            // 1988 年最高法关于执行通则的意见明确了 20 年期限不适用中止、中断的规定。(s. 175)
            if (Period.between(被侵权, today) > Period.ofYears(20)) {
                return false;
            } else if (Period.between(知道或应当知道被侵权, today) > this.诉讼时效) {
                return false;
            } else {
                return true;
            }
        }
    }

    public boolean 中止(boolean 因不可抗力或其他障碍无法行使请求权,
                        LocalDate 中止原因消除) {
        if (因不可抗力或其他障碍无法行使请求权) {
            if (诉讼时效 <= Period.ofMonths(6)) {
                Period 中止期间 = Period.between(LocalDate.now(), 中止原因消除);
                this.诉讼时效 += 中止期间;
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public boolean 中断(boolean 提起诉讼, boolean 提出要求, boolean 同意履行) {
        if (提起诉讼 || 提出要求 || 同意履行) {
            this.诉讼时效 += this.完整诉讼时效;
            return true;
        } else {
            return false;
        }
    }
}

class 身体伤害 extends 民事权利 {
    public 身体伤害(LocalDate 知道, LocalDate 被侵, boolean 自愿) {
        super(知道，被侵，自愿);
        this.完整诉讼时效 = Period.ofYears(1);
        this.诉讼时效 = this.完整诉讼时效;
    }
}
// 同理可定义 `class 质量不合格商品`, `class 延付拒付租金`, `class 寄存财物丢失损毁`，
// 此处省略。

abstract class 另有规定 extends 民事权利 {
    @Override public boolean is有效期内();
}
```

## Patch

法律文本的麻烦之处是 Patch 是分开来发表的，
而且后来的 Patch 并不包括以前的 Patch.

因此工具书很重要。

同理，不建议直接看法条。

如果一时找不到靠谱的工具书，不得已直接读法条，
那要保持高度警惕，特别要注意 2 点：

### 1. 含糊的地方。

比如《民法通则》s. 153

> 本法所称的「不可抗力」，是指不能预见、不能避免并不能克服的客观情况。

这句话是很含糊的。
阅读判例的时候可以帮助理解法官的思路，
但想凭此主张自己不承担责任难度很大。
还是要找细法里的具体规定以及司法解释。

### 2. 过时的地方。

比如 1988 年最高法出的执行民法通则的意见第 118 条规定：

> 出租人出卖出租房屋，应提前三个月通知承租人，
> 承租人在同等条件下，享有优先购买权;
> 出租人未按此规定出卖房屋的，承租人可以请求人民法院宣告该房屋买卖无效。

1988 年时候房屋买卖还不频繁。而现在房屋买卖是很频繁的。
同时，有些地方因为房价波动厉害，因此往往希望尽快成交。
要求每笔买卖都拖上 3 个月并不符合现在的实际情况。

因此 2009 最高法就出 patch 更新了，先把 3 个月改成了更灵活的「合理期限」，
其次把没有及时通知的违约责任由买卖无效改成了赔偿损失。
（最高人民法院关于审理城镇房屋租赁合同纠纷案件具体应用法律若干问题的解释, s. 21）