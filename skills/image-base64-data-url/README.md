# Image Base64 Data URL Skill

這是一個可在 Windows 或一般本機專案離線使用的 Agent Skill，用來把圖片轉成可直接放進 HTML、CSS、JSON 或 API 請求的 Base64 data URL。

## 快速使用（Windows PowerShell）

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\skills\image-base64-data-url\scripts\image-to-data-url.ps1" -InputPath ".\images\product.jpg" -OutputPath ".\images\product.data-url.txt"
```

## Python

```powershell
python ".\skills\image-base64-data-url\scripts\image_to_data_url.py" ".\images\product.jpg" --output ".\images\product.data-url.txt"
```

產生的文字可直接使用：

```html
<img src="data:image/jpeg;base64,..." alt="商品照片">
```

注意：Base64 通常比原始檔大約多 33%，大型網站圖片通常仍建議使用正常圖片檔與相對路徑。

來源、授權與本專案的調整內容請見 [SOURCE.md](SOURCE.md)。
