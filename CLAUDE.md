# VDA 5050 中文指南 (vda5050-guide-zh)

本项目旨在提供 VDA 5050 标准的中文翻译和解读，帮助中文读者更好地理解和应用该标准。

## 项目概述

VDA 5050 是德国汽车工业协会 (Verband der Automobilindustrie) 发布的一项标准，定义了自动化引导车 (AGV)、自主移动机器人 (AMR) 与上位控制系统之间进行通信的接口和协议。

本仓库的目标是创建一份准确、易懂的中文指南，涵盖标准的关键部分。

## 文档结构

*   `README.md`: 项目简介。
*   `LICENSE`: MIT 开源许可证。
*   `CLAUDE.md`: 本文件，项目开发和文档工作流的说明。
*   `/docs/`: 存放主要的中文翻译和解读文档。
    *   `standard_chapter_X.md`: 标准各章节的翻译。
    *   `glossary.md`: 术语表。
    *   `faq.md`: 常见问题解答。
    *   `examples/`: 示例和用例。

## 工作流程

### 1. 内容创作
*   所有文档均以 Markdown (`.md`) 格式编写。
*   提交前，请确保 Markdown 语法正确，本地预览无误。

### 2. 提交与合并
*   创建新功能或修复时，请从 `main` 分支创建一个新的特性分支 (feature branch)。
*   完成后，发起 Pull Request (PR)，请求合并到 `main` 分支。
*   PR 需要经过至少一名其他贡献者的审查和批准。

### 3. 质量保证 (QA)
*   **内容校对**: 确保翻译的准确性、一致性和流畅性。
*   **技术审核**: 确保技术细节的解释是正确的。

## 技术栈与工具

*   **格式**: [Markdown](https://www.markdownguide.org/)
*   **文档生成**: [VitePress](https://vitepress.dev/)
*   **编辑器**: 任何支持 Markdown 的编辑器均可 (如 VS Code, Typora, Vim 等)。
*   **版本控制**: Git
*   **协作平台**: GitHub
*   **CI/CD**: GitHub Actions (自动部署到 GitHub Pages)

## 开发命令

```bash
# 安装依赖
npm install

# 本地预览
npm run docs:dev

# 构建生产版本
npm run docs:build
```

## 贡献指南

欢迎任何形式的贡献！您可以：
*   翻译标准的未完成章节。
*   校对现有翻译内容。
*   撰写示例或补充说明。
*   报告文档中的错误或提出改进建议 (通过 Issues)。

## 许可证

本项目遵循 [MIT License](./LICENSE)。所有贡献者同意其贡献内容也遵循此许可证发布。