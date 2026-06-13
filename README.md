# Demo Project

這是一個教學用 monorepo，主要用於示範如何以 GitHub Actions 將服務部署到 Google Cloud，並搭配 serverless 架構建置一個可運行的 Web + API 範例。

專案刻意保留了幾個在實務上常見、也適合教學拆解的元素：

- Next.js Web 應用，作為前端與 BFF
- NestJS API 服務，作為後端 REST API
- Terraform 基礎設施定義
- Google Cloud Run 作為 serverless 執行環境
- Artifact Registry 作為容器映像儲存庫
- Firestore MongoDB Compatibility 作為資料儲存

## 教學目標

這個 repo 的重點不是做出一個功能很完整的產品，而是讓你可以用一個具體範例理解以下主題：

1. 如何以 monorepo 管理前後端與基礎設施
2. 如何把 Web 與 API 容器化後部署到 Google Cloud Run
3. 如何用 Terraform 宣告 GCP 基礎設施
4. 如何把 GitHub Actions 串進 CI/CD 流程，從程式碼變更一路推進到雲端部署

## 專案結構

```text
.
├── apps/
│   ├── api/      # NestJS API
│   └── web/      # Next.js Web / BFF
├── infra/        # Terraform for Google Cloud
├── packages/
│   ├── eslint-config/
│   └── types/    # Shared TypeScript types
├── docs/
│   └── superpowers/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 架構概念

此專案採用適合教學展示的 serverless 架構：

- Web 服務以 Next.js 建置，部署到 Cloud Run
- API 服務以 NestJS 建置，部署到另一個 Cloud Run service
- 兩個服務的容器映像可推送到 Artifact Registry
- 服務帳戶與 IAM 權限綁定確保安全性
- Terraform 管理所有資源

這樣的拆法可以清楚示範：

- 應用程式如何容器化
- GitHub Actions 如何建置與發布映像
- GCP serverless 平台如何承接部署產物
- IaC 如何管理部署環境

## GitHub Actions 部署示範重點

這個 repo 的教學主軸是示範一條典型的 GitHub 到 Google Cloud 部署路徑：

1. 開發者將變更 push 到 GitHub
2. GitHub Actions 觸發 CI/CD workflow
3. Workflow 安裝依賴並建置 Web 與 API
4. 建立 Docker image
5. 將 image 推送到 Google Artifact Registry
6. 更新 Cloud Run 上的服務版本

## 雲端基礎設施部署前置作業

安裝依賴：

```bash
pnpm install
```

啟動所有服務：

```bash
pnpm dev
```

建置整個 monorepo：

```bash
pnpm build
```

執行測試：

```bash
pnpm test
```
