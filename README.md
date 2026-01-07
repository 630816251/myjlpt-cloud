# MyJLPT Cloud ☁️📘
**AWS Serverless 日語學習平台**

MyJLPT Cloud 是一個基於 AWS 雲端服務打造的日語學習系統，  
整合「單字學習、文法練習、錯題複習、學習進度紀錄與 Email 提醒」，  
目標是提供使用者一個可持續、自動化的 JLPT 學習環境。

---

## 🔧 使用技術（Tech Stack）
- **Frontend**：HTML / CSS / JavaScript（部署於 Amazon S3）
- **Backend**：AWS Lambda（Python / Node.js）
- **API**：Amazon API Gateway
- **Authentication**：Amazon Cognito（使用者註冊 / 登入）
- **Database**：Amazon DynamoDB
- **Scheduler & Notification**：EventBridge + Amazon SNS

---

## 🧠 系統架構概覽
使用者透過瀏覽器存取 S3 靜態網站，  
前端經由 API Gateway 呼叫 Lambda，  
後端負責處理登入驗證、學習紀錄、錯題管理與學習提醒。

> 📌 架構圖請見 `infrastructure/architecture.png`

---

## ✨ 系統功能
- 🔐 使用者註冊 / 登入（Cognito）
- 📖 單字學習與配對遊戲
- 🧠 文法練習模組
- ❌ 錯題紀錄與再複習機制
- 📊 學習進度與歷史紀錄
- 📧 定時 Email 學習提醒

---

## 📂 專案結構說明
myjlpt-cloud/
<img width="457" height="838" alt="image" src="https://github.com/user-attachments/assets/aebd73dd-2f44-4f31-a04a-700afd63e95c" />


本專案 **不包含任何金鑰或敏感資訊**，  
請於 AWS Lambda 中設定以下環境變數：

COGNITO_USER_POOL_ID/
COGNITO_CLIENT_ID/
DYNAMODB_TABLE_USERS/
DYNAMODB_TABLE_RECORDS/


---

## 🚀 部署流程概述
1. 建立 Amazon Cognito User Pool 與 App Client
2. 建立 DynamoDB Tables（使用者、學習紀錄、錯題）
3. 部署 Lambda Functions
4. 設定 API Gateway 並串接 Lambda
5. 將 frontend 上傳至 S3 並開啟靜態網站

---

## 📌 專案目的
本專案為雲端與後端整合實作練習，  
展示 Serverless 架構在實際學習應用上的可行性與擴充性。

---

## 🧑‍💻 作者
林沛琪  
國立臺東大學 資訊工程學系
