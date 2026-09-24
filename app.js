const translations = {
  "zh-Hant": {
    brand: "工地現場管理", navFeatures: "功能", navGuide: "使用教學", navSync: "試算表同步", navSupport: "支援", download: "下載", languageLabel: "切換語言",
    heroEyebrow: "你的個人工地現場管理工具", heroTitle: "把工地的每一天，<span>整理得清清楚楚。</span>", heroBody: "工程記錄、施工進度、估驗計價、材料訂購與現場報表，一支 iPhone 就能完成。", appStoreCta: "在 App Store 下載", syncCta: "設定 Google 同步", offline: "離線可用", icloud: "iCloud 備份", export: "PDF・Excel 匯出", progressLabel: "工程進度", reportTitle: "專案報告", reportBody: "一鍵匯出 Excel",
    featuresEyebrow: "核心功能", featuresTitle: "從第一筆記錄到完工，<span>都在同一個地方。</span>", featuresBody: "讓現場資訊不再散落在紙本、群組訊息與不同檔案裡。",
    feature1Title: "每天的工程記錄，一眼看懂。", feature1Body: "用月曆整理工項、廠商、樓層、人數、機具與備註，搜尋與分享也更快速。", feature2Title: "進度與計價，用趨勢看變化。", feature2Body: "按月份檢視工程與計價進度，並追蹤各工項、樓層及廠商狀態。", feature3Title: "案場、計價與文件集中管理。", feature3Body: "保管案場資料、估驗計價、追加工程、廠商資訊及 PDF 文件。", feature4Title: "材料訂單不漏項，也不漏交貨。", feature4Body: "建立自己的材料分類，記錄訂購與到貨數量，並分享到 LINE 或同步 Google 試算表。", feature5Title: "照片與圖紙，現場直接標記。", feature5Body: "把日期、案場、廠商、樓層與文字加到照片，也能在 PDF 圖紙上貼入現場照片。", feature6Title: "報表與資料，隨時帶走。", feature6Body: "匯出 PDF、Excel 與 ZIP 備份，工程資訊由你掌握。",
    guideEyebrow: "快速開始", guideTitle: "第一次使用，<span>六步就能開始記錄。</span>", step1Title: "建立案場", step1Body: "在「案場資訊」新增案場名稱、樓層與基本資料。", step2Title: "建立公司與施工廠商", step2Body: "在管理頁加入你的公司及合作廠商，再將廠商添加到案場。", step3Title: "新增施工項目", step3Body: "指定工項、廠商與施工樓層，工程進度會立即建立。", step4Title: "填寫每日工程記錄", step4Body: "從月曆新增工項、人數、進度、機具與備註。", step5Title: "建立材料品項", step5Body: "手動建立或從 Excel 批次匯入材料分類與品項。", step6Title: "匯出與同步", step6Body: "將報表匯出為 PDF／Excel，或同步到 Google 試算表。",
    syncEyebrow: "Google 試算表同步", syncTitle: "你的專案報告，<span>自動同步到自己的試算表。</span>", syncBody: "不需登入 App 內的 Google 帳號。只要部署一次 Apps Script，新增、修改與刪除都能由 App 同步。", viewScreenshot: "放大查看教學截圖",
    syncVisual1Title: "建立試算表並開啟 Apps Script", syncVisual1Body: "前往 <a href=\"https://sheets.google.com\" target=\"_blank\" rel=\"noopener\">Google 試算表</a>建立空白表格，再選擇「擴充功能」→「Apps Script」。", syncVisual2Title: "貼上程式碼並完成授權", syncVisual2Body: "複製右側完整程式碼、貼到 Code.gs 並儲存。選擇 setupGCGLSync 後按「執行」，完成 Google 授權。", syncVisual3Title: "部署為網路應用程式", syncVisual3Body: "選擇「部署」→「新增部署作業」→「網路應用程式」。執行身分選「我」，存取權限選「所有人」，再複製結尾為 /exec 的網址。", syncVisual4Title: "回到 App 測試並儲存", syncVisual4Body: "開啟「設定」→「Google 試算表同步」，貼上網址與同步密碼。測試連線成功後按「儲存」。",
    syncStep1Title: "建立空白試算表", syncStep1Body: "前往 <a href=\"https://sheets.google.com\" target=\"_blank\" rel=\"noopener\">Google 試算表</a>，建立一份新的空白試算表。", syncStep2Title: "開啟 Apps Script", syncStep2Body: "在試算表上方選擇「擴充功能」→「Apps Script」。", syncStep3Title: "貼上完整程式碼", syncStep3Body: "先按右側「複製完整程式碼」，刪除 Code.gs 原有內容，再完整貼上並按儲存。", syncStep4Title: "執行一次 setupGCGLSync", syncStep4Body: "在函式選單選擇 setupGCGLSync，再按「執行」。這個步驟只需執行一次。", syncStep5Title: "完成 Google 權限授權", syncStep5Body: "依畫面選擇自己的 Google 帳號，確認權限後按「允許」。這是讓 Apps Script 寫入你自己的試算表。", syncStep6Title: "取得同步密碼", syncStep6Body: "回到試算表並重新整理，選擇「GCGL 同步」→「初始設定／查看同步密碼」，複製顯示的同步密碼。", syncStep7Title: "部署為網路應用程式", syncStep7Body: "在 Apps Script 選擇「部署」→「新增部署作業」→「網路應用程式」。執行身分選「我」，存取權限選「所有人」。", syncStep8Title: "複製 /exec 網址", syncStep8Body: "完成部署後，複製「網頁應用程式」網址。請確認網址最後是 /exec，不要複製 /dev 網址。", syncStep9Title: "回到 App 測試並儲存", syncStep9Body: "在 App 開啟「設定」→「Google 試算表同步」，貼上 /exec 網址與同步密碼。先按「測試連線」，成功後再按「儲存」。",
    copyCode: "複製完整程式碼", copied: "已複製完整程式碼", copyFailed: "無法自動複製，請手動選取程式碼", codeLoading: "正在載入程式碼…", codeLoadFailed: "程式碼載入失敗，請重新整理頁面。", codeNote: "程式碼會建立專案報告所需分頁，並支援全量同步、單一案場更新及刪除。", expandCode: "展開程式碼", collapseCode: "收合程式碼", syncImportantTitle: "部署後打開網址，應該看到健康狀態", syncImportantBody: "用 Safari 開啟 <code>/exec</code> 網址，畫面應顯示 <code>\"ok\": true</code>。若出現登入頁或 1011 錯誤，通常是存取權限沒有設為「所有人」。",
    supportEyebrow: "技術支援", supportTitle: "技術支援", supportSubtitle: "如有任何問題，我們很樂意協助您解決。", faq1Q: "如何備份我的資料？", faq1A: "訂閱 Pro 方案後，資料會自動同步至您的 iCloud Drive。您也可以在設定頁手動觸發備份。", faq2Q: "刪除 App 後資料會消失嗎？", faq2A: "訂閱 Pro 方案的用戶，資料儲存於 iCloud，重裝 App 後可自動還原。未訂閱用戶的資料僅儲存於本機，刪除 App 後將無法恢復。", faq3Q: "如何恢復訂閱？", faq3A: "開啟 App 後，在付費牆頁面點擊「恢復購買」，系統將自動恢復您原有的訂閱狀態。", faq4Q: "如何取消訂閱？", faq4A: "前往 iPhone「設定」→ 點選您的 Apple ID →「訂閱」→ 找到「工地現場管理」→ 取消訂閱。", faq5Q: "免費試用期結束後會自動扣款嗎？", faq5A: "是的，試用期結束後會自動續訂並扣款。如不想繼續訂閱，請在試用期結束前取消。", faq6Q: "匯出的 PDF 或 Excel 在哪裡？", faq6A: "匯出後會透過 iOS 的分享功能讓您選擇儲存位置，例如「檔案」App 或傳送給其他人。",
    privacyEyebrow: "隱私權政策", privacyTitle: "隱私權政策", privacyUpdated: "最後更新：2026 年 6 月 26 日", privacyIntro: "感謝您使用「工地現場管理」。本隱私權政策說明我們如何收集、使用及保護您的個人資料。", privacyH1: "1. 資料收集", privacyP1: "本應用程式以離線為主，所有工程記錄、案場資訊、材料訂購等資料均儲存於您的裝置本機或您的 iCloud 帳號中。我們不會在我們的伺服器上儲存您的個人資料。", privacyH2: "2. 我們收集的資料", privacyL21: "<strong>本機儲存資料：</strong>工程記錄、案場資訊、工程進度、材料訂購等，儲存於您的裝置或 iCloud Drive。", privacyL22: "<strong>訂閱資料：</strong>訂閱狀態由 Apple App Store 及 RevenueCat 管理，我們不會存取您的付款資訊。", privacyL23: "<strong>匯出資料：</strong>您主動匯出的 PDF、Excel 或 LINE 分享內容，由您自行控制。", privacyH3: "3. 第三方服務", privacyL31: "<strong>Apple iCloud：</strong>用於雲端備份與資料同步。", privacyL32: "<strong>RevenueCat：</strong>用於管理訂閱狀態，適用 <a href=\"https://www.revenuecat.com/privacy\" target=\"_blank\" rel=\"noopener\">RevenueCat 隱私權政策</a>。", privacyL33: "<strong>Apple App Store：</strong>用於處理應用程式內購。", privacyH4: "4. 資料安全", privacyP4: "您的資料儲存於您的裝置本機或 iCloud，受 Apple 的安全機制保護。我們不會存取、傳輸或出售您的個人資料。", privacyH5: "5. 兒童隱私", privacyP5: "本應用程式不針對 13 歲以下兒童設計，亦不會主動收集兒童個人資料。", privacyH6: "6. 隱私權政策變更", privacyP6: "我們保留修改本隱私權政策的權利。重大變更時，將於應用程式內通知使用者。", privacyH7: "7. 聯絡我們", followThreads: "在脆上追蹤", terms: "使用條款", privacyLink: "隱私權", contactLink: "聯絡我們"
  },
  "zh-Hans": {
    brand: "工地现场管理", navFeatures: "功能", navGuide: "使用教程", navSync: "表格同步", navSupport: "支持", download: "下载", languageLabel: "切换语言",
    heroEyebrow: "你的个人工地现场管理工具", heroTitle: "把工地的每一天，<span>整理得清清楚楚。</span>", heroBody: "工程记录、施工进度、工程计价、材料订购与现场报表，一部 iPhone 就能完成。", appStoreCta: "在 App Store 下载", syncCta: "设置 Google 同步", offline: "支持离线", icloud: "iCloud 备份", export: "导出 PDF・Excel", progressLabel: "工程进度", reportTitle: "项目报告", reportBody: "一键导出 Excel",
    featuresEyebrow: "核心功能", featuresTitle: "从第一条记录到完工，<span>都在同一个地方。</span>", featuresBody: "让现场信息不再散落在纸张、群聊和不同文件中。",
    feature1Title: "每天的工程记录，一眼看懂。", feature1Body: "使用日历整理施工项目、厂商、楼层、人数、设备与备注，搜索和分享也更快捷。", feature2Title: "进度与计价，用趋势查看变化。", feature2Body: "按月查看工程与计价进度，并跟踪各项目、楼层和厂商状态。", feature3Title: "集中管理工地、计价与文件。", feature3Body: "保管工地资料、工程计价、追加工程、厂商信息和 PDF 文件。", feature4Title: "材料订单不漏项，也不漏交货。", feature4Body: "建立自己的材料分类，记录订购与到货数量，并分享到 LINE 或同步 Google 表格。", feature5Title: "照片与图纸，现场直接标记。", feature5Body: "把日期、工地、厂商、楼层和文字添加到照片，也能在 PDF 图纸上插入现场照片。", feature6Title: "报表与数据，随时带走。", feature6Body: "导出 PDF、Excel 和 ZIP 备份，工程信息由你掌握。",
    guideEyebrow: "快速开始", guideTitle: "第一次使用，<span>六步即可开始记录。</span>", step1Title: "创建工地", step1Body: "在“工地信息”中添加工地名称、楼层和基本资料。", step2Title: "创建公司与施工厂商", step2Body: "在管理页面添加你的公司与合作厂商，再把厂商添加到工地。", step3Title: "新增施工项目", step3Body: "指定项目、厂商和施工楼层，工程进度会立即建立。", step4Title: "填写每日工程记录", step4Body: "从日历添加施工项目、人数、进度、设备和备注。", step5Title: "创建材料品项", step5Body: "手动创建，或从 Excel 批量导入材料分类与品项。", step6Title: "导出与同步", step6Body: "将报表导出为 PDF／Excel，或同步到 Google 表格。",
    syncEyebrow: "Google 表格同步", syncTitle: "你的项目报告，<span>自动同步到自己的表格。</span>", syncBody: "无需在 App 内登录 Google 账号。只需部署一次 Apps Script，新增、修改与删除都可由 App 同步。", viewScreenshot: "放大查看教程截图",
    syncVisual1Title: "创建表格并打开 Apps Script", syncVisual1Body: "前往 <a href=\"https://sheets.google.com\" target=\"_blank\" rel=\"noopener\">Google 表格</a>创建空白表格，再选择“扩展程序”→“Apps Script”。", syncVisual2Title: "粘贴代码并完成授权", syncVisual2Body: "复制右侧完整代码，粘贴到 Code.gs 并保存。选择 setupGCGLSync 后点击“运行”，完成 Google 授权。", syncVisual3Title: "部署为 Web 应用", syncVisual3Body: "选择“部署”→“新建部署”→“Web 应用”。执行身份选择“我”，访问权限选择“所有人”，然后复制以 /exec 结尾的网址。", syncVisual4Title: "返回 App 测试并保存", syncVisual4Body: "打开“设置”→“Google 表格同步”，粘贴网址和同步密码。连接测试成功后点击“保存”。",
    syncStep1Title: "创建空白表格", syncStep1Body: "前往 <a href=\"https://sheets.google.com\" target=\"_blank\" rel=\"noopener\">Google 表格</a>，新建一份空白表格。", syncStep2Title: "打开 Apps Script", syncStep2Body: "在表格顶部选择“扩展程序”→“Apps Script”。", syncStep3Title: "粘贴完整代码", syncStep3Body: "先点击右侧“复制完整代码”，删除 Code.gs 原有内容，再完整粘贴并保存。", syncStep4Title: "运行一次 setupGCGLSync", syncStep4Body: "在函数列表选择 setupGCGLSync，再点击“运行”。此步骤只需执行一次。", syncStep5Title: "完成 Google 权限授权", syncStep5Body: "按照画面选择自己的 Google 账号，确认权限后点击“允许”，让 Apps Script 可以写入您的表格。", syncStep6Title: "获取同步密码", syncStep6Body: "返回表格并刷新，选择“GCGL 同步”→“初始设置／查看同步密码”，复制显示的同步密码。", syncStep7Title: "部署为 Web 应用", syncStep7Body: "在 Apps Script 选择“部署”→“新建部署”→“Web 应用”。执行身份选择“我”，访问权限选择“所有人”。", syncStep8Title: "复制 /exec 网址", syncStep8Body: "部署完成后复制 Web 应用网址。请确认网址以 /exec 结尾，不要复制 /dev 网址。", syncStep9Title: "返回 App 测试并保存", syncStep9Body: "在 App 打开“设置”→“Google 表格同步”，粘贴 /exec 网址与同步密码。先测试连接，成功后再保存。",
    copyCode: "复制完整代码", copied: "完整代码已复制", copyFailed: "无法自动复制，请手动选择代码", codeLoading: "正在加载代码…", codeLoadFailed: "代码加载失败，请刷新页面。", codeNote: "代码会创建项目报告所需工作表，并支持完整同步、单个工地更新和删除。", expandCode: "展开代码", collapseCode: "收起代码", syncImportantTitle: "部署后打开网址，应看到健康状态", syncImportantBody: "使用 Safari 打开 <code>/exec</code> 网址，应显示 <code>\"ok\": true</code>。如果出现登录页面或 1011 错误，通常是访问权限没有设为“所有人”。",
    supportEyebrow: "技术支持", supportTitle: "技术支持", supportSubtitle: "如有任何问题，我们很乐意协助您解决。", faq1Q: "如何备份我的数据？", faq1A: "订阅 Pro 方案后，数据会自动同步到您的 iCloud Drive。您也可以在设置页面手动触发备份。", faq2Q: "删除 App 后数据会消失吗？", faq2A: "订阅 Pro 方案的用户，数据存储在 iCloud 中，重新安装 App 后可自动恢复。未订阅用户的数据仅存储在本机，删除 App 后将无法恢复。", faq3Q: "如何恢复订阅？", faq3A: "打开 App 后，在付费墙页面点击“恢复购买”，系统将自动恢复您原有的订阅状态。", faq4Q: "如何取消订阅？", faq4A: "前往 iPhone“设置”→ 点击您的 Apple ID →“订阅”→ 找到“工地现场管理”→ 取消订阅。", faq5Q: "免费试用期结束后会自动扣款吗？", faq5A: "是的，试用期结束后会自动续订并扣款。如不想继续订阅，请在试用期结束前取消。", faq6Q: "导出的 PDF 或 Excel 在哪里？", faq6A: "导出后会通过 iOS 的共享功能让您选择保存位置，例如“文件”App 或发送给其他人。",
    privacyEyebrow: "隐私政策", privacyTitle: "隐私政策", privacyUpdated: "最后更新：2026 年 6 月 26 日", privacyIntro: "感谢您使用“工地现场管理”。本隐私政策说明我们如何收集、使用及保护您的个人数据。", privacyH1: "1. 数据收集", privacyP1: "本应用程序以离线使用为主，所有工程记录、工地信息、材料订购等数据均存储在您的设备本机或您的 iCloud 账户中。我们不会在自己的服务器上存储您的个人数据。", privacyH2: "2. 我们收集的数据", privacyL21: "<strong>本机存储数据：</strong>工程记录、工地信息、工程进度、材料订购等，存储在您的设备或 iCloud Drive 中。", privacyL22: "<strong>订阅数据：</strong>订阅状态由 Apple App Store 及 RevenueCat 管理，我们不会访问您的付款信息。", privacyL23: "<strong>导出数据：</strong>您主动导出的 PDF、Excel 或 LINE 共享内容，由您自行控制。", privacyH3: "3. 第三方服务", privacyL31: "<strong>Apple iCloud：</strong>用于云端备份与数据同步。", privacyL32: "<strong>RevenueCat：</strong>用于管理订阅状态，适用 <a href=\"https://www.revenuecat.com/privacy\" target=\"_blank\" rel=\"noopener\">RevenueCat 隐私政策</a>。", privacyL33: "<strong>Apple App Store：</strong>用于处理应用内购买。", privacyH4: "4. 数据安全", privacyP4: "您的数据存储在设备本机或 iCloud 中，并受 Apple 的安全机制保护。我们不会访问、传输或出售您的个人数据。", privacyH5: "5. 儿童隐私", privacyP5: "本应用程序并非为 13 岁以下儿童设计，也不会主动收集儿童的个人数据。", privacyH6: "6. 隐私政策变更", privacyP6: "我们保留修改本隐私政策的权利。如有重大变更，将在应用程序内通知用户。", privacyH7: "7. 联系我们", followThreads: "在 Threads 上关注", terms: "使用条款", privacyLink: "隐私", contactLink: "联系我们"
  },
  ja: {
    brand: "現場管理", navFeatures: "機能", navGuide: "使い方", navSync: "スプレッドシート連携", navSupport: "サポート", download: "ダウンロード", languageLabel: "言語を切り替える",
    heroEyebrow: "あなた専用の工事現場管理ツール", heroTitle: "現場の毎日を、<span>すっきり、わかりやすく。</span>", heroBody: "工事記録、施工進捗、出来高管理、資材発注、現場レポートまで、iPhoneひとつで完結します。", appStoreCta: "App Storeからダウンロード", syncCta: "Google連携を設定", offline: "オフライン対応", icloud: "iCloudバックアップ", export: "PDF・Excel出力", progressLabel: "工事進捗", reportTitle: "プロジェクトレポート", reportBody: "Excelをワンタップ出力",
    featuresEyebrow: "主な機能", featuresTitle: "最初の記録から竣工まで、<span>すべてをひとつに。</span>", featuresBody: "紙の帳票、グループチャット、複数のファイルに散らばる現場情報をまとめます。",
    feature1Title: "毎日の工事記録が、ひと目でわかる。", feature1Body: "カレンダーで工種、協力会社、階、作業員数、使用機械、備考を整理。検索や共有もすばやく行えます。", feature2Title: "進捗と出来高を、推移で確認。", feature2Body: "月ごとの施工進捗と出来高を確認し、工種・階・協力会社別の状況も追跡できます。", feature3Title: "現場、出来高、書類を一括管理。", feature3Body: "現場情報、出来高、追加工事、協力会社情報、PDF書類をまとめて保管できます。", feature4Title: "資材の発注漏れも、納品漏れも防ぐ。", feature4Body: "独自の資材分類を作成し、発注数と入荷数を記録。LINE共有やGoogleスプレッドシート連携にも対応します。", feature5Title: "写真と図面に、その場で注記。", feature5Body: "日付、現場、協力会社、階、文字を写真に追加。PDF図面へ現場写真を貼り付けることもできます。", feature6Title: "帳票もデータも、いつでも持ち出せる。", feature6Body: "PDF、Excel、ZIPバックアップを書き出し、工事情報を自分で管理できます。",
    guideEyebrow: "クイックスタート", guideTitle: "はじめてでも、<span>6ステップですぐに記録。</span>", step1Title: "現場を作成", step1Body: "「現場情報」で現場名、階、基本情報を登録します。", step2Title: "自社・協力会社を登録", step2Body: "管理画面で自社と協力会社を登録し、対象の現場へ追加します。", step3Title: "施工項目を追加", step3Body: "工種、協力会社、施工階を指定すると、進捗管理がすぐに始まります。", step4Title: "日々の工事記録を入力", step4Body: "カレンダーから工種、人数、進捗、使用機械、備考を記録します。", step5Title: "資材品目を作成", step5Body: "手入力またはExcelから資材分類と品目を一括取り込みします。", step6Title: "出力・連携", step6Body: "帳票をPDF／Excelで出力、またはGoogleスプレッドシートへ連携します。",
    syncEyebrow: "Googleスプレッドシート連携", syncTitle: "プロジェクトレポートを、<span>自分のスプレッドシートへ自動同期。</span>", syncBody: "App内でGoogleアカウントにログインする必要はありません。Apps Scriptを一度デプロイするだけで、追加・変更・削除をAppから同期できます。", viewScreenshot: "チュートリアル画像を拡大表示",
    syncVisual1Title: "スプレッドシートを作成してApps Scriptを開く", syncVisual1Body: "<a href=\"https://sheets.google.com\" target=\"_blank\" rel=\"noopener\">Googleスプレッドシート</a>で空のファイルを作成し、「拡張機能」→「Apps Script」を選択します。", syncVisual2Title: "コードを貼り付けて承認を完了", syncVisual2Body: "右側のコード全体をコピーしてCode.gsに貼り付け、保存します。setupGCGLSyncを選択して「実行」を押し、Googleの承認を完了します。", syncVisual3Title: "ウェブアプリとしてデプロイ", syncVisual3Body: "「デプロイ」→「新しいデプロイ」→「ウェブアプリ」を選択します。実行ユーザーは「自分」、アクセスできるユーザーは「全員」にして、末尾が/execのURLをコピーします。", syncVisual4Title: "Appでテストして保存", syncVisual4Body: "「設定」→「Googleスプレッドシート連携」を開き、URLと同期パスワードを貼り付けます。接続テストに成功したら「保存」を押します。",
    syncStep1Title: "空のスプレッドシートを作成", syncStep1Body: "<a href=\"https://sheets.google.com\" target=\"_blank\" rel=\"noopener\">Googleスプレッドシート</a>を開き、新しい空のファイルを作成します。", syncStep2Title: "Apps Scriptを開く", syncStep2Body: "スプレッドシート上部の「拡張機能」→「Apps Script」を選択します。", syncStep3Title: "コード全体を貼り付ける", syncStep3Body: "右側の「コード全体をコピー」を押し、Code.gsの既存内容を削除してから貼り付け、保存します。", syncStep4Title: "setupGCGLSyncを一度実行", syncStep4Body: "関数一覧からsetupGCGLSyncを選び、「実行」を押します。この操作は一度だけ行います。", syncStep5Title: "Googleの権限を承認", syncStep5Body: "自分のGoogleアカウントを選択し、権限内容を確認して「許可」を押します。", syncStep6Title: "同期パスワードを取得", syncStep6Body: "スプレッドシートに戻って再読み込みし、「GCGL 同期」→「初期設定／同期パスワードを表示」を選択してパスワードをコピーします。", syncStep7Title: "ウェブアプリとしてデプロイ", syncStep7Body: "Apps Scriptで「デプロイ」→「新しいデプロイ」→「ウェブアプリ」を選択します。実行ユーザーは「自分」、アクセスできるユーザーは「全員」にします。", syncStep8Title: "/exec URLをコピー", syncStep8Body: "デプロイ後、ウェブアプリのURLをコピーします。末尾が/execであることを確認し、/dev URLは使用しないでください。", syncStep9Title: "Appでテストして保存", syncStep9Body: "Appの「設定」→「Googleスプレッドシート連携」で/exec URLと同期パスワードを入力します。接続テストに成功したら保存します。",
    copyCode: "コード全体をコピー", copied: "コード全体をコピーしました", copyFailed: "自動コピーできません。コードを手動で選択してください", codeLoading: "コードを読み込んでいます…", codeLoadFailed: "コードを読み込めませんでした。ページを再読み込みしてください。", codeNote: "このコードはプロジェクトレポート用のシートを作成し、全件同期・現場単位の更新・削除に対応します。", expandCode: "コードを展開", collapseCode: "コードを閉じる", syncImportantTitle: "デプロイ後、URLを開いて動作状態を確認", syncImportantBody: "Safariで<code>/exec</code> URLを開き、<code>\"ok\": true</code>が表示されることを確認してください。ログイン画面や1011エラーが出る場合は、アクセス権限が「全員」になっていない可能性があります。",
    supportEyebrow: "サポート", supportTitle: "サポート", supportSubtitle: "ご不明な点がございましたら、お気軽にお問い合わせください。", faq1Q: "データはどうやってバックアップしますか？", faq1A: "Proプランをご契約いただくと、データは自動的にiCloud Driveに同期されます。設定ページから手動でバックアップを実行することもできます。", faq2Q: "Appを削除するとデータは消えますか？", faq2A: "Proプランをご契約のユーザーは、データがiCloudに保存されているため、Appを再インストールすると自動的に復元されます。未契約ユーザーのデータは端末のみに保存されており、App削除後は復元できません。", faq3Q: "サブスクリプションを復元するには？", faq3A: "Appを開き、有料プラン画面で「購入を復元」をタップすると、以前のサブスクリプション状態が自動的に復元されます。", faq4Q: "サブスクリプションを解約するには？", faq4A: "iPhoneの「設定」→ ご自身のApple IDをタップ →「サブスクリプション」→「現場管理」を選択 → 解約してください。", faq5Q: "無料トライアル終了後は自動的に課金されますか？", faq5A: "はい、トライアル終了後は自動的に更新され課金されます。継続を希望しない場合は、トライアル終了前に解約してください。", faq6Q: "出力したPDFやExcelはどこにありますか？", faq6A: "出力後はiOSの共有機能を通じて保存先を選択できます。「ファイル」Appに保存するか、他の方に送信することも可能です。",
    privacyEyebrow: "プライバシーポリシー", privacyTitle: "プライバシーポリシー", privacyUpdated: "最終更新日：2026年6月26日", privacyIntro: "「現場管理」をご利用いただきありがとうございます。本プライバシーポリシーでは、お客様の個人情報の収集、利用、保護方法についてご説明します。", privacyH1: "1. 情報の収集", privacyP1: "本アプリケーションはオフライン利用を基本としており、すべての工事記録、現場情報、資材注文などのデータはお客様の端末本体またはiCloudアカウントに保存されます。当社のサーバーにお客様の個人情報を保存することはありません。", privacyH2: "2. 収集する情報", privacyL21: "<strong>端末保存データ：</strong>工事記録、現場情報、工事進捗、資材注文などは、お客様の端末またはiCloud Driveに保存されます。", privacyL22: "<strong>サブスクリプション情報：</strong>サブスクリプション状態はApple App StoreおよびRevenueCatにより管理されており、当社がお客様の決済情報にアクセスすることはありません。", privacyL23: "<strong>出力データ：</strong>お客様が能動的に出力したPDF、Excel、またはLINE共有内容は、お客様ご自身で管理していただきます。", privacyH3: "3. 第三者サービス", privacyL31: "<strong>Apple iCloud：</strong>クラウドバックアップとデータ同期に使用します。", privacyL32: "<strong>RevenueCat：</strong>サブスクリプション状態の管理に使用します。<a href=\"https://www.revenuecat.com/privacy\" target=\"_blank\" rel=\"noopener\">RevenueCatのプライバシーポリシー</a>が適用されます。", privacyL33: "<strong>Apple App Store：</strong>アプリ内課金の処理に使用します。", privacyH4: "4. データセキュリティ", privacyP4: "お客様のデータは端末本体またはiCloudに保存され、Appleのセキュリティ機構によって保護されています。当社がお客様の個人情報にアクセス、送信、または販売することはありません。", privacyH5: "5. お子様のプライバシー", privacyP5: "本アプリケーションは13歳未満のお子様を対象としておらず、お子様の個人情報を能動的に収集することもありません。", privacyH6: "6. プライバシーポリシーの変更", privacyP6: "当社は本プライバシーポリシーを変更する権利を留保します。重要な変更がある場合は、アプリ内でユーザーに通知します。", privacyH7: "7. お問い合わせ", followThreads: "Threadsでフォロー", terms: "利用規約", privacyLink: "プライバシー", contactLink: "お問い合わせ"
  },
  ko: {
    brand: "공사 현장 관리", navFeatures: "기능", navGuide: "사용 방법", navSync: "스프레드시트 동기화", navSupport: "지원", download: "다운로드", languageLabel: "언어 변경",
    heroEyebrow: "나만의 공사 현장 관리 도구", heroTitle: "현장의 하루하루를, <span>한눈에 명확하게.</span>", heroBody: "공사 기록, 진행률, 기성 관리, 자재 주문, 현장 보고서까지 iPhone 하나로 관리하세요.", appStoreCta: "App Store에서 다운로드", syncCta: "Google 동기화 설정", offline: "오프라인 사용", icloud: "iCloud 백업", export: "PDF・Excel 내보내기", progressLabel: "공사 진행률", reportTitle: "프로젝트 보고서", reportBody: "Excel 원터치 내보내기",
    featuresEyebrow: "핵심 기능", featuresTitle: "첫 기록부터 준공까지, <span>한곳에서 관리하세요.</span>", featuresBody: "종이 문서, 단체 채팅, 여러 파일에 흩어진 현장 정보를 하나로 모읍니다.",
    feature1Title: "매일의 공사 기록을 한눈에.", feature1Body: "캘린더에서 공종, 업체, 층, 인원, 장비, 메모를 정리하고 빠르게 검색하고 공유할 수 있습니다.", feature2Title: "진행률과 기성률을 추세로 확인.", feature2Body: "월별 공사 진행률과 기성률을 확인하고 공종·층·업체별 상태를 추적합니다.", feature3Title: "현장, 기성, 문서를 통합 관리.", feature3Body: "현장 정보, 기성 내역, 추가 공사, 업체 정보와 PDF 문서를 한곳에 보관합니다.", feature4Title: "자재 주문과 입고를 빠짐없이.", feature4Body: "자재 분류를 만들고 주문·입고 수량을 기록해 LINE으로 공유하거나 Google 스프레드시트와 동기화합니다.", feature5Title: "사진과 도면에 현장에서 바로 표시.", feature5Body: "날짜, 현장, 업체, 층, 문구를 사진에 추가하고 PDF 도면에도 현장 사진을 붙일 수 있습니다.", feature6Title: "보고서와 데이터를 언제든 내보내기.", feature6Body: "PDF, Excel, ZIP 백업으로 내보내 공사 정보를 직접 관리하세요.",
    guideEyebrow: "빠른 시작", guideTitle: "처음이라도, <span>6단계면 기록을 시작할 수 있어요.</span>", step1Title: "현장 만들기", step1Body: "‘현장 정보’에서 현장명, 층, 기본 정보를 등록합니다.", step2Title: "내 회사와 협력업체 등록", step2Body: "관리 화면에서 내 회사와 협력업체를 추가하고 해당 현장에 연결합니다.", step3Title: "공사 항목 추가", step3Body: "공종, 업체, 시공 층을 지정하면 진행률 관리가 바로 시작됩니다.", step4Title: "일일 공사 기록 작성", step4Body: "캘린더에서 공종, 인원, 진행률, 장비와 메모를 기록합니다.", step5Title: "자재 품목 만들기", step5Body: "직접 등록하거나 Excel에서 자재 분류와 품목을 일괄 가져옵니다.", step6Title: "내보내기 및 동기화", step6Body: "보고서를 PDF／Excel로 내보내거나 Google 스프레드시트와 동기화합니다.",
    syncEyebrow: "Google 스프레드시트 동기화", syncTitle: "프로젝트 보고서를, <span>내 스프레드시트에 자동 동기화.</span>", syncBody: "앱에서 Google 계정에 로그인할 필요가 없습니다. Apps Script를 한 번 배포하면 추가·수정·삭제 내용을 앱에서 동기화할 수 있습니다.", viewScreenshot: "튜토리얼 스크린샷 크게 보기",
    syncVisual1Title: "스프레드시트를 만들고 Apps Script 열기", syncVisual1Body: "<a href=\"https://sheets.google.com\" target=\"_blank\" rel=\"noopener\">Google 스프레드시트</a>에서 빈 문서를 만든 뒤 ‘확장 프로그램’ → ‘Apps Script’를 선택합니다.", syncVisual2Title: "코드를 붙여넣고 권한 승인 완료", syncVisual2Body: "오른쪽의 전체 코드를 복사해 Code.gs에 붙여넣고 저장합니다. setupGCGLSync를 선택해 ‘실행’을 누르고 Google 권한 승인을 완료합니다.", syncVisual3Title: "웹 앱으로 배포", syncVisual3Body: "‘배포’ → ‘새 배포’ → ‘웹 앱’을 선택합니다. 실행 사용자는 ‘나’, 액세스 권한은 ‘모든 사용자’로 설정한 뒤 /exec로 끝나는 URL을 복사합니다.", syncVisual4Title: "App에서 테스트 후 저장", syncVisual4Body: "‘설정’ → ‘Google 스프레드시트 동기화’를 열고 URL과 동기화 비밀번호를 붙여넣습니다. 연결 테스트에 성공하면 ‘저장’을 누릅니다.",
    syncStep1Title: "빈 스프레드시트 만들기", syncStep1Body: "<a href=\"https://sheets.google.com\" target=\"_blank\" rel=\"noopener\">Google 스프레드시트</a>에서 새 빈 문서를 만듭니다.", syncStep2Title: "Apps Script 열기", syncStep2Body: "스프레드시트 상단에서 ‘확장 프로그램’ → ‘Apps Script’를 선택합니다.", syncStep3Title: "전체 코드 붙여넣기", syncStep3Body: "오른쪽의 ‘전체 코드 복사’를 누르고 Code.gs의 기존 내용을 삭제한 뒤 전체 코드를 붙여넣고 저장합니다.", syncStep4Title: "setupGCGLSync 한 번 실행", syncStep4Body: "함수 목록에서 setupGCGLSync를 선택하고 ‘실행’을 누릅니다. 이 단계는 한 번만 실행합니다.", syncStep5Title: "Google 권한 승인 완료", syncStep5Body: "본인의 Google 계정을 선택하고 권한을 확인한 뒤 ‘허용’을 눌러 Apps Script가 스프레드시트에 쓸 수 있도록 합니다.", syncStep6Title: "동기화 비밀번호 받기", syncStep6Body: "스프레드시트로 돌아가 새로고침한 뒤 ‘GCGL 동기화’ → ‘초기 설정／동기화 비밀번호 보기’를 선택하고 비밀번호를 복사합니다.", syncStep7Title: "웹 앱으로 배포", syncStep7Body: "Apps Script에서 ‘배포’ → ‘새 배포’ → ‘웹 앱’을 선택합니다. 실행 사용자는 ‘나’, 액세스 권한은 ‘모든 사용자’로 설정합니다.", syncStep8Title: "/exec URL 복사", syncStep8Body: "배포가 끝나면 웹 앱 URL을 복사합니다. URL이 /exec로 끝나는지 확인하고 /dev URL은 사용하지 마세요.", syncStep9Title: "앱에서 테스트 후 저장", syncStep9Body: "앱의 ‘설정’ → ‘Google 스프레드시트 동기화’에서 /exec URL과 동기화 비밀번호를 입력합니다. 연결 테스트가 성공하면 저장합니다.",
    copyCode: "전체 코드 복사", copied: "전체 코드를 복사했습니다", copyFailed: "자동으로 복사하지 못했습니다. 코드를 직접 선택해 주세요", codeLoading: "코드를 불러오는 중…", codeLoadFailed: "코드를 불러오지 못했습니다. 페이지를 새로고침해 주세요.", codeNote: "이 코드는 프로젝트 보고서용 시트를 만들고 전체 동기화, 현장별 업데이트 및 삭제를 지원합니다.", expandCode: "코드 펼치기", collapseCode: "코드 접기", syncImportantTitle: "배포 후 URL을 열어 상태 확인", syncImportantBody: "Safari에서 <code>/exec</code> URL을 열었을 때 <code>\"ok\": true</code>가 표시되어야 합니다. 로그인 화면이나 1011 오류가 나타나면 액세스 권한이 ‘모든 사용자’로 설정되지 않았을 가능성이 큽니다.",
    supportEyebrow: "기술 지원", supportTitle: "기술 지원", supportSubtitle: "문의 사항이 있으시면 언제든 도와드리겠습니다.", faq1Q: "데이터는 어떻게 백업하나요?", faq1A: "Pro 요금제를 구독하면 데이터가 iCloud Drive에 자동으로 동기화됩니다. 설정 화면에서 수동으로 백업할 수도 있습니다.", faq2Q: "App을 삭제하면 데이터도 사라지나요?", faq2A: "Pro 요금제 사용자는 데이터가 iCloud에 저장되므로 App을 다시 설치하면 자동으로 복원됩니다. 미구독 사용자의 데이터는 기기에만 저장되며 App을 삭제한 뒤에는 복원할 수 없습니다.", faq3Q: "구독을 복원하려면 어떻게 하나요?", faq3A: "App을 열고 유료 플랜 화면에서 ‘구매 복원’을 누르면 기존 구독 상태가 자동으로 복원됩니다.", faq4Q: "구독을 취소하려면 어떻게 하나요?", faq4A: "iPhone ‘설정’ → Apple ID → ‘구독’ → ‘공사 현장 관리’를 선택한 뒤 구독을 취소해 주세요.", faq5Q: "무료 체험이 끝나면 자동으로 결제되나요?", faq5A: "예. 체험 기간이 끝나면 자동으로 갱신되고 결제됩니다. 계속 구독하지 않으려면 체험 종료 전에 취소해 주세요.", faq6Q: "내보낸 PDF 또는 Excel은 어디에 있나요?", faq6A: "내보낸 뒤 iOS 공유 기능에서 저장 위치를 선택할 수 있습니다. ‘파일’ App에 저장하거나 다른 사람에게 보낼 수 있습니다.",
    privacyEyebrow: "개인정보 처리방침", privacyTitle: "개인정보 처리방침", privacyUpdated: "최종 업데이트: 2026년 6월 26일", privacyIntro: "‘공사 현장 관리’를 이용해 주셔서 감사합니다. 본 개인정보 처리방침은 개인정보를 수집, 이용 및 보호하는 방법을 설명합니다.", privacyH1: "1. 데이터 수집", privacyP1: "본 애플리케이션은 오프라인 사용을 기본으로 하며 모든 공사 기록, 현장 정보, 자재 주문 등의 데이터는 사용자의 기기 또는 iCloud 계정에 저장됩니다. 당사 서버에는 사용자의 개인정보를 저장하지 않습니다.", privacyH2: "2. 수집하는 데이터", privacyL21: "<strong>기기 저장 데이터:</strong> 공사 기록, 현장 정보, 공사 진행률, 자재 주문 등은 사용자의 기기 또는 iCloud Drive에 저장됩니다.", privacyL22: "<strong>구독 데이터:</strong> 구독 상태는 Apple App Store와 RevenueCat에서 관리하며 당사는 결제 정보에 접근하지 않습니다.", privacyL23: "<strong>내보낸 데이터:</strong> 사용자가 직접 내보낸 PDF, Excel 또는 LINE 공유 내용은 사용자가 직접 관리합니다.", privacyH3: "3. 제3자 서비스", privacyL31: "<strong>Apple iCloud:</strong> 클라우드 백업과 데이터 동기화에 사용됩니다.", privacyL32: "<strong>RevenueCat:</strong> 구독 상태 관리에 사용되며 <a href=\"https://www.revenuecat.com/privacy\" target=\"_blank\" rel=\"noopener\">RevenueCat 개인정보 처리방침</a>이 적용됩니다.", privacyL33: "<strong>Apple App Store:</strong> 앱 내 구매 처리에 사용됩니다.", privacyH4: "4. 데이터 보안", privacyP4: "사용자의 데이터는 기기 또는 iCloud에 저장되며 Apple의 보안 체계로 보호됩니다. 당사는 사용자의 개인정보에 접근하거나 전송 또는 판매하지 않습니다.", privacyH5: "5. 아동의 개인정보", privacyP5: "본 애플리케이션은 만 13세 미만 아동을 대상으로 하지 않으며 아동의 개인정보를 의도적으로 수집하지 않습니다.", privacyH6: "6. 개인정보 처리방침 변경", privacyP6: "당사는 본 개인정보 처리방침을 변경할 권리를 보유합니다. 중요한 변경 사항이 있는 경우 App 내에서 사용자에게 알립니다.", privacyH7: "7. 문의하기", followThreads: "Threads에서 팔로우", terms: "이용 약관", privacyLink: "개인정보 보호", contactLink: "문의하기"
  },
  en: {
    brand: "Site Log Manager", navFeatures: "Features", navGuide: "Get Started", navSync: "Sheets Sync", navSupport: "Support", download: "Download", languageLabel: "Change language",
    heroEyebrow: "Your personal construction site companion", heroTitle: "Keep every day on site <span>clear and organized.</span>", heroBody: "Daily logs, construction progress, valuations, material orders, and site reports—all from your iPhone.", appStoreCta: "Download on the App Store", syncCta: "Set up Google sync", offline: "Works offline", icloud: "iCloud backup", export: "PDF & Excel export", progressLabel: "Construction progress", reportTitle: "Project Report", reportBody: "Export to Excel in one tap",
    featuresEyebrow: "Core features", featuresTitle: "From the first site log to handover, <span>everything stays together.</span>", featuresBody: "Bring information scattered across paper, group chats, and separate files into one place.",
    feature1Title: "Daily site logs at a glance.", feature1Body: "Use the calendar to organize work items, contractors, floors, headcount, equipment, and notes—then search or share in seconds.", feature2Title: "See progress and valuations as trends.", feature2Body: "Review monthly construction and valuation progress, with status by work item, floor, and contractor.", feature3Title: "Keep site data, valuations, and files together.", feature3Body: "Manage project details, valuations, variations, contractor information, and PDF documents in one place.", feature4Title: "Never lose track of an order or delivery.", feature4Body: "Create your own material catalog, record ordered and delivered quantities, then share via LINE or sync with Google Sheets.", feature5Title: "Mark up photos and drawings on site.", feature5Body: "Add the date, project, contractor, floor, and notes to photos, or place site photos directly onto PDF drawings.", feature6Title: "Take your reports and data with you.", feature6Body: "Export PDF and Excel reports or a ZIP backup, so your project information remains under your control.",
    guideEyebrow: "Quick start", guideTitle: "New here? <span>Start logging in six steps.</span>", step1Title: "Create a project", step1Body: "Add the project name, floors, and essential details under Project Info.", step2Title: "Add your company and contractors", step2Body: "Create your company and trade partners in Manage, then add the right contractors to each project.", step3Title: "Add work items", step3Body: "Assign the work item, contractor, and floors. Progress tracking starts immediately.", step4Title: "Record the day’s work", step4Body: "Use the calendar to add work items, headcount, progress, equipment, and notes.", step5Title: "Build your material catalog", step5Body: "Create categories and items manually, or import them in bulk from Excel.", step6Title: "Export and sync", step6Body: "Export reports as PDF or Excel, or sync them to Google Sheets.",
    syncEyebrow: "Google Sheets sync", syncTitle: "Sync your Project Report <span>to a spreadsheet you own.</span>", syncBody: "There is no Google sign-in inside the app. Deploy Apps Script once, and the app can sync additions, edits, and deletions.", viewScreenshot: "Open tutorial screenshot at full size",
    syncVisual1Title: "Create a spreadsheet and open Apps Script", syncVisual1Body: "Create a blank file in <a href=\"https://sheets.google.com\" target=\"_blank\" rel=\"noopener\">Google Sheets</a>, then choose Extensions → Apps Script.", syncVisual2Title: "Paste the script and authorize it", syncVisual2Body: "Copy the full script on the right, paste it into Code.gs, and save. Choose setupGCGLSync, select Run, and complete Google authorization.", syncVisual3Title: "Deploy as a web app", syncVisual3Body: "Choose Deploy → New deployment → Web app. Set Execute as to Me and Who has access to Anyone, then copy the URL ending in /exec.", syncVisual4Title: "Test and save in the app", syncVisual4Body: "Open Settings → Google Sheets Sync, then paste the URL and sync password. After the connection test succeeds, select Save.",
    syncStep1Title: "Create a blank spreadsheet", syncStep1Body: "Open <a href=\"https://sheets.google.com\" target=\"_blank\" rel=\"noopener\">Google Sheets</a> and create a new blank spreadsheet.", syncStep2Title: "Open Apps Script", syncStep2Body: "From the spreadsheet menu, choose Extensions → Apps Script.", syncStep3Title: "Paste the complete script", syncStep3Body: "Select Copy full script on the right, delete the starter code in Code.gs, paste the complete script, and save.", syncStep4Title: "Run setupGCGLSync once", syncStep4Body: "Choose setupGCGLSync from the function menu, then select Run. You only need to do this once.", syncStep5Title: "Complete Google authorization", syncStep5Body: "Choose your Google account, review the permissions, and select Allow so Apps Script can write to your spreadsheet.", syncStep6Title: "Get the sync password", syncStep6Body: "Return to the spreadsheet and refresh it. Choose GCGL Sync → Initial setup / View sync password, then copy the password.", syncStep7Title: "Deploy as a web app", syncStep7Body: "In Apps Script, choose Deploy → New deployment → Web app. Set Execute as to Me and Who has access to Anyone.", syncStep8Title: "Copy the /exec URL", syncStep8Body: "After deployment, copy the web app URL. Confirm that it ends in /exec and do not use the /dev URL.", syncStep9Title: "Test and save in the app", syncStep9Body: "Open Settings → Google Sheets Sync in the app and paste the /exec URL and sync password. Test the connection, then save after it succeeds.",
    copyCode: "Copy full script", copied: "Full script copied", copyFailed: "Automatic copy failed. Please select the code manually.", codeLoading: "Loading script…", codeLoadFailed: "The script could not be loaded. Please refresh the page.", codeNote: "This script creates the Project Report sheets and supports full sync, per-project updates, and deletion.", expandCode: "Expand code", collapseCode: "Collapse code", syncImportantTitle: "After deployment, open the URL to check its status", syncImportantBody: "Open the <code>/exec</code> URL in Safari. It should show <code>\"ok\": true</code>. A sign-in page or error 1011 usually means access was not set to Anyone.",
    supportEyebrow: "Technical Support", supportTitle: "Technical Support", supportSubtitle: "If you have any questions, we will be happy to help.", faq1Q: "How do I back up my data?", faq1A: "After subscribing to Pro, your data is automatically synced to your iCloud Drive. You can also start a manual backup from Settings.", faq2Q: "Will my data be lost if I delete the app?", faq2A: "For Pro subscribers, data is stored in iCloud and can be restored automatically after reinstalling the app. Data for users without a subscription is stored only on the device and cannot be recovered after the app is deleted.", faq3Q: "How do I restore my subscription?", faq3A: "Open the app and select Restore Purchases on the paywall. The system will automatically restore your existing subscription status.", faq4Q: "How do I cancel my subscription?", faq4A: "Go to iPhone Settings → your Apple ID → Subscriptions → Site Log Manager → Cancel Subscription.", faq5Q: "Will I be charged automatically after the free trial?", faq5A: "Yes. The subscription renews automatically and you will be charged after the trial ends. Cancel before the end of the trial if you do not want to continue.", faq6Q: "Where are exported PDF or Excel files saved?", faq6A: "After export, the iOS share sheet lets you choose where to save the file, such as the Files app, or send it to someone else.",
    privacyEyebrow: "Privacy Policy", privacyTitle: "Privacy Policy", privacyUpdated: "Last updated: June 26, 2026", privacyIntro: "Thank you for using Site Log Manager. This Privacy Policy explains how we collect, use, and protect your personal data.", privacyH1: "1. Data Collection", privacyP1: "This application is designed primarily for offline use. All construction logs, project information, material orders, and related data are stored on your device or in your iCloud account. We do not store your personal data on our servers.", privacyH2: "2. Data We Collect", privacyL21: "<strong>Locally stored data:</strong> Construction logs, project information, construction progress, material orders, and related data are stored on your device or in iCloud Drive.", privacyL22: "<strong>Subscription data:</strong> Subscription status is managed by Apple App Store and RevenueCat. We do not access your payment information.", privacyL23: "<strong>Exported data:</strong> You control any PDF, Excel, or LINE content that you choose to export or share.", privacyH3: "3. Third-Party Services", privacyL31: "<strong>Apple iCloud:</strong> Used for cloud backup and data synchronization.", privacyL32: "<strong>RevenueCat:</strong> Used to manage subscription status and subject to the <a href=\"https://www.revenuecat.com/privacy\" target=\"_blank\" rel=\"noopener\">RevenueCat Privacy Policy</a>.", privacyL33: "<strong>Apple App Store:</strong> Used to process in-app purchases.", privacyH4: "4. Data Security", privacyP4: "Your data is stored on your device or in iCloud and protected by Apple’s security systems. We do not access, transmit, or sell your personal data.", privacyH5: "5. Children’s Privacy", privacyP5: "This application is not designed for children under 13 and does not knowingly collect personal data from children.", privacyH6: "6. Changes to This Privacy Policy", privacyP6: "We reserve the right to modify this Privacy Policy. Users will be notified in the app if material changes are made.", privacyH7: "7. Contact Us", followThreads: "Follow on Threads", terms: "Terms of Use", privacyLink: "Privacy", contactLink: "Contact"
  }
};

