# 澄香製所｜GitHub Pages 展示網站

這是一個不需要資料庫、可直接部署到 GitHub Pages 的香品購物展示網站。

## 已完成功能

- 響應式首頁（電腦與手機）
- 三款示範商品
- 可增減數量的購物車
- 購物車資料保存在瀏覽器中
- 品牌故事與選香指南
- 電子報表單展示
- 無真實付款、無個資蒐集

## 本機預覽

直接開啟 `index.html`，或在此資料夾執行：

```bash
python3 -m http.server 8000
```

然後瀏覽 `http://localhost:8000`。

## 發布到 GitHub Pages

1. 在 GitHub 建立新的 Repository，例如 `incense-showcase`。
2. 將本資料夾全部檔案上傳到 Repository 根目錄。
3. 進入 `Settings` → `Pages`。
4. `Source` 選擇 `Deploy from a branch`。
5. Branch 選擇 `main`，資料夾選擇 `/ (root)`。
6. 儲存後等待約一至數分鐘，即可取得展示網址。

## 下一階段

客戶確認版面後，可將這個前台設計轉接 Medusa、Next.js 與 PostgreSQL，加入正式商品後台、會員、訂單、金流與物流。
