---
lang: zh-Hans
---

# 王垠网站改版备忘

你的记忆没错。王垠网站确实经历过一次大改，而且网上几乎没人专门讨论这件事。

## 旧站是什么样

早年 `yinwang.org` 是那种极简静态博客：

- 米黄/奶油色背景（社区复刻主题里常用 `#fbf6ec`）
- 居中窄栏、朴素衬线排版
- 标题「当然我在扯淡」
- URL 形如 `/blog-cn/2015/07/02/program-correctness`

这个风格被大量模仿，比如 [hexo-theme-yinwang](https://github.com/smallyunet/hexo-theme-yinwang)、[mickeyouyou/yinwang](https://github.com/mickeyouyou/yinwang)。V2EX 上也有人讨论「跟王垠一样的博客」。

它和胡正、李杀、田春那些 `.org` 个人站同属一类：手写 HTML、文字为主、几乎没装饰。王垠这套因为被开源主题反复复刻，反而成了「四大天王」里最有辨识度的一种。

## 现在为什么差这么多

当前站点是另一套东西：

| 维度 | 旧站 | 现站 |
|------|------|------|
| 技术 | 静态页（Jekyll 风格） | Vite SPA + `/api/v1/posts` 后端 |
| 首页 | 文章列表 | 课程招生、GUCS 书、内容版图 |
| 视觉 | 米黄极简 | 现代门户页 + 暗色代码高亮 |
| 文章 URL | `/blog-cn/年/月/日/slug` | `/posts/slug` |

从 API 元数据看，**129 篇旧文 bulk 导入时间都是 `2025-10-12`**；之后的新文（如《我和螨虫的故事》）才是 `2026-07-15` 单独创建。可以判断：**大改版大约在 2025 年 10 月**。

旧 URL 大多还能打开（例如 `/blog-cn/...` 和 `/posts/...` 都返回 200），但外壳已是新 SPA，不再是当年那种一页 HTML 的感觉。

## 王垠本人说过改版吗？

**没找到专门宣布「网站改版」的文章。**

他公开解释过的平台迁移主要是这些：

1. **2022-11-20** [《从 wordpress 转移到 substack》](https://yinwang1.substack.com/p/wordpress-substack)  
   说的是 WordPress 草稿本 → Substack，**不是** `yinwang.org` 视觉改版。

2. **2025-05-12** 《计算机科学视频班课程介绍》（`/posts/cs-video-course`）  
   讲课程方式和内容，同样**没提**网站重建。

3. 近年 Substack 上还有学费调整、转向英文写作等，都和 UI 改版无关。

所以：**他解释过写作平台迁移，但没找到对这次 `yinwang.org` 大改版的正式说明。**

## 网上有人讨论吗？

**几乎没有成规模的专门讨论。**

能搜到的主要是：

- V2EX：早年聊「跟王垠一样的博客样式」、文章观点、博客偶尔打不开
- GitHub：第三方备份（[yinwang-wiki](https://github.com/yinwang-wiki/site)、[yinwangdl](https://github.com/jrtx0/yinwangdl)）和复刻旧样式的 Hexo/Hugo 主题
- 社区备份站（如王垠百科）仍按旧 `/blog-cn/` 路径归档

**没看到**类似「垠神网站怎么变成课程首页了」这种集中讨论的帖。多数人要么只关心内容，要么用第三方备份看旧版。

## 怎么理解这次变化

没有他本人声明，只能合理推断：

1. **定位变了**：从个人博客 → 「个人品牌 + 课程 + 书」门户（视频班学费现标 16000 元）。
2. **技术栈换了**：自建 API，方便管理文章和课程页。
3. **和四大天王分道扬镳**：李杀、胡正、田春仍是老式 `.org` 个人页；王垠这边已是 2020 年代产品站风格。

如果想看旧版感觉，可以试：

- [hexo-theme-yinwang 演示站](https://smallyunet.github.io/hexo-theme-yinwang-demo/)
- [王垠百科备份](https://yinwang-wiki.github.io/site/assets/blog/)
- Wayback Machine 搜 `yinwang.org`（2025 年 10 月前的快照）

## 相关链接

| 用途 | 地址 |
|------|------|
| 现站首页 | https://www.yinwang.org/ |
| 中文 Substack | https://yinwang1.substack.com/ |
| 英文 Substack | https://yinwang0.substack.com/ |
| 旧样式 Hexo 主题演示 | https://smallyunet.github.io/hexo-theme-yinwang-demo/ |
| 社区备份 | https://yinwang-wiki.github.io/site/assets/blog/ |