const localeConfig = {
  "zh-Hant": { htmlLang: "zh-Hant", badge: "zh-tw", title: "工地現場管理" },
  "zh-Hans": { htmlLang: "zh-Hans", badge: "zh-cn", title: "工地现场管理" },
  ja: { htmlLang: "ja", badge: "ja", title: "現場管理" },
  ko: { htmlLang: "ko", badge: "ko", title: "공사 현장 관리" },
  en: { htmlLang: "en", badge: "us", title: "Site Log Manager" }
};

let currentLanguage = detectLanguage();
let scriptCode = "";

function detectLanguage() {
  try {
    const saved = localStorage.getItem("gcgl-site-language");
    if (saved && translations[saved]) return saved;
  } catch (_) {}
  return "zh-Hant";
}

function text(key) {
  return translations[currentLanguage][key] || translations["zh-Hant"][key] || key;
}

function applyLanguage(language) {
  if (!translations[language]) return;
  currentLanguage = language;
  try { localStorage.setItem("gcgl-site-language", language); } catch (_) {}
  document.documentElement.lang = localeConfig[language].htmlLang;
  document.title = localeConfig[language].title;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = text(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    element.innerHTML = text(element.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", text(element.dataset.i18nAria));
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.classList.toggle("active", button.dataset.language === language);
    button.setAttribute("aria-current", button.dataset.language === language ? "true" : "false");
  });
  const expandButton = document.getElementById("expandCodeButton");
  if (expandButton) {
    expandButton.textContent = document.getElementById("codePreview").classList.contains("expanded") ? text("collapseCode") : text("expandCode");
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

async function copyScript() {
  if (!scriptCode) return showToast(text("codeLoadFailed"));
  try {
    await navigator.clipboard.writeText(scriptCode);
    showToast(text("copied"));
  } catch (_) {
    const area = document.createElement("textarea");
    area.value = scriptCode;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand("copy");
    area.remove();
    showToast(copied ? text("copied") : text("copyFailed"));
  }
}

async function loadScriptCode() {
  const preview = document.querySelector("#codePreview code");
  try {
    const response = await fetch("google-sync.gs", { cache: "no-store" });
    if (!response.ok) throw new Error(String(response.status));
    scriptCode = await response.text();
    preview.removeAttribute("data-i18n");
    preview.textContent = scriptCode;
  } catch (_) {
    preview.textContent = text("codeLoadFailed");
  }
}

function initLanguageMenu() {
  const button = document.getElementById("languageButton");
  const menu = document.getElementById("languageMenu");
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    button.setAttribute("aria-expanded", String(willOpen));
  });
  menu.addEventListener("click", (event) => {
    const target = event.target.closest("[data-language]");
    if (!target) return;
    applyLanguage(target.dataset.language);
    menu.hidden = true;
    button.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("click", (event) => {
    if (!menu.hidden && !menu.contains(event.target) && event.target !== button) {
      menu.hidden = true;
      button.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) {
      menu.hidden = true;
      button.setAttribute("aria-expanded", "false");
      button.focus();
    }
  });
}

function initReveal() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -30px" });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function initHeader() {
  const header = document.getElementById("siteHeader");
  const update = () => header.classList.toggle("scrolled", window.scrollY > 20);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  applyLanguage(currentLanguage);
  initLanguageMenu();
  initReveal();
  initHeader();
  loadScriptCode();
  document.getElementById("copyCodeButton").addEventListener("click", copyScript);
  document.getElementById("expandCodeButton").addEventListener("click", () => {
    const preview = document.getElementById("codePreview");
    preview.classList.toggle("expanded");
    document.getElementById("expandCodeButton").textContent = preview.classList.contains("expanded") ? text("collapseCode") : text("expandCode");
  });
});
