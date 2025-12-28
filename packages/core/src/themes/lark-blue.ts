export const larkBlueTheme = `/*
 * ============================================
 * 主题名称：飞书蓝 (Modern Blue)
 * 设计理念：类似 Notion/飞书的文档风格，年轻、理性、高效
 * ============================================
 */

/* 1. 全局：更现代的字体栈 */
#wemd {
    padding: 30px 20px;
    max-width: 677px;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    color: #1f2329; /* 飞书黑，非纯黑 */
    background-color: transparent;
    font-size: 16px;
}

/* 2. 段落 */
#wemd p {
    margin: 16px 0;
    line-height: 1.75;
    text-align: justify;
    color: #1f2329;
}

/* 3. 标题：文档风格 */
#wemd h1 {
    margin: 40px 0 24px;
    text-align: left;
}

#wemd h1 .content {
    font-size: 26px;
    font-weight: 800; /* 更粗一点 */
    color: #1f2329;
}

/* 二级标题：左侧无框，纯文字，更像 APP 界面 */
#wemd h2 {
    margin: 32px 0 16px;
}

#wemd h2 .content {
    font-size: 20px;
    font-weight: 700;
    color: #1f2329;
    padding-left: 10px;
    border-left: 4px solid #3370ff; /* 蓝色竖条，经典文档风 */
}

/* 三级标题 */
#wemd h3 {
    margin: 24px 0 12px;
}

#wemd h3 .content {
    font-size: 17px;
    font-weight: bold;
    color: #646a73; /* 次级灰色 */
}

/* 隐藏装饰 */
#wemd h1 .prefix, #wemd h1 .suffix,
#wemd h2 .prefix, #wemd h2 .suffix,
#wemd h3 .prefix, #wemd h3 .suffix {
    display: none;
}

/* 4. 链接：清新的蓝色 */
#wemd a {
    color: #3370ff;
    text-decoration: none;
    border-bottom: 1px solid rgba(51, 112, 255, 0.3);
    transition: all 0.2s;
}

/* 5. 引用块：改为浅蓝背景，无边框设计，像便利贴 */
#wemd .multiquote-1 {
    margin: 20px 0;
    padding: 16px;
    background: #f0f4ff; /* 极浅蓝 */
    border-radius: 8px; /* 大圆角 */
    border-left: none; /* 去掉左边框 */
}

#wemd .multiquote-1 p {
    color: #1f2329;
    font-size: 15px;
}

/* 6. 列表 */
#wemd ul, #wemd ol {
    margin: 16px 0;
    padding-left: 24px;
}

/* 列表项内容 */
#wemd li {
    margin-bottom: 6px;
}

#wemd li section {
    margin: 0;
    line-height: 1.75;
}

/* 7. 行内代码：模仿 Notion */
#wemd p code {
    color: #c92a2a; /* 红色字 */
    background: rgba(255, 201, 201, 0.2); /* 浅红背景 */
    border: 1px solid rgba(200, 200, 200, 0.2);
    padding: 2px 5px;
    border-radius: 4px;
    font-family: "SF Mono", Consolas, monospace;
    font-size: 14px;
}

/* 8. 图片 */
#wemd img {
    border-radius: 8px; /* 图片圆角 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* 轻微阴影，增加层次感 */
    margin: 24px auto;
}

/* 9. 高亮 */
#wemd mark {
    background: linear-gradient(120deg, rgba(51, 112, 255, 0.2) 0%, rgba(51, 112, 255, 0.2) 100%);
    background-repeat: no-repeat;
    background-size: 100% 40%;
    background-position: 0 85%; /* 底部高亮样式，像记号笔 */
    padding: 0;
    color: inherit;
}

/* ============================================
 * 补充：提示块样式（复用飞书蓝风格）
 * ============================================
 */
#wemd .callout {
    margin: 20px 0;
    padding: 16px;
    background: #f0f4ff;
    border-left: none;
    border-radius: 8px;
}
#wemd .callout-title {
    font-weight: bold;
    margin-bottom: 8px;
    color: #1f2329;
    font-size: 15px;
}
#wemd .callout-icon { margin-right: 6px; }

/* 针对不同类型的微调 */
#wemd .callout-note { background: #f0f4ff; }
#wemd .callout-info { background: #f0f9ff; }
#wemd .callout-tip { background: #ecfdf5; }
#wemd .callout-success { background: #ecfdf5; }
#wemd .callout-warning { background: #fffbeb; }
#wemd .callout-danger { background: #fff5f5; }
`;
