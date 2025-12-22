# 配置图床

图床让你的图片上传到云端，获得稳定的外链 URL。配置完成后，粘贴或拖入编辑器的图片会自动上传。

---

## 基础概念

| 名词 | 说明 |
| :--- | :--- |
| **AccessKey / SecretKey** | 云服务商的 API 密钥，用于身份验证 |
| **Bucket** | 存储空间名称，类似文件夹 |
| **Domain** | 外链域名，图片 URL 的前缀（如https://cdn.example.com） |
| **Region / Area** | 存储区域代码，影响访问速度 |

---

## 步骤 1：获取密钥

在云服务商控制台获取 AccessKey 和 SecretKey：

七牛云

阿里云 OSS

腾讯云 COS

---

## 步骤 2：进入图床设置

点击顶部导航栏的 **「图床设置」** 按钮。

---

## 步骤 3：填写配置

### 七牛云

| 字段 | 填写内容 |
| :--- | :--- |
| 服务商 | 选择「七牛云」 |
| AccessKey | 密钥管理中的 AK |
| SecretKey | 密钥管理中的 SK |
| Bucket | 存储空间名称（在对象存储中创建） |
| Domain | 绑定的外链域名（必须http://或https://开头） |
| Area | 区域代码：z0=华东,z1=华北,z2=华南,na0=北美,as0=东南亚 |

### 阿里云 OSS

| 字段 | 填写内容 |
| :--- | :--- |
| 服务商 | 选择「阿里云」 |
| AccessKey | RAM 用户的 AccessKey ID |
| SecretKey | RAM 用户的 AccessKey Secret |
| Bucket | 存储桶名称 |
| Domain | 绑定的自定义域名，或使用默认外网访问域名 |
| Region | 区域：oss-cn-hangzhou,oss-cn-beijing,oss-cn-shanghai等 |

### 腾讯云 COS

| 字段 | 填写内容 |
| :--- | :--- |
| 服务商 | 选择「腾讯云」 |
| SecretId | API 密钥中的 SecretId |
| SecretKey | API 密钥中的 SecretKey |
| Bucket | 存储桶名称（格式：name-appid） |
| Domain | 绑定的加速域名或默认域名 |
| Region | 区域：ap-guangzhou,ap-shanghai,ap-beijing等 |

---

## 步骤 4：验证并保存

1. 点击 **「检查」** 按钮

* 🟢 显示「配置有效」→ 点击「保存」
* 🔴 显示错误 → 见下方常见问题

---

## 常见问题

### Q: 检查时报跨域错误？

Web 端受浏览器安全策略限制，部分云服务商需要配置 CORS。建议：

* 使用 **Desktop 桌面版**验证配置
* 或在云服务商控制台开启 CORS（允许 `*` 来源）

### Q: 上传成功但图片显示不出来？

检查 Domain 是否正确：

* 必须以 `http://` 或 `https://` 开头
* 如果用 CDN 加速域名，确保已完成域名绑定和备案

### Q: AccessKey 和 SecretKey 安全吗？

密钥只保存在你的浏览器本地存储中，不会上传到任何服务器。