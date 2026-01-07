# MyJLPT Cloud ☁️📘
### 期末報告

---

## 📌 基本資料

| 欄位 | 內容 |
|---|---|
| 學生姓名 | 林沛琪 |
| 系所 | 國立臺東大學 資訊工程學系 |
| 名稱 | MyJLPT Cloud |
| 核心主題 | JLPT 學習平台（單字、文法、錯題、進度、Email 提醒） |

---

## 📝 摘要

- **目的**：建立一個可持續使用、可追蹤學習進度、並具備提醒機制的 JLPT 學習平台  
- **系統特色**：
  - Serverless 架構（低維運、可擴展）
  - 學習記錄長期保存（DynamoDB）
  - 錯題再複習（Wrong Questions）
  - 自動化 Email 提醒（EventBridge + SNS）

---


## ✅ 系統目標與需求規格

### 系統目標（Goals）

- 提供 JLPT 練習平台（單字 / 文法）
- 自動記錄作答結果與歷史紀錄
- 具備錯題紀錄與再練習流程
- 可視化進度（總量 / 正確率 / 今日是否完成）
- 定時 Email 提醒，提升學習持續度

### 功能需求（Functional Requirements）

- 使用者：
  - 註冊 / 登入
  - 進行單字練習、文法練習
  - 查看進度與每日狀態
  - 查看錯題並再練習
  - 新增 / 查詢筆記
- 系統：
  - 儲存使用者資料與練習紀錄
  - 提供 REST API
  - 提供排程提醒與通知

### 非功能需求（Non-Functional Requirements）

- 可擴展性：Serverless 自動擴展
- 成本：以按量計費為主
- 安全性：Token 驗證、環境變數不入版控
- 可維護性：模組化 API 與 Lambda Function 分工

---

## 🧠 系統架構設計

### 架構流程（Workflow）

- **Browser** → **S3 靜態網站**
- **Frontend JS** → **API Gateway（REST API）**
- **API Gateway** → **Lambda（業務邏輯）**
- **Lambda** → **DynamoDB（資料儲存）**
- **EventBridge（排程）** → **Lambda（提醒）** → **SNS（Email）**

### 架構圖（Architecture Diagram）

![MyJLPT Cloud Architecture](https://github.com/user-attachments/assets/8c92ba9c-7aaf-4aaa-a776-259191b30e28)

---

## 🔧 使用技術與服務

### Tech Stack

| Layer | 技術 / 服務 |
|---|---|
| Frontend | HTML / CSS / JavaScript（S3 Static Website Hosting） |
| API | Amazon API Gateway（REST） |
| Compute | AWS Lambda（Python / Node.js） |
| Auth | Amazon Cognito User Pool |
| Database | Amazon DynamoDB |
| Scheduler | Amazon EventBridge |
| Notification | Amazon SNS（Email） |

---

## 🔐 環境變數（Environment Variables）

> 本專案不包含金鑰或敏感資訊，請在 AWS Lambda 設定下列環境變數。

```env
COGNITO_USER_POOL_ID=
COGNITO_CLIENT_ID=
DYNAMODB_TABLE_USERS=
DYNAMODB_TABLE_RECORDS=
```

---

## ✨ 功能模組說明

### 1) 使用者認證（Authentication）

- 使用 Cognito User Pool
- 功能：
  - 註冊（Sign Up）
  - 登入（Login）
  - 取得 Access Token（後續 API 認證）

### 2) 單字學習（Vocabulary）

- 功能：
  - 進行單字題目 / 配對遊戲
  - 回傳作答結果（正確/錯誤、關卡/等級）
  - 儲存學習紀錄至 DynamoDB

### 3) 文法練習（Grammar）

- 功能：
  - 文法題目練習
  - 回傳作答結果
  - 儲存練習紀錄

### 4) 錯題庫（Wrong Questions）

- 功能：
  - 自動記錄錯題
  - 顯示錯題清單
  - 「再複習」：將錯題重新出題練習

### 5) 進度紀錄（Progress / Daily Status）

- Progress：
  - 取得累積題數、正確數、正確率等
- Daily Status：
  - 判斷「今天是否完成學習」
  - 方便使用者建立每日學習習慣

### 6) 筆記（Notes）

- 功能：
  - 新增筆記（POST）
  - 查詢筆記（GET）

### 7) Email 提醒（EventBridge + SNS）

- 功能：
  - EventBridge 依排程觸發 Lambda
  - Lambda 呼叫 SNS 發送 Email
  - 提升學習持續性

---

## 📡 API 設計與文件

### 認證 Header

```http
Authorization: Bearer <AccessToken>
```

### Response Convention

**成功**
```json
{
  "status": "ok",
  "data": {}
}
```

**錯誤**
```json
{
  "error": "Unauthorized",
  "message": "Invalid token"
}
```

### HTTP Status Code

- `200`：成功
- `400`：請求格式錯誤
- `401`：未授權
- `500`：伺服器錯誤

---

## 🔗 API Endpoints

### `POST /auth/login`（登入）

**Request**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**
```json
{
  "accessToken": "xxxxx",
  "idToken": "xxxxx",
  "refreshToken": "xxxxx"
}
```

---

### `POST /auth/register`（註冊）

**Request**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**
```json
{
  "message": "Register success"
}
```

---

### `POST /vocab`（單字紀錄）

**Request**
```json
{
  "level": "N4",
  "correct": true
}
```

**Response**
```json
{
  "status": "ok"
}
```

---

### `POST /grammar`（文法紀錄）

- 用途：儲存文法練習結果

---

### `GET /progress`（進度查詢）

**Response**
```json
{
  "total": 120,
  "correct": 85
}
```

---

### `GET /daily-status`（每日狀態）

- 用途：顯示當日是否完成學習

---

### `POST /notes` / `GET /notes`（筆記）

- 用途：儲存與查詢使用者筆記

---

## 🖥 部署與測試方式

### 前端部署（S3）

- 上傳 `frontend/` 至 S3
- 開啟 Static Website Hosting
- 使用 S3 Website Endpoint 存取

### API 測試（開發階段）

- 工具：
  - Browser DevTools（Network）
  - Postman / Thunder Client
- 注意：
  - 需帶 `Authorization: Bearer <AccessToken>`

---

## 🛡 安全性設計

- 不將金鑰、憑證、敏感設定上傳至 GitHub
- 以 Lambda Environment Variables 管理設定
- Cognito Token 驗證保護 API
- 後端可搭配 API Gateway Authorizer（JWT）進一步限制存取

---

## ✅ 結論

- 完成以 AWS Serverless 架構建置的 JLPT 學習平台
- 整合：
  - 認證（Cognito）
  - API（API Gateway + Lambda）
  - 資料（DynamoDB）
  - 自動化提醒（EventBridge + SNS）
---

# 🧑‍💻 作者

- **林沛琪**
- 國立臺東大學 資訊工程學系
