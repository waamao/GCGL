# 官網更新

將 `dist` 資料夾內的檔案上傳到 GitHub 官網根目錄，和 `index.html` 放在同一層。

## 留言文字

編輯 `dist/announcement.txt`，儲存成 UTF-8 純文字。可以換行；內容會原樣顯示在官網頂部與 App 的 Google 專案報告下方。將內容清空即可隱藏留言。

App 讀取的網址是 `https://waamao.github.io/GCGL/announcement.txt`，所以發布後必須可以用這個網址看到文字。官網及新版 App 在前景每 30 秒檢查一次，App 回到前景時也會立即檢查；離線時保留上次成功取得的文字。GitHub Pages 發布及 CDN 更新可能需要等待，這不是背景推播。

目前留言檔初始內容是既有的 10/3 留言。

## Google 影片教學

播放器使用 `dist/google-sync-tutorial.mp4`。把教學影片改成這個檔名，上傳到和 `index.html` 同一層；檔案尚未提供時會顯示「教學影片準備中」。

影片不會自動播放，使用瀏覽器原生的播放、音量與全螢幕控制。

## 複製同步程式碼

「複製完整程式碼」按鈕讀取 `dist/google-sync.gs`。要更新同步程式碼時替換這個檔案即可，網站不會顯示程式碼預覽。
