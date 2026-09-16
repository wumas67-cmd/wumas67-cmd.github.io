# 拙具羅商品圖片來源與轉換紀錄

- 建立日期：2026-09-16
- 本機來源：`圖片/拙具羅香01.jpg`、`圖片/拙具羅香02.jpg`、`圖片/拙具羅香03.jpg`
- 主要商品圖片：`zhujuluo-incense-01.jpg`
- 補充商品圖片：`zhujuluo-incense-02.jpg`、`zhujuluo-incense-03.jpg`
- Base64 轉換：使用專案內 `skills/image-base64-data-url` Skill 的 PowerShell 工具離線轉換
- 輸出格式：`data:image/jpeg;base64,...`
- 驗證方式：逐張解碼後與來源檔案進行位元組比對，三張皆完全一致
- 商品說明參照：https://wumas1216.pixnet.net/blog/posts/16096543718

`拙具羅香04.jpg` 不在本次指定範圍，未用於網站商品圖片。
