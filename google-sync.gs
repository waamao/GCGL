// Version: 4.2

const GCGL_CONFIG = Object.freeze({
  schemaVersion: 1,
  spreadsheetProperty: "GCGL_SPREADSHEET_ID",
  tokenProperty: "GCGL_SYNC_TOKEN",
  managedTablesProperty: "GCGL_MANAGED_TABLES",
  tableSchemasProperty: "GCGL_TABLE_SCHEMAS",
  reportSelectionPropertyPrefix: "GCGL_REPORT_SITE_SELECTION_",
  constructionGanttSheetPropertyPrefix: "GCGL_CONSTRUCTION_GANTT_SHEET_",
  constructionGanttScopePropertyPrefix: "GCGL_CONSTRUCTION_GANTT_SCOPE_",
  constructionGanttSheetPrefix: "甘特圖_",
  reportLanguageProperty: "GCGL_REPORT_LANGUAGE",
  pricingStatisticsSheetName: "計價統計",
  combinedPricingSheetName: "計價統計表",
  combinedPricingSheetIdPropertyPrefix: "GCGL_COMBINED_PRICING_SHEET_",
  workLogReportSheetName: "工程記錄",
  previousWorkLogReportSheetName: "施工記錄",
  reportRebuildPendingProperty: "GCGL_REPORT_REBUILD_PENDING",
  reportRebuildGenerationProperty: "GCGL_REPORT_REBUILD_GENERATION",
  reportRebuildChangedKeysProperty: "GCGL_REPORT_REBUILD_CHANGED_KEYS",
  manualReportRebuildProperty: "GCGL_MANUAL_REPORT_REBUILD",
  manualGridQueueProperty: "GCGL_MANUAL_GRID_QUEUE",
  reportRebuildTriggerIdProperty: "GCGL_REPORT_REBUILD_TRIGGER_ID",
  reportRecoveryTriggerIdProperty: "GCGL_REPORT_RECOVERY_TRIGGER_ID",
  reportRecoveryHandler: "recoverPendingGCGLReports",
  reportRebuildLeaseProperty: "GCGL_REPORT_REBUILD_LEASE",
  reportRebuildLeaseMilliseconds: 8 * 60 * 1000,
  reportFailureCountProperty: "GCGL_REPORT_FAILURE_COUNT",
  reportRetryAfterProperty: "GCGL_REPORT_RETRY_AFTER",
  lastDataSyncAtProperty: "GCGL_LAST_DATA_SYNC_AT",
  reportRebuildHandler: "processPendingGCGLReportRebuild",
  reportRebuildDelayMilliseconds: 5000,
  dailyOverviewRefreshHandler: "refreshGCGLDailyOverview",
  dailyOverviewTriggerIdProperty: "GCGL_DAILY_OVERVIEW_TRIGGER_ID",
  dailyOverviewTimeZoneProperty: "GCGL_DAILY_OVERVIEW_TIME_ZONE",
  allSitesLabel: "全部案場",
  syncLogSheetName: "__GCGL_SYNC_LOG",
  rawDataSheetName: "__GCGL_DATA",
  memorySheetName: "__GCGL_MEMORY",
  memoryRegistryPrefix: "GCGL_MEMORY_SHEET_",
  memoryRefreshPrefix: "GCGL_MEMORY_MATERIAL_REFRESH_",
  materialPricesSheetName: "__GCGL_MATERIAL_PRICES",
  materialPricesHeaders: ["__price_key", "__catalog_id", "__category", "__item", "__unit_price"],
  materialPriceKeyHeader: "__material_price_key",
  materialCatalogIdHeader: "__material_catalog_id",
  materialSiteNameHeader: "__material_site_name",
  attendanceWorkersHeader: "__attendance_workers_json",
  workDateKeyHeader: "__work_date_key",
  memoRecordKeyHeader: "__memo_record_key",
  memoSourceSignatureHeader: "__memo_source_signature",
  workerAttendanceSheetName: "施工人員",
  workerMonthSheetPrefix: "出工",
  workerMonthSheetsPropertyPrefix: "GCGL_WORKER_MONTH_SHEETS_",
  workerLegacyArchivePropertyPrefix: "GCGL_WORKER_LEGACY_ARCHIVE_",
  workerWagesSheetName: "__GCGL_WORKER_WAGES",
  workerWagesHeaders: ["__wage_key", "__rate", "__mode"],
  workerDirectorySheetName: "施工廠商及人員",
  workerOwnerInfoHeader: "__worker_owner_json",
  workerDirectorySheetIdProperty: "GCGL_WORKER_DIRECTORY_SHEET_ID",
  workerDirectoryKeyHeader: "__worker_directory_key",
  workerDetailsSheetName: "__GCGL_WORKER_DETAILS",
  workerDetailsHeaders: ["__worker_key", "__identity_number", "__address"],
  workerWageKeysMarker: "__GCGL_WORKER_WAGE_KEYS",
  pdfRenderRevisionProperty: "GCGL_PDF_RENDER_REVISION",
  pdfRenderActivePrefix: "GCGL_PDF_RENDER_ACTIVE_",
  pdfRenderFailedProperty: "GCGL_PDF_RENDER_FAILED",
  maxPDFBytes: 12 * 1024 * 1024,
  legacyRawSheetPrefix: "__GCGL_DATA_",
  unifiedDataHeaders: [
    "__table_key",
    "__site_id",
    "__record_id",
    "__updated_at",
    "__operation_id",
    "__values_json"
  ],
  maxStoredPayloadChars: 45000,
  maxSyncLogRows: 500,
  maxRowsPerTable: 50000,
  maxVisibleColumns: 100,
  metadataHeaders: [
    "__site_id",
    "__record_id",
    "__updated_at",
    "__operation_id"
  ],
  expectedTableKeys: [
    "site_overview",
    "monthly_progress",
    "pricing_progress",
    "pricing_detail",
    "construction_progress",
    "work_logs",
    "memos",
    "attendance",
    "material_summary",
    "material_orders",
    "material_catalog",
    "worker_directory"
  ],
  optionalTableKeys: ["material_catalog", "worker_directory"],
  defaultSheetNames: {
    site_overview: "案場總覽",
    monthly_progress: "月份進度",
    pricing_progress: "計價進度",
    pricing_detail: "計價明細",
    construction_progress: "施工進度",
    work_logs: "工程記錄",
    memos: "備忘錄",
    attendance: "出勤",
    material_summary: "材料統計",
    material_orders: "材料訂購",
    material_catalog: "材料單價表",
    worker_directory: "施工廠商及人員"
  }
});

const GCGL_REPORT_COLORS = Object.freeze({
  navy: "#1F4E78",
  blue: "#4472C4",
  red: "#E15759",
  headerText: "#FFFFFF",
  titleFill: "#D9EAF7",
  firstRow: "#FFFFFF",
  secondRow: "#F3F6F9",
  border: "#666666",
  overviewBorder: "#CCD6E0",
  lightRed1: "#EA9999",
  lightRed3: "#F4CCCC",
  rememberedInput: "#FFF4CC",
  text: "#263238"
});

// 分頁名稱、同步欄位及 UUID 維持原值；僅翻譯明確標記的報表標題與系統狀態。
const GCGL_REPORT_LANGUAGES = Object.freeze({"繁體中文": "zh-Hant", "簡體中文": "zh-Hans", "日文": "ja", "英文": "en", "韓文": "ko"});
const GCGL_REPORT_TRANSLATIONS = Object.freeze({
  "案場總覽": ["案场总览", "現場概要", "Project Overview", "현장 개요"],
  "案場": ["案场", "現場", "Site", "현장"],
  "追加總價": ["追加总价", "追加総額", "Change Order Total", "추가 총액"],
  "契約總額": ["合同总额", "契約総額", "Contract Total", "계약 총액"],
  "工程記錄筆數": ["工程记录数", "工事記録件数", "Work Log Entries", "공사 기록 수"],
  "出勤天數": ["出勤天数", "出勤日数", "Attendance Days", "출근 일수"],
  "日期": ["日期", "日付", "Date", "날짜"],
  "月份": ["月份", "月", "Month", "월"],
  "月份進度": ["月份进度", "月別進捗", "Monthly Progress", "월별 진행률"],
  "今日工程記錄": ["今日工程记录", "本日の工事記録", "Today's Site Log", "오늘의 공사 기록"],
  "工程記錄": ["工程记录", "工事記録", "Site Log", "공사 기록"],
  "備忘錄": ["备忘录", "メモ", "Memos", "메모"],
  "出勤": ["出勤", "出勤", "Attendance", "출근"],
  "施工人員": ["施工人员", "作業員", "Site Worker", "시공 작업자"],
  "材料訂購": ["材料订购", "資材発注", "Material Orders", "자재 주문"],
  "未完成項目": ["未完成项目", "未完了項目", "Pending Items", "미완료 항목"],
  "無未完成項目": ["无未完成项目", "未完了項目はありません", "No pending items", "미완료 항목 없음"],
  "人員文件到期": ["人员文件到期", "作業員書類の有効期限", "Expired Worker Documents", "작업자 서류 만료"],
  "承攬總價": ["承揽总价", "請負金額", "Contract Value", "도급 금액"],
  "追加金額": ["追加金额", "追加金額", "Change Orders", "추가 공사 금액"],
  "合計總價": ["合计总价", "契約総額", "Total Contract Value", "총 계약 금액"],
  "已計價": ["已计价", "出来高累計", "Billed", "기성 누계"],
  "計價進度": ["计价进度", "出来高進捗", "Billing Progress", "기성 진행률"],
  "施工進度": ["施工进度", "施工進捗", "Construction Progress", "공사 진행률"],
  "工程進度": ["工程进度", "工事進捗", "Work Progress", "공정 진행률"],
  "總出工數": ["总出工数", "延べ人工", "Total Worker-Days", "총 출역 공수"],
  "材料成本": ["材料成本", "資材費", "Material Cost", "자재비"],
  "未填單價品項": ["未填单价品项", "単価未入力の資材", "Unpriced Items", "단가 미입력 품목"],
  "累計出工數": ["累计出工数", "累計人工", "Total Worker-Days", "누적 출역 공수"],
  "尚無月份進度資料": ["暂无月份进度数据", "月別進捗データはありません", "No monthly progress data", "월별 진행률 데이터 없음"],
  "尚未建立單價表": ["尚未建立单价表", "単価表が未作成です", "The price list has not been created", "단가표가 아직 생성되지 않았습니다"],
  "同步資料時間": ["同步数据时间", "最終同期", "Last Data Sync", "최종 데이터 동기화"],
  "尚無記錄": ["暂无记录", "記録なし", "No records yet", "기록 없음"],
  "星期日": ["星期日", "日曜日", "Sunday", "일요일"],
  "星期一": ["星期一", "月曜日", "Monday", "월요일"],
  "星期二": ["星期二", "火曜日", "Tuesday", "화요일"],
  "星期三": ["星期三", "水曜日", "Wednesday", "수요일"],
  "星期四": ["星期四", "木曜日", "Thursday", "목요일"],
  "星期五": ["星期五", "金曜日", "Friday", "금요일"],
  "星期六": ["星期六", "土曜日", "Saturday", "토요일"],
  "施工廠商": ["施工单位", "施工業者", "Contractor", "시공업체"],
  "工項": ["施工项", "工種", "Work Item", "공종"],
  "施工項目": ["施工项目", "施工項目", "Work Item", "시공 항목"],
  "樓層/區域": ["楼层/区域", "階／エリア", "Floor / Area", "층/구역"],
  "樓層": ["楼层", "階", "Floor", "층"],
  "人數": ["人数", "人数", "Crew Size", "인원"],
  "機具": ["机具", "機械・機材", "Equipment", "장비"],
  "機具使用": ["机具使用", "使用機械・機材", "Equipment Used", "사용 장비"],
  "備註": ["备注", "備考", "Notes", "비고"],
  "內容": ["内容", "内容", "Content", "내용"],
  "備忘錄內容": ["备忘录内容", "メモ内容", "Memo Content", "메모 내용"],
  "公司": ["公司", "会社", "Company", "회사"],
  "無案場出勤": ["无案场出勤", "現場未指定の出勤", "No Site Assigned", "현장 미지정 출근"],
  "加班": ["加班", "残業", "Overtime", "연장 근무"],
  "加班時數": ["加班时数", "残業時間", "Overtime Hours", "연장 근무 시간"],
  "小時": ["小时", "時間", "hours", "시간"],
  "天": ["天", "日", "days", "일"],
  "人": ["人", "人", "people", "명"],
  "未指定": ["未指定", "未指定", "Unassigned", "미지정"],
  "未指定廠商": ["未指定厂商", "業者未指定", "Unassigned Contractor", "업체 미지정"],
  "未填": ["未填", "未入力", "Not Entered", "미입력"],
  "未填施工項目": ["未填写施工项目", "工種未入力", "Work Item Not Entered", "공종 미입력"],
  "未填品項": ["未填写品项", "品目未入力", "Item Not Entered", "품목 미입력"],
  "（無內容）": ["（无内容）", "（内容なし）", "(No content)", "(내용 없음)"],
  "今日尚無工程記錄、備忘錄或材料訂購": ["今日尚无工程记录、备忘录或材料订购", "本日の工事記録・メモ・資材発注はありません", "No site logs, memos, or material orders today", "오늘의 공사 기록, 메모 또는 자재 주문 없음"],
  "層級": ["层级", "区分", "Level", "구분"],
  "名稱": ["名称", "名称", "Name", "이름"],
  "類型": ["类型", "タイプ", "Type", "유형"],
  "本工程": ["本工程", "本工事", "Base Contract", "본 공사"],
  "追加工程": ["追加工程", "追加工事", "Change Order", "추가 공사"],
  "計價表": ["计价表", "出来高表", "Payment Schedule", "기성 내역서"],
  "計價統計表": ["计价统计表", "出来高・明細一覧", "Billing Summary and Details", "기성 통계 및 내역"],
  "契約金額": ["合同金额", "契約額", "Contract Amount", "계약 금액"],
  "累計已計價": ["累计已计价", "出来高累計", "Total Billed", "누적 기성액"],
  "計價日期": ["计价日期", "出来高日", "Billing Date", "기성 날짜"],
  "未稅金額": ["未税金额", "税抜金額", "Amount Excl. Tax", "세전 금액"],
  "含稅金額": ["含税金额", "税込金額", "Amount Incl. Tax", "세금 포함 금액"],
  "未命名計價表": ["未命名计价表", "名称未設定の出来高表", "Untitled billing schedule", "이름 없는 기성 내역서"],
  "無計價明細": ["无计价明细", "出来高明細なし", "No billing details", "기성 내역 없음"],
  "無計價統計": ["无计价统计", "出来高集計なし", "No billing summary", "기성 통계 없음"],
  "計價表名稱重複：明細集中列出，未配對到個別摘要。": ["计价表名称重复：明细集中列出，未匹配到单个摘要。", "出来高表名が重複しています。明細をまとめて表示し、個別の集計には割り当てません。", "Duplicate schedule names. Details are listed once and not assigned to individual summaries.", "기성 내역서 이름이 중복됩니다. 내역은 한 번만 표시되며 개별 요약에 연결되지 않습니다."],
  "本次總額不一致": ["本次总额不一致", "今回の合計額が不一致", "Conflicting billing totals", "이번 기성 총액 불일치"],
  "總價": ["总价", "総額", "Total", "총액"],
  "進度": ["进度", "進捗", "Progress", "진행률"],
  "目前進度": ["目前进度", "現在の進捗", "Current Progress", "현재 진행률"],
  "狀態": ["状态", "状態", "Status", "상태"],
  "最後計價日": ["最后计价日期", "最終出来高日", "Last Billing Date", "최종 기성일"],
  "最後記錄日": ["最后记录日期", "最終記録日", "Last Record Date", "최종 기록일"],
  "無記錄日期": ["无记录日期", "記録日なし", "No recorded date", "기록 날짜 없음"],
  "未開始／無記錄日期": ["未开始／无记录日期", "未着手／記録日なし", "Not started or no recorded date", "미시작／기록 날짜 없음"],
  "首次至最後一次施工記錄": ["首次至最后一次施工记录", "最初から最後までの工事記録", "First to last work log", "최초~최종 공사 기록"],
  "僅能確認最後記錄日": ["仅能确认最后记录日期", "最終記録日のみ確認済み", "Only the last record date is known", "최종 기록일만 확인됨"],
  "每週": ["每周", "週別", "Weekly", "주별"],
  "每月": ["每月", "月別", "Monthly", "월별"],
  "年份": ["年份", "年", "Year", "연도"],
  "無施工項目": ["无施工项目", "工事項目なし", "No construction tasks", "공사 항목 없음"],
  "未命名案場": ["未命名案场", "名称未設定の現場", "Untitled project", "이름 없는 현장"],
  "案場名稱重複，請先在 App 更名": ["案场名称重复，请先在 App 重命名", "現場名が重複しています。アプリで名前を変更してください", "Duplicate project name. Rename it in the app.", "현장 이름이 중복되었습니다. 앱에서 이름을 변경하세요."],
  "最後訂購日": ["最后订购日期", "最終発注日", "Last Order Date", "최종 주문일"],
  "品項": ["品项", "品目", "Item", "품목"],
  "品項名稱": ["品项名称", "品目名", "Item Name", "품목명"],
  "品項識別碼": ["品项识别码", "品目ID", "Item ID", "품목 ID"],
  "分類": ["分类", "分類", "Category", "분류"],
  "單位": ["单位", "単位", "Unit", "단위"],
  "數量": ["数量", "数量", "Quantity", "수량"],
  "單價": ["单价", "単価", "Unit Price", "단가"],
  "金額": ["金额", "金額", "Amount", "금액"],
  "稅率": ["税率", "税率", "Tax Rate", "세율"],
  "含稅": ["含税", "税込", "Tax Included", "세금 포함"],
  "本次計價總額": ["本次计价总额", "今回出来高総額", "Current Billing Total", "이번 기성 총액"],
  "訂購數量": ["订购数量", "発注数量", "Order Quantity", "주문 수량"],
  "已送貨數量": ["已送货数量", "納品済み数量", "Delivered Quantity", "배송 완료 수량"],
  "未送貨數量": ["未送货数量", "未納品数量", "Undelivered Quantity", "미배송 수량"],
  "小計": ["小计", "小計", "Subtotal", "소계"],
  "送貨狀態": ["送货状态", "配送状況", "Delivery Status", "배송 상태"],
  "到貨日期": ["到货日期", "納品日", "Date Received", "입고일"],
  "廠商名稱": ["厂商名称", "業者名", "Contractor Name", "업체명"],
  "說明": ["说明", "詳細情報", "Details", "상세 정보"],
  "負責人": ["负责人", "担当者", "Contact Person", "담당자"],
  "統編": ["税号", "税務番号", "Tax ID", "사업자등록번호"],
  "姓名": ["姓名", "氏名", "Worker Name", "성명"],
  "電話": ["电话", "電話番号", "Phone", "전화번호"],
  "身分證號": ["身份证号", "身分証番号", "ID Number", "신분증 번호"],
  "地址": ["地址", "住所", "Address", "주소"],
  "職安卡": ["职安卡", "安全衛生教育修了証", "Safety Training Card", "안전교육 이수증"],
  "體檢": ["体检", "健康診断", "Medical Checkup", "건강검진"],
  "勞保": ["劳保", "労働保険", "Labor Insurance", "산재보험"],
  "職安卡到期日": ["职安卡到期日", "安全衛生教育修了証の有効期限", "Safety Card Expiration", "안전교육 이수증 만료일"],
  "體檢到期日": ["体检到期日", "健康診断の有効期限", "Medical Checkup Expiration", "건강검진 만료일"],
  "勞保到期日": ["劳保到期日", "労働保険の有効期限", "Insurance Expiration", "보험 만료일"],
  "未提供": ["未提供", "未提出", "Not Provided", "미제공"],
  "到期": ["到期", "有効期限切れ", "Expired", "만료"],
  "請填入資料": ["请填写资料", "情報を入力してください", "Enter Details", "정보를 입력하세요"],
  "請填入單價": ["请填写单价", "単価を入力してください", "Enter Unit Prices", "단가를 입력하세요"],
  "可依照各案場修改材料單價": ["可根据各案场修改材料单价", "現場ごとに資材単価を変更できます", "Material prices can be set per site", "현장별 자재 단가를 수정할 수 있습니다"],
  "工資\n（日薪／時薪）": ["工资\n（日薪／时薪）", "賃金\n（日給／時給）", "Wage\n(Daily / Hourly)", "임금\n(일급／시급)"],
  "合計（天／小時）": ["合计（天／小时）", "合計（日／時間）", "Total (Days / Hours)", "합계 (일／시간)"],
  "當月工資": ["当月工资", "当月賃金", "Monthly Wages", "당월 임금"],
  "當月工資合計": ["当月工资合计", "当月賃金合計", "Total Monthly Wages", "당월 임금 합계"],
  "出工": ["出工", "出面表", "Worker Attendance", "출역"],
  "日薪": ["日薪", "日給", "Daily Rate", "일급"],
  "時薪": ["时薪", "時給", "Hourly Rate", "시급"],
  "未開始": ["未开始", "未着手", "Not Started", "미시작"],
  "準備中": ["准备中", "準備中", "Preparing", "준비 중"],
  "最後階段": ["最后阶段", "最終段階", "Final Stage", "마무리 단계"],
  "施工中": ["施工中", "施工中", "In Progress", "시공 중"],
  "已完成": ["已完成", "完了", "Completed", "완료됨"],
  "{date}完成": ["{date}完成", "{date} 完了", "Completed {date}", "{date} 완료"],
  "完成日期不明": ["完成日期不明", "完了日不明", "Completion date unknown", "완료일 알 수 없음"],
  "未送貨": ["未送货", "未配送", "Not Delivered", "미배송"],
  "已送貨": ["已送货", "納品済み", "Delivered", "배송 완료"],
  "未到貨": ["未到货", "未入荷", "Not Received", "미입고"],
  "已到貨": ["已到货", "入荷済み", "Received", "입고 완료"],
  "上班": ["上班", "出勤", "Clocked In", "출근"],
  "是": ["是", "はい", "Yes", "예"],
  "否": ["否", "いいえ", "No", "아니요"],
  "全部案場": ["全部案场", "すべての現場", "All Sites", "전체 현장"],
  "黃色工資格可修改；本月工資不影響其他月份。": ["黄色工资单元格可修改；本月工资不影响其他月份。", "黄色の賃金セルは編集できます。他の月の賃金には影響しません。", "Edit the yellow wage cells. Changes apply to this month only.", "노란색 임금 셀을 수정할 수 있습니다. 변경 사항은 이 달에만 적용됩니다."],
  "請從 App 更新備忘錄完成狀態。": ["请从 App 更新备忘录完成状态。", "メモの完了状態は App で変更してください。", "Update memo completion in the app.", "메모 완료 상태는 앱에서 변경하세요."],
  "正在更新報表語言…": ["正在更新报表语言…", "レポートの言語を更新中…", "Updating report language…", "보고서 언어 업데이트 중…"],
  "請輸入材料單價。": ["请输入材料单价。", "資材単価を入力してください。", "Enter the material unit price.", "자재 단가를 입력하세요."],
  "請在此欄輸入材料單價；同步不會清除或移動既有品項的單價。": ["请在此列输入材料单价；同步不会清除或移动现有品项的单价。", "この列に資材単価を入力してください。同期しても既存品目の単価は削除・移動されません。", "Enter unit prices here. Syncing preserves each item's price.", "이 열에 자재 단가를 입력하세요. 동기화해도 기존 품목의 단가는 유지됩니다."],
  "未填工資人數：": ["未填工资人数：", "賃金未入力の人数：", "Workers without wages: ", "임금 미입력 인원: "],
  "有": ["有", "", "", ""],
  "位人員未填入工資": ["位人员未填入工资", "名の賃金が未入力", " workers have no wage entered", "명의 임금이 미입력 상태입니다"]
});
let gcglReportLanguageCache = null;
let gcglReportAliases = null;

function normalizeReportLanguage_(locale, spreadsheetLocale) {
  const value = String(locale || "").toLowerCase().replace(/_/g, "-");
  if (/^zh(?:-|$)/.test(value)) {
    if (/hans|(?:^|-)cn(?:-|$)|(?:^|-)sg(?:-|$)/.test(value)) return "zh-Hans";
    if (/hant|(?:^|-)(tw|hk|mo)(?:-|$)/.test(value)) return "zh-Hant";
    return /zh[-_](cn|sg)|hans/i.test(spreadsheetLocale || "") ? "zh-Hans" : "zh-Hant";
  }
  const language = value.split("-")[0];
  return ["ja", "en", "ko"].indexOf(language) !== -1 ? language : "zh-Hant";
}

function reportLanguage_(spreadsheet) {
  if (gcglReportLanguageCache) return gcglReportLanguageCache;
  const properties = PropertiesService.getScriptProperties();
  const saved = properties.getProperty(GCGL_CONFIG.reportLanguageProperty);
  if (Object.values(GCGL_REPORT_LANGUAGES).indexOf(saved) !== -1) return (gcglReportLanguageCache = saved);
  let locale = "", sheetLocale = "";
  try { locale = Session.getActiveUserLocale(); } catch (_) { /* 舊環境未提供時採繁體中文。 */ }
  try { sheetLocale = (spreadsheet || SpreadsheetApp.getActiveSpreadsheet()).getSpreadsheetLocale(); } catch (_) { }
  const language = normalizeReportLanguage_(locale, sheetLocale);
  properties.setProperty(GCGL_CONFIG.reportLanguageProperty, language);
  return (gcglReportLanguageCache = language);
}

function reportText_(text) {
  const values = Object.prototype.hasOwnProperty.call(GCGL_REPORT_TRANSLATIONS, text) ? GCGL_REPORT_TRANSLATIONS[text] : null;
  const index = ["zh-Hans", "ja", "en", "ko"].indexOf(reportLanguage_());
  return values && index >= 0 ? values[index] : text;
}

function reportCanonicalText_(text) {
  if (typeof text !== "string" || text.indexOf("__") === 0) return text;
  if (!gcglReportAliases) {
    gcglReportAliases = Object.create(null);
    Object.keys(GCGL_REPORT_TRANSLATIONS).forEach(function(key) {
      [key].concat(GCGL_REPORT_TRANSLATIONS[key]).forEach(function(value) {
        const token = value.replace(/\s/g, "").toLowerCase();
        if (token && !gcglReportAliases[token]) gcglReportAliases[token] = key;
      });
    });
    Object.assign(gcglReportAliases, {"note": "備註", "siteworker": "施工人員", "floor／area": "樓層/區域", "workername": "姓名", "工事内容": "工項",
      "项目": "案場", "jobsite": "案場", "单位名称": "廠商名稱", "机械使用": "機具使用", "使用機械": "機具使用", "장비사용": "機具使用",
      "contractsum": "承攬總價", "請負総額": "承攬總價", "도급총액": "承攬總價", "progressbilling": "計價表",
      "工伤保险到期日": "勞保到期日", "労災保険の有効期限": "勞保到期日", "laborinsuranceexpirationdate": "勞保到期日"});
  }
  return gcglReportAliases[text.replace(/\s/g, "").toLowerCase()] || text;
}

function reportHeader_(text) {
  return reportText_(reportCanonicalText_(text));
}

function reportStatus_(value) {
  if (typeof value !== "string") return value;
  const keys = ["未開始", "準備中", "施工中", "最後階段", "已完成", "未送貨", "已送貨", "未到貨", "已到貨", "上班"];
  const key = keys.find(function(item) {
    return [item].concat(GCGL_REPORT_TRANSLATIONS[item]).some(function(label) { return label.toLowerCase() === value.toLowerCase(); });
  });
  return key ? reportText_(key) : value;
}

function reportDisplayRows_(table, values) {
  const columns = table.headers.map(function(header, index) {
    return ["狀態", "送貨狀態", "進度", "施工進度", "目前進度"].indexOf(reportCanonicalText_(header)) !== -1 ? index : -1;
  }).filter(function(index) { return index >= 0; });
  return values.map(function(row) {
    const copy = row.slice();
    columns.forEach(function(index) { copy[index] = reportStatus_(copy[index]); });
    if (table.key === "pricing_progress" || table.key === "pricing_detail") {
      // 層級、類型及含稅為 App 的固定選項，名稱／計價表／明細等使用者文字不變。
      table.headers.forEach(function(header, index) {
        const field = reportCanonicalText_(header);
        const choices = field === "層級" ? ["案場", "施工廠商"] : field === "類型" ? ["本工程", "追加工程"] : field === "含稅" ? ["是", "否"] : null;
        const canonical = reportCanonicalText_(copy[index]);
        if (choices && choices.indexOf(canonical) !== -1) copy[index] = reportText_(canonical);
      });
    }
    return copy;
  });
}

function renderReportLanguageSelector_(sheet) {
  ensureSheetSize_(sheet, 1, 7);
  const language = reportLanguage_(sheet.getParent());
  const labels = Object.keys(GCGL_REPORT_LANGUAGES);
  const label = labels.find(function(item) { return GCGL_REPORT_LANGUAGES[item] === language; });
  sheet.getRange(1, 7).clearDataValidations().setValue(label)
    .setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(labels, true).setAllowInvalid(false).build())
    .setBackground(GCGL_REPORT_COLORS.titleFill).setFontColor(GCGL_REPORT_COLORS.text)
    .setFontFamily("Arial").setFontSize(11).setHorizontalAlignment("center").setVerticalAlignment("middle");
  sheet.setColumnWidth(7, 120);
}

function handleReportLanguageEdit_(event) {
  const range = event.range;
  if (range.getRow() !== 1 || range.getColumn() !== 7 || range.getNumRows() !== 1 || range.getNumColumns() !== 1) return false;
  const sheet = range.getSheet();
  const overview = loadTableSchemas_().find(function(table) { return table.key === "site_overview" && table.sheetName === sheet.getName(); });
  if (!overview) return false;
  const label = optionalString_(range.getValue());
  const language = Object.prototype.hasOwnProperty.call(GCGL_REPORT_LANGUAGES, label) ? GCGL_REPORT_LANGUAGES[label] : null;
  if (!language) { renderReportLanguageSelector_(sheet); return true; }
  const previous = reportLanguage_(sheet.getParent());
  if (previous === language) return true;
  PropertiesService.getScriptProperties().setProperty(GCGL_CONFIG.reportLanguageProperty, language);
  gcglReportLanguageCache = language;
  // 走既有延後重建與每分鐘備援，不在 30 秒簡易事件內重畫所有報表。
  markReportsPending_(GCGL_CONFIG.expectedTableKeys, false);
  sheet.getParent().toast(reportText_("正在更新報表語言…"), "GCGL", 5);
  return true;
}

/** 在試算表開啟時加入操作選單。 */
function onOpen() {
  reportLanguage_(SpreadsheetApp.getActiveSpreadsheet());
  SpreadsheetApp.getUi()
    .createMenu("GCGL 同步")
    .addItem("初始設定／查看同步密碼", "setupGCGLSyncFromMenu")
    .addItem("自訂同步密碼", "setGCGLSyncTokenFromMenu")
    .addItem("重建報表版面", "rebuildGCGLReports")
    .addItem("重新產生同步密碼", "rotateGCGLSyncTokenFromMenu")
    .addToUi();
  hideInternalSheets_(SpreadsheetApp.getActiveSpreadsheet());
}

/** 在一般資料頁切換案場時，直接套用標題列的原生篩選。 */
function onEdit(event) {
  if (!event || !event.range) return;
  const properties = PropertiesService.getScriptProperties();
  const revision = Utilities.getUuid();
  const activeKey = GCGL_CONFIG.pdfRenderActivePrefix + revision;
  properties.setProperties({[activeKey]: String(Date.now()),
    [GCGL_CONFIG.pdfRenderRevisionProperty]: revision});
  try {
    onEditContents_(event);
    SpreadsheetApp.flush();
    queueGCGLMemoryFormulaRefresh_(event.range.getSheet().getParent());
  } finally {
    properties.deleteProperty(activeKey);
  }
}

function onEditContents_(event) {
  const range = event.range;
  if (handleReportLanguageEdit_(event)) return;
  if (handleMemoCompletionEdit_(event)) return;
  if (handleWorkerDirectoryEdit_(event)) return;
  if (handleWorkerWageEdit_(event)) return;
  if (handleMaterialCatalogPriceEdit_(event)) return;
  if (handleMaterialSummaryPriceEdit_(event)) return;
  if (range.getRow() !== 1 || range.getColumn() !== 1) return;

  const sheet = range.getSheet();
  const tables = loadTableSchemas_();
  const table = tables.find(function(item) {
    return reportSheetName_(item) === sheet.getName() && supportsReportSiteSelector_(item.key);
  });
  if (!table) return;

  const chosenSite = optionalString_(range.getValue());
  const selectedSite = !chosenSite || chosenSite === reportText_(GCGL_CONFIG.allSitesLabel) ? GCGL_CONFIG.allSitesLabel : chosenSite;
  PropertiesService.getScriptProperties().setProperty(
    reportSelectionPropertyKey_(table.key), selectedSite
  );
  if (usesMergedRecordLayout_(table)) {
    refreshSelectedReport_(sheet.getParent(), tables, table);
    return;
  }
  applyReportSiteFilter_(sheet, table, selectedSite);
}

/**
 * 第一次設定時手動執行。
 * 將目前試算表 ID 與同步密碼存入 Script Properties。
 */
function setupGCGLSync() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error("請從目標 Google 試算表的「擴充功能 → Apps Script」開啟並執行設定。");
  }
  reportLanguage_(spreadsheet);

  const properties = PropertiesService.getScriptProperties();
  let token = properties.getProperty(GCGL_CONFIG.tokenProperty);
  if (!token) {
    token = createSyncToken_();
  }

  const setupProperties = {
    [GCGL_CONFIG.spreadsheetProperty]: spreadsheet.getId(),
    [GCGL_CONFIG.tokenProperty]: token
  };
  if (!properties.getProperty(GCGL_CONFIG.managedTablesProperty)) {
    setupProperties[GCGL_CONFIG.managedTablesProperty] = JSON.stringify(
      GCGL_CONFIG.defaultSheetNames
    );
  }
  properties.setProperties(setupProperties);

  ensureUnifiedDataReady_(spreadsheet);
  ensureSyncLogSheet_(spreadsheet);
  hideInternalSheets_(spreadsheet);
  ensureReportRecoveryTrigger_();
  resetDeferredReportTriggers_();
  if (properties.getProperty(GCGL_CONFIG.reportRebuildPendingProperty) === "1") {
    ensureDeferredReportTrigger_();
  }
  ensureDailyOverviewTrigger_(spreadsheet);
  refreshGCGLDailyOverview();
  applyGCGLReportProtection_(spreadsheet);

  return {
    spreadsheetId: spreadsheet.getId(),
    spreadsheetName: spreadsheet.getName(),
    token: token,
    schemaVersion: GCGL_CONFIG.schemaVersion,
    webAppUrl: ScriptApp.getService().getUrl() || "尚未部署"
  };
}

function setupGCGLSyncFromMenu() {
  const result = setupGCGLSync();
  SpreadsheetApp.getUi().alert(
    "GCGL 同步設定完成",
    "同步密碼：\n" + result.token +
      "\n\n網頁應用程式網址：\n" + result.webAppUrl +
      "\n\n請把同步密碼與部署後的 /exec 網址填入 App。",
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/** 自訂同一份試算表共用的同步密碼；不改動報表、資料或部署網址。 */
function setGCGLSyncToken(token) {
  const normalized = typeof token === "string" ? token.trim() : "";
  const length = Array.from(normalized).length;
  if (length < 6 || length > 16) {
    throw new Error("同步密碼必須為 6～16 個字元，前後空白會自動移除。");
  }
  if (/[\u0000-\u001F\u007F]/.test(normalized)) {
    throw new Error("同步密碼不可包含換行或控制字元。");
  }
  PropertiesService.getScriptProperties().setProperty(GCGL_CONFIG.tokenProperty, normalized);
  return normalized;
}

function setGCGLSyncTokenFromMenu() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    "自訂同步密碼",
    "請輸入 6～16 個字元，可使用中英文、數字及符號。\n" +
      "修改後舊密碼會立即失效，所有連線到這份試算表的 App 都必須改填相同的新密碼。",
    ui.ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() !== ui.Button.OK) return;

  try {
    setGCGLSyncToken(response.getResponseText());
  } catch (error) {
    ui.alert("同步密碼未更新", error.message || String(error), ui.ButtonSet.OK);
    return;
  }
  ui.alert(
    "同步密碼已更新",
    "請在 App 的「Google 試算表同步」填入新密碼，按「測試連線」後儲存。原 /exec 網址不變。",
    ui.ButtonSet.OK
  );
}

/** 重新產生同步密碼；舊密碼會立即失效。 */
function rotateGCGLSyncToken() {
  const properties = PropertiesService.getScriptProperties();
  const token = createSyncToken_();
  properties.setProperty(GCGL_CONFIG.tokenProperty, token);
  return token;
}

function rotateGCGLSyncTokenFromMenu() {
  const ui = SpreadsheetApp.getUi();
  const answer = ui.alert(
    "重新產生同步密碼？",
    "舊密碼會立即失效，App 必須改填新密碼才能繼續同步。",
    ui.ButtonSet.YES_NO
  );
  if (answer !== ui.Button.YES) return;

  const token = rotateGCGLSyncToken();
  ui.alert("新的同步密碼", token, ui.ButtonSet.OK);
}

/** 瀏覽器開啟部署網址時，只回傳服務狀態，不洩漏同步密碼。 */
function doGet() {
  return jsonResponse_({
    ok: true,
    service: "GCGL Engineering History Sync",
    schemaVersion: GCGL_CONFIG.schemaVersion,
    configured: isConfigured_()
  });
}

/** App 所有同步指令的入口。 */
function doPost(event) {
  let lock = null;
  let spreadsheet = null;
  try {
    const payload = parsePayload_(event);
    validateEnvelope_(payload);

    if (payload.action === "ping") {
      return jsonResponse_({
        ok: true,
        action: "ping",
        schemaVersion: GCGL_CONFIG.schemaVersion,
        serverTime: new Date().toISOString()
      });
    }

    // 唯讀下載不經過同步操作記錄，不建立公開 Drive 檔案或回傳 OAuth token。
    if (["listPDFReports", "exportReportPDF"].indexOf(payload.action) !== -1) {
      const reportSpreadsheet = configuredSpreadsheet_();
      return jsonResponse_({ok: true, action: payload.action,
        report: payload.action === "listPDFReports"
          ? listPDFReports_(reportSpreadsheet)
          : exportReportPDF_(reportSpreadsheet, payload)});
    }

    // 可選擴充欄位：同時接受舊版六欄與含廠商基本資料的七欄名冊。
    let directory = null;
    if (payload.workerDirectory != null) {
      directory = validateTables_([payload.workerDirectory], true, true)[0];
      if (directory.key !== "worker_directory" || [6, 7].indexOf(directory.headers.length) === -1 ||
          (directory.headers.length === 7 && directory.headers[6] !== GCGL_CONFIG.workerOwnerInfoHeader) ||
          directory.rows.some(function(row) {
            return !validWorkerDirectoryRecordKey_(row.recordId) || row.values.some(function(value) { return typeof value !== "string"; });
          })) throw new Error("施工人員名冊格式不正確，請更新 App 後重新同步。");
      directory.rows.forEach(function(row) { workerDirectoryOwnerInfo_(row.values); });
      directory.sheetName = GCGL_CONFIG.workerDirectorySheetName;
    }

    lock = LockService.getScriptLock();
    lock.waitLock(30000);

    spreadsheet = configuredSpreadsheet_();
    ensureUnifiedDataReady_(spreadsheet);
    if (wasOperationProcessed_(spreadsheet, payload.operationId)) {
      return jsonResponse_({
        ok: true,
        duplicate: true,
        operationId: payload.operationId,
        action: payload.action
      });
    }

    let result;
    switch (payload.action) {
      case "replaceSite":
        result = replaceSite_(spreadsheet, payload);
        break;
      case "deleteSite":
        result = deleteSite_(spreadsheet, payload);
        break;
      case "fullSync":
        result = fullSync_(spreadsheet, payload);
        break;
      case "syncChanged":
        result = syncChanged_(spreadsheet, payload);
        break;
      case "syncRows":
        result = syncRows_(spreadsheet, payload);
        break;
      default:
        throw new Error("不支援的同步指令：" + payload.action);
    }

    if (directory) {
      syncChanged_(spreadsheet, {tables: [directory], operationId: payload.operationId, sentAt: payload.sentAt});
    }
    recordProcessedOperation_(spreadsheet, payload);
    return jsonResponse_({
      ok: true,
      action: payload.action,
      operationId: payload.operationId,
      serverTime: new Date().toISOString(),
      result: result
    });
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return jsonResponse_({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      code: error && error.gcglCode ? error.gcglCode : null,
      serverTime: new Date().toISOString()
    });
  } finally {
    // 中途出錯也收好內部分頁，避免使用者下一次看到尚未隱藏的原始資料。
    if (spreadsheet) {
      try {
        hideInternalSheets_(spreadsheet);
      } catch (error) {
        console.error(error && error.stack ? error.stack : error);
      }
    }
    if (lock && lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

/** 以某案場的完整快照取代該案場現有資料。 */
function replaceSite_(spreadsheet, payload) {
  const site = payload.site || {};
  const siteId = requiredString_(site.id, "site.id");
  const tables = validateTables_(payload.tables, false);
  saveManagedTables_(tables);
  saveTableSchemas_(tables);

  const targetKeys = {};
  const incomingRows = [];
  tables.forEach(function(table) {
    targetKeys[table.key] = true;
    table.rows.forEach(function(row) {
      incomingRows.push(toUnifiedStorageRow_(
        table.key,
        buildStoredRow_(
          siteId,
          row,
          table.headers.length,
          payload.operationId,
          payload.sentAt
        )
      ));
    });
  });

  const existingRows = readUnifiedDataRows_(spreadsheet);
  const retainedRows = existingRows.filter(function(row) {
    return !(targetKeys[optionalString_(row[0])] && optionalString_(row[1]) === siteId);
  });
  writeUnifiedDataRows_(spreadsheet, retainedRows.concat(incomingRows));

  SpreadsheetApp.flush();
  recordSuccessfulDataSync_();
  markReportsPending_(tables.map(function(table) { return table.key; }));

  return {
    siteId: siteId,
    siteName: optionalString_(site.name),
    tableCount: tables.length,
    rowCount: incomingRows.length
  };
}

/** 從單一隱藏資料表移除某案場的所有資料。 */
function deleteSite_(spreadsheet, payload) {
  const siteId = requiredString_(payload.siteId, "siteId");
  const tables = loadTableSchemas_();
  const existingRows = readUnifiedDataRows_(spreadsheet);
  const retainedRows = existingRows.filter(function(row) {
    return optionalString_(row[1]) !== siteId;
  });
  const removedRows = existingRows.length - retainedRows.length;

  if (removedRows > 0) writeUnifiedDataRows_(spreadsheet, retainedRows);

  SpreadsheetApp.flush();
  recordSuccessfulDataSync_();
  markReportsPending_(tables.map(function(table) { return table.key; }));

  return { siteId: siteId, removedRows: removedRows };
}

/** 以 App 傳來的完整資料重建受管理資料；未提供的 optional table 會保留原資料。 */
function fullSync_(spreadsheet, payload) {
  const tables = validateTables_(payload.tables, true);
  migrateManagedSheetNames_(spreadsheet, loadManagedTables_(), tables);
  saveManagedTables_(tables);
  saveTableSchemas_(tables);

  const targetKeys = {};
  const incomingRows = [];
  tables.forEach(function(table) {
    targetKeys[table.key] = true;
    table.rows.forEach(function(row) {
      const siteId = requiredString_(row.siteId, table.key + ".rows[].siteId");
      incomingRows.push(toUnifiedStorageRow_(
        table.key,
        buildStoredRow_(
          siteId,
          row,
          table.headers.length,
          payload.operationId,
          payload.sentAt
        )
      ));
    });
  });

  // 選填資料表若 App 這次未提供，沿用既有內容；舊版完整同步不清除新名冊。
  const retainedRows = readUnifiedDataRows_(spreadsheet).filter(function(row) {
    return !targetKeys[optionalString_(row[0])];
  });
  writeUnifiedDataRows_(spreadsheet, retainedRows.concat(incomingRows));

  SpreadsheetApp.flush();
  recordSuccessfulDataSync_();
  markReportsPending_(tables.map(function(table) { return table.key; }));

  return { tableCount: tables.length, rowCount: incomingRows.length };
}

/** 只重寫 App 判定有變更的資料表；刪除資料也由整張資料表快照反映。 */
function syncChanged_(spreadsheet, payload) {
  const tables = validateTables_(payload.tables, true, true);
  if (tables.length === 0) {
    return { tableCount: 0, rowCount: 0 };
  }

  migrateManagedSheetNames_(spreadsheet, loadManagedTables_(), tables);
  saveManagedTables_(tables);
  saveTableSchemas_(tables);

  const targetKeys = {};
  const incomingRows = [];
  tables.forEach(function(table) {
    targetKeys[table.key] = true;
    table.rows.forEach(function(row) {
      const siteId = requiredString_(row.siteId, table.key + ".rows[].siteId");
      incomingRows.push(toUnifiedStorageRow_(
        table.key,
        buildStoredRow_(
          siteId,
          row,
          table.headers.length,
          payload.operationId,
          payload.sentAt
        )
      ));
    });
  });

  const retainedRows = readUnifiedDataRows_(spreadsheet).filter(function(row) {
    return !targetKeys[optionalString_(row[0])];
  });
  writeUnifiedDataRows_(spreadsheet, retainedRows.concat(incomingRows));

  SpreadsheetApp.flush();
  recordSuccessfulDataSync_();
  markReportsPending_(tables.map(function(table) { return table.key; }));
  return { tableCount: tables.length, rowCount: incomingRows.length };
}

/** 依穩定 recordId 在單一 __GCGL_DATA 逐筆新增、修改或刪除。 */
function syncRows_(spreadsheet, payload) {
  const tables = validateRowDeltaTables_(payload.tables);
  if (tables.length === 0) {
    return { tableCount: 0, upsertedRowCount: 0, deletedRowCount: 0 };
  }

  migrateManagedSheetNames_(spreadsheet, loadManagedTables_(), tables);
  saveManagedTables_(tables);
  saveTableSchemas_(tables);

  const result = applyUnifiedRowDeltas_(spreadsheet, tables, payload.operationId, payload.sentAt);

  SpreadsheetApp.flush();
  recordSuccessfulDataSync_();
  markReportsPending_(tables.map(function(table) { return table.key; }));
  return {
    tableCount: tables.length,
    upsertedRowCount: result.upsertedRowCount,
    deletedRowCount: result.deletedRowCount
  };
}

/** 依目前隱藏資料重新建立所有可閱讀的報表分頁。 */
function rebuildGCGLReports() {
  const tables = loadTableSchemas_();
  if (tables.length === 0) {
    SpreadsheetApp.getUi().alert("目前沒有同步資料，請先從 App 執行立即完整同步。");
    return;
  }
  try {
    ensureReportRecoveryTrigger_();
  } catch (error) {
    // 手動重建仍可獨立執行；初始設定會明確回報排程授權／建立失敗。
    console.error(error && error.stack ? error.stack : error);
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    PropertiesService.getScriptProperties().setProperty(GCGL_CONFIG.manualReportRebuildProperty, "1");
    markReportsPending_(tables.map(function(table) { return table.key; }));
  } finally {
    lock.releaseLock();
  }
  // 建立當次重建證明；自動同步與背景接續不會收到這個物件，也不會刪除舊分頁。
  const replacements = {};
  if (!runPendingGCGLReportRebuild_("", true, replacements)) {
    SpreadsheetApp.getUi().alert("報表正在自動更新，這次重建已排入，完成後會自動更新。");
    return;
  }
  if (replacements.revision) {
    try {
      offerRetiredReportCleanup_(configuredSpreadsheet_(), tables, replacements);
    } catch (error) {
      console.error("GCGL 無法確認舊報表：" + error.message);
      SpreadsheetApp.getUi().alert("報表已更新，但無法完成舊分頁檢查，已保留未確認的分頁。");
    }
  }
  if (PropertiesService.getScriptProperties().getProperty(GCGL_CONFIG.manualReportRebuildProperty) === "1") {
    SpreadsheetApp.getUi().alert("報表已更新。剩餘的空白欄列會接續在背景檢查，不用再按重建。");
  }
}

const GCGL_RETIRE_ON_MANUAL_REBUILD = Object.freeze({
  "施工進度": "construction_progress",
  "計價統計": "pricing_progress",
  "計價明細": "pricing_detail"
});

/** 舊版沒有逐頁登記，不能只憑名稱判定。比對舊格式、保護和新報表，再由使用者核對。 */
function gcglRetiredReportCandidates_(spreadsheet, tables, replacements) {
  if (!replacements.revision || !replacements.book || replacements.book !== spreadsheet.getId()) return [];
  const current = PropertiesService.getScriptProperties().getProperty(GCGL_CONFIG.pdfRenderRevisionProperty);
  if (current !== replacements.revision) return [];
  const sheets = spreadsheet.getSheets();
  const visibleById = new Set(sheets.filter(function(sheet) { return !sheet.isSheetHidden(); })
    .map(function(sheet) { return sheet.getSheetId(); }));
  const liveGantts = (replacements.gantt || []).filter(function(item) { return visibleById.has(item.id); });
  const ganttSites = liveGantts.map(function(item) { return item.site; });
  const ganttIds = liveGantts.map(function(item) { return item.id; });
  const hasPricing = visibleById.has(replacements.pricing);
  return Object.keys(GCGL_RETIRE_ON_MANUAL_REBUILD).reduce(function(output, name) {
    const key = GCGL_RETIRE_ON_MANUAL_REBUILD[name];
    const replacedSites = key === "construction_progress" ? ganttSites :
      (hasPricing && replacements.pricingSites && replacements.pricingSites[key]);
    if (!replacedSites || !replacedSites.length) return output;
    const table = tables.find(function(item) { return item.key === key; });
    const sheet = sheets.find(function(item) { return item.getName() === name; });
    if (!sheet || !table || sheet.getSheetId() === replacements.pricing || ganttIds.includes(sheet.getSheetId()) ||
        sheet.getLastRow() < 3 || sheet.getFrozenRows() !== 3 || !gcglSheetProtections_(sheet).length) return output;
    const canonical = table.headers.map(reportCanonicalText_);
    const accepted = [canonical];
    if (key === "construction_progress" && canonical.length >= 7) accepted.push(withoutArrayIndex_(canonical, 4));
    if (!accepted.some(function(headers) {
      return headers.length === sheet.getLastColumn() && headers.length >= 4 &&
        arraysEqual_(sheet.getRange(3, 1, 1, headers.length).getDisplayValues()[0].map(reportCanonicalText_), headers);
    })) return output;
    const bodyCount = sheet.getLastRow() - 3;
    if (bodyCount > 0 && sheet.getRange(4, 1, bodyCount, 1).getDisplayValues().some(function(row) {
      return optionalString_(row[0]).trim() && !replacedSites.some(function(site) { return sameReportText_(row[0], site); });
    })) return output;
    const fingerprint = gcglRetiredReportFingerprint_(sheet);
    if (fingerprint) output.push({id: sheet.getSheetId(), name: name, fingerprint: fingerprint});
    return output;
  }, []);
}

function gcglRetiredReportFingerprint_(sheet) {
  const rows = sheet.getLastRow(), columns = sheet.getLastColumn();
  if (rows < 1 || columns < 1 || rows * columns > 100000) return "";
  const range = sheet.getRange(1, 1, rows, columns);
  const snapshot = [sheet.getName(), sheet.isSheetHidden(), rows, columns, sheet.getFrozenRows(),
    sheet.getFrozenColumns(), range.getValues(), range.getFormulas(), range.getNotes()];
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify(snapshot))
    .map(function(byte) { return (byte & 255).toString(16).padStart(2, "0"); }).join("");
}

function offerRetiredReportCleanup_(spreadsheet, tables, replacements) {
  const candidates = gcglRetiredReportCandidates_(spreadsheet, tables, replacements);
  if (!candidates.length) return;
  const ui = SpreadsheetApp.getUi();
  const choice = ui.alert("清理舊版 GCGL 報表",
    candidates.map(function(item) { return "・" + item.name; }).join("\n") +
    "\n\n會先建立整份試算表的私人備份並驗證，再直接刪除列出的舊分頁。\n不會刪除新版報表或其他分頁。是否繼續？",
    ui.ButtonSet.YES_NO);
  if (choice !== ui.Button.YES) return;
  const result = archiveAndRemoveRetiredReports_(spreadsheet, tables, replacements, candidates);
  const message = result.removed.length ? "已刪除：" + result.removed.join("、") : "未刪除任何舊分頁。";
  ui.alert([message, result.backup ? "私人備份：" + result.backup : "", result.message].filter(Boolean).join("\n"));
}

function archiveAndRemoveRetiredReports_(spreadsheet, tables, replacements, approved) {
  const result = {removed: [], backup: "", message: ""};
  function currentMatches() {
    const found = gcglRetiredReportCandidates_(spreadsheet, tables, replacements);
    return approved.every(function(expected) {
      return found.some(function(item) {
        return item.id === expected.id && item.name === expected.name && item.fingerprint === expected.fingerprint;
      });
    });
  }
  if (!approved.length || !currentMatches()) {
    result.message = "舊分頁或報表已變更，請重建後重新確認。";
    return result;
  }
  try {
    // 備份建立在執行者自己的 My Drive，不在原本可能共用的資料夾內複製。
    const source = DriveApp.getFileById(spreadsheet.getId());
    const owner = source.getOwner();
    const actor = Session.getEffectiveUser().getEmail();
    if (!owner || !actor || owner.getEmail() !== actor) {
      result.message = "只有原試算表擁有者能建立備份並清理。";
      return result;
    }
    const sourceNames = spreadsheet.getSheets().map(function(sheet) { return sheet.getName(); }).sort();
    const timezone = spreadsheet.getSpreadsheetTimeZone() || Session.getScriptTimeZone();
    const name = spreadsheet.getName() + "－GCGL 舊報表備份 " + Utilities.formatDate(new Date(), timezone, "yyyyMMdd-HHmmss");
    const file = source.makeCopy(name, DriveApp.getRootFolder());
    const backupId = file.getId();
    if (!backupId || backupId === spreadsheet.getId()) throw new Error("備份未建立為獨立檔案。");
    const backupOwner = file.getOwner();
    if (!backupOwner || backupOwner.getEmail() !== actor || file.getSharingAccess() !== DriveApp.Access.PRIVATE ||
        file.getViewers().length || file.getEditors().some(function(editor) { return editor.getEmail() !== actor; })) {
      file.setTrashed(true);
      throw new Error("無法確認備份為私人檔案，已保留原分頁。");
    }
    result.backup = name;
    const backup = SpreadsheetApp.openById(backupId);
    const backupNames = backup.getSheets().map(function(sheet) { return sheet.getName(); }).sort();
    if (!arraysEqual_(sourceNames, backupNames) || !approved.every(function(item) {
      const copy = backup.getSheetByName(item.name);
      return copy && gcglRetiredReportFingerprint_(copy) === item.fingerprint;
    })) throw new Error("備份驗證未通過。");
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      if (PropertiesService.getScriptProperties().getProperty(GCGL_CONFIG.reportRebuildLeaseProperty) ||
          !currentMatches()) throw new Error("確認後資料已變更，請重建後再試。");
      const sheets = new Map(spreadsheet.getSheets().map(function(sheet) { return [sheet.getSheetId(), sheet]; }));
      approved.forEach(function(item) {
        // 絕不按名稱再搜尋替代對象；只刪已同意、已備份及剛核對過的分頁。
        const sheet = sheets.get(item.id);
        if (sheet.getName() !== item.name || !Object.prototype.hasOwnProperty.call(GCGL_RETIRE_ON_MANUAL_REBUILD, item.name)) {
          throw new Error("分頁識別不一致，已停止後續清理。");
        }
        spreadsheet.deleteSheet(sheet);
        result.removed.push(item.name);
      });
      SpreadsheetApp.flush();
    } finally { lock.releaseLock(); }
  } catch (error) {
    console.error("GCGL 舊報表清理未完成：" + error.message);
    result.message = "清理未完成；尚未刪除的分頁已保留。";
  }
  return result;
}

/** 每日跨日後只排入總覽更新；不寫入原始資料，也不變更最後同步時間。 */
function refreshGCGLDailyOverview() {
  // 與 App 寫入共用短鎖，避免覆蓋其他尚待重建的分頁清單。
  // 實際報表仍由原有單次工作處理，不在這裡持鎖重建。
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    if (!isConfigured_()) return;
    const hasOverview = loadTableSchemas_().some(function(table) {
      return table.key === "site_overview";
    });
    if (!hasOverview) return;
    markReportsPending_(["site_overview"], true);
  } finally {
    lock.releaseLock();
  }
}

/** 依試算表時區，每日 00:00～01:00 執行；重新設定不重複建立排程。 */
function ensureDailyOverviewTrigger_(spreadsheet) {
  const properties = PropertiesService.getScriptProperties();
  const timezone = spreadsheet.getSpreadsheetTimeZone() || Session.getScriptTimeZone();
  const savedId = properties.getProperty(GCGL_CONFIG.dailyOverviewTriggerIdProperty);
  const savedTimezone = properties.getProperty(GCGL_CONFIG.dailyOverviewTimeZoneProperty);
  const triggers = ScriptApp.getProjectTriggers().filter(function(trigger) {
    return trigger.getHandlerFunction() === GCGL_CONFIG.dailyOverviewRefreshHandler;
  });
  if (savedTimezone === timezone && triggers.some(function(trigger) {
    return trigger.getUniqueId() === savedId;
  })) {
    triggers.filter(function(trigger) {
      return trigger.getUniqueId() !== savedId;
    }).forEach(function(trigger) { ScriptApp.deleteTrigger(trigger); });
    return;
  }

  // 新排程成功建立後再移除舊排程，設定失敗時保留既有的每日更新。
  const trigger = ScriptApp
    .newTrigger(GCGL_CONFIG.dailyOverviewRefreshHandler)
    .timeBased()
    .atHour(0)
    .everyDays(1)
    .inTimezone(timezone)
    .create();
  triggers.forEach(function(item) { ScriptApp.deleteTrigger(item); });
  properties.setProperties({
    [GCGL_CONFIG.dailyOverviewTriggerIdProperty]: trigger.getUniqueId(),
    [GCGL_CONFIG.dailyOverviewTimeZoneProperty]: timezone
  });
}

/**
 * 同步完成後短暫延遲再執行；不持有同步寫入使用的 ScriptLock，避免大型報表
 * 重建期間阻塞 App，造成 HTTP 逾時或 NSURLErrorDomain -1011。
 */
function processPendingGCGLReportRebuild(event) {
  const triggerId = event && event.triggerUid ? String(event.triggerUid) : "";
  return runPendingGCGLReportRebuild_(triggerId, false);
}

/** 常駐備援只檢查待更新旗標；沒有變動時不讀取試算表、不重建報表。 */
function recoverPendingGCGLReports() {
  const properties = PropertiesService.getScriptProperties();
  if (properties.getProperty(GCGL_CONFIG.reportRebuildPendingProperty) !== "1") return;
  return runPendingGCGLReportRebuild_("", false);
}

function runPendingGCGLReportRebuild_(triggerId, forceRetry, replacements) {
  const job = claimPendingReportRebuild_(triggerId, forceRetry);
  if (!job) return false;
  let succeeded = false;
  let failure, continuation;
  try {
    const tables = loadTableSchemas_();
    if (tables.length > 0) {
      const spreadsheet = configuredSpreadsheet_();
      const queued = job.manual && readManualReportGridQueue_(spreadsheet, job);
      const remaining = queued ? resumeManualReportGrids_(spreadsheet, queued) :
        renderReportSheets_(spreadsheet, tables, job.changedKeys, job.manual, replacements);
      SpreadsheetApp.flush();
      if (job.manual && remaining && remaining.length) {
        continuation = {book: spreadsheet.getId(), grids: remaining};
      }
    }
    succeeded = true;
  } catch (error) {
    failure = error;
    console.error(error && error.stack ? error.stack : error);
  } finally {
    finishPendingReportRebuild_(job, succeeded, continuation);
  }
  // 讓 Apps Script「執行項目」保留失敗狀態，不再只寫日誌後顯示執行成功。
  if (!succeeded) throw failure;
  return true;
}

/** 短鎖只保護工作認領與狀態，不在重建整份報表期間阻塞 App 寫入。 */
function claimPendingReportRebuild_(triggerId, forceRetry) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const properties = PropertiesService.getScriptProperties();
    if (triggerId) clearDeferredReportTrigger_(triggerId);
    if (properties.getProperty(GCGL_CONFIG.reportRebuildPendingProperty) !== "1") return null;
    const now = Date.now();
    let lease = null;
    try {
      lease = JSON.parse(properties.getProperty(GCGL_CONFIG.reportRebuildLeaseProperty) || "null");
    } catch (_) { /* 舊狀態損壞時由備援重新認領。 */ }
    // Apps Script 單次執行上限為六分鐘；逾八分鐘的認領視為已中止，可自動恢復。
    const elapsed = lease ? now - Number(lease.startedAt) : NaN;
    if (lease && lease.token && Number.isFinite(elapsed) && elapsed >= 0 &&
        elapsed < GCGL_CONFIG.reportRebuildLeaseMilliseconds) return null;
    const retryAfter = Number(properties.getProperty(GCGL_CONFIG.reportRetryAfterProperty) || "0");
    if (!forceRetry && retryAfter > now) return null;
    const job = {
      token: Utilities.getUuid(), startedAt: now,
      generation: properties.getProperty(GCGL_CONFIG.reportRebuildGenerationProperty) || "0",
      changedKeys: loadPendingReportKeys_(),
      manual: properties.getProperty(GCGL_CONFIG.manualReportRebuildProperty) === "1"
    };
    properties.setProperty(GCGL_CONFIG.reportRebuildLeaseProperty,
      JSON.stringify({token: job.token, startedAt: now}));
    return job;
  } finally {
    lock.releaseLock();
  }
}

function finishPendingReportRebuild_(job, succeeded, continuation) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const properties = PropertiesService.getScriptProperties();
    const lease = JSON.parse(properties.getProperty(GCGL_CONFIG.reportRebuildLeaseProperty) || "null");
    if (!lease || lease.token !== job.token) return;
    if (succeeded) {
      // 檢查與清除共用同一把短鎖，避免清掉重建期間剛收到的新資料。
      if ((properties.getProperty(GCGL_CONFIG.reportRebuildGenerationProperty) || "0") === job.generation) {
        if (continuation) saveManualReportGridQueue_(properties, job.generation, continuation);
        else clearReportRebuildState_();
      }
      properties.deleteProperty(GCGL_CONFIG.reportFailureCountProperty);
      properties.deleteProperty(GCGL_CONFIG.reportRetryAfterProperty);
    } else {
      const failures = Math.min(5, Math.max(0,
        Number(properties.getProperty(GCGL_CONFIG.reportFailureCountProperty)) || 0) + 1);
      properties.setProperties({
        [GCGL_CONFIG.reportFailureCountProperty]: String(failures),
        [GCGL_CONFIG.reportRetryAfterProperty]: String(Date.now() +
          Math.min(15, Math.pow(2, failures - 1)) * 60 * 1000)
      });
    }
    properties.deleteProperty(GCGL_CONFIG.reportRebuildLeaseProperty);
    resetDeferredReportTriggers_();
    if (succeeded && properties.getProperty(GCGL_CONFIG.reportRebuildPendingProperty) === "1") {
      try {
        ensureDeferredReportTrigger_();
      } catch (error) {
        console.error(error && error.stack ? error.stack : error);
      }
    }
  } finally {
    lock.releaseLock();
  }
}

/** 在初始設定建立獨立的每分鐘備援，單次工作漏跑或中止後仍能自行恢復。 */
function ensureReportRecoveryTrigger_() {
  const properties = PropertiesService.getScriptProperties();
  const savedId = properties.getProperty(GCGL_CONFIG.reportRecoveryTriggerIdProperty);
  const triggers = ScriptApp.getProjectTriggers().filter(function(trigger) {
    return trigger.getHandlerFunction() === GCGL_CONFIG.reportRecoveryHandler;
  });
  const existing = triggers.find(function(trigger) { return trigger.getUniqueId() === savedId; });
  // 先建立成功再刪除舊觸發條件，權限或額度出錯時保留既有備援。
  const trigger = existing || ScriptApp.newTrigger(GCGL_CONFIG.reportRecoveryHandler)
    .timeBased().everyMinutes(1).create();
  triggers.filter(function(item) { return item.getUniqueId() !== trigger.getUniqueId(); })
    .forEach(function(item) { ScriptApp.deleteTrigger(item); });
  properties.setProperty(GCGL_CONFIG.reportRecoveryTriggerIdProperty, trigger.getUniqueId());
}

function markReportsPending_(changedKeys, throwOnTriggerError) {
  const properties = PropertiesService.getScriptProperties();
  const generation = Number(
    properties.getProperty(GCGL_CONFIG.reportRebuildGenerationProperty) || "0"
  ) + 1;
  const pendingKeys = uniqueStrings_(
    loadPendingReportKeys_().concat(Array.isArray(changedKeys) ? changedKeys : [])
  ).filter(function(key) {
    return GCGL_CONFIG.expectedTableKeys.indexOf(key) !== -1;
  });
  properties.setProperties({
    [GCGL_CONFIG.reportRebuildPendingProperty]: "1",
    [GCGL_CONFIG.reportRebuildGenerationProperty]: String(generation),
    [GCGL_CONFIG.reportRebuildChangedKeysProperty]: JSON.stringify(pendingKeys)
  });
  try {
    ensureDeferredReportTrigger_();
  } catch (error) {
    // 原始資料已同步完成；若舊部署尚未授權建立觸發條件，不應讓 App 誤判同步失敗。
    // 使用者下次執行 setupGCGLSync() 時會完成授權與建立工作。
    console.error(error && error.stack ? error.stack : error);
    if (throwOnTriggerError) throw error;
  }
}

function ensureDeferredReportTrigger_() {
  const properties = PropertiesService.getScriptProperties();
  const savedTriggerId = properties.getProperty(GCGL_CONFIG.reportRebuildTriggerIdProperty);
  const reportTriggers = ScriptApp.getProjectTriggers().filter(function(trigger) {
    return trigger.getHandlerFunction() === GCGL_CONFIG.reportRebuildHandler;
  });
  if (savedTriggerId && reportTriggers.some(function(trigger) {
    return trigger.getUniqueId() === savedTriggerId;
  })) return;

  // 清掉舊版每分鐘週期觸發條件與失去追蹤的單次觸發條件。
  reportTriggers.forEach(function(trigger) { ScriptApp.deleteTrigger(trigger); });
  const trigger = ScriptApp
    .newTrigger(GCGL_CONFIG.reportRebuildHandler)
    .timeBased()
    .after(GCGL_CONFIG.reportRebuildDelayMilliseconds)
    .create();
  properties.setProperty(
    GCGL_CONFIG.reportRebuildTriggerIdProperty,
    trigger.getUniqueId()
  );
}

function clearDeferredReportTrigger_(triggerId) {
  const properties = PropertiesService.getScriptProperties();
  const savedTriggerId = properties.getProperty(GCGL_CONFIG.reportRebuildTriggerIdProperty) || "";
  const idToDelete = triggerId || savedTriggerId;
  if (idToDelete) {
    ScriptApp.getProjectTriggers().forEach(function(trigger) {
      if (trigger.getHandlerFunction() === GCGL_CONFIG.reportRebuildHandler &&
          trigger.getUniqueId() === idToDelete) {
        ScriptApp.deleteTrigger(trigger);
      }
    });
  }
  if (!triggerId || !savedTriggerId || triggerId === savedTriggerId) {
    properties.deleteProperty(GCGL_CONFIG.reportRebuildTriggerIdProperty);
  }
}

function resetDeferredReportTriggers_() {
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === GCGL_CONFIG.reportRebuildHandler) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  PropertiesService
    .getScriptProperties()
    .deleteProperty(GCGL_CONFIG.reportRebuildTriggerIdProperty);
}

function loadPendingReportKeys_() {
  const raw = PropertiesService
    .getScriptProperties()
    .getProperty(GCGL_CONFIG.reportRebuildChangedKeysProperty);
  if (!raw) return [];
  try {
    const keys = JSON.parse(raw);
    return Array.isArray(keys) ? keys : [];
  } catch (_) {
    return [];
  }
}

function clearReportRebuildState_() {
  const properties = PropertiesService.getScriptProperties();
  properties.deleteProperty(GCGL_CONFIG.reportRebuildPendingProperty);
  properties.deleteProperty(GCGL_CONFIG.reportRebuildChangedKeysProperty);
  properties.deleteProperty(GCGL_CONFIG.manualReportRebuildProperty);
  clearManualReportGridQueue_(properties);
}

function manualReportGridQueueMetadata_(properties) {
  try {
    const data = JSON.parse(properties.getProperty(GCGL_CONFIG.manualGridQueueProperty) || "null");
    return data && Number.isInteger(data.parts) && data.parts > 0 && data.parts <= 512 ? data : null;
  } catch (_) { return null; }
}

function clearManualReportGridQueue_(properties) {
  const metadata = manualReportGridQueueMetadata_(properties);
  if (!metadata) return;
  properties.deleteProperty(GCGL_CONFIG.manualGridQueueProperty);
  for (let index = 0; index < metadata.parts; index++) {
    properties.deleteProperty(GCGL_CONFIG.manualGridQueueProperty + "_" + index);
  }
}

function readManualReportGridQueue_(spreadsheet, job) {
  const properties = PropertiesService.getScriptProperties(), metadata = manualReportGridQueueMetadata_(properties);
  if (!metadata || metadata.book !== spreadsheet.getId() || metadata.generation !== job.generation) return null;
  try {
    const grids = [];
    for (let index = 0; index < metadata.parts; index++) {
      const part = JSON.parse(properties.getProperty(GCGL_CONFIG.manualGridQueueProperty + "_" + index) || "null");
      if (!Array.isArray(part) || !part.length || !part.every(function(grid) {
        return Array.isArray(grid) && grid.length === 3 && grid.every(Number.isSafeInteger) &&
          grid[0] >= 0 && grid[1] > 0 && grid[2] > 0;
      })) return null;
      Array.prototype.push.apply(grids, part);
    }
    return grids;
  } catch (_) { return null; }
}

function saveManualReportGridQueue_(properties, generation, continuation) {
  // 只序列化分頁 ID 與報表邊界，不保存報表內容。分段避開單一設定值大小限制。
  const key = GCGL_CONFIG.manualGridQueueProperty, previous = manualReportGridQueueMetadata_(properties);
  const values = {};
  const parts = Math.ceil(continuation.grids.length / 128);
  for (let index = 0; index < parts; index++) {
    values[key + "_" + index] = JSON.stringify(continuation.grids.slice(index * 128, (index + 1) * 128));
  }
  values[key] = JSON.stringify({generation: generation, book: continuation.book, parts: parts});
  properties.setProperties(values);
  for (let index = parts; previous && index < previous.parts; index++) properties.deleteProperty(key + "_" + index);
}

/** App 顯示語言改變時沿用原工作表，避免留下另一組舊語言分頁。 */
function migrateManagedSheetNames_(spreadsheet, previousMapping, tables) {
  tables.forEach(function(table) {
    // 可見報表不跟著 App 來源表改名；施工進度只保留來源資料與各案場甘特圖。
    if (["pricing_progress", "pricing_detail", "work_logs", "construction_progress"].indexOf(table.key) !== -1) return;
    const oldName = previousMapping[table.key];
    if (!oldName || oldName === table.sheetName) return;

    const oldSheet = spreadsheet.getSheetByName(oldName);
    if (!oldSheet || managedGCGLSheetNames_().indexOf(oldName) === -1) return;
    const targetSheet = spreadsheet.getSheetByName(table.sheetName);
    if (!targetSheet) oldSheet.setName(table.sheetName);
    // 舊、新名稱同時存在時保留兩張，不因名稱符合同步設定就刪除其中一張。
  });
}

/**
 * 單一隱藏資料表格式：
 * table_key | site_id | record_id | updated_at | operation_id | values_json
 *
 * 對 App 的 JSON API 完全不變；只有 Apps Script 內部儲存方式由多張 raw sheet
 * 改成一張 __GCGL_DATA。
 */
function ensureUnifiedDataReady_(spreadsheet) {
  ensureUnifiedDataSheet_(spreadsheet);
  migrateLegacyRawSheets_(spreadsheet);
}

function ensureUnifiedDataSheet_(spreadsheet) {
  const previousActiveSheet = spreadsheet.getActiveSheet();
  let sheet = spreadsheet.getSheetByName(GCGL_CONFIG.rawDataSheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(GCGL_CONFIG.rawDataSheetName);
    protectGCGLSheet_(sheet, []);
  }
  hideInternalSheet_(spreadsheet, sheet, previousActiveSheet);

  const headers = GCGL_CONFIG.unifiedDataHeaders;
  ensureSheetSize_(sheet, 2, headers.length);
  if (sheet.getLastRow() >= 1) {
    const existingHeaders = sheet.getRange(1, 1, 1, headers.length).getDisplayValues()[0];
    const hasHeaderContent = existingHeaders.some(function(value) { return optionalString_(value) !== ""; });
    if (hasHeaderContent && !arraysEqual_(existingHeaders, headers)) {
      throw new Error("隱藏資料表 __GCGL_DATA 的欄位格式不正確，請勿手動修改此工作表。");
    }
  }

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground("#E9EEF3")
    .setFontColor("#263238")
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 30);
  return sheet;
}

function readUnifiedDataRows_(spreadsheet) {
  const sheet = ensureUnifiedDataSheet_(spreadsheet);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet
    .getRange(2, 1, lastRow - 1, GCGL_CONFIG.unifiedDataHeaders.length)
    .getValues()
    .filter(function(row) {
      return optionalString_(row[0]) !== "" && optionalString_(row[2]) !== "";
    });
}

function writeUnifiedDataRows_(spreadsheet, rows) {
  const sheet = ensureUnifiedDataSheet_(spreadsheet);
  const columnCount = GCGL_CONFIG.unifiedDataHeaders.length;
  const oldRowCount = Math.max(sheet.getLastRow() - 1, 0);
  const rowsToClear = Math.max(oldRowCount, rows.length);
  if (rowsToClear > 0) {
    ensureSheetSize_(sheet, rowsToClear + 1, columnCount);
    sheet.getRange(2, 1, rowsToClear, columnCount).clearContent();
  }
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, columnCount).setValues(rows);
  }
}

function toUnifiedStorageRow_(tableKey, storedRow) {
  const valuesJson = JSON.stringify(storedRow.slice(GCGL_CONFIG.metadataHeaders.length));
  if (valuesJson.length > GCGL_CONFIG.maxStoredPayloadChars) {
    throw new Error(
      "單筆資料內容過長（" + tableKey + " / " + optionalString_(storedRow[1]) +
      "），請縮短備註或文字內容後再同步。"
    );
  }
  return [
    tableKey,
    storedRow[0],
    storedRow[1],
    storedRow[2],
    storedRow[3],
    valuesJson
  ];
}

function parseUnifiedValues_(row, table) {
  const recordId = optionalString_(row[2]);
  let values;
  try {
    values = JSON.parse(optionalString_(row[5]) || "[]");
  } catch (_) {
    throw new Error("__GCGL_DATA 內的 JSON 資料損壞：" + table.key + " / " + recordId);
  }
  if (!Array.isArray(values)) {
    throw new Error("__GCGL_DATA 內的資料格式不正確：" + table.key + " / " + recordId);
  }
  if (values.length !== table.headers.length) {
    throw new Error(
      "資料表「" + table.sheetName + "」欄位版本不一致，請從 App 執行完整重新同步。"
    );
  }
  return values;
}

/** 一次讀取 __GCGL_DATA，再依 table_key 還原成舊版報表程式使用的 row 格式。 */
function readStoredRowsByTable_(spreadsheet, tables) {
  ensureUnifiedDataReady_(spreadsheet);
  const tableByKey = {};
  const rowsByKey = {};
  tables.forEach(function(table) {
    tableByKey[table.key] = table;
    rowsByKey[table.key] = [];
  });

  readUnifiedDataRows_(spreadsheet).forEach(function(row) {
    const tableKey = optionalString_(row[0]);
    const table = tableByKey[tableKey];
    if (!table) return;
    const values = parseUnifiedValues_(row, table);
    rowsByKey[tableKey].push([
      row[1],
      row[2],
      row[3],
      row[4]
    ].concat(values));
  });
  return rowsByKey;
}

/** syncRows 專用：整張索引只讀一次，避免每個 table 都重新掃描 __GCGL_DATA。 */
function applyUnifiedRowDeltas_(spreadsheet, tables, operationId, sentAt) {
  const sheet = ensureUnifiedDataSheet_(spreadsheet);
  const lastRow = sheet.getLastRow();
  const rowNumberByKey = {};
  if (lastRow >= 2) {
    sheet.getRange(2, 1, lastRow - 1, 3).getDisplayValues().forEach(function(values, index) {
      const tableKey = optionalString_(values[0]);
      const recordId = optionalString_(values[2]);
      if (!tableKey || !recordId) return;
      const key = unifiedRecordKey_(tableKey, recordId);
      if (rowNumberByKey[key]) {
        throw new Error("__GCGL_DATA 含有重複 recordId：" + tableKey + " / " + recordId + "，請執行完整同步。");
      }
      rowNumberByKey[key] = index + 2;
    });
  }

  const updates = [];
  const inserts = [];
  const deletedRowNumbers = [];

  tables.forEach(function(table) {
    table.upserts.forEach(function(row) {
      const storedRow = buildStoredRow_(
        requiredString_(row.siteId, table.key + ".upserts[].siteId"),
        row,
        table.headers.length,
        operationId,
        sentAt
      );
      const unifiedRow = toUnifiedStorageRow_(table.key, storedRow);
      const key = unifiedRecordKey_(table.key, row.recordId);
      const rowNumber = rowNumberByKey[key];
      if (rowNumber) {
        updates.push({ rowNumber: rowNumber, values: unifiedRow });
      } else {
        inserts.push(unifiedRow);
      }
    });

    table.deletedRecordIds.forEach(function(recordId) {
      const rowNumber = rowNumberByKey[unifiedRecordKey_(table.key, recordId)];
      if (rowNumber) deletedRowNumbers.push(rowNumber);
    });
  });

  writeUnifiedRowUpdates_(sheet, updates);
  deleteStoredRows_(sheet, deletedRowNumbers);

  if (inserts.length > 0) {
    const startRow = sheet.getLastRow() + 1;
    const columnCount = GCGL_CONFIG.unifiedDataHeaders.length;
    ensureSheetSize_(sheet, startRow + inserts.length - 1, columnCount);
    sheet.getRange(startRow, 1, inserts.length, columnCount).setValues(inserts);
  }

  return {
    upsertedRowCount: updates.length + inserts.length,
    deletedRowCount: uniqueNumbers_(deletedRowNumbers).length
  };
}

function writeUnifiedRowUpdates_(sheet, updates) {
  if (updates.length === 0) return;
  const columnCount = GCGL_CONFIG.unifiedDataHeaders.length;
  const sorted = updates.slice().sort(function(left, right) {
    return left.rowNumber - right.rowNumber;
  });
  let group = [];
  const flushGroup = function() {
    if (group.length === 0) return;
    const startRow = group[0].rowNumber;
    sheet.getRange(startRow, 1, group.length, columnCount)
      .setValues(group.map(function(item) { return item.values; }));
    group = [];
  };
  sorted.forEach(function(item) {
    if (group.length > 0 && item.rowNumber !== group[group.length - 1].rowNumber + 1) {
      flushGroup();
    }
    group.push(item);
  });
  flushGroup();
}

function unifiedRecordKey_(tableKey, recordId) {
  return optionalString_(tableKey) + "\u0001" + optionalString_(recordId);
}

function deleteStoredRows_(sheet, rowNumbers) {
  if (rowNumbers.length === 0) return;
  const sorted = uniqueNumbers_(rowNumbers).sort(function(left, right) { return left - right; });
  const groups = [];
  let start = sorted[0];
  let end = sorted[0];
  sorted.slice(1).forEach(function(rowNumber) {
    if (rowNumber === end + 1) {
      end = rowNumber;
    } else {
      groups.push({ start: start, count: end - start + 1 });
      start = rowNumber;
      end = rowNumber;
    }
  });
  groups.push({ start: start, count: end - start + 1 });
  groups.reverse().forEach(function(group) {
    sheet.deleteRows(group.start, group.count);
  });
}

/**
 * 將舊版 __GCGL_DATA_<tableKey> 一次性搬入 __GCGL_DATA。
 * 驗證成功後記錄已搬移的分頁，舊表原樣保留，避免後續重新匯入備份。
 */
function migrateLegacyRawSheets_(spreadsheet) {
  const properties = PropertiesService.getScriptProperties(), key = "GCGL_RAW_MIGRATED_" + spreadsheet.getId();
  const imported = JSON.parse(properties.getProperty(key) || "{}");
  if (!imported || Array.isArray(imported) || typeof imported !== "object") {
    throw new Error("舊版資料移轉紀錄格式不正確，已保留原表。");
  }
  const legacySheets = GCGL_CONFIG.expectedTableKeys.map(function(tableKey) {
    return {
      tableKey: tableKey,
      sheet: Object.prototype.hasOwnProperty.call(imported, tableKey) ? null :
        spreadsheet.getSheetByName(legacyRawSheetName_(tableKey))
    };
  }).filter(function(item) { return item.sheet && item.sheet.isSheetHidden(); });
  if (legacySheets.length === 0) return;

  const existingRows = readUnifiedDataRows_(spreadsheet);
  const rowByKey = {};
  const order = [];
  existingRows.forEach(function(row) {
    const key = unifiedRecordKey_(row[0], row[2]);
    if (!rowByKey[key]) order.push(key);
    rowByKey[key] = row;
  });

  const schemaByKey = {};
  loadTableSchemas_().forEach(function(schema) {
    if (schema && schema.key) schemaByKey[schema.key] = schema;
  });
  const recoveredSchemas = [];
  const legacyKeys = {};

  legacySheets.forEach(function(item) {
    const sheet = item.sheet;
    if (sheet.getLastRow() < 1) return;
    const lastColumn = sheet.getLastColumn();
    if (lastColumn < GCGL_CONFIG.metadataHeaders.length) {
      throw new Error("舊版隱藏資料表「" + sheet.getName() + "」欄位不足，已保留原表未刪除。");
    }

    const headerRow = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
    if (!arraysEqual_(headerRow.slice(0, GCGL_CONFIG.metadataHeaders.length), GCGL_CONFIG.metadataHeaders)) {
      throw new Error("舊版隱藏資料表「" + sheet.getName() + "」格式無法辨識，已保留原表未刪除。");
    }
    const visibleHeaders = headerRow.slice(GCGL_CONFIG.metadataHeaders.length);
    if (!schemaByKey[item.tableKey] && visibleHeaders.length > 0) {
      recoveredSchemas.push({
        key: item.tableKey,
        sheetName: loadManagedTables_()[item.tableKey] || GCGL_CONFIG.defaultSheetNames[item.tableKey],
        headers: visibleHeaders,
        widths: [],
        formats: []
      });
    }

    if (sheet.getLastRow() < 2) return;
    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, lastColumn).getValues();
    const seenInLegacySheet = {};
    rows.forEach(function(row, index) {
      const siteId = optionalString_(row[0]);
      const recordId = optionalString_(row[1]);
      const isBlank = row.every(function(value) { return optionalString_(value) === ""; });
      if (isBlank) return;
      if (!siteId || !recordId) {
        throw new Error(
          "舊版隱藏資料表「" + sheet.getName() + "」第 " + (index + 2) +
          " 列缺少 siteId 或 recordId，已停止搬移並保留原表。"
        );
      }
      const key = unifiedRecordKey_(item.tableKey, recordId);
      if (seenInLegacySheet[key]) {
        throw new Error("舊版隱藏資料表「" + sheet.getName() + "」含重複 recordId：" + recordId);
      }
      seenInLegacySheet[key] = true;
      legacyKeys[key] = true;
      const storedRow = row.slice(0, GCGL_CONFIG.metadataHeaders.length + visibleHeaders.length);
      const unifiedRow = toUnifiedStorageRow_(item.tableKey, storedRow);
      if (!rowByKey[key]) order.push(key);
      // 若新版已有該筆資料，保留較新來源，不讓舊分頁覆蓋現有同步結果。
      if (!rowByKey[key]) rowByKey[key] = unifiedRow;
    });
  });

  if (recoveredSchemas.length > 0) saveTableSchemas_(recoveredSchemas);
  const mergedRows = order.map(function(key) { return rowByKey[key]; });
  writeUnifiedDataRows_(spreadsheet, mergedRows);
  SpreadsheetApp.flush();

  const verified = {};
  readUnifiedDataRows_(spreadsheet).forEach(function(row) {
    verified[unifiedRecordKey_(row[0], row[2])] = true;
  });
  const missingKeys = Object.keys(legacyKeys).filter(function(key) { return !verified[key]; });
  if (missingKeys.length > 0) {
    throw new Error("舊版資料搬移驗證失敗，已保留舊版隱藏工作表。請重新執行 setupGCGLSync()。" );
  }

  legacySheets.forEach(function(item) { imported[item.tableKey] = item.sheet.getSheetId(); });
  properties.setProperty(key, JSON.stringify(imported));
}

// MARK: - 可閱讀報表分頁

function renderReportSheets_(spreadsheet, tables, changedKeys, manualRebuild, replacements) {
  const renderStartedAt = Date.now();
  reportLanguage_(spreadsheet);
  const properties = PropertiesService.getScriptProperties();
  const revision = Utilities.getUuid();
  const activeKey = GCGL_CONFIG.pdfRenderActivePrefix + revision;
  properties.setProperties({[activeKey]: String(Date.now()),
    [GCGL_CONFIG.pdfRenderRevisionProperty]: revision});
  try {
    const remaining = renderReportSheetsContents_(spreadsheet, tables, changedKeys, manualRebuild, renderStartedAt, replacements);
    SpreadsheetApp.flush();
    properties.deleteProperty(GCGL_CONFIG.pdfRenderFailedProperty);
    // 被系統中止的舊執行可能沒有 finally；只有一次成功重建才能恢復下載。
    const leases = properties.getProperties();
    Object.keys(leases).forEach(function(key) {
      if (key.indexOf(GCGL_CONFIG.pdfRenderActivePrefix) === 0 &&
          (!Number.isFinite(Number(leases[key])) ||
          Date.now() - Number(leases[key]) >= 10 * 60 * 1000)) properties.deleteProperty(key);
    });
    if (replacements) {
      replacements.book = spreadsheet.getId();
      replacements.revision = revision;
    }
    return remaining;
  } catch (error) {
    properties.setProperty(GCGL_CONFIG.pdfRenderFailedProperty, "1");
    throw error;
  } finally {
    properties.deleteProperty(activeKey);
  }
}

let gcglReportGridWork = null;

function renderReportSheetsContents_(spreadsheet, tables, changedKeys, manualRebuild, renderStartedAt, replacements) {
  let reportError = null;
  const previousMemoryCache = gcglMemoryReadCache;
  const previousGridWork = gcglReportGridWork;
  const gridWork = {created: new Set(), finished: new Map()};
  gcglMemoryReadCache = {spreadsheet: spreadsheet, rows: Object.create(null)};
  gcglReportGridWork = gridWork;
  try {
    const memory = migrateExistingGCGLMemory_(spreadsheet);
    const properties = PropertiesService.getScriptProperties(), refreshKey = gcglMemoryRefreshKey_(spreadsheet);
    const rewireMaterials = properties.getProperty(refreshKey) === "1";
    const keys = reportKeysForChangedTables_(changedKeys);
    const reportKeys = rewireMaterials
      ? uniqueStrings_(keys.concat(reportKeysForChangedTables_(["material_catalog"]))) : keys;
    const hasReport = function(key) {
      return reportKeys.indexOf(key) !== -1 && tables.some(function(table) { return table.key === key; });
    };
    const needsMaterialPrices = hasReport("material_summary") || hasReport("material_orders") || hasReport("material_catalog");
    const memoryKinds = [];
    if (needsMaterialPrices) memoryKinds.push("materials");
    if (hasReport("worker_directory")) memoryKinds.push("workers");
    if (hasReport("attendance")) memoryKinds.push("wages");
    primeGCGLMemoryCache_(spreadsheet, memory, memoryKinds);
    hideInternalSheets_(spreadsheet, true);
    const activeSheet = spreadsheet.getActiveSheet();
    const previousActiveSheetId = activeSheet ? activeSheet.getSheetId() : null;
    const valuesByKey = {};
    const recordIdsByKey = {};
    const storedRowsByKey = readStoredRowsByTable_(spreadsheet, tables);
    tables.forEach(function(table) {
      const storedRows = storedRowsByKey[table.key] || [];
      valuesByKey[table.key] = storedRows.map(function(row) {
        return row.slice(GCGL_CONFIG.metadataHeaders.length);
      });
      recordIdsByKey[table.key] = storedRows.map(function(row) {
        return optionalString_(row[1]);
      });
    });

    const siteNames = collectReportSiteNames_(tables, valuesByKey);
    const materialCatalogTable = tables.find(function(table) {
      return table.key === "material_catalog";
    });
    const materialPriceContext = materialCatalogTable && (hasReport("material_summary") || hasReport("material_orders"))
      ? buildMaterialPriceContext_(spreadsheet, materialCatalogTable,
          valuesByKey.material_catalog || [], recordIdsByKey.material_catalog || [], storedRowsByKey)
      : null;
    if (materialCatalogTable && (
      reportKeys.indexOf(materialCatalogTable.key) !== -1 ||
      !spreadsheet.getSheetByName(materialCatalogTable.sheetName)
    )) {
      renderMaterialCatalogReport_(
        spreadsheet,
        materialCatalogTable,
        valuesByKey.material_catalog || [],
        recordIdsByKey.material_catalog || []
      );
    }
    const materialSummaryTable = materialCatalogTable ? tables.find(function(table) {
      return table.key === "material_summary";
    }) : null;
    const pricingTables = tables.filter(function(table) { return isPricingReportKey_(table.key); });
    const pricing = renderPricingReports_(spreadsheet, pricingTables, valuesByKey, reportKeys, recordIdsByKey);
    if (replacements && pricing && pricingTables.every(function(table) { return hasReport(table.key); })) {
      replacements.pricing = pricing.getSheetId();
      replacements.pricingSites = Object.fromEntries(pricingTables.map(function(table) {
        const column = reportSiteColumnIndex_(table.key);
        return [table.key, uniqueStrings_(valuesByKey[table.key].map(function(row) {
          return optionalString_(row[column]).trim();
        })).filter(Boolean)];
      }));
    }
    tables.filter(function(table) {
      return ["material_catalog", "monthly_progress", "pricing_progress", "pricing_detail", "construction_progress"].indexOf(table.key) === -1 &&
        reportKeys.indexOf(table.key) !== -1;
    }).sort(function(left, right) {
      // 總覽的材料成本引用材料統計小計；先建立來源報表，避免首次同步產生 #REF!。
      return Number(left.key === "site_overview") - Number(right.key === "site_overview");
    }).forEach(function(table) {
      if (table.key === "site_overview") {
        renderSiteOverviewReport_(
          spreadsheet,
          table,
          valuesByKey,
          recordIdsByKey,
          siteNames,
          materialSummaryTable,
          tables.find(function(item) { return item.key === "monthly_progress"; })
        );
      } else if (table.key === "worker_directory") {
        renderWorkerDirectoryReport_(spreadsheet, table, valuesByKey[table.key] || [],
          recordIdsByKey[table.key] || [], tables, valuesByKey, recordIdsByKey);
      } else if (table.key === "attendance") {
        renderAttendanceReport_(
          spreadsheet,
          table,
          valuesByKey[table.key],
          recordIdsByKey[table.key],
          valuesByKey.worker_directory || []
        );
        renderWorkerAttendanceReport_(spreadsheet, table, valuesByKey[table.key], recordIdsByKey[table.key]);
      } else if (
        materialCatalogTable &&
        ["material_summary", "material_orders"].indexOf(table.key) !== -1
      ) {
        renderMaterialCostReport_(
          spreadsheet,
          table,
          valuesByKey[table.key],
          siteNames,
          materialCatalogTable.sheetName,
          materialPriceContext,
          storedRowsByKey[table.key] || [],
          materialSummaryTable
        );
      } else {
        renderFlatReport_(spreadsheet, table, valuesByKey[table.key], siteNames, recordIdsByKey[table.key]);
      }
    });
    const constructionTable = tables.find(function(table) { return table.key === "construction_progress"; });
    if (constructionTable && (reportKeys.indexOf(constructionTable.key) !== -1 ||
        (Array.isArray(changedKeys) && changedKeys.indexOf("site_overview") !== -1 &&
          constructionGanttScopeChanged_(spreadsheet, valuesByKey.site_overview, recordIdsByKey.site_overview)))) {
      const gantts = renderConstructionGanttReports_(spreadsheet, constructionTable, valuesByKey.construction_progress || [],
        constructionGanttLogs_(tables, valuesByKey), valuesByKey.site_overview, recordIdsByKey.site_overview);
      if (replacements && Array.isArray(gantts)) replacements.gantt = gantts;
    }
    placeReportTabs_(spreadsheet, tables, previousActiveSheetId);
    if (rewireMaterials && hasReport("material_catalog")) {
      SpreadsheetApp.flush();
      properties.deleteProperty(refreshKey);
    }
  } catch (error) {
    reportError = error;
    throw error;
  } finally {
    gcglMemoryReadCache = previousMemoryCache;
    gcglReportGridWork = previousGridWork;
    try {
      applyGCGLReportProtection_(spreadsheet);
    } catch (error) {
      if (!reportError) throw error;
      console.error("GCGL 報表保護未完成：" + error.message);
    }
  }
  // 先讓報表及保護完整落地，再用剩餘時間修剪。手動重建可接續未完成的範圍。
  const renderingElapsed = renderStartedAt == null ? 0 : Date.now() - renderStartedAt;
  return compactGeneratedReportGrids_(gridWork,
    Math.max(0, Math.min(manualRebuild ? 240000 : 8000, 300000 - renderingElapsed)), manualRebuild);
}

// MARK: - 原版面 PDF 下載（只有持有同步密碼的 App 可呼叫）

function pdfExportError_(code, message) {
  const error = new Error(message);
  error.gcglCode = code;
  return error;
}

function pdfReportState_() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  // 中止後可能留下半張報表；過期租約不能直接當作「已完成」。
  let interrupted = false;
  const rendering = Object.keys(properties).some(function(key) {
    if (key.indexOf(GCGL_CONFIG.pdfRenderActivePrefix) !== 0) return false;
    const started = Number(properties[key]);
    if (!Number.isFinite(started) || Date.now() - started >= 10 * 60 * 1000) {
      interrupted = true;
      return false;
    }
    return true;
  });
  return {
    ready: !rendering && !interrupted && properties[GCGL_CONFIG.reportRebuildPendingProperty] !== "1" &&
      properties[GCGL_CONFIG.pdfRenderFailedProperty] !== "1",
    version: JSON.stringify([properties[GCGL_CONFIG.lastDataSyncAtProperty] || "",
      properties[GCGL_CONFIG.reportRebuildGenerationProperty] || "0",
      properties[GCGL_CONFIG.pdfRenderRevisionProperty] || ""]),
    renderFailed: (interrupted || properties[GCGL_CONFIG.pdfRenderFailedProperty] === "1") &&
      properties[GCGL_CONFIG.reportRebuildPendingProperty] !== "1" && !rendering
  };
}

function pdfReportSheets_(spreadsheet) {
  // 只允許受管理的可見報表；即使知道隱藏 sheet ID 也不能下載。
  const combinedPricing = visibleCombinedPricingSheet_(spreadsheet);
  const names = uniqueStrings_(loadTableSchemas_().filter(function(table) {
    return ["monthly_progress", "construction_progress"].indexOf(table.key) === -1 && !isPricingReportKey_(table.key);
  }).map(reportSheetName_).concat([GCGL_CONFIG.workerAttendanceSheetName],
    workerMonthSheets_(spreadsheet).map(function(item) { return item.sheet.getName(); }),
    constructionGanttSheets_(spreadsheet).map(function(item) { return item.sheet.getName(); }),
    combinedPricing ? [combinedPricing.getName()] : []));
  return spreadsheet.getSheets().filter(function(sheet) {
    return names.indexOf(sheet.getName()) !== -1 && !isGCGLInternalSheet_(sheet) &&
      !isArchivedLegacyWorkerAttendance_(sheet) && sheet.getName().indexOf("__") !== 0 && !sheet.isSheetHidden();
  });
}

function workerPDFMonths_(sheet) {
  return workerWageLayouts_(sheet).map(function(layout) {
    const months = uniqueStrings_(layout.keys.map(function(key) { return JSON.parse(key)[3]; }));
    if (months.length !== 1 || !/^\d{4}-(0[1-9]|1[0-2])$/.test(months[0])) {
      throw new Error("施工人員月份識別不正確，請重建報表。");
    }
    const month = months[0];
    const dayCount = new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5)), 0)).getUTCDate();
    const monthlySheet = Boolean(workerMonthForSheet_(sheet));
    // 月份頁到個人工資列為止；舊合併表仍保留原匯出範圍。
    return {month: month, firstRow: monthlySheet ? 1 : layout.keyRow - 3,
      lastRow: layout.keyRow + dayCount + (monthlySheet ? 2 : 3),
      lastColumn: monthlySheet ? Math.max(4, layout.keys.length + 1) : layout.keys.length + 1};
  });
}

function listPDFReports_(spreadsheet) {
  const state = pdfReportState_();
  if (state.renderFailed) throw pdfExportError_("REPORT_RENDER_FAILED", "報表重建失敗，請在試算表執行「重建報表版面」後再試。");
  if (!state.ready) return {ready: false, version: state.version, sheets: []};
  const sheets = pdfReportSheets_(spreadsheet).map(function(sheet) {
    return {id: sheet.getSheetId(), name: sheet.getName(),
      months: isWorkerAttendanceSheet_(sheet)
        ? workerPDFMonths_(sheet).map(function(item) { return item.month; }) : []};
  });
  const after = pdfReportState_();
  if (!after.ready || after.version !== state.version) return {ready: false, sheets: []};
  return {ready: true, version: state.version, sheets: sheets};
}

function exportReportPDF_(spreadsheet, payload) {
  const state = pdfReportState_();
  if (!state.ready || payload.reportVersion !== state.version) {
    throw pdfExportError_("REPORT_NOT_READY", "Google 報表正在更新，請稍後再試。");
  }
  if (!Number.isInteger(payload.sheetId) || payload.sheetId < 0) throw new Error("工作表識別不正確。");
  const sheet = pdfReportSheets_(spreadsheet).find(function(item) { return item.getSheetId() === payload.sheetId; });
  if (!sheet) throw new Error("找不到可匯出的工作表，請重新取得工作表清單。");
  if (["A4", "A3"].indexOf(payload.paperSize) === -1 ||
      ["portrait", "landscape"].indexOf(payload.orientation) === -1) throw new Error("紙張或方向設定不正確。");
  const month = optionalString_(payload.month);
  if (month && !isWorkerAttendanceSheet_(sheet)) throw new Error("此工作表不支援月份範圍匯出。");
  const parameters = {format: "pdf", gid: sheet.getSheetId(), size: payload.paperSize,
    portrait: payload.orientation === "portrait", fitw: true, gridlines: false,
    printtitle: false, sheetnames: false, pagenum: "UNDEFINED", attachment: true,
    fzr: !month, top_margin: 0.35, bottom_margin: 0.35, left_margin: 0.25, right_margin: 0.25};
  if (month) {
    const block = workerPDFMonths_(sheet).find(function(item) { return item.month === month; });
    if (!block) throw new Error("找不到此月份的施工人員表格。");
    parameters.r1 = block.firstRow - 1;
    parameters.r2 = block.lastRow;
    parameters.c1 = 0;
    parameters.c2 = block.lastColumn;
  }
  SpreadsheetApp.flush();
  const url = "https://docs.google.com/spreadsheets/d/" + encodeURIComponent(spreadsheet.getId()) +
    "/export?" + Object.keys(parameters).map(function(key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(String(parameters[key]));
    }).join("&");
  const response = UrlFetchApp.fetch(url, {method: "get", muteHttpExceptions: true,
    headers: {Authorization: "Bearer " + ScriptApp.getOAuthToken()}});
  const status = response.getResponseCode();
  if (status === 401 || status === 403) throw pdfExportError_("PDF_AUTH_REQUIRED",
    "PDF 匯出尚未授權，請在 Apps Script 執行 authorizeGCGLPDFExport，再更新部署版本。");
  if (status === 429 || status >= 500) throw pdfExportError_("PDF_SERVICE_BUSY", "Google PDF 服務暫時忙碌，請稍後再試。");
  if (status !== 200) throw new Error("Google PDF 匯出失敗（HTTP " + status + "）。");
  const bytes = response.getBlob().getBytes();
  if (bytes.length > GCGL_CONFIG.maxPDFBytes) throw new Error("PDF 超過 12 MB，請改用單月或縮小匯出範圍。");
  if (bytes.length < 5 || bytes.slice(0, 5).map(function(byte) { return String.fromCharCode(byte); }).join("") !== "%PDF-") {
    throw new Error("Google 沒有回傳 PDF，請確認已授權並更新部署。");
  }
  // 生成期間若有同步或重建，丟棄本次 PDF；App 可重新取得清單後重試。
  const after = pdfReportState_();
  if (!after.ready || after.version !== state.version) throw pdfExportError_("REPORT_NOT_READY", "報表內容已變更，請重新匯出。");
  const safeName = sheet.getName().replace(/[\\/:*?"<>|\r\n]/g, "_").slice(0, 80) || "Google專案報告";
  return {ready: true, version: state.version, filename: safeName + (month ? "_" + month : "") + ".pdf",
    byteLength: bytes.length, pdfBase64: Utilities.base64Encode(bytes)};
}

/** 更新程式碼後手動執行一次，取得 PDF 所需的 external_request／試算表授權。 */
function authorizeGCGLPDFExport() {
  const spreadsheet = configuredSpreadsheet_();
  const sheet = spreadsheet.getSheets().find(function(item) {
    return !isGCGLInternalSheet_(item) && !item.isSheetHidden();
  });
  if (!sheet) throw new Error("請先完成 App 同步，建立可見報表。");
  const response = UrlFetchApp.fetch("https://docs.google.com/spreadsheets/d/" +
    encodeURIComponent(spreadsheet.getId()) + "/export?format=pdf&size=A4&portrait=false&fitw=true&gid=" +
    sheet.getSheetId() + "&r1=0&r2=1&c1=0&c2=1", {
    method: "get", muteHttpExceptions: true,
    headers: {Authorization: "Bearer " + ScriptApp.getOAuthToken()}
  });
  if (response.getResponseCode() !== 200 ||
      response.getBlob().getBytes().slice(0, 5).map(function(byte) { return String.fromCharCode(byte); }).join("") !== "%PDF-") {
    throw new Error("PDF 授權測試失敗，請確認 Google 帳號可存取試算表。");
  }
  return "PDF 匯出已授權，請更新網頁應用程式部署版本。";
}

/** 自訂分頁留在前方；材料單價表後接案場甘特圖、出工月份及隱藏資料。 */
function placeReportTabs_(spreadsheet, tables, previousActiveSheetId) {
  const reportOrder = [
    "site_overview", "pricing_progress", "pricing_detail",
    "work_logs", "memos", "attendance", "worker_directory", "material_summary", "material_orders", "material_catalog"
  ];
  const reportSheets = [];
  const placedSheetIds = {};
  const combinedPricing = visibleCombinedPricingSheet_(spreadsheet);
  reportOrder.forEach(function(key) {
    if (isPricingReportKey_(key)) {
      if (combinedPricing && key === "pricing_progress") {
        placedSheetIds[combinedPricing.getSheetId()] = true;
        reportSheets.push(combinedPricing);
      }
      return;
    }
    const table = tables.find(function(item) { return item.key === key; });
    const sheet = table && spreadsheet.getSheetByName(reportSheetName_(table));
    if (!sheet || placedSheetIds[sheet.getSheetId()]) return;
    placedSheetIds[sheet.getSheetId()] = true;
    reportSheets.push(sheet);
  });
  const ganttSheets = constructionGanttSheets_(spreadsheet);
  ganttSheets.filter(function(item) { return !item.sheet.isSheetHidden(); }).sort(function(a, b) {
    return a.sheet.getName().localeCompare(b.sheet.getName(), undefined, {numeric: true});
  }).forEach(function(item) {
    placedSheetIds[item.sheet.getSheetId()] = true;
    reportSheets.push(item.sheet);
  });
  workerMonthSheets_(spreadsheet).sort(function(a, b) {
    return b.month.localeCompare(a.month);
  }).forEach(function(item) {
    if (placedSheetIds[item.sheet.getSheetId()]) return;
    placedSheetIds[item.sheet.getSheetId()] = true;
    reportSheets.push(item.sheet);
  });
  ganttSheets.filter(function(item) { return item.sheet.isSheetHidden(); }).forEach(function(item) {
    reportSheets.push(item.sheet);
  });
  // GCGL 隱藏資料留在所有報表之後，__GCGL_DATA 固定為最後一頁。
  reportSheets.push.apply(reportSheets, orderedInternalSheets_(spreadsheet));
  // 從右向左放到表尾，只搬 GCGL 分頁；原有分頁不會被擠到報表之後。
  // 已在正確位置的分頁不再搬動，避免每次同步都重新排序。
  let position = spreadsheet.getSheets().length;
  reportSheets.reverse().forEach(function(sheet) {
    const current = spreadsheet.getSheets()[position - 1];
    if (!current || current.getSheetId() !== sheet.getSheetId()) {
      moveGCGLSheet_(spreadsheet, sheet, position);
    }
    position -= 1;
  });
  const previousActiveSheet = spreadsheet.getSheets().find(function(sheet) {
    return sheet.getSheetId() === previousActiveSheetId && !sheet.isSheetHidden();
  });
  if (previousActiveSheet) spreadsheet.setActiveSheet(previousActiveSheet);
}

function orderedInternalSheets_(spreadsheet) {
  const sheets = spreadsheet.getSheets().filter(isGCGLInternalSheet_);
  return sheets.filter(function(sheet) { return sheet.getName() !== GCGL_CONFIG.rawDataSheetName; })
    .concat(sheets.filter(function(sheet) { return sheet.getName() === GCGL_CONFIG.rawDataSheetName; }));
}

/** 隱藏頁暫時顯示才能切為 active 移動；完成或出錯都恢復隱藏與原本可見分頁。 */
function moveGCGLSheet_(spreadsheet, sheet, position) {
  const previous = spreadsheet.getActiveSheet(), hidden = sheet.isSheetHidden();
  if (hidden) sheet.showSheet();
  try {
    spreadsheet.setActiveSheet(sheet);
    spreadsheet.moveActiveSheet(position);
  } finally {
    if (hidden) {
      const visible = previous && !previous.isSheetHidden() && previous.getSheetId() !== sheet.getSheetId()
        ? previous : visibleReportSheet_(spreadsheet);
      spreadsheet.setActiveSheet(visible);
      sheet.hideSheet();
    }
  }
}

/**
 * 一般變更只重建受影響的可見分頁。當某頁第一次出現該案場資料時，該資料表
 * 本身也會被列為已變更，因此案場下拉選單會一起更新。總覽另外依賴工程記錄、
 * 備忘錄、材料訂購、材料統計及月份進度。施工甘特圖亦依賴工程記錄的日期。
 */
function reportKeysForChangedTables_(changedKeys) {
  const keys = Array.isArray(changedKeys) && changedKeys.length > 0
    ? uniqueStrings_(changedKeys)
    : GCGL_CONFIG.expectedTableKeys.slice();
  const result = keys.slice();
  if (keys.indexOf("work_logs") !== -1) result.push("construction_progress");
  // 名冊亦供出勤欄位核對；新登錄／更名人員後，讓舊備註的顯示同步更新。
  if (keys.indexOf("worker_directory") !== -1) result.push("attendance");
  if (keys.indexOf("material_catalog") !== -1 || keys.indexOf("material_summary") !== -1) {
    result.push("material_summary", "material_orders");
  }
  if (["work_logs", "memos", "attendance", "worker_directory", "material_orders", "material_summary", "material_catalog", "monthly_progress"].some(function(key) {
    return keys.indexOf(key) !== -1;
  })) {
    result.push("site_overview");
  }
  return uniqueStrings_(result);
}

/** 第一次套用新版面時，保留舊版可見工作表內的同步資料。 */
function migrateLegacyTableData_(spreadsheet, destinationSheet, table) {
  const legacySheet = spreadsheet.getSheetByName(table.sheetName);
  if (!legacySheet || legacySheet.getLastRow() < 1) return;

  const expectedHeaders = GCGL_CONFIG.metadataHeaders.concat(table.headers);
  if (legacySheet.getLastColumn() < expectedHeaders.length) return;
  const existingHeaders = legacySheet
    .getRange(1, 1, 1, expectedHeaders.length)
    .getDisplayValues()[0];
  if (!arraysEqual_(existingHeaders, expectedHeaders)) return;

  const rowCount = legacySheet.getLastRow();
  ensureSheetSize_(destinationSheet, Math.max(rowCount, 2), expectedHeaders.length);
  destinationSheet
    .getRange(1, 1, rowCount, expectedHeaders.length)
    .setValues(legacySheet.getRange(1, 1, rowCount, expectedHeaders.length).getValues());
}

function collectReportSiteNames_(tables, valuesByKey) {
  const result = [];
  const seen = {};
  const overviewTable = tables.find(function(table) {
    return table.key === "site_overview";
  });
  if (!overviewTable) return result;

  const siteIndex = reportSiteColumnIndex_(overviewTable.key);
  (valuesByKey.site_overview || []).forEach(function(row) {
    const name = optionalString_(row[siteIndex]);
    if (!name || seen[name]) return;
    seen[name] = true;
    result.push(name);
  });
  return result;
}

function reportSiteColumnIndex_(tableKey) {
  if (["work_logs", "memos", "attendance", "material_orders"].indexOf(tableKey) !== -1) {
    return 1;
  }
  if (GCGL_CONFIG.expectedTableKeys.indexOf(tableKey) !== -1) return 0;
  return -1;
}

function prepareReportSheet_(spreadsheet, sheetName, layout) {
  // 只能重建已登記的同步報表；不得清空使用者自行新增的工作表。
  const managedByName = managedGCGLSheetNames_().indexOf(sheetName) !== -1;
  const combinedPricing = managedByName ? null : combinedPricingSheet_(spreadsheet);
  if (!managedByName &&
      (!combinedPricing || combinedPricing.getName() !== sheetName) &&
      !workerMonthForSheet_(sheetName && spreadsheet.getSheetByName(sheetName)) &&
      !constructionGanttSheets_(spreadsheet).some(function(item) { return item.sheet.getName() === sheetName; })) {
    throw new Error("「" + sheetName + "」不是 GCGL 管理的工作表，已保留內容未清空。");
  }
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) sheet = insertGeneratedReportSheet_(spreadsheet, sheetName);
  if (sheet.isSheetHidden()) sheet.showSheet();
  layout = layout || {};
  const revealAfterClearing = [];
  if (layout.visibleColumns && layout.hiddenColumns && sheet.getLastRow() > 0) {
    const width = Math.min(layout.visibleColumns, sheet.getMaxColumns());
    const rows = sheet.getRange(1, 1, Math.min(4, sheet.getLastRow()), width).getValues();
    const previousIdentifierHeaders = new Set([GCGL_CONFIG.materialPriceKeyHeader, GCGL_CONFIG.materialCatalogIdHeader,
      GCGL_CONFIG.materialSiteNameHeader, GCGL_CONFIG.memoRecordKeyHeader, GCGL_CONFIG.memoSourceSignatureHeader,
      GCGL_CONFIG.workerDirectoryKeyHeader]);
    for (let column = 1; column <= width; column++) {
      if (rows.some(function(row) { return previousIdentifierHeaders.has(row[column - 1]); })) revealAfterClearing.push(column);
    }
  }
  // 寫入前先隱藏技術資料；即使稍後拋錯或被系統中止，也不會先露出識別欄／列。
  if (layout.hiddenColumns) {
    ensureSheetSize_(sheet, 1, layout.hiddenColumns[0] + layout.hiddenColumns[1] - 1);
    sheet.hideColumns(layout.hiddenColumns[0], layout.hiddenColumns[1]);
  }
  if (layout.hiddenRow) {
    ensureSheetSize_(sheet, layout.hiddenRow, 1);
    sheet.hideRows(layout.hiddenRow);
  }

  sheet.getCharts().forEach(function(chart) { sheet.removeChart(chart); });
  sheet.getBandings().forEach(function(banding) { banding.remove(); });
  const filter = sheet.getFilter();
  if (filter) filter.remove();
  sheet
    .getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns())
    .getMergedRanges()
    .forEach(function(range) { range.breakApart(); });
  const previousRows = Math.max(sheet.getLastRow(), 1);
  const previousColumns = Math.max(sheet.getLastColumn(), 1);
  const grid = sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns());
  grid.clearContent().clearDataValidations().clearNote();
  resetReportStylesKeepingBorders_(sheet.getRange(1, 1, previousRows, previousColumns));
  // 舊版技術欄移到新位置才恢復原欄，其餘使用者隱藏欄維持不變。
  revealAfterClearing.forEach(function(column) { sheet.showColumns(column); });
  sheet.clearConditionalFormatRules();
  sheet.setHiddenGridlines(true);
  sheet.setFrozenRows(0);
  sheet.setFrozenColumns(0);
  sheet.setTabColor(GCGL_REPORT_COLORS.navy);
  return sheet;
}

function insertGeneratedReportSheet_(spreadsheet, name) {
  const sheet = spreadsheet.insertSheet(name);
  if (gcglReportGridWork) gcglReportGridWork.created.add(sheet.getSheetId());
  return sheet;
}

/** 編排實際終點可包含只有框線、合併、隱藏識別或圖表留白，不能只看儲存格有無文字。 */
function finishGeneratedReportGrid_(sheet, lastRow, lastColumn) {
  if (gcglReportGridWork) gcglReportGridWork.finished.set(sheet.getSheetId(), {sheet: sheet, row: lastRow, column: lastColumn});
}

function resumeManualReportGrids_(spreadsheet, grids) {
  const sheets = new Map(spreadsheet.getSheets().map(function(sheet) { return [sheet.getSheetId(), sheet]; }));
  const work = {created: new Set(), finished: new Map()};
  grids.forEach(function(grid) {
    const sheet = sheets.get(grid[0]);
    if (sheet) work.finished.set(grid[0], {sheet: sheet, row: grid[1], column: grid[2]});
  });
  return compactGeneratedReportGrids_(work, 240000, true);
}

function compactGeneratedReportGrids_(work, budget, completeCheck) {
  const existingColumns = [], existingRows = [];
  const unexamined = new Map();
  const track = function(grid) {
    const id = grid.sheet.getSheetId();
    unexamined.set(id, [id, grid.row, grid.column]);
  };
  function skipGrid(grid) {
    console.warn("GCGL 保留無法確認的報表空白格：" + grid.sheet.getName());
  }
  let failure = null;
  function compactAxis(axis, fresh, deadline) {
    try {
      const sheet = axis.grid.sheet;
      const done = compactGeneratedReportAxis_(sheet, axis.isRow, axis.lastUsed, axis.maximum,
        axis.isRow ? sheet.getMaxColumns() : sheet.getMaxRows(), fresh, deadline);
      if (!done && completeCheck) track(axis.grid);
    } catch (error) {
      // 單一分頁或方向無法檢查，不影響同一張表的另一方向或其他報表。
      skipGrid(axis.grid);
      if (completeCheck) failure = failure || error;
    }
  }
  budget = budget == null ? 8000 : budget;
  if (budget <= 0 && completeCheck) {
    work.finished.forEach(track);
    return Array.from(unexamined.values());
  }
  work.finished.forEach(function(grid, id) {
    try {
      const sheet = grid.sheet;
      if (sheet.isSheetHidden() || sheet.getImages().length) return;
      const maxRows = sheet.getMaxRows(), maxColumns = sheet.getMaxColumns();
      const lastRow = Math.max(1, grid.row, sheet.getLastRow(), sheet.getFrozenRows());
      const lastColumn = Math.max(1, grid.column, sheet.getLastColumn(), sheet.getFrozenColumns());
      const fresh = work.created.has(id);
      if (maxColumns > lastColumn) {
        const axis = {grid: grid, isRow: false, lastUsed: lastColumn, maximum: maxColumns};
        if (fresh) compactAxis(axis, true, 0);
        else existingColumns.push(axis);
      }
      if (maxRows > lastRow) {
        const axis = {grid: grid, isRow: true, lastUsed: lastRow, maximum: maxRows};
        if (fresh) compactAxis(axis, true, 0);
        else existingRows.push(axis);
      }
    } catch (error) {
      skipGrid(grid);
      if (completeCheck) failure = failure || error;
    }
  });

  // 安排每張舊表的兩個方向，而不是讓第一張的列掃描吃掉整輪時間。
  // 欄通常較短；先檢查各頁的欄，剩餘時間再公平分配給各頁的列。
  if (budget <= 0) return [];
  const deadline = Date.now() + budget, axes = existingColumns.concat(existingRows);
  axes.forEach(function(axis, index) {
    const now = Date.now(), remaining = Math.max(0, deadline - now);
    const share = Math.floor(remaining / (axes.length - index));
    compactAxis(axis, false, now + share);
  });
  if (failure) throw failure;
  return Array.from(unexamined.values());
}

/** 只從尾端縮減；碰到隱藏列／欄就停，絕不移動那些格的索引。 */
function compactGeneratedReportAxis_(sheet, isRow, lastUsed, maximum, across, fresh, deadline) {
  if (maximum <= lastUsed) return true;
  let retained = lastUsed;
  let reachedEnd = true;
  if (!fresh) {
    let position = maximum;
    // 每次最多檢查一段；大表下次重建可繼續，避免建立非常大的空白範圍。
    const lowerBound = Math.max(lastUsed, maximum - Math.max(1, Math.floor(50000 / across)));
    // 即使前頁的服務呼叫較慢，每個有空白尾端的舊分頁仍至少會檢查一欄／列。
    do {
      const hidden = isRow ? sheet.isRowHiddenByUser(position) : sheet.isColumnHiddenByUser(position);
      if (hidden) {
        retained = position;
        break;
      }
      position--;
    } while (position > lowerBound && Date.now() < deadline);
    reachedEnd = position === lastUsed || retained !== lastUsed;
    retained = position;
  }
  let count = maximum - retained;
  if (count <= 0) return reachedEnd;
  const tail = isRow ? sheet.getRange(retained + 1, 1, count, across) :
    sheet.getRange(1, retained + 1, across, count);
  if (!tail.isBlank()) return true;
  let keep = retained;
  tail.getMergedRanges().forEach(function(range) {
    keep = Math.max(keep, isRow ? range.getRow() + range.getNumRows() - 1 :
      range.getColumn() + range.getNumColumns() - 1);
  });
  // 新建頁面的非報表區沒有舊註解或驗證。既有表仍可刪除保留格以後確認空白的部分。
  if (!fresh) [tail.getNotes(), tail.getDataValidations()].forEach(function(matrix) {
    matrix.forEach(function(row, rowIndex) {
      row.forEach(function(value, columnIndex) {
        if (value) keep = Math.max(keep, retained + (isRow ? rowIndex : columnIndex) + 1);
      });
    });
  });
  if (keep > retained) reachedEnd = true;
  retained = keep;
  count = maximum - retained;
  if (count <= 0) return reachedEnd;
  if (isRow) sheet.deleteRows(retained + 1, count);
  else sheet.deleteColumns(retained + 1, count);
  return reachedEnd;
}

/** 重填內容時重設非框線格式，避免整頁 clear() 先把既有表格框線抹除。 */
function resetReportStylesKeepingBorders_(range) {
  range.setBackground(null).setFontColor(null).setFontFamily("Arial").setFontSize(10)
    .setFontWeight("normal").setFontStyle("normal").setNumberFormat("General")
    .setHorizontalAlignment(null).setVerticalAlignment(null).setWrap(false);
}

/** 只清除新版表格以外的舊框線；依矩形邊界分批處理，不逐格呼叫 Google。 */
function clearUnusedReportBorders_(sheet, ranges, maxRows, maxColumns) {
  maxRows = maxRows || sheet.getMaxRows();
  maxColumns = maxColumns || sheet.getMaxColumns();
  const boxes = ranges.map(function(range) {
    return {top: range.getRow(), bottom: Math.min(maxRows + 1, range.getRow() + range.getNumRows()),
      left: range.getColumn(), right: Math.min(maxColumns + 1, range.getColumn() + range.getNumColumns())};
  });
  const edges = Array.from(new Set([1, maxRows + 1].concat(boxes.reduce(function(result, box) {
    return result.concat([box.top, box.bottom]);
  }, [])))).sort(function(a, b) { return a - b; });
  for (let index = 0; index < edges.length - 1; index++) {
    const top = edges[index], bottom = edges[index + 1];
    if (top >= bottom || top > maxRows) continue;
    const intervals = boxes.filter(function(box) { return box.top <= top && box.bottom >= bottom; })
      .sort(function(a, b) { return a.left - b.left; });
    let column = 1;
    intervals.concat([{left: maxColumns + 1, right: maxColumns + 1}]).forEach(function(box) {
      if (box.left > column) sheet.getRange(top, column, bottom - top, box.left - column)
        .setBorder(false, false, false, false, false, false);
      column = Math.max(column, box.right);
    });
  }
}

function renderSiteOverviewReport_(spreadsheet, table, valuesByKey, recordIdsByKey, siteNames, materialSummaryTable, monthlyTable) {
  const siteIndex = reportSiteColumnIndex_(table.key);
  const summaryColumn = 6;
  const summaryColumnCount = 2;
  const companyMemoColumnCount = summaryColumn + summaryColumnCount - 1;
  const monthlySourceColumn = companyMemoColumnCount + 1; // H：緊接 A～G 可見報表，不留空白欄。
  const monthlySourceWidth = monthlyTable ? monthlyTable.headers.length - 1 : 0;
  const oldMonthlySourceColumn = 24; // 舊版圖表來源從 X 開始。
  const previousOverview = spreadsheet.getSheetByName(table.sheetName);
  const oldSourceWidth = oldSiteOverviewMonthlySourceWidth_(
    previousOverview, oldMonthlySourceColumn, monthlySourceColumn, monthlySourceWidth
  );
  const sheet = prepareReportSheet_(spreadsheet, table.sheetName, {
    hiddenColumns: monthlySourceWidth > 0 ? [monthlySourceColumn, monthlySourceWidth] : null
  });
  // 先隱藏新來源，確認舊圖表與內容已清空後才解除舊技術欄的隱藏，讓末尾空白可正常修剪。
  if (oldSourceWidth > 0) sheet.showColumns(oldMonthlySourceColumn, oldSourceWidth);
  removeLegacySiteMonthlyProgressImages_(sheet);
  const frames = [];
  function frame(range, internal, color, style) {
    const args = [true, true, true, true, internal, internal,
      color || GCGL_REPORT_COLORS.overviewBorder, style || SpreadsheetApp.BorderStyle.SOLID];
    range.setBorder.apply(range, args);
    frames.push({range: range, args: args});
    return range;
  }
  const companyMemoText = buildPendingCompanyMemoSummary_(
    valuesByKey.memos || [],
    recordIdsByKey.memos || [], spreadsheet.getSpreadsheetTimeZone() || Session.getScriptTimeZone()
  );
  const companyMemoLines = companyMemoText.split("\n");
  const memoLines = [reportText_("備忘錄")].concat(companyMemoLines);
  const expiredWorkers = buildExpiredWorkerDirectorySummary_(spreadsheet, valuesByKey.worker_directory || []);
  if (expiredWorkers.length) memoLines.push(reportText_("人員文件到期"), ...expiredWorkers);
  let startRow = memoLines.length + 4;
  let monthlySourceRow = 1;

  ensureSheetSize_(sheet, Math.max(siteNames.length * 12 + startRow, 10),
    Math.max(companyMemoColumnCount, monthlySourceWidth > 0 ? monthlySourceColumn + monthlySourceWidth - 1 : 0));
  sheet.setColumnWidths(1, 2, 120);
  sheet.setColumnWidth(3, 220);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 450);
  sheet.setColumnWidth(summaryColumn, 330);
  sheet.getRange(1, 1, 1, summaryColumn).merge()
    .setValue(reportOverviewTitle_(spreadsheet))
    .setBackground(GCGL_REPORT_COLORS.navy)
    .setFontColor(GCGL_REPORT_COLORS.headerText)
    .setFontFamily("Arial")
    .setFontSize(16)
    .setFontWeight("bold")
    .setHorizontalAlignment("left")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);
  renderReportLanguageSelector_(sheet);

  const attendanceText = buildTodayAttendanceSummary_(spreadsheet,
    valuesByKey.attendance || [], recordIdsByKey.attendance || [], valuesByKey.worker_directory || []);
  sheet.getRange(2, 1, 1, summaryColumn).merge().setValue(attendanceText)
    .setFontFamily("Arial").setFontSize(11).setFontColor(GCGL_REPORT_COLORS.text)
    .setWrap(true).setHorizontalAlignment("left").setVerticalAlignment("middle");
  const attendanceLines = attendanceText.split("\n").reduce(function(total, line) {
    return total + Math.max(1, Math.ceil(line.length / 100));
  }, 0);
  sheet.setRowHeight(2, Math.max(28, attendanceLines * 18 + 8));

  const companyMemoRange = sheet.getRange(3, 1, memoLines.length, companyMemoColumnCount);
  companyMemoRange
    .setBackground("#FFF7F7")
    .setFontColor(GCGL_REPORT_COLORS.text)
    .setFontFamily("Arial")
    .setFontSize(11)
    .setFontWeight("normal")
    .setWrap(true)
    .setHorizontalAlignment("left")
    .setVerticalAlignment("top");
  frame(companyMemoRange, false, GCGL_REPORT_COLORS.red, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  memoLines.forEach(function(line, index) {
    sheet.getRange(index + 3, 1, 1, companyMemoColumnCount).merge().setValue(line);
    if (expiredWorkers.length && index >= memoLines.length - expiredWorkers.length - 1) {
      sheet.getRange(index + 3, 1).setFontColor("#D93025");
    }
    const visibleLineCount = line.split("\n").reduce(function(count, part) {
      return count + Math.max(1, Math.ceil(part.length / 100));
    }, 0);
    sheet.setRowHeight(index + 3, index === 0 ? 28 : Math.max(24, visibleLineCount * 18 + 6));
  });
  sheet.getRange(3, 1).setFontWeight("bold");

  siteNames.forEach(function(siteName) {
    const overviewRow = (valuesByKey.site_overview || []).find(function(row) {
      return sameReportText_(row[siteIndex], siteName);
    }) || [];
    const vendorTotals = buildSiteVendorWorkTotals_(siteName, valuesByKey.work_logs || []);
    const totalWork = vendorTotals.reduce(function(total, vendor) { return total + vendor.people; }, 0);
    const materialRows = valuesByKey.material_summary || [];
    const hasMaterials = materialRows.some(function(row) { return sameReportText_(row[0], siteName); });
    const costReportExists = materialSummaryTable && spreadsheet.getSheetByName(materialSummaryTable.sheetName);
    const pendingSiteItems = buildPendingSiteMemoLines_(
      valuesByKey.memos || [],
      recordIdsByKey.memos || [],
      siteName, spreadsheet.getSpreadsheetTimeZone() || Session.getScriptTimeZone()
    );
    const recordText = buildTodaySiteSummary_(spreadsheet, siteName, valuesByKey, pendingSiteItems);
    const renderedLineCount = recordText.split("\n").reduce(function(count, line) {
      return count + Math.max(1, Math.ceil(line.length / 35));
    }, 0);
    const metricLabels = [
      "承攬總價", "追加金額", "合計總價", "已計價", "計價進度", "施工進度", "總出工數"
    ];
    const metricRows = metricLabels.map(function(label, index) {
      return [reportText_(label), index === 6 ? totalWork : (overviewRow[index + 1] === undefined ? "" : overviewRow[index + 1])];
    });
    metricRows.push([reportText_("材料成本"), 0], [reportText_("未填單價品項"), 0]);
    const resourceRows = vendorTotals.map(function(vendor) {
      return [vendor.name + " " + reportText_("累計出工數"), vendor.people];
    });
    // E 欄圖表高 250px；F:G 合併寬 450px，今日記錄按內容延長。
    const blockRows = Math.max(10, metricRows.length, resourceRows.length,
      Math.ceil(renderedLineCount * 17 / 28) + 1);
    ensureSheetSize_(sheet, startRow + blockRows + 2,
      Math.max(summaryColumn + summaryColumnCount - 1, monthlySourceColumn + monthlySourceWidth - 1));
    sheet.setRowHeight(startRow, 30);
    sheet.setRowHeights(startRow + 1, blockRows, 28);
    sheet.getRange(startRow, 1, 1, 4).merge()
      .setValue(siteName)
      .setBackground(GCGL_REPORT_COLORS.titleFill)
      .setFontColor(GCGL_REPORT_COLORS.text)
      .setFontFamily("Arial")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("left")
      .setVerticalAlignment("middle");
    sheet.getRange(startRow, 5)
      .setValue(reportText_("月份進度"))
      .setBackground(GCGL_REPORT_COLORS.titleFill)
      .setFontColor(GCGL_REPORT_COLORS.text)
      .setFontFamily("Arial")
      .setFontSize(11)
      .setFontWeight("bold");
    sheet.getRange(startRow, summaryColumn, 1, summaryColumnCount).merge()
      .setValue(reportText_("今日工程記錄"))
      .setBackground(GCGL_REPORT_COLORS.titleFill)
      .setFontColor(GCGL_REPORT_COLORS.text)
      .setFontFamily("Arial")
      .setFontSize(11)
      .setFontWeight("bold");

    const metricRange = sheet.getRange(startRow + 1, 1, metricRows.length, 2)
      .setValues(metricRows)
      .setFontColor(GCGL_REPORT_COLORS.text)
      .setFontFamily("Arial")
      .setFontSize(10)
      .setVerticalAlignment("middle");
    frame(metricRange, true);
    sheet.getRange(startRow + 1, 1, metricRows.length, 1).setFontWeight("bold");
    sheet.getRange(startRow + 1, 2, metricRows.length, 1).setHorizontalAlignment("right");
    sheet.getRange(startRow + 1, 2, 4, 1).setNumberFormat("#,##0");
    sheet.getRange(startRow + 5, 2, 2, 1).setNumberFormat("0%");
    sheet.getRange(startRow + 7, 2).setNumberFormat("#,##0.########");

    if (resourceRows.length > 0) {
      const resourceRange = sheet.getRange(startRow + 1, 3, resourceRows.length, 2)
        .setValues(resourceRows)
        .setFontColor(GCGL_REPORT_COLORS.text)
        .setFontFamily("Arial")
        .setFontSize(10)
        .setVerticalAlignment("middle");
      frame(resourceRange, true);
      sheet.getRange(startRow + 1, 3, resourceRows.length, 1).setFontWeight("bold").setWrap(true);
      sheet.getRange(startRow + 1, 4, resourceRows.length, 1)
        .setHorizontalAlignment("right").setNumberFormat("#,##0.########");
    }
    const costCell = sheet.getRange(startRow + 8, 2).setNumberFormat("#,##0.##");
    const missingPriceCell = sheet.getRange(startRow + 9, 2).setNumberFormat("#,##0")
      .setFontColor(GCGL_REPORT_COLORS.red);
    sheet.getRange(startRow + 9, 1).setFontColor(GCGL_REPORT_COLORS.red);
    if (hasMaterials && costReportExists) {
      const costFormulas = siteMaterialCostFormulas_(siteName, materialSummaryTable, materialRows.length, spreadsheet);
      costCell.setFormula(costFormulas.total);
      missingPriceCell.setFormula(costFormulas.missingCount);
    } else {
      // 舊版資料尚無單價報表時，保留未填單價的品項數供使用者辨識。
      const unpricedItemCount = materialRows.filter(function(row) {
        return sameReportText_(row[0], siteName) && Number(row[3]) !== 0;
      }).length;
      if (hasMaterials) sheet.getRange(startRow + 8, 1).setNote(reportText_("尚未建立單價表"));
      costCell.setValue(0);
      missingPriceCell.setValue(unpricedItemCount);
    }

    for (let index = 0; index < Math.max(metricRows.length, resourceRows.length); index++) {
      if (index % 2 === 1) sheet.getRange(startRow + index + 1, 1, 1, 4)
        .setBackground(GCGL_REPORT_COLORS.secondRow);
    }
    const chartArea = sheet.getRange(startRow + 1, 5, blockRows, 1)
      .setBackground(GCGL_REPORT_COLORS.firstRow);
    frame(chartArea, false);
    const chartResult = insertSiteMonthlyProgressChart_(
      sheet, monthlyTable, valuesByKey.monthly_progress || [], siteName,
      startRow + 1, monthlySourceRow, monthlySourceColumn
    );
    monthlySourceRow = chartResult.nextSourceRow;
    if (!chartResult.hasChart) {
      chartArea.merge()
        .setValue(reportText_("尚無月份進度資料"))
        .setFontFamily("Arial").setFontSize(10)
        .setFontColor(GCGL_REPORT_COLORS.text)
        .setHorizontalAlignment("center").setVerticalAlignment("middle");
    }
    const recordRange = sheet.getRange(startRow + 1, summaryColumn, blockRows, summaryColumnCount).merge()
      .setValue(recordText)
      .setBackground(GCGL_REPORT_COLORS.firstRow)
      .setFontColor(GCGL_REPORT_COLORS.text)
      .setFontFamily("Arial")
      .setFontSize(10)
      .setWrap(true)
      .setHorizontalAlignment("left")
      .setVerticalAlignment("top");
    frame(recordRange, false);
    startRow += blockRows + 3;
  });
  clearUnusedReportBorders_(sheet, frames.map(function(item) { return item.range; }));
  // 清理空白間隔可能觸及相鄰外框；最後補畫目前區塊，保留紅框及合併格樣式。
  frames.forEach(function(item) { item.range.setBorder.apply(item.range, item.args); });
  const lastFrameRow = frames.reduce(function(last, item) {
    return Math.max(last, item.range.getRow() + item.range.getNumRows() - 1);
  }, 1);
  finishGeneratedReportGrid_(sheet, Math.max(lastFrameRow, monthlySourceRow - 1),
    Math.max(companyMemoColumnCount, monthlySourceWidth > 0 ? monthlySourceColumn + monthlySourceWidth - 1 : 0));
}

function oldSiteOverviewMonthlySourceWidth_(sheet, oldStart, newStart, expectedWidth) {
  if (!sheet || sheet.getMaxColumns() < oldStart || !sheet.isColumnHiddenByUser(oldStart)) return 0;
  const widthFromCharts = sheet.getCharts().reduce(function(width, chart) {
    if (chart.getContainerInfo().getAnchorColumn() !== 5) return width;
    const ranges = chart.getRanges();
    if (ranges.length !== 1 || ranges[0].getSheet().getSheetId() !== sheet.getSheetId() ||
        ranges[0].getColumn() !== oldStart || ranges[0].getNumColumns() < 3) return width;
    const header = sheet.getRange(ranges[0].getRow(), oldStart, 1, 3).getDisplayValues()[0].map(reportCanonicalText_);
    return arraysEqual_(header, ["月份", "施工進度", "計價進度"]) ? Math.max(width, ranges[0].getNumColumns()) : width;
  }, 0);
  if (widthFromCharts > 0) return widthFromCharts;

  // 舊版即使沒有月份資料，也會隱藏完整保留區。只有確認還沒搬到 H 且舊範圍全空白才釋放。
  if (expectedWidth <= 0 || sheet.getMaxColumns() < oldStart + expectedWidth - 1 ||
      sheet.isColumnHiddenByUser(newStart) || sheet.getLastRow() < 1) return 0;
  const title = optionalString_(sheet.getRange(1, 1).getValue()).split("　")[0];
  if (reportCanonicalText_(title) !== "案場總覽") return 0;
  for (let column = oldStart; column < oldStart + expectedWidth; column++) {
    if (!sheet.isColumnHiddenByUser(column)) return 0;
  }
  const rowCount = sheet.getMaxRows();
  if (rowCount * expectedWidth > 50000) return 0;
  const reserved = sheet.getRange(1, oldStart, rowCount, expectedWidth);
  return reserved.isBlank() && !reserved.getMergedRanges().length &&
    !reserved.getNotes().some(function(row) { return row.some(Boolean); }) &&
    !reserved.getDataValidations().some(function(row) { return row.some(Boolean); }) ? expectedWidth : 0;
}

/** 工程記錄已在 App 以 displayGroupID 去除逐樓層重複；此處只加總每筆原始顯示人數。 */
function buildSiteVendorWorkTotals_(siteName, workRows) {
  const totals = new Map();
  workRows.forEach(function(row) {
    if (!sameReportText_(row[1], siteName)) return;
    const vendorName = optionalString_(row[4]) || reportText_("未指定廠商");
    const people = Number(row[6]);
    totals.set(vendorName, (totals.get(vendorName) || 0) + (Number.isFinite(people) ? people : 0));
  });
  return Array.from(totals, function(entry) { return { name: entry[0], people: entry[1] }; })
    .sort(function(left, right) { return left.name.localeCompare(right.name, "zh-Hant", { numeric: true }); });
}

/** 使用公式連到材料統計，先加總已填單價的成本，另外計算未填單價的品項數。 */
function siteMaterialCostFormulas_(siteName, table, sourceRowCount, spreadsheet) {
  const reference = quoteSheetNameForFormula_(table.sheetName);
  const lastRow = Math.max(sourceRowCount + 3, 4);
  // A 欄合併後只有首列留有文字；逐列案場副本用於加總，不受顯示或篩選影響。
  const sourceSheet = spreadsheet && spreadsheet.getSheetByName(table.sheetName);
  const hasSiteCopy = !spreadsheet || (sourceSheet &&
    sourceSheet.getRange(3, table.headers.length + 5).getValue() === GCGL_CONFIG.materialSiteNameHeader);
  const siteColumn = hasSiteCopy ? reportColumnLetter_(table.headers.length + 5) : "A";
  const siteRange = reference + "!$" + siteColumn + "$4:$" + siteColumn + "$" + lastRow;
  const quantityRange = reference + "!$D$4:$D$" + lastRow;
  const priceColumn = reportColumnLetter_(table.headers.length + 1);
  const subtotalColumn = reportColumnLetter_(table.headers.length + 2);
  const priceRange = reference + "!$" + priceColumn + "$4:$" + priceColumn + "$" + lastRow;
  const subtotalRange = reference + "!$" + subtotalColumn + "$4:$" + subtotalColumn + "$" + lastRow;
  // SUMIFS/COUNTIFS 的文字條件會解讀 *、? 與 ~；先逸出，避免案場名稱被當成萬用字元。
  const criterion = '"' + String(siteName).replace(/~/g, "~~").replace(/\*/g, "~*").replace(/\?/g, "~?").replace(/"/g, '""') + '"';
  return {
    total: "=SUMIFS(" + subtotalRange + "," + siteRange + "," + criterion + ")",
    missingCount: "=COUNTIFS(" + siteRange + "," + criterion + "," + quantityRange + ',"<>0",' + priceRange + ',"")'
  };
}

/** 當日出勤依原始記錄分組；跨案場不重複加班，備註保留換行。 */
function buildTodayAttendanceSummary_(spreadsheet, attendanceRows, attendanceRecordIds, directoryRows) {
  const timezone = spreadsheet.getSpreadsheetTimeZone() || Session.getScriptTimeZone();
  const today = Utilities.formatDate(new Date(), timezone, "yyyy-MM-dd");
  const table = loadTableSchemas_().find(function(item) { return item.key === "attendance"; });
  const headers = table ? table.headers : [];
  const workerColumn = headers.indexOf(GCGL_CONFIG.attendanceWorkersHeader);
  const workerNameIndex = attendanceWorkerNameIndex_(directoryRows, workerColumn < 0 ? [] : attendanceRows.map(function(row) { return row[workerColumn]; }));
  const groups = [], byId = Object.create(null), names = [];
  attendanceRows.forEach(function(row, index) {
    const id = optionalString_(attendanceRecordIds[index]);
    const raw = row[workerColumn < 0 ? 5 : workerColumn];
    if (attendanceDateKeys_(row[0], raw, timezone).indexOf(today) === -1) return;
    const key = attendanceRecordGroupId_(id) || "row-" + index;
    let group = byId[key];
    if (!group) {
      group = {sites: [], notes: [], overtime: 0, company: false};
      byId[key] = group;
      groups.push(group);
    }
    const company = /:company$/.test(id), unassigned = /:unassigned$/.test(id);
    const site = optionalString_(row[1]);
    if (company) group.company = true;
    if (site && !company && !unassigned) { names.push(site); group.sites.push(site); }
    const fields = legacyAttendanceReportFields_(row[4], raw, headers[4], workerNameIndex);
    if (fields.notes) group.notes.push(fields.notes);
    const hours = Number(row[3]);
    if (Number.isFinite(hours) && hours > group.overtime) group.overtime = hours;
  });
  const sites = uniqueStrings_(names);
  const lines = [reportText_("出勤") + "：" + (sites.length ? sites.join("、") : reportText_("無案場出勤"))];
  groups.forEach(function(group) {
    if (!group.notes.length && group.overtime <= 0) return;
    if (groups.length > 1) lines.push(
      uniqueStrings_(group.sites).join("、") || reportText_(group.company ? "公司" : "無案場出勤"));
    const notes = uniqueStrings_(group.notes).join("\n");
    if (notes) lines.push(reportText_("備註") + "：" + notes);
    if (group.overtime > 0) lines.push(reportText_("加班") + "：" + group.overtime + " " + reportText_("小時"));
  });
  return lines.join("\n");
}


/** 無法唯一辨識的舊日／月日期保留原文，不以今日日期或試算表地區猜測。 */
function pendingMemoDateText_(value, timezone) {
  const keys = attendanceDateKeys_(value, "", timezone || Session.getScriptTimeZone());
  return keys.length === 1 ? keys[0].replace(/-/g, "/") : optionalString_(value).trim();
}

function datedPendingMemoItems_(row, timezone, addBullet) {
  const date = pendingMemoDateText_(row[0], timezone);
  return pendingMemoContent_(row).split(/\n(?=○ )/).map(function(item) {
    const text = item.trim();
    if (!text) return "";
    const content = addBullet ? "○ " + text.replace(/^○\s*/, "") : text;
    return (date ? date + "\n" : "") + content;
  }).filter(Boolean);
}

function buildPendingCompanyMemoSummary_(memoRows, memoRecordIds, timezone) {
  const contents = [];
  memoRows.forEach(function(row, index) {
    const recordId = optionalString_(memoRecordIds[index]);
    if (recordId.indexOf("memo-company:") !== 0) return;
    Array.prototype.push.apply(contents, datedPendingMemoItems_(row, timezone, false));
  });
  return contents.length > 0 ? contents.join("\n") : reportText_("無未完成項目");
}

/** 案場未完成事項只顯示於對應案場的今日工程記錄，保留項目原有的換行。 */
function buildPendingSiteMemoLines_(memoRows, memoRecordIds, siteName, timezone) {
  const itemsByDate = new Map();
  memoRows.forEach(function(row, index) {
    if (optionalString_(memoRecordIds[index]).indexOf("memo-company:") === 0) return;
    if (!sameReportText_(row[1], siteName)) return;

    const items = pendingMemoContent_(row).split(/\n(?=○ )/).map(function(item) {
      const text = item.trim();
      return text ? "○ " + text.replace(/^○\s*/, "") : "";
    }).filter(Boolean);
    if (!items.length) return;

    const date = pendingMemoDateText_(row[0], timezone);
    if (!itemsByDate.has(date)) itemsByDate.set(date, []);
    itemsByDate.get(date).push(...items);
  });
  const lines = [];
  itemsByDate.forEach(function(items, date) {
    if (date) lines.push(date);
    lines.push(...items);
  });
  return lines;
}

function pendingMemoContent_(row) {
  // 新版 App 明確提供未完成內容；空字串表示這筆的所有項目都已完成。
  // 舊版四欄資料以原有「○ ... ✓」格式相容。
  return row.length > 4
    ? optionalString_(row[4])
    : optionalString_(row[3]).split(/\n(?=○ )/).filter(function(item) {
        return !/ ✓\s*$/.test(item);
      }).join("\n").trim();
}

function buildTodaySiteSummary_(spreadsheet, siteName, valuesByKey, pendingSiteItems) {
  const timezone = spreadsheet.getSpreadsheetTimeZone() || Session.getScriptTimeZone();
  const todayKey = Utilities.formatDate(new Date(), timezone, "yyyy-MM-dd");
  function todayRows(key) {
    return (valuesByKey[key] || []).map(function(row, index) { return {row: row, index: index}; }).filter(function(item) {
      return sameReportText_(item.row[1], siteName) && reportDateKeys_(item.row[0], timezone).indexOf(todayKey) !== -1;
    });
  }
  const memos = todayRows("memos"), workLogs = todayRows("work_logs"), materialOrders = todayRows("material_orders");
  const parts = [];
  function addPart(lines) {
    parts.push(lines.join("\n"));
  }
  if (memos.length > 0) {
    addPart([reportText_("備忘錄") + "："].concat(memos.map(function(item) {
      return optionalString_(item.row[3]) || reportText_("（無內容）");
    })));
  }
  const recordsByVendor = {};
  const vendorOrder = [];
  workLogs.forEach(function(item) {
    const vendor = optionalString_(item.row[4]) || reportText_("未指定");
    if (!recordsByVendor[vendor]) {
      recordsByVendor[vendor] = [];
      vendorOrder.push(vendor);
    }
    recordsByVendor[vendor].push(item);
  });
  vendorOrder.forEach(function(vendor) {
    const lines = [
      reportText_("施工廠商") + "：" + vendor
    ];
    recordsByVendor[vendor].forEach(function(item, itemIndex) {
      const row = item.row;
      lines.push(
        (itemIndex + 1) + ". " + (optionalString_(row[2]) || reportText_("未填施工項目")),
        "↳ " + reportText_("樓層") + "：" + (optionalString_(row[3]) || reportText_("未填")),
        "↳ " + reportText_("人數") + "：" + (optionalString_(row[6]) || "0") + " " + reportText_("人")
      );
      const equipment = optionalString_(row[7]);
      const notes = optionalString_(row[8]);
      if (equipment) lines.push("↳ " + reportText_("機具") + "：" + equipment);
      if (notes) lines.push("↳ " + reportText_("備註") + "：" + notes);
    });
    addPart(lines);
  });
  if (materialOrders.length > 0) {
    addPart([reportText_("材料訂購") + "："].concat(materialOrders.map(function(entry) {
      const row = entry.row;
      const item = optionalString_(row[3]) || reportText_("未填品項");
      const quantity = optionalString_(row[4]) || "0";
      const status = reportStatus_(optionalString_(row[5]));
      return item + " × " + quantity + (status ? "（" + status + "）" : "");
    })));
  }
  if (pendingSiteItems && pendingSiteItems.length > 0) {
    addPart([reportText_("未完成項目") + "："].concat(pendingSiteItems));
  }
  return parts.length > 0
    ? parts.join("\n\n")
    : reportText_("今日尚無工程記錄、備忘錄或材料訂購");
}

function reportOverviewTitle_(spreadsheet) {
  const timezone = spreadsheet.getSpreadsheetTimeZone() || Session.getScriptTimeZone();
  const now = new Date();
  const dateKey = Utilities.formatDate(now, timezone, "yyyy-MM-dd");
  const parts = dateKey.split("-").map(Number);
  const weekdayIndex = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])).getUTCDay();
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const lastSyncAt = lastSuccessfulDataSyncAt_();
  const syncText = lastSyncAt
    ? Utilities.formatDate(lastSyncAt, timezone, "yyyy/MM/dd HH:mm:ss")
    : reportText_("尚無記錄");
  return reportText_("案場總覽") + "　" + dateKey.replace(/-/g, "/") + " " + reportText_(weekdays[weekdayIndex]) +
    "　" + reportText_("同步資料時間") + "：" + syncText;
}

function recordSuccessfulDataSync_() {
  PropertiesService.getScriptProperties().setProperty(
    GCGL_CONFIG.lastDataSyncAtProperty,
    new Date().toISOString()
  );
}

function lastSuccessfulDataSyncAt_() {
  const value = PropertiesService
    .getScriptProperties()
    .getProperty(GCGL_CONFIG.lastDataSyncAtProperty);
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

function reportDateKeys_(value, timezone) {
  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
    return [Utilities.formatDate(value, timezone, "yyyy-MM-dd")];
  }
  const text = optionalString_(value);
  let match = text.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (match) return [reportDateKey_(match[1], match[2], match[3])];
  match = text.match(/(\d{1,2})\D+(\d{1,2})\D+(\d{4})/);
  if (match) {
    return uniqueStrings_([
      reportDateKey_(match[3], match[1], match[2]),
      reportDateKey_(match[3], match[2], match[1])
    ]);
  }
  return [];
}

function reportDateKey_(year, month, day) {
  return String(year).padStart(4, "0") + "-" +
    String(month).padStart(2, "0") + "-" +
    String(day).padStart(2, "0");
}

/** 優先採用人員同步的原始日期；舊文字有兩種有效日／月解讀時不猜測。 */
function attendanceDateKeys_(value, raw, timezone) {
  let payload;
  try { payload = JSON.parse(optionalString_(raw)); } catch (_) { /* 舊出勤沒有結構化資料。 */ }
  const valid = function(key) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
    const date = new Date(key + "T12:00:00Z");
    return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === key;
  };
  if (payload && typeof payload.date === "string" && valid(payload.date)) return [payload.date];
  return uniqueStrings_(reportDateKeys_(value, timezone).filter(valid));
}

function attendanceReportDateValue_(value, raw, timezone) {
  const keys = attendanceDateKeys_(value, raw, timezone);
  if (keys.length !== 1) return value;
  return Utilities.parseDate(keys[0], timezone, "yyyy-MM-dd");
}

/** 舊版進度 PNG 使用此固定標記；不依位置或大小猜測，避免誤刪使用者圖片。 */
function removeLegacySiteMonthlyProgressImages_(sheet) {
  sheet.getImages().forEach(function(image) {
    if (image.getAltTextTitle() === "GCGL_SITE_MONTHLY_PROGRESS") image.remove();
  });
}

/** 以總覽右側的隱藏輔助欄作為圖表資料，資料列隨同步重建而更新。 */
function insertSiteMonthlyProgressChart_(sheet, table, values, siteName, chartRow, sourceRow, sourceColumn) {
  if (!table) return { hasChart: false, nextSourceRow: sourceRow };
  const siteIndex = reportSiteColumnIndex_(table.key);
  const headers = withoutArrayIndex_(table.headers, siteIndex);
  const rows = values
    .filter(function(row) { return sameReportText_(row[siteIndex], siteName); })
    .map(function(row) { return withoutArrayIndex_(row, siteIndex); });
  if (rows.length === 0 || headers.length < 3) {
    return { hasChart: false, nextSourceRow: sourceRow };
  }

  const source = [headers.map(reportHeader_)].concat(rows);
  ensureSheetSize_(sheet, sourceRow + source.length - 1, sourceColumn + headers.length - 1);
  sheet.getRange(sourceRow, sourceColumn, source.length, headers.length).setValues(source);
  sheet.getRange(sourceRow + 1, sourceColumn + 1, rows.length, 2).setNumberFormat("0%");
  const builder = sheet.newChart();
  builder.setChartType(Charts.ChartType.LINE);
  builder.addRange(sheet.getRange(sourceRow, sourceColumn, source.length, headers.length));
  builder.setNumHeaders(1);
  builder.setHiddenDimensionStrategy(Charts.ChartHiddenDimensionStrategy.SHOW_BOTH);
  builder.setPosition(chartRow, 5, 5, 5);
  builder.setOption("width", 430);
  builder.setOption("height", 250);
  builder.setOption("legend", { position: "top" });
  builder.setOption("colors", [GCGL_REPORT_COLORS.blue, GCGL_REPORT_COLORS.red]);
  builder.setOption("lineWidth", 3);
  builder.setOption("pointSize", 4);
  builder.setOption("vAxis", { minValue: 0, maxValue: 1, format: "0%", gridlines: { count: 3 } });
  builder.setOption("hAxis", { slantedText: false });
  sheet.insertChart(builder.build());
  return { hasChart: true, nextSourceRow: sourceRow + source.length + 2 };
}

function renderAttendanceReport_(spreadsheet, table, values, recordIds, directoryRows) {
  const timezone = spreadsheet.getSpreadsheetTimeZone() || Session.getScriptTimeZone();
  const workerColumn = table.headers.indexOf(GCGL_CONFIG.attendanceWorkersHeader);
  const workerPayloads = values.map(function(row) { return workerColumn < 0 ? "" : row[workerColumn]; });
  const workerNameIndex = attendanceWorkerNameIndex_(directoryRows, workerPayloads);
  if (workerColumn !== -1) {
    table = reportTableWithoutColumn_(table, workerColumn);
    values = values.map(function(row) { return withoutArrayIndex_(row, workerColumn); });
  }
  if (table.headers.length === 5) {
    // 只轉換閱讀版面，不改舊 App 的同步格式、隱藏原文或工資來源。
    const labels = {"Note": "Site Worker", "Notes": "Site Worker", "備考": "作業員", "비고": "시공 작업자", "备注": "施工人员"};
    const noteHeader = table.headers[4];
    table = {key: table.key, sheetName: table.sheetName,
      headers: table.headers.concat([labels[noteHeader] || "施工人員"]),
      widths: (table.widths || []).concat([300]), formats: (table.formats || []).concat(["@"])};
    values = values.map(function(row, index) {
      const fields = legacyAttendanceReportFields_(row[4], workerPayloads[index], noteHeader, workerNameIndex);
      return row.slice(0, 4).concat([fields.notes, fields.workers]);
    });
  }
  // 相容舊 App 傳來的「上班」：未指定案場的可見狀態留空，不改原始出勤或人員 JSON。
  values = values.map(function(row, index) {
    const copy = row.slice();
    copy[0] = attendanceReportDateValue_(row[0], workerPayloads[index], timezone);
    if (!optionalString_(copy[1]).trim()) copy[2] = "";
    return copy;
  });
  const sheet = prepareReportSheet_(spreadsheet, table.sheetName);
  const bodyRows = values.length > 0 ? reportDisplayRows_(table, values) : [table.headers.map(function() { return ""; })];
  const formats = (table.formats || []).slice();
  formats[0] = "yyyy/MM/dd ddd";
  writeReportTableBlock_(
    sheet,
    1,
    1,
    table.headers,
    bodyRows,
    table.widths || [],
    formats
  );
  mergeAttendanceDateCells_(sheet, values);
  mergeAttendanceOvertimeCells_(sheet, values, recordIds || []);
  mergeAttendanceNotesCells_(sheet, values, recordIds || []);
  mergeAttendanceNotesCells_(sheet, values, recordIds || [], 6);
  sheet.setColumnWidth(5, 180);
  sheet.setColumnWidth(6, 300);
  sheet.getRange(2, 4, bodyRows.length, 1).setHorizontalAlignment("center");
  // 日期／加班欄合併完成後再畫框線，避免合併動作留下不完整的表格邊框。
  const tableRange = sheet.getRange(1, 1, bodyRows.length + 1, table.headers.length);
  tableRange.setBorder(true, true, true, true, true, true,
    GCGL_REPORT_COLORS.border, SpreadsheetApp.BorderStyle.SOLID);
  tableRange.getMergedRanges().forEach(function(range) {
    range.setBorder(true, true, true, true, false, false,
      GCGL_REPORT_COLORS.border, SpreadsheetApp.BorderStyle.SOLID);
  });
  fitReportRowHeights_(sheet, 1, bodyRows.length + 1, 1, table.headers.length);
  sheet.setFrozenRows(1);
  finishGeneratedReportGrid_(sheet, bodyRows.length + 1, Math.max(6, table.headers.length));
}

/** 僅建立顯示用名冊，不由姓名產生 ID、工數或工資資料。 */
function attendanceWorkerNameIndex_(directoryRows, rawPayloads) {
  const namesByPrefix = new Map();
  function add(vendor, name) {
    if (typeof vendor !== "string" || !vendor.trim() || /[\r\n]/.test(vendor) ||
        typeof name !== "string" || !name.trim() || /[\r\n]/.test(name)) return;
    const prefix = vendor + "：";
    if (!namesByPrefix.has(prefix)) namesByPrefix.set(prefix, new Set());
    namesByPrefix.get(prefix).add(name);
  }
  (directoryRows || []).forEach(function(row) { add(row[0], row[1]); });
  (rawPayloads || []).forEach(function(raw) {
    const payload = legacyAttendanceWorkerPayload_(raw);
    if (payload) payload.workers.forEach(function(worker) { add(worker.vendorName, worker.workerName); });
  });
  return Array.from(namesByPrefix, function(entry) { return {prefix: entry[0], names: Array.from(entry[1])}; });
}

function legacyAttendanceWorkerPayload_(raw) {
  let payload;
  try { payload = JSON.parse(optionalString_(raw)); } catch (_) { return null; }
  return payload && ["days", "hours"].indexOf(payload.unit) !== -1 && Array.isArray(payload.workers) &&
    payload.workers.every(function(worker) {
      return worker && typeof worker.vendorId === "string" && worker.vendorId &&
        typeof worker.workerId === "string" && worker.workerId &&
        typeof worker.vendorName === "string" && typeof worker.workerName === "string" &&
        typeof worker.quantity === "number" && Number.isFinite(worker.quantity) && worker.quantity > 0;
    }) ? payload : null;
}

/** 整行必須是已知廠商與人員的「姓名×正數+單位」，且只有一種拆法。 */
function matchesKnownAttendanceWorkerLine_(line, group) {
  if (!line.startsWith(group.prefix)) return false;
  const paths = new Map([[group.prefix.length, 1]]);
  let completed = 0;
  // 動態規劃不使用姓名分隔正規式，保留姓名內的「、」「：」「×」等字元。
  for (let start = group.prefix.length; start < line.length; start++) {
    const count = paths.get(start) || 0;
    if (!count) continue;
    group.names.forEach(function(name) {
      const prefix = name + "×";
      if (!line.startsWith(prefix, start)) return;
      const quantityAndUnit = line.slice(start + prefix.length).match(/^((?:0|[1-9]\d*)(?:\.\d+)?)(天|小時|小时|日|時間|일|시간| days?| hours?)(?=、|$)/);
      if (!quantityAndUnit || !Number.isFinite(Number(quantityAndUnit[1])) || Number(quantityAndUnit[1]) <= 0) return;
      const end = start + prefix.length + quantityAndUnit[0].length;
      if (end === line.length) completed = Math.min(2, completed + count);
      else paths.set(end + 1, Math.min(2, (paths.get(end + 1) || 0) + count));
    });
  }
  return completed === 1;
}

function splitKnownAttendanceWorkerSuffix_(notes, workerNameIndex) {
  let end = notes.length;
  const lines = [], used = new Set();
  while (end > 0) {
    const start = notes.lastIndexOf("\n", end - 1) + 1, line = notes.slice(start, end);
    const matches = (workerNameIndex || []).filter(function(group) { return matchesKnownAttendanceWorkerLine_(line, group); });
    if (matches.length !== 1 || used.has(matches[0].prefix)) break;
    used.add(matches[0].prefix);
    lines.unshift(line);
    end = start === 0 ? 0 : start - 1;
  }
  return {notes: notes.slice(0, end), workers: lines.join("\n")};
}

/** 優先核對同筆結構化資料；僅缺資料時，才以已知名冊核對完整尾段。 */
function legacyAttendanceReportFields_(notes, raw, noteHeader, workerNameIndex) {
  notes = notes == null ? "" : String(notes);
  const unchanged = {notes: notes, workers: ""};
  const payload = legacyAttendanceWorkerPayload_(raw);
  if (!payload) return optionalString_(raw).trim() ? unchanged : splitKnownAttendanceWorkerSuffix_(notes, workerNameIndex);
  const units = {"Note": [" day", " days", " hour", " hours"], "Notes": [" day", " days", " hour", " hours"],
    "備考": ["日", "日", "時間", "時間"], "비고": ["일", "일", "시간", "시간"],
    "备注": ["天", "天", "小时", "小时"]}[noteHeader] || ["天", "天", "小時", "小時"];
  const groups = [], byVendor = Object.create(null);
  payload.workers.forEach(function(worker) {
    let group = byVendor[worker.vendorId];
    if (!group) {
      group = {prefix: worker.vendorName + "：", tokens: []};
      byVendor[worker.vendorId] = group;
      groups.push(group);
    }
    const plain = String(worker.quantity);
    const fixed = !/[eE]/.test(plain) && (plain.split(".")[1] || "").length <= 12
      ? plain : worker.quantity.toFixed(12);
    const quantity = fixed.indexOf(".") < 0 ? fixed : fixed.replace(/\.?0+$/, "");
    const unitIndex = (payload.unit === "hours" ? 2 : 0) + (worker.quantity === 1 ? 0 : 1);
    group.tokens.push(worker.workerName + "×" + quantity + units[unitIndex]);
  });
  // 各案場的舊備註可能只含部分人員；只移除與同筆資料吻合、順序相符的結尾行。
  let end = notes.length, lastGroup = groups.length - 1;
  while (end > 0 && lastGroup >= 0) {
    const start = notes.lastIndexOf("\n", end - 1) + 1;
    const line = notes.slice(start, end);
    let matched = -1;
    for (let index = lastGroup; index >= 0; index--) {
      if (matchesLegacyAttendanceWorkerLine_(line, groups[index])) { matched = index; break; }
    }
    if (matched < 0) break;
    end = start === 0 ? 0 : start - 1;
    lastGroup = matched - 1;
  }
  return {notes: notes.slice(0, end), workers: groups.map(function(group) {
    return group.prefix + group.tokens.join("、");
  }).join("\n")};
}

/** 不解析任意姓名或廠商文字；只比對原始人員清單中的完整字串（含標點與數量）。 */
function matchesLegacyAttendanceWorkerLine_(line, group) {
  if (!line.startsWith(group.prefix)) return false;
  const positions = new Set([group.prefix.length]);
  for (let index = 0; index < group.tokens.length; index++) {
    const token = group.tokens[index], starts = Array.from(positions);
    for (let offset = 0; offset < starts.length; offset++) {
      if (!line.startsWith(token, starts[offset])) continue;
      const end = starts[offset] + token.length;
      if (end === line.length) return true;
      if (line[end] === "、") positions.add(end + 1);
    }
  }
  return false;
}

function mergeAttendanceDateCells_(sheet, values) {
  let groupStartIndex = 0;
  for (let index = 1; index <= values.length; index += 1) {
    const isSameDate = index < values.length &&
      sameReportText_(values[index][0], values[groupStartIndex][0]);
    if (isSameDate) continue;

    const groupSize = index - groupStartIndex;
    const range = sheet.getRange(groupStartIndex + 2, 1, groupSize, 1);
    if (groupSize > 1) {
      range.merge().setVerticalAlignment("middle");
    }
    range.setHorizontalAlignment("left");
    if (values.slice(groupStartIndex, index).some(function(row) {
      return Number.isFinite(Number(row[3])) && Number(row[3]) > 0;
    })) range.setBackground(GCGL_REPORT_COLORS.lightRed3);
    groupStartIndex = index;
  }
}

/** 同一筆出勤可包含多個案場；加班時數只在該筆出勤群組顯示一次。 */
function mergeAttendanceOvertimeCells_(sheet, values, recordIds) {
  let groupStartIndex = 0;
  for (let index = 1; index <= values.length; index += 1) {
    const groupId = attendanceRecordGroupId_(recordIds[groupStartIndex]);
    const isSameRecord = index < values.length &&
      groupId !== "" &&
      groupId === attendanceRecordGroupId_(recordIds[index]);
    if (isSameRecord) continue;

    const groupSize = index - groupStartIndex;
    if (groupId !== "" && groupSize > 1) {
      sheet.getRange(groupStartIndex + 2, 4, groupSize, 1)
        .merge()
        .setVerticalAlignment("middle")
        .setHorizontalAlignment("center");
    }
    groupStartIndex = index;
  }
}

/** 同一筆出勤的備註／人員文字各自合併一次；不同內容完整保留，不猜測解析備註。 */
function mergeAttendanceNotesCells_(sheet, values, recordIds, column) {
  column = column || 5;
  let start = 0;
  for (let index = 1; index <= values.length; index++) {
    const group = attendanceRecordGroupId_(recordIds[start]);
    const sameGroup = index < values.length && group &&
      attendanceRecordGroupId_(recordIds[index]) === group &&
      sameReportText_(values[start][0], values[index][0]);
    if (sameGroup) continue;
    if (group && index - start > 1) {
      const notes = uniqueStrings_(values.slice(start, index).map(function(row) {
        return optionalString_(row[column - 1]);
      }).filter(Boolean)).join("\n");
      sheet.getRange(start + 2, column, index - start, 1).merge().setValue(notes)
        .setWrap(true).setHorizontalAlignment("left").setVerticalAlignment("middle");
    }
    start = index;
  }
}

function attendanceRecordGroupId_(recordId) {
  const match = optionalString_(recordId).match(/^attendance:([^:]+):/i);
  return match ? match[1] : "";
}

// MARK: - 施工人員月出勤與工資

function validWorkerWageKey_(key) {
  try {
    const parts = JSON.parse(key);
    return Array.isArray(parts) && parts.length === 4 &&
      parts.slice(0, 2).every(function(part) { return typeof part === "string" && part !== ""; }) &&
      ["days", "hours"].indexOf(parts[2]) !== -1 && /^\d{4}-\d{2}$/.test(parts[3]) &&
      Number(parts[3].slice(5)) >= 1 && Number(parts[3].slice(5)) <= 12;
  } catch (_) { return false; }
}

/** 用原始日期及 ID，而非地區化日期／姓名。跨案場的同一出勤只讀一次。 */
function workerAttendanceMonths_(table, values, recordIds) {
  const column = table.headers.indexOf(GCGL_CONFIG.attendanceWorkersHeader);
  if (column === -1) return [];
  const seen = Object.create(null), months = Object.create(null);
  values.forEach(function(row, index) {
    const raw = optionalString_(row[column]);
    if (!raw) return;
    const recordId = attendanceRecordGroupId_(recordIds[index]);
    if (!recordId) throw new Error("施工人員出勤缺少穩定識別碼，已停止重建。");
    if (seen[recordId]) {
      if (seen[recordId] !== raw) throw new Error("同一筆出勤的施工人員內容不一致，已停止重建。");
      return;
    }
    seen[recordId] = raw;
    let payload;
    try { payload = JSON.parse(raw); } catch (_) { throw new Error("施工人員同步資料不是有效 JSON。"); }
    const date = payload && payload.date;
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        new Date(date + "T00:00:00Z").toISOString().slice(0, 10) !== date ||
        Number(date.slice(0, 4)) < 1900 || Number(date.slice(0, 4)) > 2200 ||
        ["days", "hours"].indexOf(payload.unit) === -1 || !Array.isArray(payload.workers)) {
      throw new Error("施工人員日期或單位格式不正確，已停止重建。");
    }
    const month = date.slice(0, 7);
    payload.workers.forEach(function(worker) {
      if (!worker || typeof worker.vendorId !== "string" || !worker.vendorId ||
          typeof worker.workerId !== "string" || !worker.workerId ||
          typeof worker.quantity !== "number" || !Number.isFinite(worker.quantity) || worker.quantity <= 0) {
        throw new Error("施工人員識別或數量不正確，已停止重建。");
      }
      if (!months[month]) months[month] = {month: month, columns: Object.create(null)};
      const key = JSON.stringify([worker.vendorId, worker.workerId, payload.unit, month]);
      const columns = months[month].columns;
      if (!columns[key]) columns[key] = {key: key, vendorName: optionalString_(worker.vendorName),
        workerName: optionalString_(worker.workerName), unit: payload.unit, days: Object.create(null)};
      columns[key].days[date] = (columns[key].days[date] || 0) + worker.quantity;
    });
  });
  return Object.keys(months).sort().map(function(month) {
    const model = months[month];
    model.columns = Object.keys(model.columns).map(function(key) { return model.columns[key]; })
      .sort(function(a, b) {
        return a.vendorName.localeCompare(b.vendorName) || a.workerName.localeCompare(b.workerName) ||
          a.unit.localeCompare(b.unit) || a.key.localeCompare(b.key);
      });
    return model;
  });
}

// A:F 單價（F 保留舊橫排相容），G:I 每月工資，J:L 人員手填資料。
const GCGL_MEMORY_BLOCKS = Object.freeze({
  materials: {column: 1, headers: GCGL_CONFIG.materialPricesHeaders, legacy: GCGL_CONFIG.materialPricesSheetName, label: "案場材料單價"},
  wages: {column: 7, headers: GCGL_CONFIG.workerWagesHeaders, legacy: GCGL_CONFIG.workerWagesSheetName, label: "工資保存資料"},
  workers: {column: 10, headers: GCGL_CONFIG.workerDetailsHeaders, legacy: GCGL_CONFIG.workerDetailsSheetName, label: "施工人員記憶資料表"}
});
const GCGL_MEMORY_WIDTH = 12;
let gcglMemoryReadCache = null;

function gcglMemoryRegistryKey_(spreadsheet) {
  return GCGL_CONFIG.memoryRegistryPrefix + spreadsheet.getId();
}

function gcglMemoryRefreshKey_(spreadsheet) {
  return GCGL_CONFIG.memoryRefreshPrefix + spreadsheet.getId();
}

function gcglMemoryRegistry_(spreadsheet) {
  const value = PropertiesService.getScriptProperties().getProperty(gcglMemoryRegistryKey_(spreadsheet));
  if (!value) return null;
  let state;
  try { state = JSON.parse(value); } catch (_) { /* 由下方回報保留舊資料。 */ }
  if (!state || !Number.isInteger(state.id) || state.id < 0 || typeof state.ready !== "boolean") {
    throw new Error("GCGL 記憶資料分頁登記不正確，已保留所有資料。");
  }
  return state;
}

function ownedGCGLMemorySheet_(sheet) {
  if (sheet.getName() !== GCGL_CONFIG.memorySheetName) return false;
  const state = gcglMemoryRegistry_(sheet.getParent());
  return Boolean(state && state.id === sheet.getSheetId());
}

function registeredGCGLMemorySheet_(spreadsheet, state) {
  const sheet = spreadsheet.getSheetByName(GCGL_CONFIG.memorySheetName);
  if (state && (!sheet || sheet.getSheetId() !== state.id)) {
    throw new Error("找不到原本的 GCGL 記憶資料分頁，請先還原該分頁；既有備份未覆寫。");
  }
  return state ? sheet : null;
}

function validateGCGLMemoryBlock_(kind, matrix) {
  const block = GCGL_MEMORY_BLOCKS[kind];
  if (!arraysEqual_(matrix[0], block.headers)) {
    throw new Error(block.label + "格式不正確，已保留原資料。");
  }
  // 不同區塊的列數可不同；只略過同一區塊尾端的空白。
  let end = matrix.length;
  while (end > 1 && matrix[end - 1].every(function(value) { return value === ""; })) end--;
  const rows = matrix.slice(1, end), seen = new Set();
  rows.forEach(function(row) {
    const valid = kind === "materials" ? validMaterialPriceKey_(row[0]) && materialPriceInputValue_(row[4]) !== undefined
      : kind === "wages" ? validWorkerWageKey_(row[0]) && materialPriceInputValue_(row[1]) !== undefined &&
        ["inherited", "explicit"].indexOf(row[2]) !== -1
      : validWorkerDirectoryKey_(row[0]) && typeof row[1] === "string" && typeof row[2] === "string";
    if (!valid || seen.has(row[0])) throw new Error(block.label + "包含無效或重複識別，已保留原資料。");
    seen.add(row[0]);
  });
  return rows;
}

function gcglMemoryRowsFromSheet_(sheet, kind, column) {
  const last = sheet.getLastRow();
  return validateGCGLMemoryBlock_(kind, sheet.getRange(1, column, Math.max(1, last),
    GCGL_MEMORY_BLOCKS[kind].headers.length).getValues());
}

function readLegacyGCGLMemoryRows_(spreadsheet, kind) {
  const sheet = spreadsheet.getSheetByName(GCGL_MEMORY_BLOCKS[kind].legacy);
  return sheet && sheet.getLastRow() ? gcglMemoryRowsFromSheet_(sheet, kind, 1) : [];
}

function memoryCacheFor_(spreadsheet) {
  return gcglMemoryReadCache && gcglMemoryReadCache.spreadsheet === spreadsheet ? gcglMemoryReadCache : null;
}

function readGCGLMemoryRows_(spreadsheet, kind, sheetForWrite) {
  const cache = memoryCacheFor_(spreadsheet);
  if (!sheetForWrite && cache && cache.rows[kind]) return cache.rows[kind].map(function(row) { return row.slice(); });
  const state = !sheetForWrite && gcglMemoryRegistry_(spreadsheet);
  const sheet = sheetForWrite || (state && state.ready ? registeredGCGLMemorySheet_(spreadsheet, state) : null);
  const rows = sheet ? gcglMemoryRowsFromSheet_(sheet, kind, GCGL_MEMORY_BLOCKS[kind].column)
    : readLegacyGCGLMemoryRows_(spreadsheet, kind);
  if (cache) cache.rows[kind] = rows.map(function(row) { return row.slice(); });
  return rows;
}

/** 只在重建會讀多區時整批取一次。特別長的表改成按區讀，以免配置過大的矩陣。 */
function primeGCGLMemoryCache_(spreadsheet, sheet, kinds) {
  const cache = memoryCacheFor_(spreadsheet);
  if (!cache || !sheet || kinds.length < 2) return;
  const last = sheet.getLastRow();
  if (last < 1 || last > 10000) return;
  const first = Math.min.apply(null, kinds.map(function(kind) { return GCGL_MEMORY_BLOCKS[kind].column; }));
  const end = Math.max.apply(null, kinds.map(function(kind) {
    const block = GCGL_MEMORY_BLOCKS[kind];
    return block.column + block.headers.length;
  }));
  const matrix = sheet.getRange(1, first, last, end - first).getValues();
  kinds.forEach(function(kind) {
    const block = GCGL_MEMORY_BLOCKS[kind], offset = block.column - first;
    cache.rows[kind] = validateGCGLMemoryBlock_(kind, matrix.map(function(row) {
      return row.slice(offset, offset + block.headers.length);
    }));
  });
}

/** 持短鎖呼叫。先核對三份舊表，完整複製並驗證後才切換，不修改舊表。 */
function ensureGCGLMemoryForWrite_(spreadsheet) {
  const properties = PropertiesService.getScriptProperties(), registryKey = gcglMemoryRegistryKey_(spreadsheet);
  const state = gcglMemoryRegistry_(spreadsheet);
  let sheet = registeredGCGLMemorySheet_(spreadsheet, state);
  if (state && state.ready) return sheet;
  if (!sheet && spreadsheet.getSheetByName(GCGL_CONFIG.memorySheetName)) {
    throw new Error("「" + GCGL_CONFIG.memorySheetName + "」已存在且不是本程式建立，已保留原資料。");
  }
  const kinds = Object.keys(GCGL_MEMORY_BLOCKS), sources = {};
  kinds.forEach(function(kind) { sources[kind] = readLegacyGCGLMemoryRows_(spreadsheet, kind); });
  const oldPrices = spreadsheet.getSheetByName(GCGL_CONFIG.materialPricesSheetName);
  const catalogLinks = oldPrices && oldPrices.getMaxColumns() >= 6 && oldPrices.getRange(1, 6).getValue() === "__catalog_live_price";
  const last = Math.max.apply(null, kinds.map(function(kind) { return sources[kind].length + 1; }));
  const matrix = Array.from({length: last}, function() { return Array(GCGL_MEMORY_WIDTH).fill(""); });
  kinds.forEach(function(kind) {
    const block = GCGL_MEMORY_BLOCKS[kind];
    [block.headers].concat(sources[kind]).forEach(function(row, index) {
      row.forEach(function(value, column) { matrix[index][block.column - 1 + column] = materialCatalogCellText_(value); });
    });
  });
  if (catalogLinks && sources.materials.length) {
    matrix[0][5] = "__catalog_live_price";
    oldPrices.getRange(2, 6, sources.materials.length, 1).getFormulas().forEach(function(row, index) {
      matrix[index + 1][5] = row[0];
    });
  }
  if (!sheet) {
    sheet = spreadsheet.insertSheet(GCGL_CONFIG.memorySheetName);
    properties.setProperty(registryKey, JSON.stringify({id: sheet.getSheetId(), ready: false}));
  }
  hideInternalSheet_(spreadsheet, sheet, spreadsheet.getActiveSheet());
  protectGCGLSheet_(sheet, []);
  ensureSheetSize_(sheet, last, GCGL_MEMORY_WIDTH);
  // 舊公式仍指向原表；等材料相關報表重建成功後才清除遷移旗標。
  if (oldPrices && oldPrices.getLastRow() > 0) properties.setProperty(gcglMemoryRefreshKey_(spreadsheet), "1");
  if (last > 1) sheet.getRange(2, GCGL_MEMORY_BLOCKS.workers.column, last - 1, 3).setNumberFormat("@");
  if (sheet.getLastRow() > last) {
    // 未完成的移轉舊尾不參與驗證；原始三分頁一律不改。
    sheet.getRange(last + 1, 1, sheet.getLastRow() - last, GCGL_MEMORY_WIDTH).clearContent();
  }
  sheet.getRange(1, 1, last, GCGL_MEMORY_WIDTH).setValues(matrix);
  SpreadsheetApp.flush();
  const written = sheet.getRange(1, 1, last, GCGL_MEMORY_WIDTH).getValues();
  kinds.forEach(function(kind) {
    const block = GCGL_MEMORY_BLOCKS[kind];
    const copied = validateGCGLMemoryBlock_(kind, written.map(function(row) {
      return row.slice(block.column - 1, block.column - 1 + block.headers.length);
    }));
    const original = sources[kind];
    if (copied.length !== original.length || !copied.every(function(row, index) { return arraysEqual_(row, original[index]); })) {
      throw new Error(block.label + "移轉驗證未通過，舊分頁未變更。");
    }
  });
  properties.setProperty(registryKey, JSON.stringify({id: sheet.getSheetId(), ready: true}));
  const cache = memoryCacheFor_(spreadsheet);
  if (cache) cache.rows = Object.create(null);
  return sheet;
}

function migrateExistingGCGLMemory_(spreadsheet) {
  const state = gcglMemoryRegistry_(spreadsheet);
  if (state && state.ready) return registeredGCGLMemorySheet_(spreadsheet, state);
  if (!state && !Object.keys(GCGL_MEMORY_BLOCKS).some(function(kind) {
    return spreadsheet.getSheetByName(GCGL_MEMORY_BLOCKS[kind].legacy);
  })) return null;
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try { return ensureGCGLMemoryForWrite_(spreadsheet); }
  finally { lock.releaseLock(); }
}

/** 在手動編輯先觸發移轉時，安排相關報表改用新資料分頁。 */
function queueGCGLMemoryFormulaRefresh_(spreadsheet) {
  const properties = PropertiesService.getScriptProperties(), key = gcglMemoryRefreshKey_(spreadsheet);
  if (properties.getProperty(key) !== "1" || loadPendingReportKeys_().indexOf("material_catalog") !== -1) return;
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    if (properties.getProperty(key) === "1" && loadPendingReportKeys_().indexOf("material_catalog") === -1) {
      markReportsPending_(["material_catalog"], false);
    }
  } finally { lock.releaseLock(); }
}

/** 寫入範圍只涵蓋變動列，讀取快取隨成功寫入更新。 */
function writeGCGLMemoryRows_(spreadsheet, sheet, kind, rows, changed) {
  if (!changed.length) return;
  const block = GCGL_MEMORY_BLOCKS[kind], width = block.headers.length, cache = memoryCacheFor_(spreadsheet);
  if (cache) delete cache.rows[kind];
  ensureSheetSize_(sheet, rows.length + 1, GCGL_MEMORY_WIDTH);
  const indexes = uniqueNumbers_(changed).sort(function(a, b) { return a - b; });
  let cursor = 0;
  while (cursor < indexes.length) {
    let end = cursor + 1;
    while (end < indexes.length && indexes[end] === indexes[end - 1] + 1) end++;
    const start = indexes[cursor], range = sheet.getRange(start + 2, block.column, end - cursor, width);
    if (kind === "workers") range.setNumberFormat("@");
    range.setValues(rows.slice(start, start + end - cursor).map(function(row) { return row.map(materialCatalogCellText_); }));
    cursor = end;
  }
  // 持鎖完成寫入，再讓下一個編輯事件讀取該區塊。
  SpreadsheetApp.flush();
  if (cache) cache.rows[kind] = rows.map(function(row) { return row.slice(); });
}

function readWorkerWageRows_(spreadsheet) {
  return readGCGLMemoryRows_(spreadsheet, "wages");
}

/** 已有月份的實際工資為快照，不反向套用新月份；只為新月份尋找前一份工資。 */
function resolveWorkerWages_(months, savedRows) {
  const rows = savedRows.map(function(row) { return row.slice(); });
  const byKey = Object.create(null);
  rows.forEach(function(row) { byKey[row[0]] = row; });
  const entries = [];
  months.forEach(function(model) {
    model.columns.forEach(function(column) {
      let saved = byKey[column.key];
      if (saved && !(saved[1] === "" && saved[2] === "inherited")) {
        column.rate = saved[1];
        return;
      }
      const identity = JSON.parse(column.key).slice(0, 3);
      const previous = rows.filter(function(row) {
        const parts = JSON.parse(row[0]);
        return parts[3] < model.month && arraysEqual_(parts.slice(0, 3), identity) &&
          !(row[1] === "" && row[2] === "inherited");
      }).sort(function(a, b) { return JSON.parse(b[0])[3].localeCompare(JSON.parse(a[0])[3]); })[0];
      column.rate = previous ? previous[1] : "";
      if (!saved) {
        saved = [column.key, column.rate, "inherited"];
        byKey[column.key] = saved;
        rows.push(saved);
      } else saved[1] = column.rate;
      entries.push(saved.slice());
    });
  });
  return entries;
}

/** 保存只按穩定識別碼更新，不按表格列號；同步刪除出勤不會刪除歷史工資。 */
function saveWorkerWageEntries_(spreadsheet, entries, defaultsOnly) {
  if (!entries.length) return;
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const sheet = ensureGCGLMemoryForWrite_(spreadsheet);
    const rows = readGCGLMemoryRows_(spreadsheet, "wages", sheet), indexes = Object.create(null);
    rows.forEach(function(row, index) { indexes[row[0]] = index; });
    const changed = [];
    entries.forEach(function(entry) {
      if (!validWorkerWageKey_(entry[0]) || materialPriceInputValue_(entry[1]) === undefined) {
        throw new Error("請輸入非負數工資，或清空表示尚未填寫。");
      }
      let index = indexes[entry[0]];
      if (defaultsOnly && index !== undefined && !(rows[index][1] === "" && rows[index][2] === "inherited")) return;
      if (index === undefined) {
        index = rows.length;
        indexes[entry[0]] = index;
        rows.push(entry.slice());
      } else if (arraysEqual_(rows[index], entry)) return;
      else rows[index] = entry.slice();
      changed.push(index);
    });
    writeGCGLMemoryRows_(spreadsheet, sheet, "wages", rows, changed);
  } finally { lock.releaseLock(); }
}

/** 月份分頁以實際 sheet ID 登記，不使用名稱前綴取得使用者自訂分頁的管理權。 */
function workerMonthRegistry_(spreadsheet) {
  const raw = PropertiesService.getScriptProperties().getProperty(
    GCGL_CONFIG.workerMonthSheetsPropertyPrefix + spreadsheet.getId());
  if (!raw) return {};
  let registry;
  try { registry = JSON.parse(raw); } catch (_) { throw new Error("施工人員月份分頁設定損壞，已保留原資料。"); }
  if (!registry || Array.isArray(registry) || typeof registry !== "object" ||
      !Object.keys(registry).every(function(month) {
        return /^\d{4}-(0[1-9]|1[0-2])$/.test(month) && Number.isInteger(registry[month]) && registry[month] >= 0;
      }) || new Set(Object.keys(registry).map(function(month) { return registry[month]; })).size !== Object.keys(registry).length) {
    throw new Error("施工人員月份分頁設定不正確，已保留原資料。");
  }
  return registry;
}

function saveWorkerMonthRegistry_(spreadsheet, registry) {
  PropertiesService.getScriptProperties().setProperty(
    GCGL_CONFIG.workerMonthSheetsPropertyPrefix + spreadsheet.getId(), JSON.stringify(registry));
}

function workerMonthSheets_(spreadsheet, includeHidden) {
  const registry = workerMonthRegistry_(spreadsheet), sheets = spreadsheet.getSheets();
  return Object.keys(registry).sort().map(function(month) {
    return {month: month, sheet: sheets.find(function(sheet) { return sheet.getSheetId() === registry[month]; })};
  }).filter(function(item) { return item.sheet && (includeHidden || !item.sheet.isSheetHidden()); });
}

function workerMonthForSheet_(sheet) {
  if (!sheet) return "";
  const registry = workerMonthRegistry_(sheet.getParent());
  return Object.keys(registry).find(function(month) { return registry[month] === sheet.getSheetId(); }) || "";
}

function isWorkerAttendanceSheet_(sheet) {
  return !!sheet && !isWorkerDirectorySheet_(sheet) &&
    (!isArchivedLegacyWorkerAttendance_(sheet) &&
      (sheet.getName() === GCGL_CONFIG.workerAttendanceSheetName || !!workerMonthForSheet_(sheet)));
}

function legacyWorkerAttendanceArchiveKey_(spreadsheet) {
  return GCGL_CONFIG.workerLegacyArchivePropertyPrefix + spreadsheet.getId();
}

function isArchivedLegacyWorkerAttendance_(sheet) {
  return sheet.getName() === GCGL_CONFIG.workerAttendanceSheetName && String(sheet.getSheetId()) ===
    PropertiesService.getScriptProperties().getProperty(legacyWorkerAttendanceArchiveKey_(sheet.getParent()));
}

// MARK: - 跨案場施工廠商及人員；E/F 欄另外記憶，不回寫 App。

function validWorkerDirectoryKey_(key) {
  const uuid = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
  return new RegExp("^worker-directory:(company|" + uuid + "):" + uuid + "$", "i").test(optionalString_(key));
}

function validWorkerDirectoryRecordKey_(key) {
  return validWorkerDirectoryKey_(key) || /^worker-directory:(company|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}):owner$/i.test(optionalString_(key));
}

function workerDirectoryOwnerID_(key) {
  return optionalString_(key).split(":")[1] || "";
}

function workerDirectoryOwnerInfo_(row) {
  if (row.length < 7 || !row[6]) return {};
  let info;
  try { info = JSON.parse(row[6]); } catch (_) { throw new Error("廠商資料格式不正確，請從 App 重新同步。"); }
  if (!info || typeof info !== "object" || Array.isArray(info) ||
      ["contactPerson", "phone", "taxID", "address", "notes"].some(function(key) {
        return info[key] !== undefined && typeof info[key] !== "string";
      })) throw new Error("廠商資料格式不正確，請從 App 重新同步。");
  return info;
}

function workerDirectoryDescription_(row, key) {
  const info = workerDirectoryOwnerInfo_(row);
  const fields = workerDirectoryOwnerID_(key) === "company"
    ? [["電話", "phone"], ["統編", "taxID"], ["地址", "address"], ["備註", "notes"]]
    : [["負責人", "contactPerson"], ["電話", "phone"], ["統編", "taxID"], ["地址", "address"]];
  return fields.map(function(field) {
    return reportText_(field[0]) + "：" + optionalString_(info[field[1]]);
  }).join("\n");
}

function isWorkerDirectorySheet_(sheet) {
  return !!sheet && String(sheet.getSheetId()) ===
    PropertiesService.getScriptProperties().getProperty(GCGL_CONFIG.workerDirectorySheetIdProperty);
}

function workerDirectorySheet_(spreadsheet) {
  const id = PropertiesService.getScriptProperties().getProperty(GCGL_CONFIG.workerDirectorySheetIdProperty);
  return id ? spreadsheet.getSheets().find(function(sheet) { return String(sheet.getSheetId()) === id; }) || null : null;
}

/** 表頭從第 1 列開始；仍辨識舊版第 3／4 列，移轉時先保存原輸入。 */
function workerDirectoryLayout_(sheet) {
  if (!isWorkerDirectorySheet_(sheet)) return null;
  for (const headerRow of [1, 3, 4]) {
    if (sheet.getMaxRows() < headerRow) continue;
    for (const keyColumn of [10, 9]) {
      if (sheet.getMaxColumns() >= keyColumn &&
          sheet.getRange(headerRow, keyColumn).getValue() === GCGL_CONFIG.workerDirectoryKeyHeader) {
        return {headerRow: headerRow, firstDataRow: headerRow + 1, keyColumn: keyColumn,
          identityColumn: keyColumn - 5, visibleColumns: keyColumn - 1};
      }
    }
  }
  return null;
}

function readWorkerDirectoryDetails_(spreadsheet) {
  return readGCGLMemoryRows_(spreadsheet, "workers");
}

function captureWorkerDirectoryDetails_(spreadsheet) {
  const sheet = workerDirectorySheet_(spreadsheet);
  const layout = workerDirectoryLayout_(sheet);
  if (!layout || sheet.getLastRow() < layout.firstDataRow) return;
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const state = gcglMemoryRegistry_(spreadsheet);
    const memory = state && state.ready ? registeredGCGLMemorySheet_(spreadsheet, state) : null;
    const rows = readGCGLMemoryRows_(spreadsheet, "workers", memory);
    const byId = Object.create(null);
    rows.forEach(function(row, index) { byId[row[0]] = index; });
    const changed = [];
    sheet.getRange(layout.firstDataRow, 1, sheet.getLastRow() - layout.firstDataRow + 1, layout.keyColumn).getDisplayValues().forEach(function(row) {
      const key = row[layout.keyColumn - 1];
      if (!validWorkerDirectoryKey_(key)) return;
      const identity = optionalString_(row[layout.identityColumn - 1]) === "未提供" ? "" : rememberedInputValue_(optionalString_(row[layout.identityColumn - 1]), "請填入資料");
      const address = optionalString_(row[layout.identityColumn]) === "未提供" ? "" : rememberedInputValue_(optionalString_(row[layout.identityColumn]), "請填入資料");
      const existing = byId[key] === undefined ? null : rows[byId[key]];
      if (existing && existing[1] === identity && existing[2] === address) return;
      if (!existing && !identity && !address) return;
      const entry = [key, identity, address];
      if (existing) rows[byId[key]] = entry;
      else { byId[key] = rows.length; rows.push(entry); }
      changed.push(byId[key]);
    });
    if (!changed.length) return;
    writeGCGLMemoryRows_(spreadsheet, memory || ensureGCGLMemoryForWrite_(spreadsheet), "workers", rows, changed);
  } finally { lock.releaseLock(); }
}

function handleWorkerDirectoryEdit_(event) {
  const sheet = event.range.getSheet();
  if (!isWorkerDirectorySheet_(sheet)) return false;
  const layout = workerDirectoryLayout_(sheet);
  if (layout && event.range.getRow() + event.range.getNumRows() > layout.firstDataRow &&
      event.range.getColumn() < layout.identityColumn + 2 &&
      event.range.getColumn() + event.range.getNumColumns() > layout.identityColumn) {
    captureWorkerDirectoryDetails_(sheet.getParent());
    restoreEditedInputPrompt_(event.range, layout.firstDataRow, layout.identityColumn, 2, layout.keyColumn, validWorkerDirectoryKey_, "請填入資料");
  }
  if (layout && event.range.getColumn() <= layout.visibleColumns) {
    const lastDataRow = sheet.getLastRow();
    let firstRow = Math.max(layout.firstDataRow, event.range.getRow());
    let lastRow = Math.min(lastDataRow, event.range.getRow() + event.range.getNumRows() - 1);
    if (firstRow <= lastRow) {
      // 廠商名稱及說明一起合併；包含整組才能同時滿足說明與各人員的內容高度。
      sheet.getRange(firstRow, 1, lastRow - firstRow + 1, layout.keyColumn === 10 ? 2 : 1).getMergedRanges().forEach(function(merged) {
        const endRow = merged.getRow() + merged.getNumRows() - 1;
        if (merged.getRow() >= layout.firstDataRow && endRow <= lastDataRow) {
          firstRow = Math.min(firstRow, merged.getRow());
          lastRow = Math.max(lastRow, endRow);
        }
      });
      fitReportRowHeights_(sheet, firstRow, lastRow - firstRow + 1, 1, layout.visibleColumns, false, false);
    }
  }
  return true;
}

function workerDirectoryInputRanges_(sheet) {
  const layout = workerDirectoryLayout_(sheet);
  if (!layout || sheet.getLastRow() < layout.firstDataRow) return [];
  const keys = sheet.getRange(layout.firstDataRow, layout.keyColumn, sheet.getLastRow() - layout.firstDataRow + 1, 1).getValues();
  const ranges = [];
  let start = -1;
  for (let index = 0; index <= keys.length; index++) {
    if (index < keys.length && validWorkerDirectoryKey_(keys[index][0])) {
      if (start === -1) start = index;
    } else if (start !== -1) {
      ranges.push(sheet.getRange(layout.firstDataRow + start, layout.identityColumn, index - start, 2));
      start = -1;
    }
  }
  return ranges;
}

function workerDirectoryLiteral_(value) {
  return typeof value === "string" && value.startsWith("=") ? "'" + value : value;
}

function workerDirectoryDate_(value, timezone) {
  const keys = attendanceDateKeys_(value, "", timezone);
  return keys.length === 1 ? {key: keys[0], date: Utilities.parseDate(keys[0], timezone, "yyyy-MM-dd")} : null;
}

function buildExpiredWorkerDirectorySummary_(spreadsheet, values) {
  const timezone = spreadsheet.getSpreadsheetTimeZone() || Session.getScriptTimeZone();
  const today = Utilities.formatDate(new Date(), timezone, "yyyy-MM-dd");
  const labels = ["職安卡", "體檢", "勞保"], result = [];
  values.forEach(function(row) {
    for (let index = 0; index < 3; index++) {
      const date = workerDirectoryDate_(row[index + 3], timezone);
      if (date && date.key <= today) result.push(
        (optionalString_(row[0]) || reportText_("未提供")) + "：" + (optionalString_(row[1]) || reportText_("未提供")) +
        " — " + reportText_(labels[index]) + " " + date.key.replace(/-/g, "/") + " " + reportText_("到期"));
    }
  });
  return result;
}

function renderWorkerDirectoryReport_(spreadsheet, table, values, recordIds, tables, valuesByKey, idsByKey) {
  let sheet = workerDirectorySheet_(spreadsheet);
  const named = spreadsheet.getSheetByName(GCGL_CONFIG.workerDirectorySheetName);
  if (named && (!sheet || named.getSheetId() !== sheet.getSheetId())) {
    throw new Error("「施工廠商及人員」已存在且尚未登記為 GCGL 名冊，請先將自訂分頁更名。");
  }
  if (!sheet) {
    // 舊合併出工表仍叫施工人員；先保留工資並移轉，不接管同名的自訂名冊。
    const legacy = spreadsheet.getSheetByName(GCGL_CONFIG.workerAttendanceSheetName);
    if (legacy && (workerWageLayouts_(legacy).length ||
        legacy.getRange(3, 1).getValue() === "尚無施工人員出勤記錄")) {
      const attendance = tables.find(function(item) { return item.key === "attendance"; });
      if (!attendance) throw new Error("請先從 App 完整同步出勤，再建立施工人員名冊；既有工資已保留。");
      renderWorkerAttendanceReport_(spreadsheet, attendance, valuesByKey.attendance || [], idsByKey.attendance || []);
    }
    sheet = insertGeneratedReportSheet_(spreadsheet, GCGL_CONFIG.workerDirectorySheetName);
    PropertiesService.getScriptProperties().setProperty(GCGL_CONFIG.workerDirectorySheetIdProperty, String(sheet.getSheetId()));
  }
  // 重建及改名前依舊版 I 欄／新版 J 欄 UUID 保存未觸發 onEdit 的身分證及地址。
  captureWorkerDirectoryDetails_(spreadsheet);
  const details = Object.create(null);
  readWorkerDirectoryDetails_(spreadsheet).forEach(function(row) { details[row[0]] = row.slice(1); });
  const timezone = spreadsheet.getSpreadsheetTimeZone() || Session.getScriptTimeZone();
  const output = values.map(function(row, index) {
    const key = recordIds[index];
    if (!validWorkerDirectoryRecordKey_(key)) throw new Error("施工人員缺少穩定識別碼，已停止重建。");
    const isPerson = validWorkerDirectoryKey_(key);
    const saved = details[key] || ["", ""];
    const inputs = isPerson ? saved.map(function(value) { return rememberedInputDisplay_(value, "請填入資料"); }) : ["", ""];
    const dates = [3, 4, 5].map(function(column) {
      return isPerson ? workerDirectoryDate_(row[column], timezone)?.date || reportText_("未提供") : "";
    });
    return [row[0], workerDirectoryDescription_(row, key), row[1], row[2]].concat(inputs).map(function(value) {
      return workerDirectoryLiteral_(optionalString_(value).trim() ? value : "");
    }).concat(dates, [key]);
  });
  if (sheet.getName() !== GCGL_CONFIG.workerDirectorySheetName) sheet.setName(GCGL_CONFIG.workerDirectorySheetName);
  sheet = prepareReportSheet_(spreadsheet, sheet.getName(), {hiddenColumns: [10, 1], visibleColumns: 9});
  const headers = ["廠商名稱", "說明", "姓名", "電話", "身分證號", "地址", "職安卡到期日", "體檢到期日", "勞保到期日",
    GCGL_CONFIG.workerDirectoryKeyHeader];
  const rows = output.length ? output : [headers.map(function() { return ""; })];
  const headerRow = 1, firstDataRow = headerRow + 1;
  ensureSheetSize_(sheet, rows.length + headerRow, 10);
  sheet.getRange(headerRow, 1, rows.length + 1, 10).setNumberFormat("@");
  writeReportTableBlock_(sheet, headerRow, 1, headers, rows,
    [180, 300, 99, 99, 99, 300, 180, 180, 180, 100],
    ["@", "@", "@", "@", "@", "@", "yyyy/MM/dd", "yyyy/MM/dd", "yyyy/MM/dd", "@"]);
  if (output.length) {
    workerDirectoryInputRanges_(sheet).forEach(function(range) { range.setBackground(GCGL_REPORT_COLORS.rememberedInput); });
    const dateCell = "G" + firstDataRow;
    const missing = SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=' + dateCell + '="' + reportText_("未提供") + '"')
      .setFontColor("#D93025").setRanges([sheet.getRange(firstDataRow, 7, output.length, 3)]).build();
    const expired = SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied("=AND(ISNUMBER(" + dateCell + ")," + dateCell + "<=TODAY())")
      .setBackground(GCGL_REPORT_COLORS.lightRed3).setRanges([sheet.getRange(firstDataRow, 7, output.length, 3)]).build();
    sheet.setConditionalFormatRules([missing, expired]);
  }
  setRememberedInputPromptFormat_(sheet, firstDataRow, output.length, 2, "請填入資料", 5);
  // 同名不同 UUID 不合併；說明與名稱依同一個公司／廠商分組。
  const mergeRows = output.map(function(row) { return row.concat([workerDirectoryOwnerID_(row[9])]); });
  mergeReportLabelColumn_(sheet, mergeRows, 0, [10], firstDataRow);
  mergeReportLabelColumn_(sheet, mergeRows, 1, [10], firstDataRow);
  sheet.setFrozenRows(headerRow);
  fitReportRowHeights_(sheet, headerRow, rows.length + 1, 1, 9, false);
  protectGCGLSheet_(sheet, workerDirectoryInputRanges_(sheet));
  finishGeneratedReportGrid_(sheet, rows.length + headerRow, 10);
}

/** 隱藏的識別列跟著月份保存；薪資輸入是它的上一列。保留讀取舊合併表以移轉工資。 */
function workerWageLayouts_(sheet) {
  if (!sheet || isWorkerDirectorySheet_(sheet)) return [];
  const month = workerMonthForSheet_(sheet);
  if (!month && sheet.getName() !== GCGL_CONFIG.workerAttendanceSheetName) return [];
  const lastRow = sheet.getLastRow(), lastColumn = sheet.getLastColumn();
  if (lastRow < 2) return [];
  // 已登記的月表只有一區工資；舊式合併表才需要掃完整份內容。
  const firstRead = month ? Math.min(lastRow, 6) : lastRow;
  let values = sheet.getRange(1, 1, firstRead, lastColumn).getValues();
  if (firstRead < lastRow && !values.some(function(row) { return row[0] === GCGL_CONFIG.workerWageKeysMarker; })) {
    values = sheet.getRange(1, 1, lastRow, lastColumn).getValues();
  }
  const layouts = [];
  values.forEach(function(row, index) {
    if (row[0] !== GCGL_CONFIG.workerWageKeysMarker || index === 0) return;
    const keys = row.slice(1);
    while (keys.length && keys[keys.length - 1] === "") keys.pop();
    if (!keys.length || !keys.every(validWorkerWageKey_)) throw new Error("施工人員月份識別不正確，已保留原資料。");
    if (month && !keys.every(function(key) { return JSON.parse(key)[3] === month; })) {
      throw new Error("施工人員分頁與工資月份不一致，已保留原資料。");
    }
    // 新版：工資、姓名、識別列；舊版：姓名、工資、識別列。
    const wageRow = index >= 2 && optionalString_(reportCanonicalText_(values[index - 2][0])).replace(/\s/g, "") === "工資（日薪／時薪）"
      ? index - 1 : index;
    layouts.push({row: wageRow, keyRow: index + 1, keys: keys});
  });
  return layouts;
}

function workerWageInputRanges_(sheet) {
  return workerWageLayouts_(sheet).map(function(layout) { return sheet.getRange(layout.row, 2, 1, layout.keys.length); });
}

function captureWorkerWages_(spreadsheet) {
  const sheets = workerMonthSheets_(spreadsheet).map(function(item) { return item.sheet; });
  const legacy = spreadsheet.getSheetByName(GCGL_CONFIG.workerAttendanceSheetName);
  if (legacy && !isArchivedLegacyWorkerAttendance_(legacy) && !isWorkerDirectorySheet_(legacy) &&
      !workerMonthForSheet_(legacy)) sheets.unshift(legacy);
  const saved = Object.create(null);
  readWorkerWageRows_(spreadsheet).forEach(function(row) { saved[row[0]] = row; });
  const entries = [];
  const visible = Object.create(null);
  let legacyToArchive = null;
  sheets.forEach(function(sheet) {
    const layouts = workerWageLayouts_(sheet);
    if (legacy && sheet.getSheetId() === legacy.getSheetId() && layouts.length && !workerMonthForSheet_(sheet)) {
      legacyToArchive = sheet;
    }
    layouts.forEach(function(layout) {
      const values = sheet.getRange(layout.row, 2, 1, layout.keys.length).getValues()[0];
      values.forEach(function(value, index) {
        const price = materialPriceInputValue_(value), key = layout.keys[index];
        if (price === undefined) throw new Error("施工人員工資包含無效輸入，已停止重建。");
        visible[key] = price;
      });
    });
  });
  Object.keys(visible).forEach(function(key) {
    if (!saved[key] || saved[key][1] !== visible[key]) entries.push([key, visible[key], "explicit"]);
  });
  saveWorkerWageEntries_(spreadsheet, entries, false);
  return legacyToArchive;
}

function handleWorkerWageEdit_(event) {
  const range = event.range, sheet = range.getSheet();
  if (!isWorkerAttendanceSheet_(sheet)) return false;
  const entries = [];
  workerWageLayouts_(sheet).forEach(function(layout) {
    if (layout.row < range.getRow() || layout.row >= range.getRow() + range.getNumRows()) return;
    const start = Math.max(2, range.getColumn());
    const end = Math.min(layout.keys.length + 1, range.getColumn() + range.getNumColumns() - 1);
    if (start > end) return;
    const values = sheet.getRange(layout.row, start, 1, end - start + 1).getValues()[0];
    values.forEach(function(value, index) {
      const price = materialPriceInputValue_(value);
      if (price === undefined) throw new Error("請輸入非負數工資，或清空表示尚未填寫。");
      entries.push([layout.keys[start + index - 2], price, "explicit"]);
    });
  });
  if (entries.length) {
    saveWorkerWageEntries_(sheet.getParent(), entries, false);
    // 本月公式立即計算；尚未填工資的下個月份由延後重建補上預設。
    markReportsPending_(["attendance"], true);
  }
  return true;
}

function renderWorkerAttendanceReport_(spreadsheet, table, values, recordIds) {
  const months = workerAttendanceMonths_(table, values, recordIds || []);
  const registry = workerMonthRegistry_(spreadsheet);
  // 在清空任何報表前檢查同名自訂頁，避免覆寫使用者自行建立的內容。
  months.forEach(function(model) {
    const name = GCGL_CONFIG.workerMonthSheetPrefix + " " + model.month;
    const existing = spreadsheet.getSheetByName(name);
    if (existing && existing.getSheetId() !== registry[model.month]) {
      throw new Error("「" + name + "」已存在且不是 GCGL 建立的分頁，請先將自訂分頁更名。");
    }
  });
  const legacyToArchive = captureWorkerWages_(spreadsheet);
  saveWorkerWageEntries_(spreadsheet, resolveWorkerWages_(months, readWorkerWageRows_(spreadsheet)), true);
  months.forEach(function(model) {
    let sheet = spreadsheet.getSheets().find(function(item) { return item.getSheetId() === registry[model.month]; });
    if (!sheet) {
      sheet = insertGeneratedReportSheet_(spreadsheet, GCGL_CONFIG.workerMonthSheetPrefix + " " + model.month);
      registry[model.month] = sheet.getSheetId();
      saveWorkerMonthRegistry_(spreadsheet, registry);
    } else if (sheet.getName() === GCGL_CONFIG.workerAttendanceSheetName + " " + model.month) {
      // 舊月份頁直接更名，保留 sheet ID、月份登記與工資；使用者手動更名的頁面不動。
      sheet.setName(GCGL_CONFIG.workerMonthSheetPrefix + " " + model.month);
    }
    sheet = prepareReportSheet_(spreadsheet, sheet.getName(), {hiddenRow: 6});
    const startRow = 3, inputRanges = [];
    const label = model.month.replace("-", "/");
    const dayCount = new Date(Date.UTC(Number(model.month.slice(0, 4)), Number(model.month.slice(5)), 0)).getUTCDate();
    const headers = [reportText_("日期")].concat(model.columns.map(function(column) {
      const text = column.vendorName + "\n" + column.workerName + "/" + reportText_(column.unit === "days" ? "日薪" : "時薪");
      return text[0] === "=" ? "'" + text : text;
    }));
    const wageRow = startRow + 1, nameRow = startRow + 2;
    const keyRow = startRow + 3, firstDayRow = startRow + 4;
    const totalRow = firstDayRow + dayCount, amountRow = totalRow + 1;
    const rows = [headers,
      [GCGL_CONFIG.workerWageKeysMarker].concat(model.columns.map(function(column) { return column.key; }))];
    for (let day = 1; day <= dayCount; day++) {
      const date = model.month + "-" + String(day).padStart(2, "0");
      rows.push([Utilities.parseDate(date, spreadsheet.getSpreadsheetTimeZone(), "yyyy-MM-dd")].concat(model.columns.map(function(column) {
        return Object.prototype.hasOwnProperty.call(column.days, date) ? column.days[date] : "";
      })));
    }
    rows.push([reportText_("合計（天／小時）")].concat(model.columns.map(function() { return ""; })));
    rows.push([reportText_("當月工資")].concat(model.columns.map(function() { return ""; })));
    writeReportTableBlock_(sheet, wageRow, 1,
      ["工資\n（日薪／時薪）"].concat(model.columns.map(function(column) { return column.rate; })), rows,
      [180].concat(model.columns.map(function() { return 99; })), ["@"].concat(model.columns.map(function() { return "0.##"; })));
    sheet.getRange(nameRow, 1, 1, headers.length).setBackground(GCGL_REPORT_COLORS.navy)
      .setFontColor(GCGL_REPORT_COLORS.headerText).setFontWeight("bold")
      .setHorizontalAlignment("center").setWrap(true);
    sheet.getRange(firstDayRow, 1, dayCount, 1).setNumberFormat("yyyy/MM/dd");
    const wages = sheet.getRange(wageRow, 2, 1, model.columns.length);
    wages.setBackground(GCGL_REPORT_COLORS.rememberedInput).setFontColor(GCGL_REPORT_COLORS.text).setNumberFormat("#,##0");
    applyMaterialSummaryPriceValidation_(wages);
    inputRanges.push(wages);
    const totalFormulas = [], wageFormulas = [];
    model.columns.forEach(function(column, index) {
      const letter = reportColumnLetter_(index + 2);
      totalFormulas.push('=SUM(' + letter + firstDayRow + ':' + letter + (totalRow - 1) + ')');
      wageFormulas.push('=IF(' + letter + wageRow + '="","",ROUND(' + letter + totalRow + '*' + letter + wageRow + ',2))');
    });
    const quantityFormats = [];
    for (let day = 1; day <= dayCount + 1; day++) {
      quantityFormats.push(model.columns.map(function(column) {
        const value = day > dayCount
          ? Object.keys(column.days).reduce(function(sum, date) { return sum + column.days[date]; }, 0)
          : column.days[model.month + "-" + String(day).padStart(2, "0")] || 0;
        const unitText = reportLanguage_() === "en"
          ? " " + (column.unit === "days" ? (value === 1 ? "day" : "days") : (value === 1 ? "hour" : "hours"))
          : reportText_(column.unit === "days" ? "天" : "小時");
        return (Number.isInteger(value) ? "0" : "0.############") + '"' + unitText + '"';
      }));
    }
    sheet.getRange(firstDayRow, 2, dayCount + 1, model.columns.length).setNumberFormats(quantityFormats);
    sheet.getRange(totalRow, 2, 1, model.columns.length).setFormulas([totalFormulas]);
    sheet.getRange(amountRow, 2, 1, model.columns.length).setFormulas([wageFormulas]).setNumberFormat("#,##0");
    sheet.getRange(totalRow, 1, 2, model.columns.length + 1).setFontWeight("bold").setBackground(GCGL_REPORT_COLORS.titleFill);
    const lastColumn = reportColumnLetter_(model.columns.length + 1);
    const grandTotalFormula = '=SUM(B' + amountRow + ':' + lastColumn + amountRow + ')';
    // 同一人分日薪／時薪兩欄時，未填人數只計一次；0 元是已填工資。
    const workerWageCells = Object.create(null);
    model.columns.forEach(function(column, index) {
      const identity = JSON.stringify(JSON.parse(column.key).slice(0, 2));
      if (!workerWageCells[identity]) workerWageCells[identity] = [];
      workerWageCells[identity].push(reportColumnLetter_(index + 2) + wageRow);
    });
    const missingWorkerCounts = Object.keys(workerWageCells).map(function(identity) {
      const cells = workerWageCells[identity];
      return 'IF(COUNT(' + cells.join(',') + ')<' + cells.length + ',1,0)';
    });
    ensureSheetSize_(sheet, amountRow, Math.max(5, model.columns.length + 1));
    sheet.getRange(1, 1).setValue(label + " " + reportText_("出工")).setFontWeight("bold").setFontSize(14);
    sheet.getRange(1, 2).setValue(reportText_("當月工資合計")).setFontWeight("bold");
    sheet.getRange(1, 3).setFormula(grandTotalFormula).setNumberFormat("#,##0").setFontWeight("bold").setFontSize(14);
    sheet.getRange(1, 4).setFormula('="' + reportText_("有") + '"&SUM(' + missingWorkerCounts.join(',') + ')&"' + reportText_("位人員未填入工資") + '"')
      .setFontColor(GCGL_REPORT_COLORS.red).setWrap(false);
    sheet.setRowHeight(1, 48);
    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidths(2, model.columns.length, 99);
    sheet.getRange(1, 1, 1, 5).setFontFamily("Arial").setVerticalAlignment("middle");
    sheet.getRange(1, 1, 1, 3).setBackground(GCGL_REPORT_COLORS.titleFill);
    // 說明列完整留在未凍結區，避免 A 欄凍結邊界切進合併儲存格。
    sheet.getRange(2, 2, 1, 3).merge()
      .setFontFamily("Arial").setFontSize(11).setFontColor(GCGL_REPORT_COLORS.red).setWrap(false);
    sheet.getRange(2, 2).setValue(reportText_("黃色工資格可修改；本月工資不影響其他月份。"));
    sheet.setFrozenRows(5);
    sheet.setFrozenColumns(1);
    // 重建期間如已有工資編輯完成保存，最後重讀一次，不以過期快照覆蓋它。
    const latest = Object.create(null);
    readWorkerWageRows_(spreadsheet).forEach(function(row) { latest[row[0]] = row[1]; });
    workerWageLayouts_(sheet).forEach(function(layout) {
      sheet.getRange(layout.row, 2, 1, layout.keys.length).setValues([layout.keys.map(function(key) { return latest[key]; })]);
    });
    fitReportRowHeights_(sheet, wageRow, 2, 1, headers.length);
    // 隱藏的識別列不參與列高，日期／數量與合計以各列的可見內容計算。
    fitReportRowHeights_(sheet, firstDayRow, dayCount + 2, 1, headers.length, true, false);
    removeWorkerMonthExportButtons_(sheet);
    protectGCGLSheet_(sheet, inputRanges);
    finishGeneratedReportGrid_(sheet, amountRow, Math.max(5, model.columns.length + 1));
  });
  // 不刪除任何分頁；只隱藏已登記的非當前月份及確定完成移轉的舊合併表，日後沿用原 ID。
  if (legacyToArchive) PropertiesService.getScriptProperties().setProperty(
    legacyWorkerAttendanceArchiveKey_(spreadsheet), String(legacyToArchive.getSheetId()));
  const activeMonths = new Set(months.map(function(model) { return model.month; }));
  const inactive = workerMonthSheets_(spreadsheet).filter(function(item) {
    return !activeMonths.has(item.month);
  }).map(function(item) { return item.sheet; });
  if (legacyToArchive && !legacyToArchive.isSheetHidden()) inactive.push(legacyToArchive);
  const inactiveIDs = new Set(inactive.map(function(sheet) { return sheet.getSheetId(); }));
  const visible = spreadsheet.getSheets().find(function(sheet) {
    return !inactiveIDs.has(sheet.getSheetId()) && !sheet.isSheetHidden() && !isGCGLInternalSheet_(sheet);
  });
  if (visible) inactive.forEach(function(sheet) { hideInternalSheet_(spreadsheet, sheet, visible); });
  saveWorkerMonthRegistry_(spreadsheet, registry);
}

/** 圖片指派 Apps Script 函式，按鈕在電腦版 Sheets 可執行。 */
const GCGL_WORKER_EXPORT_BUTTONS = Object.freeze({
  pdf: "iVBORw0KGgoAAAANSUhEUgAAASAAAABICAYAAABWUygDAAAIcElEQVR42u3de1BU5xkG8OccrgIygIIoN3URoUVQEanghYiig0hUtKLTqsEYlKYWG6dYtI4Tk4KtsWicjIkpotMkYryBGJNqqFGJUTGIGqHh4m4VoRCK0GW57m7/MG4lokDYZeHw/P7aZQ8fOy+Hh/f7zmUF9JBH1CYtiGhAUmSlCD35foGhQ0TGCiOBwUNExgoigcFDRMYKIpHhQ0SG0JXsEBk+RGSsEBIZPkRkrBASGT5EZKwQEhk+RGSsEBIZPkRkrBASWRIiMhaR3Q8RGasLYgdERMbtgNj9EJExuiB2QERk/DUgIqLeJnD6RUTsgIiIAURExAAiIgYQEREDiHrE0X4w5JnJkGcmY+vLkSwIMYCIaGAzZQl6Jnd/Ilyc7Aw2vlqjgWzhZhaa2AFR3/TWb5ZAnpmMvIM9D6qIYF/dVM3P05XFJXZA/cGxnK+xJyMHR1PiUNfQiFf/9BGKFJXtttm6OhIew4fgzOXbOPr5dd3X5075KeIXh+JCfjH2Hf8CSlWzJGqSuGIu1kXP6LTDa2lVo76hERXf1SGvUIGjOddRJK/scPvYqBBsXf3sNSytVovWNjVUzS2orlWi+F4VLuZ/ixPnb6CppfW576WzsTvjuWgz2tQa/jGwAzKO0AAv2FoPgqerE07ujMe8kHHtXp812Qdhgd6I/8Efpa/MBX6erli7aAZa29QDqmYmoohBFmYY5mCL8V5uePnFqfgkdT22ro6EIHT/czMFQYC5mSnsbKwwxs0JEcG+SP7VIlza/zuEBXpzJ2UASdfB05cxb8PbKCuvhqW5GVJ/uxRT/T0BAO7ODnB3dgAA3Llb0e77Jvl4AAAK5RVobmnjTikIiI0KwR9i5+ltzKF2Nnh/8wr8MuJn3FE5BZOukvtVWPL793A0JQ6jRgxF1HR/XCooQdQ0f902N0vu6x5bmpth4lh3AMBXt8okW5fUw58j9aNzHYaNpYUZ7G2tMMHLHRuWzYLM1REAsDJyCjLOXcM/Ff/ucMwPP7uCpHdOPtUBmZqIsLUeBJmrIyKCfRETHghLczMIgoBta+ajrLwauQWlz32/HY1NDKB+oaZOiXUpHyB+cSiS3jkBQRCwZFaA7vWkVRFIWhXx1PetWTANaxZMa/e1nLwixG4/KNlaabRaqJpaoGpqQXnVQ1y+VYYzu9fDyX4wTEQR0S8E4I/pn3R5vMdrQDV1StTUKXH1m7v425krOLB1FdyG2cNEFPHG2gUI/3XqgJvucgomYW7ODji161UkrpgLczNTFCkqsf6tw2hTazB9whh4OA9hkboY3gdO5eqeT/EbrZeuNHZ7um56O2rEUCwMncBiswOSjgBvd5iIIsbJXBDsNxorth1AnbIRgiBg4y/CddtlnM1D4t5juudhgd7465aVAIDQtTshr6gZ8LV8coo6zMFWL2MW36tC+ukvEbdwOgBg6exJOHIujzsuOyBpOHXxJg6fvQYA8B/jhkPbXoKFuSkWzBiPcTIXFqgbtE/coaq1VX/TpIyz/w+ciWPdYWNlwWKzA5IGtVqDTXuPQ6PRYPmcIIwYaocAbw+8HhfVbrulsydh6exJHY5xft/Gds/LyqsxM34XunOkR56Z3Ol2sfNDEDs/pM/WcvJPRuoel1fX6m3csvJqVNbUw3mILQRBgP8Y104Xo4kdUL+ybX82cvKK8POk9+DiaIfBVpYsSjd4ujohNmqq7vmF/GK9jl9WXq177OJoz4KzA5KWltY23VGruw++g0ajRbC/DIE+I+Hu7GCQNaDXdn+M13Z/jM6uhr+WngQASDuVi9ffz+4z5/xYD7LAaBdHhAf5YNX8EFhbmgMAGhqb8eFnV/X682r/q9I9trV+9j+H5XOCsHxOUJfG3PCXIzhxPp87PwOob5jq74l10aE4fPYajp/Px7F/fI0v3t04oGuSEBOGhJgwdOdweuLe4/hPfYPe/0HgiXOwiFMwyfH3ckOIvwxvrH0RWq1h7/kfMztQd/HoyOH6OdSf8eYrkGcm4+Sf441Sv4dKFdbt+ADZl27qfWyLJ0JH2djMnZUdkPSM93IDANwuffDUa4ZchEY/PRFRqWpGTZ0S35Q9QG5BCTIvFEDV1GKQn+doZ6N7XKdsBM+EZgBJirmZKUL8ZACAG9/+iwXB8y/F6G2PL/MAgNL71fzFMICkJcRPBqvvF1Ev3Cju8FwUnohoHD6jhsPB1hoA0NqmRqG8gkUB14AkZVn45EfrC6pmXC9kB9SXLP/+dwMAlwpKeC0YOyBpGeFoh7DJj+45czr3FtrU6h6tAT0WkbDnqVt4UPd4j3RGTHig7jkvw2AHJDkbls2CiShyB+9r4ePhjLQtK2FmagIAKJJX4u9f3WFh2AFBQh97Y4Mp4x4tPhcU38P1IkW712fE7WSR0HsHAuwHP7ojYuQ0PyyeGQBTE1F3C9gt+05CreGtUxlAElJdq0REwh4kvRSB9OwvjfIenjWFQz+7FqyrunO28uPwSdh1BHmFCu6wDCBpiZ45EdEzJwIAXggYq9ex8woVWLxpH4vcA7dLH2B7Wjau3L7LYjCAyBD0dRg/481XEOQ7qt/WoaGpBQ/rVaiqrcfVO3JczC9G7s1Sg5+VTgwgGPNjeTq7IHSg2XHoU+w49Klex0zLykVaVq5B3q8hxybwKBgR9S2CR9Qm9qVExA6IiBhAREQMICJiABERMYCISGIBpMhKEVgGIuptiqwUgR0QEXEKRkQDNIA4DSOi3p5+sQMior4xBWMXRES92f2wAyKivrMIzS6IiHqr++mwA2IIEVFvhM8zp2AMISIydPg8dw2IIUREhgyfThehGUJEZKjw6dJRMIYQERkifACgW+HC27cSkT6blh/V3TCIiEgfs6UeT68YRkQMnR/rfxua7hGqcnx6AAAAAElFTkSuQmCC",
  xlsx: "iVBORw0KGgoAAAANSUhEUgAAASAAAABICAYAAABWUygDAAAL5ElEQVR42u3dfVzP9/7H8cf3Gy2VpBrJRSgUKVe5CJPLWeg20jib2Tjm6rAxdlhnG8fOjn47McbP5eaM8fMzl4kxc3LZ2OQidqaNkSHMRUhJVOePtg/fWyXUtzo87399L96f7+dze3+/Pb+v9/vz/nwzUUSeoRNzEJEn0qn1kaaibG9S6IhIaYWRScEjIqUVRCYFj4iUVhCZFT4iYg0Pkh1mhY+IlFYImRU+IlJaIWRW+IhIaYWQWeEjIqUVQmaFj4iUVgiZ1SUiUlrMqn5EpLSqIFVAIlK6FZCqHxEpjSpIFZCIlP4ckIhISTNp+CUiqoBERAEkIqIAEhEFkIiIAkgK9XTliiRFTyUpeirvDempDhEFkIhIQcqpCwoXt3AC1as4W+31s7Kz8er9F3W0qAKSsmnaG+EkRU8lfnHRgyokyM8Yqvl711Dniiqg/warYw/w8YpYVkUO41raTUZ9uJzEU+ct2rz3x554VnNl057vWfWv/cbj3ds0YmTfYHYePMa8NTu4kX7rseiTEWHBTBj4bJFeo83gSM5dvvbYfV52zB+Pp7sr6RmZNOw3SX9AqoCKLrh5fZwcKuBdowrrokbSo21ji+e7tPSlc6API8M6WDzu51Udf+8aDO/Tgdt3stSRIgqgh7d44x56jJ3FibMXsbMtz4w3+9EuwBuAWu4u1HJ3AeCHk+cstmvh6wnA0aRz3Mq8o44U0RDs0Rw/8yvhby9gVeQw6ni4EfpMALsTjhPaPsBoc/j4GeO2nW15mjWoBcDeIyce235ZFBPHlE826AMiCiBru3ztBiMilzGybzARc9ZiMpkI79LceD7i1RAiXg3Js91rz7fntefbWzwWG5/I4PcXq1NFQzApWE13F2Kmj2LCwO7Yli9H4qnzvD7t/7mTlc0zTevh6e6qThJRBWQdzX1qYWM209irOkH+dRk4+Z9cu3ETk8nE+AHdjHYrvo5nwuzVxv3OgT58+s4rAAQPjyLp3GV1Zj6cHOzYMmss7q5OAMxeuY2opVvybdu/ayCRo/oAcOHKdbq/PpOU1HTLb1eTic6BPvRs70+T+jWp6uJEVlY2J5Mv86/4oyzZuJfL127c95iC/L3oE9yUFg1rU6VyRXJycjh3+RpxCT+zZttBEo6d1hunACoZMbsOk5F5m/5dAwmoV5MlkwfxQsQCQoIa09irujqoiK6nZfDWrFV8PnkwAMP7dOCrPf/myM9nLdrV8XAzLjXJyclh3IyVecLH42ln5k54iYB6edc5+Xl54Oflwas9ghj70RfExifmaVPhqfJMH/MCzwX55XnOu0YVvGtU4ZUebVi97QARc9bqxIICyPqysrKZOHsN2dnZvPhsKzzcnGnu48mUYaEW7fp1bUG/ri3yfY3t88Zb3D9x9iKdRk5/4GNwc3YkKXpqoe0G92rL4F5t/+v6eNfBYyzb/C0vdW9FORszUW+E0/PNWcbShXI2Nnw8vj/2drYALFy3m90Jxy1ew9nRnuV/G1LokLiSYwUWRAyg78T5HPrpbiVjYzbz2XuDaOVXp9DjDevYDGdHe4Z8sIScHP22nwKoBExeuAF310q8/+lGWvh6UtHeTp1SjD7455e0a+KNp7srDTyr8kb/zsZQ7K2XuxnV5g8nz/GPpV/l2f7dP/YwwicrO5vFG/awMnY/J89ewr6CLa0a1WHiK93xdHelnI0NU4aFEjruf43th/Z+xgif62kZLN20l5jdhzn7awpZ2TnUrFqZ7q0bMeC51rg5O9I50IeXn2vNki/36M1TAFlf5u07xlmrk8mXyM7OISjAi0Df2tRyd7HKHNC4mSsZN3MlhV0Nv++zCKB0Tok/StUV/vZ89v2QZPFYekYm42euYsXfh2I2mRjepwMb445QuaI9Q387g3jz1m1GRy3Ps6izmlslng9uYtx/86OVRO88ZNzPyLzNpm++J+HYGTZMH4WLkwP+3jWoX6sqP/1yATvb8gzrk7uPiymp9Jkwl9MXUiz2kZh0nsSk8yzd/C0x00ZRza0SI/p24PNNe1UFobNgJaJdgDfLpgyhV/sA1mw/yLgZK8lBH77isu+HJBau2/XbsMtM1Ot9+WjsC5hMJgD+tmgjP5+5mGe7Ti18sDHnfqy37//RInzulXzxKku+3MvpCynExidS4SlbY6W7s6M9AHNWbc8TPve6dPUGizd+kxt8rpXwre2uN04VUMkIqF+TtgFe+Hl5ELMrwar7uveMT3GdRVvxwVBa+dXh0E+nef6tOWWyj6ct+5qOzRtQv1ZVGtX1MB7/+rujLNv8bb7b3NtufSHvy4zlW5mxfCuWK9ZrG7cnvdaLSa/1euDj9a1dLc8KeFEAWUWT+jUB+P7n5DzPWXMSmidoJXTm7TuM/egLoqNGUs7GxhgWTZi1usBtqro4WQyVHlaNKpUf+XiruVXSH4aGYNZnW74cbf29ADj00y/qECtKSr7Epatpxv30W5lkZN4usL2dbXnjdtrNzIfen6P9U498rL+fmRNVQFbV1t/L+LDtPHQs7/BGCxGLzXtDehkLEwE83V15Z3AIEXPW5ds+PePuz5w4VHj4QLh562649Rg7i3+fSNaboAqobPlDt5YA3Ei/xf6jqoCspXOgjzGUTU3PIDU9A4AXn21Fx+YN8t3mwpXrxu36tao+9D4vptzd3t9bi0tVAZUxHk8707mlDwAb445wJyurSHNAvwsZ87EmMO/h4uTA/4wK4+7aqxhszGY+HJ372Iejw+g2ekaeFdAHfzzNgOda51Yw7fxZt+NQgfto07gu899+meRLV1m77SDz1+7kwI+nefHZVgD079aS5Vv23fc4P3lnIL6e1Tj96xWilm4h/ugpvXmqgKxn7B+6GKd5v9garw6xkr+P7I2bsyMAW/cdZXXsAb7YGs+2/T8CuWuePhjZO892sfGJxmURXVv60rVVw3xf38ZsZkRYB5wc7PDxdOd62s3c7fclGnNMAfVqMO6lrgUeY+/gpnQJ9KV6FWda+HpyMllDa1VAWPPf3jjSpnHu5HPCsdPsT7T8tuswLEqdVAzCOjaje5tGAKSkpjNx9hrjuYmz1/D17LE4OdgREuRH7+CmrN1+0Hg+JTWd5Vu+49WeQQDM+fOLLFi7kzXbD/LL+StUdLDDt7Y7I8KCjR+Su56WwfpdhwG4cj2N/9v8HYNDcxdUjn6hE35e1fkkehcJx86QlZVNbQ83+nVpwcAebbh33q+wC1tFAVQkF1NuEDLmYyIGhfDZhm9K5RgKGsJRBq4Fe9R9rttxiDHTVwC5p7InD7279ubdedFcunrDYo7nrwtjmDYmHIApw0LZ+/0Jzl26+5vS//j8K55pWo+61Z+mfDkb/hTekT+Fdyxw/5MWrCft5t3J6w8//4rWjevSsE41ADo2b1DgnBPkroafuniT/kAUQFb+Zu7UjLBOzYwPZXGKP3qKvhPnPdH9azKZmPZGuHFt3Ybdh9mw+3Cedqu3HaB7kB9dW/pS0d6OqNfDGTDpU+MyiLSMTPr9ZSELI1421muR7xmzTCYvjLGooCD3co1+EQuYOa4fnVr43PeYDyT+wvDIpY/NPxlQAMl9FfdK6LJkUK8ggn5bX3UxJZV350UX2DZizloCG3ri7GhP2wAvBvUMYlFM3D3Vaiq9/zyXnu386dXOn8b1quPq5MDtrGySki8RG5/Iss3fcv7y9XxfPzU9g8HvL6ZN47r0Dm5KYMPaVHFx4qnyNly+lsbh42eJ3nGIL+OOkK3rvxRAlNC/5SnsgtAnzdzV25m7enuxvNai9XEsWh/3gMPhVJq89P592+Tk5BCzK6FIl8rsOXKCPY/4O96aE0RnwUSkDA+7PUMnqn4UEVVAIqIAEhFRAImIAkhERAEkIo9ZAJ1aH2lSN4hISTu1PtKkCkhENAQTkSc0gDQME5GSHn6pAhKRsjEEUxUkIiVZ/agCEpGyMwmtKkhESqr6ybcCUgiJSEmET4FDMIWQiFg7fO47B6QQEhFrhk+hk9AKIRGxVvg80FkwhZCIWCN8AB4qXPTzrSJSnEXLI1U3CiIRKY7RUpGHVwojEYXOo/oPsTswYizT+D8AAAAASUVORK5CYII="
});

function removeWorkerMonthExportButtons_(sheet) {
  sheet.getImages().forEach(function(image) {
    if (/^GCGL_WORKER_EXPORT_(pdf|xlsx)$/.test(image.getAltTextTitle())) image.remove();
  });
}

function installWorkerMonthExportButtons_(sheet) {
  removeWorkerMonthExportButtons_(sheet);
  [{format: "pdf", column: 4, label: "匯出 PDF", handler: "exportGCGLWorkerMonthPDF"},
    {format: "xlsx", column: 5, label: "匯出 Excel", handler: "exportGCGLWorkerMonthExcel"}]
    .forEach(function(button) {
      const blob = Utilities.newBlob(Utilities.base64Decode(GCGL_WORKER_EXPORT_BUTTONS[button.format]),
        "image/png", "gcgl-worker-" + button.format + ".png");
      sheet.insertImage(blob, button.column, 1, 4, 6)
        .setWidth(144).setHeight(36).setAltTextTitle("GCGL_WORKER_EXPORT_" + button.format)
        .setAltTextDescription(button.label + "（僅此月份）").assignScript(button.handler);
    });
}

function exportGCGLWorkerMonthPDF() { showWorkerMonthExport_("pdf"); }
function exportGCGLWorkerMonthExcel() { showWorkerMonthExport_("xlsx"); }

/** 手動執行一次，授權匯出暫存檔與下載，完成後再更新部署版本。 */
function authorizeGCGLWorkerMonthExport() {
  const spreadsheet = configuredSpreadsheet_();
  DriveApp.getFileById(spreadsheet.getId()).getName();
  authorizeGCGLPDFExport();
  return "月份 PDF／Excel 匯出已授權，請更新部署版本。";
}

/** 只匯出登記的當月頁。XLSX 不使用原試算表 gid（Google 會匯出整本活頁簿）。 */
function workerMonthExportData_(spreadsheet, sheet, format) {
  const month = workerMonthForSheet_(sheet);
  if (!month || ["pdf", "xlsx"].indexOf(format) === -1) throw new Error("請先開啟 GCGL 建立的出工月份分頁。");
  if (sheet.getParent().getId() !== spreadsheet.getId()) throw new Error("月份分頁不屬於此試算表。");
  const blocks = workerPDFMonths_(sheet);
  if (blocks.length !== 1 || blocks[0].month !== month) throw new Error("月份資料不完整，請先重建報表。");
  const state = pdfReportState_();
  if (!state.ready) throw new Error("報表正在更新或重建失敗，請完成更新後再匯出。");
  SpreadsheetApp.flush();
  let temporaryId = "";
  try {
    const temporary = SpreadsheetApp.create("GCGL 暫存匯出 " + month + " " + Utilities.getUuid());
    if (temporary.getId() === spreadsheet.getId()) throw new Error("無法建立獨立的匯出暫存檔。");
    temporaryId = temporary.getId();
    const emptySheets = temporary.getSheets();
    if (emptySheets.length !== 1 || emptySheets[0].getParent().getId() !== temporaryId) {
      throw new Error("匯出暫存檔狀態不正確，未處理任何分頁。");
    }
    temporary.setSpreadsheetTimeZone(spreadsheet.getSpreadsheetTimeZone());
    const copy = sheet.copyTo(temporary).setName(GCGL_CONFIG.workerMonthSheetPrefix + " " + month);
    // 僅刪除剛建立的暫存活頁簿預設頁，絕不刪除來源活頁簿的頁面。
    if (emptySheets[0].getSheetId() === copy.getSheetId()) throw new Error("匯出暫存頁識別不正確。");
    temporary.deleteSheet(emptySheets[0]);
    removeWorkerMonthExportButtons_(copy);
    gcglSheetProtections_(copy).forEach(function(protection) { if (protection.canEdit()) protection.remove(); });
    // 穩定識別碼只用於同步，不寫入下載檔；保留各人員數量、工資及合計公式。
    workerWageLayouts_(sheet).forEach(function(layout) { copy.getRange(layout.keyRow, 1, 1, layout.keys.length + 1).clearContent(); });
    copy.setFrozenRows(5);
    SpreadsheetApp.flush();
    const parameters = {format: format};
    if (format === "pdf") {
      Object.assign(parameters, {gid: copy.getSheetId(), size: "A4", portrait: false,
        fitw: true, gridlines: false, printtitle: false, sheetnames: false,
        pagenum: "UNDEFINED", attachment: true, fzr: true,
        r1: 0, r2: blocks[0].lastRow, c1: 0, c2: blocks[0].lastColumn,
        top_margin: 0.35, bottom_margin: 0.35, left_margin: 0.25, right_margin: 0.25});
    }
    const url = "https://docs.google.com/spreadsheets/d/" + encodeURIComponent(temporaryId) +
      "/export?" + Object.keys(parameters).map(function(key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(String(parameters[key]));
      }).join("&");
    let response;
    for (let attempt = 0; attempt < 3; attempt++) {
      response = UrlFetchApp.fetch(url, {method: "get", muteHttpExceptions: true,
        headers: {Authorization: "Bearer " + ScriptApp.getOAuthToken()}});
      const status = response.getResponseCode();
      if (status !== 404 && status !== 429 && status < 500) break;
      if (attempt < 2) Utilities.sleep(750 * (attempt + 1));
    }
    const status = response.getResponseCode();
    if (status === 401 || status === 403) throw new Error("匯出未授權，請執行 authorizeGCGLWorkerMonthExport 並允許 Google 授權。");
    if (status !== 200) throw new Error("Google 匯出失敗（HTTP " + status + "），請稍後再試。");
    const bytes = response.getBlob().getBytes();
    if (bytes.length > GCGL_CONFIG.maxPDFBytes) throw new Error("匯出檔超過 12 MB，請減少當月人員欄位。");
    const valid = format === "pdf"
      ? bytes.length >= 5 && bytes.slice(0, 5).map(function(byte) { return String.fromCharCode(byte); }).join("") === "%PDF-"
      : bytes.length >= 4 && (bytes[0] & 255) === 80 && (bytes[1] & 255) === 75 &&
        (bytes[2] & 255) === 3 && (bytes[3] & 255) === 4;
    if (!valid) throw new Error("Google 沒有回傳正確的匯出檔，請確認授權後重試。");
    const after = pdfReportState_();
    if (!after.ready || after.version !== state.version) throw new Error("資料在匯出期間有更新，請重新匯出。");
    return {filename: GCGL_CONFIG.workerMonthSheetPrefix + "_" + month + "." + format,
      mimeType: format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      base64: Utilities.base64Encode(bytes)};
  } finally {
    // ID 只能來自本次新建的暫存活頁簿；下載內容放在視窗記憶體，不建立公開連結。
    if (temporaryId) DriveApp.getFileById(temporaryId).setTrashed(true);
  }
}

function showWorkerMonthExport_(format) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error("請在試算表開啟出工月份分頁，再點選匯出。");
  const data = workerMonthExportData_(spreadsheet, spreadsheet.getActiveSheet(), format);
  const json = JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
  const html = '<!doctype html><html><head><meta charset="utf-8"></head><body style="font:16px sans-serif;padding:20px">' +
    '<p>當月檔案已準備完成，點擊下方按鈕下載。</p><a id="download" style="display:inline-block;padding:12px 20px;' +
    'background:#1F4E78;color:white;border-radius:8px;text-decoration:none">下載檔案</a>' +
    '<script>const data=' + json + ';const bytes=Uint8Array.from(atob(data.base64),c=>c.charCodeAt(0));' +
    'const url=URL.createObjectURL(new Blob([bytes],{type:data.mimeType}));const link=document.getElementById("download");' +
    'link.href=url;link.download=data.filename;window.addEventListener("unload",()=>URL.revokeObjectURL(url));</script></body></html>';
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(400).setHeight(190),
    format === "pdf" ? "匯出當月 PDF" : "匯出當月 Excel");
}

const GCGL_CATALOG_ITEM_KEY = "__GCGL_CATALOG_ITEM_ID";
const GCGL_CATALOG_DEFAULT_OWNER = "__GCGL_CATALOG_DEFAULT__";

/** 支援舊直表和新橫表。新表的 UUID 集中放在所有可見欄右方，不佔 A:B:C 等位置。 */
function materialCatalogLayout_(sheet) {
  if (!sheet || sheet.getMaxColumns() < 4) return null;
  const labels = ["分類", "品項名稱", "單價"];
  const first = sheet.getRange(1, 1, 1, sheet.getMaxColumns()).getValues()[0];
  const marker = first.indexOf(GCGL_CATALOG_ITEM_KEY);
  if (marker >= 3 && marker % 3 === 0) {
    const groupCount = marker / 3, blocks = [];
    for (let index = 0; index < groupCount; index++) {
      const start = index * 3;
      if (!arraysEqual_(first.slice(start, start + 3).map(reportCanonicalText_), labels) ||
          first[marker + index] !== GCGL_CATALOG_ITEM_KEY) return null;
      blocks.push({start: start + 1, price: start + 3, key: marker + index + 1});
    }
    return {headerRow: 1, firstDataRow: 2, width: groupCount * 4, horizontal: true, blocks: blocks};
  }
  const headers = ["品項識別碼"].concat(labels);
  const headerRow = [1, 3, 4].find(function(row) {
    return sheet.getMaxRows() >= row && arraysEqual_(sheet.getRange(row, 1, 1, 4).getValues()[0].map(reportCanonicalText_), headers);
  });
  return headerRow ? {headerRow: headerRow, firstDataRow: headerRow + 1, width: 4,
    horizontal: false, blocks: [{start: 2, price: 4, key: 1}]} : null;
}

function readMaterialCatalogRows_(sheet, layout) {
  if (!layout || sheet.getLastRow() < layout.firstDataRow) return [];
  const rows = sheet.getRange(layout.firstDataRow, 1, sheet.getLastRow() - layout.firstDataRow + 1, layout.width).getValues();
  const output = [];
  layout.blocks.forEach(function(block) {
    rows.forEach(function(row) {
      if (optionalString_(row[block.key - 1])) {
        output.push([row[block.key - 1], row[block.start - 1], row[block.start], row[block.price - 1]]);
      }
    });
  });
  return output;
}

function materialCatalogPriceEntry_(row) {
  const raw = rememberedInputValue_(row[3], "請填入單價"), price = materialPriceInputValue_(raw);
  const entry = [JSON.stringify([GCGL_CATALOG_DEFAULT_OWNER, row[0]]), row[0], row[1], row[2]];
  // 無效輸入不覆蓋此前的有效備份；空白是使用者明確清除，0 是有效單價。
  if (price !== undefined) entry.push(price);
  return entry;
}

/** 提示只代表未填；接受所有報表語言，避免切換語言後把提示保存成內容。 */
function rememberedInputLabels_(label) {
  return uniqueStrings_([label].concat(GCGL_REPORT_TRANSLATIONS[label] || []));
}

function rememberedInputValue_(value, label) {
  return value == null || (typeof value === "string" && (!value.trim() || rememberedInputLabels_(label).indexOf(value) !== -1)) ? "" : value;
}

function rememberedInputDisplay_(value, label) {
  const saved = rememberedInputValue_(value, label);
  return saved === "" ? reportText_(label) : saved;
}

/** 只替換本功能的規則；實際輸入後由原生條件格式立即恢復原字色。 */
function setRememberedInputPromptFormat_(sheet, firstDataRow, rowCount, columnCount, label, firstColumn) {
  function formulaAtRow(row) {
    const cell = reportColumnLetter_(firstColumn) + row;
    return "=OR(" + rememberedInputLabels_(label).map(function(text) {
      return cell + '="' + text.replace(/"/g, '""') + '"';
    }).join(",") + ")";
  }
  const rules = sheet.getConditionalFormatRules().filter(function(rule) {
    const condition = rule.getBooleanCondition();
    const ranges = rule.getRanges();
    return !(condition && ranges.length > 0 && ranges.every(function(range) {
      return range.getColumn() === firstColumn && range.getNumColumns() === columnCount &&
        condition.getCriteriaValues()[0] === formulaAtRow(range.getRow());
    }));
  });
  if (rowCount > 0) rules.push(SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied(formulaAtRow(firstDataRow))
    .setFontColor(GCGL_REPORT_COLORS.lightRed3).setRanges([sheet.getRange(firstDataRow, firstColumn, rowCount, columnCount)]).build());
  sheet.setConditionalFormatRules(rules);
}

/** 僅補回使用者編輯範圍內的空白輸入；不覆寫其他內容或沒有穩定識別的空列。 */
function restoreEditedInputPrompt_(range, firstDataRow, firstColumn, columnCount, keyColumn, validKey, label) {
  const sheet = range.getSheet(), first = Math.max(firstDataRow, range.getRow());
  const last = Math.min(sheet.getLastRow(), range.getRow() + range.getNumRows() - 1);
  const left = Math.max(firstColumn, range.getColumn()), right = Math.min(firstColumn + columnCount - 1, range.getColumn() + range.getNumColumns() - 1);
  if (first > last || left > right) return;
  const keys = sheet.getRange(first, keyColumn, last - first + 1, 1).getValues();
  for (let column = left; column <= right; column++) {
    const values = sheet.getRange(first, column, last - first + 1, 1).getValues();
    let start = -1;
    for (let index = 0; index <= values.length; index++) {
      const replace = index < values.length && validKey(keys[index][0]) &&
        rememberedInputValue_(values[index][0], label) === "" && values[index][0] !== reportText_(label);
      if (replace && start < 0) start = index;
      if (!replace && start >= 0) {
        sheet.getRange(first + start, column, index - start, 1).setValues(Array.from({length: index - start}, function() { return [reportText_(label)]; }));
        start = -1;
      }
    }
  }
}

function handleMaterialCatalogPriceEdit_(event) {
  const sheet = event.range.getSheet();
  const table = loadTableSchemas_().find(function(item) { return item.key === "material_catalog" && item.sheetName === sheet.getName(); });
  if (!table) return false;
  const layout = materialCatalogLayout_(sheet);
  if (layout) layout.blocks.forEach(function(block) {
    restoreEditedInputPrompt_(event.range, layout.firstDataRow, block.price, 1, block.key,
      function(key) { return !!optionalString_(key); }, "請填入單價");
  });
  return true;
}

function renderMaterialCatalogReport_(spreadsheet, table, values, recordIds) {
  let sheet = spreadsheet.getSheetByName(table.sheetName);
  if (!sheet) sheet = insertGeneratedReportSheet_(spreadsheet, table.sheetName);
  if (sheet.isSheetHidden()) sheet.showSheet();

  const oldLayout = materialCatalogLayout_(sheet);
  const oldEnd = sheet.getLastRow();
  if (!oldLayout && oldEnd > 0) {
    throw new Error("材料單價表欄位不正確，已保留原資料，請先確認表頭。");
  }
  let existingRows = readMaterialCatalogRows_(sheet, oldLayout);
  const restoring = oldLayout && oldLayout.horizontal;
  if (restoring) {
    // 橫排期間編輯的價格比備份新。先按 UUID 保存可見價格，再轉回直式。
    saveMaterialPriceEntries_(spreadsheet, existingRows.map(materialCatalogPriceEntry_));
    const byId = new Map(existingRows.map(function(row) { return [row[0], row]; }));
    const ordered = [];
    readMaterialPriceRows_(spreadsheet).forEach(function(row) {
      if (row[0] !== JSON.stringify([GCGL_CATALOG_DEFAULT_OWNER, row[1]]) || !byId.has(row[1])) return;
      ordered.push(byId.get(row[1]));
      byId.delete(row[1]);
    });
    existingRows = ordered.concat(Array.from(byId.values()));
  }
  const outputRows = mergeMaterialCatalogRows_(values, recordIds, existingRows).map(function(row) {
    return [row[0], materialCatalogCellText_(row[1]), materialCatalogCellText_(row[2]),
      rememberedInputDisplay_(row[3], "請填入單價")];
  });

  const headerRow = 1, firstDataRow = 2, width = 4;
  const newEnd = headerRow + outputRows.length;
  const managedWidth = restoring ? oldLayout.width : width;
  const height = Math.max(oldEnd, newEnd);
  const display = [["品項識別碼", "分類", "品項名稱", "單價"].map(reportHeader_)].concat(outputRows);
  ensureSheetSize_(sheet, Math.max(height, firstDataRow), managedWidth);
  const showExistingCategoryOnFailure = restoring && !sheet.isColumnHiddenByUser(1);
  sheet.hideColumns(1);
  const area = sheet.getRange(1, 1, height, managedWidth);
  try {
    if (restoring) {
      // 只有辨識到舊橫排，才一併清理 E 欄以後的舊報表內容。
      const matrix = Array.from({length: height}, function(_, index) {
        return (display[index] || []).concat(Array(managedWidth).fill("")).slice(0, managedWidth);
      });
      area.setValues(matrix);
    } else {
      sheet.getRange(headerRow, 1, display.length, width).setValues(display);
      if (oldEnd > newEnd) {
        sheet.getRange(newEnd + 1, 1, oldEnd - newEnd, width).clearContent();
      }
    }
  } catch (error) {
    if (showExistingCategoryOnFailure) {
      try {
        const current = materialCatalogLayout_(sheet);
        if (current && current.horizontal) sheet.showColumns(1);
      } catch (_) { /* 保留原始寫入錯誤 */ }
    }
    throw error;
  }
  const filter = sheet.getFilter();
  if (filter) filter.remove();
  sheet.getBandings().forEach(function(banding) { banding.remove(); });
  if (oldLayout) oldLayout.blocks.forEach(function(block) {
    sheet.getRange(oldLayout.headerRow, block.price).clearNote();
    setRememberedInputPromptFormat_(sheet, oldLayout.firstDataRow, 0, 1, "請填入單價", block.price);
  });
  area.clearDataValidations();
  resetReportStylesKeepingBorders_(area);

  sheet.getRange(headerRow, 1, 1, width)
    .setBackground(GCGL_REPORT_COLORS.navy)
    .setFontColor(GCGL_REPORT_COLORS.headerText)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  if (outputRows.length > 0) {
    sheet.getRange(firstDataRow, 1, outputRows.length, width)
      .setFontColor(GCGL_REPORT_COLORS.text)
      .setVerticalAlignment("middle");
    const cell = "D" + firstDataRow;
    const priceRange = sheet.getRange(firstDataRow, 4, outputRows.length, 1);
    priceRange.setNumberFormat("#,##0.##").setHorizontalAlignment("right")
      .setDataValidation(SpreadsheetApp.newDataValidation()
        .requireFormulaSatisfied('=OR(' + cell + '="",AND(ISNUMBER(' + cell + '),' + cell + '>=0),' +
          rememberedInputLabels_("請填入單價").map(function(text) {
            return cell + '="' + text.replace(/"/g, '""') + '"';
          }).join(",") + ')')
        .setAllowInvalid(true).setHelpText(reportText_("請輸入材料單價。")).build());
    const tableRange = sheet.getRange(headerRow, 1, newEnd, width);
    const banding = tableRange.applyRowBanding(SpreadsheetApp.BandingTheme.BLUE, true, false);
    banding.setHeaderRowColor(GCGL_REPORT_COLORS.navy)
      .setFirstRowColor(GCGL_REPORT_COLORS.firstRow).setSecondRowColor(GCGL_REPORT_COLORS.secondRow);
    clearUnusedReportBorders_(sheet, [tableRange], height, managedWidth);
    tableRange.setBorder(true, true, true, true, true, true, GCGL_REPORT_COLORS.border, SpreadsheetApp.BorderStyle.SOLID);
    priceRange.setBackground(GCGL_REPORT_COLORS.rememberedInput);
    tableRange.createFilter();
  } else {
    clearUnusedReportBorders_(sheet, [], height, managedWidth);
  }
  setRememberedInputPromptFormat_(sheet, firstDataRow, outputRows.length, 1, "請填入單價", 4);
  sheet.getRange(headerRow, 4).setNote(reportText_("請在此欄輸入材料單價；同步不會清除或移動既有品項的單價。"));
  [180, 150, 260, 99].forEach(function(value, index) { sheet.setColumnWidth(index + 1, value); });
  sheet.setRowHeight(headerRow, 30);
  sheet.setFrozenRows(headerRow);
  sheet.setHiddenGridlines(true);
  sheet.setTabColor(GCGL_REPORT_COLORS.red);
  if (restoring) sheet.showColumns(2, width - 1);
  if (restoring && managedWidth > width) {
    const formerKeys = Math.max(width + 1, oldLayout.blocks[0].key);
    sheet.showColumns(formerKeys, managedWidth + 1 - formerKeys);
  }
  fitReportRowHeights_(sheet, headerRow, newEnd, 2, 3, false);
  if (restoring) clearMaterialCatalogPriceLinks_(spreadsheet);
  finishGeneratedReportGrid_(sheet, Math.max(newEnd, firstDataRow), width);
}

function materialCatalogCellText_(value) {
  return typeof value === "string" && /^[=']/.test(value) ? "'" + value : value;
}

/** 舊橫排即時連結已停用；只清新記憶頁的 F 欄，不動舊備份。 */
function clearMaterialCatalogPriceLinks_(spreadsheet) {
  const state = gcglMemoryRegistry_(spreadsheet);
  const sheet = state && state.ready ? registeredGCGLMemorySheet_(spreadsheet, state) : null;
  if (sheet && sheet.getMaxColumns() >= 6 && sheet.getRange(1, 6).getValue() === "__catalog_live_price") {
    sheet.getRange(1, 6, Math.max(1, sheet.getLastRow()), 1).clearContent();
  }
}

function mergeMaterialCatalogRows_(values, recordIds, existingRows) {
  const existingPrices = {};
  const existingOrder = [];
  (existingRows || []).forEach(function(row) {
    const recordId = optionalString_(row[0]);
    if (!recordId || Object.prototype.hasOwnProperty.call(existingPrices, recordId)) return;
    existingPrices[recordId] = rememberedInputValue_(row[3], "請填入單價");
    existingOrder.push(recordId);
  });

  const rowByRecordId = {};
  const incomingOrder = [];
  (recordIds || []).forEach(function(recordId, index) {
    const id = optionalString_(recordId);
    if (!id || rowByRecordId[id]) return;
    const row = Array.isArray(values[index]) ? values[index] : [];
    rowByRecordId[id] = [optionalString_(row[0]), optionalString_(row[1])];
    incomingOrder.push(id);
  });

  const outputOrder = existingOrder.filter(function(recordId) {
    return Boolean(rowByRecordId[recordId]);
  });
  incomingOrder.forEach(function(recordId) {
    if (outputOrder.indexOf(recordId) === -1) outputOrder.push(recordId);
  });
  return outputOrder.map(function(recordId) {
    const row = rowByRecordId[recordId];
    const price = Object.prototype.hasOwnProperty.call(existingPrices, recordId)
      ? existingPrices[recordId]
      : "";
    return [recordId, row[0], row[1], price];
  });
}

/** 材料統計可覆寫案場單價；材料訂購按隱藏識別鍵引用，不依賴顯示列號。 */
function renderMaterialCostReport_(spreadsheet, table, values, siteNames, priceSheetName,
    priceContext, storedRows, summaryTable, lockAlreadyHeld) {
  if (table.key === "material_summary") captureMaterialSummaryPrices_(spreadsheet, [table]);
  const catalogLayout = materialCatalogLayout_(spreadsheet.getSheetByName(priceSheetName));
  const context = priceContext || buildMaterialPriceContext_(spreadsheet,
    {sheetName: priceSheetName}, [], []);
  let identities = materialReportPriceIdentities_(table, values, storedRows || [], context);
  saveMaterialPriceEntries_(spreadsheet, identities.map(function(identity) {
    return [identity.key, identity.catalogId, identity.category, identity.item];
  }), lockAlreadyHeld);
  const selectedSite = selectedSiteForReport_(table.key, siteNames);
  const selectedRows = selectReportRows_(table, values, (storedRows || []).map(function(row) { return row[1]; }), selectedSite);
  if (usesMergedRecordLayout_(table)) {
    identities = selectedRows.indexes.map(function(index) { return identities[index]; });
    values = selectedRows.values;
  }
  const isSummary = table.key === "material_summary";
  const sheet = prepareReportSheet_(spreadsheet, table.sheetName, {
    hiddenColumns: [table.headers.length + 3, isSummary ? 3 : 2], visibleColumns: table.headers.length + 2
  });
  const headers = table.headers.concat(["單價", "小計",
    GCGL_CONFIG.materialPriceKeyHeader, GCGL_CONFIG.materialCatalogIdHeader],
    isSummary ? [GCGL_CONFIG.materialSiteNameHeader] : []);
  const widths = (table.widths || []).concat([110, 130, 180, 180], isSummary ? [180] : []);
  const formats = (table.formats || []).concat(["#,##0.##", "#,##0.##", "@", "@"], isSummary ? ["@"] : []);
  const bodyRows = values.length > 0
    ? reportDisplayRows_(table, values).map(function(row, index) {
        return row.concat(["", "", identities[index].key, identities[index].catalogId], isSummary ? [values[index][0]] : []);
      })
    : [headers.map(function() { return ""; })];
  const tableBlock = writeReportTableBlock_(
    sheet,
    3,
    1,
    headers,
    bodyRows,
    widths,
    formats
  );

  if (values.length > 0) {
    const quantityColumn = table.key === "material_summary" ? 4 : 5;
    const priceColumn = table.headers.length + 1;
    const subtotalColumn = priceColumn + 1;
    const priceFormulas = [];
    const subtotalFormulas = [];
    for (let index = 0; index < values.length; index += 1) {
      const rowNumber = index + 4;
      const quantityCell = "$" + reportColumnLetter_(quantityColumn) + rowNumber;
      const priceCell = "$" + reportColumnLetter_(priceColumn) + rowNumber;
      priceFormulas.push([materialReportPriceFormula_(table, rowNumber, priceSheetName, summaryTable,
        catalogLayout && catalogLayout.horizontal)]);
      subtotalFormulas.push([
        "=IF(OR(" + priceCell + "=\"\"," + quantityCell + "=\"\"),\"\"," +
          quantityCell + "*" + priceCell + ")"
      ]);
    }
    sheet.getRange(4, priceColumn, values.length, 1).setFormulas(priceFormulas);
    sheet.getRange(4, subtotalColumn, values.length, 1).setFormulas(subtotalFormulas);
    if (table.key === "material_summary") {
      const priceRange = sheet.getRange(4, priceColumn, values.length, 1);
      priceRange.setBackground(GCGL_REPORT_COLORS.rememberedInput);
      applyMaterialSummaryPriceValidation_(priceRange);
    }
  }

  if (usesMergedRecordLayout_(table)) {
    mergeReportRecordCells_(sheet, table, values, selectedRows.recordIds, 4);
  } else if (isSummary) {
    mergeReportLabelColumn_(sheet, values, 0, [], 4);
  } else {
    createReportFilter_(sheet, 3, 1, tableBlock);
  }

  if (table.key === "material_orders" && table.headers.length >= 7) {
    applyReportTextHighlight_(sheet, 4, values.length, 6,
      ["未送貨", "未送货", "Not Delivered", "未配送", "미배송"], "#B7E1CD");
  }
  renderReportSelectors_(sheet, selectedSite, siteNames, requestedReportColumnWidth_(headers[0]));
  if (table.key === "material_summary") {
    sheet.getRange(2, 8).setValue(reportText_("可依照各案場修改材料單價"))
      .setFontFamily("Arial").setFontSize(11).setFontColor("#D93025")
      .setHorizontalAlignment("left").setVerticalAlignment("middle").setWrap(false);
  }
  applyReportSiteFilter_(sheet, table, selectedSite);
  sheet.setFrozenRows(3);
  fitReportRowHeights_(sheet, 3, bodyRows.length + 1, 1, table.headers.length + 2, false);
  finishGeneratedReportGrid_(sheet, tableBlock.endRow, Math.max(tableBlock.endColumn, isSummary ? 8 : 1));
}

/** 材料單價使用共用記憶頁的獨立欄組，讀取不包含工資及人員資料。 */
function readMaterialPriceRows_(spreadsheet) {
  return readGCGLMemoryRows_(spreadsheet, "materials");
}

function saveMaterialPriceEntries_(spreadsheet, entries, lockAlreadyHeld) {
  if (entries.length === 0) return;
  const cache = memoryCacheFor_(spreadsheet);
  if (cache && cache.rows.materials && entries.every(function(entry) { return entry.length <= 4; })) {
    // 這條路徑只登記識別碼；已存在時不用再加鎖讀一次，更不覆寫單價。
    const registered = new Set(cache.rows.materials.map(function(row) { return row[0]; }));
    if (entries.every(function(entry) { return registered.has(entry[0]); })) return;
  }
  const lock = LockService.getScriptLock();
  if (!lockAlreadyHeld) lock.waitLock(5000);
  try {
    const sheet = ensureGCGLMemoryForWrite_(spreadsheet);
    const rows = readGCGLMemoryRows_(spreadsheet, "materials", sheet);
    const indexes = {};
    rows.forEach(function(row, index) { indexes[row[0]] = index; });
    const changed = {};
    entries.forEach(function(entry) {
      if (!validMaterialPriceKey_(entry[0])) return;
      let index = indexes[entry[0]];
      if (index === undefined) {
        index = rows.length;
        indexes[entry[0]] = index;
        rows.push([entry[0], entry[1] || "", entry[2] || "", entry[3] || "", ""]);
        changed[index] = true;
      }
      if (entry.length > 4 && rows[index][4] !== entry[4]) {
        rows[index][4] = entry[4];
        changed[index] = true;
      }
    });
    writeGCGLMemoryRows_(spreadsheet, sheet, "materials", rows, Object.keys(changed).map(Number));
  } finally {
    if (!lockAlreadyHeld) lock.releaseLock();
  }
}

function validMaterialPriceKey_(value) {
  try {
    const parts = JSON.parse(value);
    return Array.isArray(parts) && parts.length === 2 && parts.every(function(part) {
      return typeof part === "string" && part !== "";
    });
  } catch (_) { return false; }
}

function materialNameKey_(category, item) {
  return JSON.stringify([optionalString_(category), optionalString_(item)]);
}

function buildMaterialPriceContext_(spreadsheet, catalogTable, values, recordIds, storedRowsByKey) {
  const idsByName = {}, aliases = {}, siteIdsByName = Object.create(null);
  function add(target, category, item, id) {
    if (!id) return;
    const name = materialNameKey_(category, item);
    if (!Object.prototype.hasOwnProperty.call(target, name)) target[name] = id;
    else if (target[name] !== id) target[name] = ""; // 同名不同 UUID 不猜測或加總單價。
  }
  readMaterialPriceRows_(spreadsheet).forEach(function(row) { add(aliases, row[2], row[3], row[1]); });
  const sheet = spreadsheet.getSheetByName(catalogTable.sheetName);
  const layout = materialCatalogLayout_(sheet);
  readMaterialCatalogRows_(sheet, layout).forEach(function(row) {
    add(aliases, row[1], row[2], optionalString_(row[0]));
  });
  recordIds.forEach(function(id, index) {
    const row = values[index] || [];
    add(idsByName, row[0], row[1], optionalString_(id));
  });
  // 沒有新目錄資料（直接重建單一報表）時，使用既有 UUID 對照。
  if (recordIds.length === 0) Object.keys(aliases).forEach(function(name) { idsByName[name] = aliases[name]; });
  function addSite(name, id) {
    if (!name || !id) return;
    if (!Object.prototype.hasOwnProperty.call(siteIdsByName, name)) siteIdsByName[name] = id;
    else if (siteIdsByName[name] !== id) siteIdsByName[name] = "";
  }
  const rowsByKey = storedRowsByKey || {};
  (rowsByKey.material_summary || []).forEach(function(row) {
    const match = optionalString_(row[1]).match(/^material-summary:([^:]+):/);
    addSite(optionalString_(row[4]), match ? match[1] : "");
  });
  (rowsByKey.site_overview || []).forEach(function(row) {
    const match = optionalString_(row[1]).match(/^site-overview:(.+)$/);
    addSite(optionalString_(row[4]), match ? match[1] : "");
  });
  return {idsByName: idsByName, aliases: aliases, siteIdsByName: siteIdsByName};
}

function materialReportPriceIdentities_(table, values, storedRows, context) {
  const siteIndex = reportSiteColumnIndex_(table.key);
  const categoryIndex = table.key === "material_summary" ? 1 : 2;
  return values.map(function(row, index) {
    const category = optionalString_(row[categoryIndex]), item = optionalString_(row[categoryIndex + 1]);
    const name = materialNameKey_(category, item);
    const catalogId = Object.prototype.hasOwnProperty.call(context.idsByName, name)
      ? context.idsByName[name] : context.aliases[name] || "";
    const storedRow = storedRows[index] || [];
    const owner = optionalString_(storedRow[1]).match(/^material-summary:([^:]+):/);
    const metadataSiteId = optionalString_(storedRow[0]);
    const siteId = owner ? owner[1] : (metadataSiteId && metadataSiteId !== "all" ? metadataSiteId :
      context.siteIdsByName[optionalString_(row[siteIndex])] || "legacy-site:" + optionalString_(row[siteIndex]));
    const itemId = catalogId || "legacy-item:" + name;
    return {key: JSON.stringify([siteId, itemId]), catalogId: catalogId, category: category, item: item};
  });
}

/** COUNTIFS/SUMIFS/MATCH 的條件都須逸出萬用字元，包含舊版的名稱式識別鍵。 */
function materialPriceCriterion_(cell) {
  return 'SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(' + cell + ',"~","~~"),"*","~*"),"?","~?")';
}

function materialReportPriceFormula_(table, row, priceSheetName, summaryTable, horizontalCatalog) {
  const key = "$" + reportColumnLetter_(table.headers.length + 3) + row;
  const catalogId = "$" + reportColumnLetter_(table.headers.length + 4) + row;
  const criterion = materialPriceCriterion_(key);
  const catalog = quoteSheetNameForFormula_(priceSheetName);
  const saved = quoteSheetNameForFormula_(GCGL_CONFIG.memorySheetName);
  const placeholderExclusions = rememberedInputLabels_("請填入單價").map(function(text) {
    return ',' + catalog + '!$D:$D,"<>' + text.replace(/"/g, '""') + '"';
  }).join("");
  const legacyDefaults = 'IF(' + catalogId + '="","",IF(COUNTIFS(' + catalog + '!$A:$A,' +
    catalogId + ',' + catalog + '!$D:$D,"<>"' + placeholderExclusions + ')=0,"",SUMIFS(' + catalog + '!$D:$D,' + catalog + '!$A:$A,' + catalogId + ')))';
  const matchCatalogId = materialPriceCriterion_(catalogId);
  const defaults = !horizontalCatalog ? legacyDefaults : 'IF(' + catalogId + '="","",IF(COUNTIFS(' +
    saved + '!$B:$B,' + matchCatalogId + ',' + saved + '!$F:$F,"<>")=0,"",SUMIFS(' + saved + '!$F:$F,' +
    saved + '!$B:$B,' + matchCatalogId + ')))';
  let formula = 'IF(COUNTIFS(' + saved + '!$A:$A,' + criterion + ',' + saved + '!$E:$E,"<>")=0,' +
    defaults + ',SUMIFS(' + saved + '!$E:$E,' + saved + '!$A:$A,' + criterion + '))';
  if (table.key === "material_orders" && summaryTable) {
    const summary = quoteSheetNameForFormula_(summaryTable.sheetName);
    const summaryKeys = summary + '!$' + reportColumnLetter_(summaryTable.headers.length + 3) + ':$' +
      reportColumnLetter_(summaryTable.headers.length + 3);
    const summaryPrices = summary + '!$' + reportColumnLetter_(summaryTable.headers.length + 1) + ':$' +
      reportColumnLetter_(summaryTable.headers.length + 1);
    const lookup = 'INDEX(' + summaryPrices + ',MATCH(' + criterion + ',' + summaryKeys + ',0))';
    formula = 'IF(COUNTIFS(' + summaryKeys + ',' + criterion + ')=0,' + formula +
      ',IF(COUNTIFS(' + summaryKeys + ',' + criterion + ',' + summaryPrices + ',"<>")=0,"",' + lookup + '))';
  }
  return "=" + formula;
}

function materialSummaryInputLayout_(sheet, table) {
  const priceColumn = table.headers.length + 1, keyColumn = priceColumn + 2;
  if (sheet.getLastRow() < 4 || sheet.getMaxColumns() < keyColumn + 1 ||
      sheet.getRange(3, keyColumn).getValue() !== GCGL_CONFIG.materialPriceKeyHeader ||
      sheet.getRange(3, keyColumn + 1).getValue() !== GCGL_CONFIG.materialCatalogIdHeader) return null;
  return {priceColumn: priceColumn, keyColumn: keyColumn};
}

function materialPriceInputValue_(value) {
  if (value === "" || value == null) return "";
  if (typeof value !== "number" && typeof value !== "string") return undefined;
  if (typeof value === "string" && value.trim() === "") return "";
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
}

/** 清空及公式回傳空字串代表使用共用單價，不能被硬性數字規則拒絕。 */
function applyMaterialSummaryPriceValidation_(range) {
  const cell = reportColumnLetter_(range.getColumn()) + range.getRow();
  range.setDataValidation(SpreadsheetApp.newDataValidation()
    .requireFormulaSatisfied('=OR(' + cell + '="",AND(ISNUMBER(' + cell + '),' + cell + '>=0))')
    .setAllowInvalid(false).build());
}

function captureMaterialSummaryPrices_(spreadsheet, tables) {
  const table = tables.find(function(item) { return item.key === "material_summary"; });
  const sheet = table && spreadsheet.getSheetByName(table.sheetName);
  const layout = sheet && materialSummaryInputLayout_(sheet, table);
  if (!layout) return;
  const rowCount = sheet.getLastRow() - 3;
  const values = sheet.getRange(4, 1, rowCount, layout.keyColumn + 1).getValues();
  const formulas = sheet.getRange(4, layout.priceColumn, rowCount, 1).getFormulas();
  const entries = [];
  values.forEach(function(row, index) {
    const key = row[layout.keyColumn - 1], price = materialPriceInputValue_(row[layout.priceColumn - 1]);
    if (!validMaterialPriceKey_(key) || formulas[index][0] !== "" || price === undefined) return;
    entries.push([key, row[layout.keyColumn], row[1], row[2], price]);
  });
  saveMaterialPriceEntries_(spreadsheet, entries);
}

function handleMaterialSummaryPriceEdit_(event) {
  const range = event.range, sheet = range.getSheet(), spreadsheet = sheet.getParent();
  const tables = loadTableSchemas_();
  const table = tables.find(function(item) { return item.key === "material_summary" && item.sheetName === sheet.getName(); });
  const catalog = tables.find(function(item) { return item.key === "material_catalog"; });
  if (!table || !catalog) return false;
  const layout = materialSummaryInputLayout_(sheet, table);
  if (!layout || range.getColumn() > layout.priceColumn ||
      range.getColumn() + range.getNumColumns() <= layout.priceColumn) return false;
  const startRow = Math.max(range.getRow(), 4);
  const endRow = Math.min(range.getRow() + range.getNumRows() - 1, sheet.getLastRow());
  if (endRow < startRow) return false;
  const rows = sheet.getRange(startRow, 1, endRow - startRow + 1, layout.keyColumn + 1).getValues();
  const existingFormulas = sheet.getRange(startRow, layout.priceColumn, rows.length, 1).getFormulas();
  const entries = [], formulas = [];
  const catalogLayout = materialCatalogLayout_(spreadsheet.getSheetByName(catalog.sheetName));
  rows.forEach(function(row, index) {
    const key = row[layout.keyColumn - 1], price = materialPriceInputValue_(row[layout.priceColumn - 1]);
    formulas.push([materialReportPriceFormula_(table, startRow + index, catalog.sheetName, null,
      catalogLayout && catalogLayout.horizontal)]);
    if (validMaterialPriceKey_(key) && price !== undefined && existingFormulas[index][0] === "") {
      entries.push([key, row[layout.keyColumn], row[1], row[2], price]);
    }
  });
  saveMaterialPriceEntries_(spreadsheet, entries);
  // 回復可計算的公式：之後共用單價更新、清空覆寫及其他訂單都能即時跟隨。
  const priceRange = sheet.getRange(startRow, layout.priceColumn, rows.length, 1);
  priceRange.clearDataValidations().setFormulas(formulas);
  applyMaterialSummaryPriceValidation_(priceRange);
  return true;
}

function quoteSheetNameForFormula_(sheetName) {
  return "'" + String(sheetName || "").replace(/'/g, "''") + "'";
}

function reportColumnLetter_(columnNumber) {
  let value = Number(columnNumber);
  let result = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }
  return result;
}

function usesMergedRecordLayout_(table) {
  // 同組的共用標籤可合併；來源資料仍逐列保存。
  return table.key === "pricing_progress" || table.key === "pricing_detail" || table.key === "memos" ||
    (table.key === "work_logs" && table.headers.length >= 9) ||
    (table.key === "material_orders" && table.headers.length >= 7);
}

function selectReportRows_(table, values, recordIds, selectedSite) {
  const siteIndex = reportSiteColumnIndex_(table.key);
  const indexes = [];
  values.forEach(function(row, index) {
    if (!selectedSite || selectedSite === GCGL_CONFIG.allSitesLabel || sameReportText_(row[siteIndex], selectedSite)) {
      indexes.push(index);
    }
  });
  return {indexes: indexes, values: indexes.map(function(index) { return values[index]; }),
    recordIds: indexes.map(function(index) { return recordIds[index] || ""; })};
}

function reportRecordGroupID_(tableKey, recordId) {
  const prefixes = {pricing_detail: "pricing-detail", work_logs: "work", material_orders: "material-order"};
  if (!prefixes[tableKey]) return "";
  const match = optionalString_(recordId).match(new RegExp("^" + prefixes[tableKey] + ":([^:]+):"));
  return match ? match[1] : "";
}

/** 只合併相鄰且同群組的標籤；空白不承接上一列，明細、識別鍵及輸入格不合併。 */
function mergeReportLabelColumn_(sheet, values, columnIndex, parentColumns, firstRow) {
  let start = 0;
  const columns = parentColumns.concat([columnIndex]);
  for (let index = 1; index <= values.length; index++) {
    const hasLabel = optionalString_(values[start][columnIndex]).trim() !== "";
    if (index < values.length && hasLabel && columns.every(function(column) {
      return sameReportText_(values[start][column], values[index][column]);
    })) continue;
    if (hasLabel && index - start > 1) {
      sheet.getRange(firstRow + start, columnIndex + 1, index - start, 1).merge()
        .setVerticalAlignment("middle")
        .setBorder(true, true, true, true, false, false, GCGL_REPORT_COLORS.border, SpreadsheetApp.BorderStyle.SOLID);
    }
    start = index;
  }
}

/** 共用標籤可跨記錄合併；計價總額與其他表頭仍只在同記錄 ID 內合併。 */
function mergeReportRecordCells_(sheet, table, values, recordIds, firstRow, dateKeys) {
  if (table.key === "memos") {
    mergeReportLabelColumn_(sheet, values, 0, [], firstRow);
    mergeReportLabelColumn_(sheet, values, 1, [0], firstRow);
    return;
  }
  if (table.key === "pricing_progress" || table.key === "pricing_detail") {
    mergeReportLabelColumn_(sheet, values, 0, [], firstRow);
    if (table.key === "pricing_progress" || table.headers.length < 14) return;
  }
  if (table.key === "work_logs") {
    const dateValues = dateKeys ? values.map(function(row, index) { return [dateKeys[index]]; }) : values;
    mergeReportLabelColumn_(sheet, dateValues, 0, [], firstRow);
  }
  const columnCount = table.key === "pricing_detail" ? 6 : 2;
  const firstColumn = table.key === "material_orders" ? 1 : 2;
  let start = 0;
  for (let index = 1; index <= values.length; index++) {
    const group = reportRecordGroupID_(table.key, recordIds[start]);
    const sameGroup = index < values.length && group &&
      reportRecordGroupID_(table.key, recordIds[index]) === group &&
      values[index].slice(0, columnCount).every(function(value, column) {
        return sameReportText_(value, values[start][column]);
      });
    if (sameGroup) continue;
    if (group && index - start > 1) {
      for (let column = firstColumn; column <= columnCount; column++) {
        sheet.getRange(firstRow + start, column, index - start, 1).merge()
          .setVerticalAlignment("middle")
          .setBorder(true, true, true, true, false, false, GCGL_REPORT_COLORS.border, SpreadsheetApp.BorderStyle.SOLID);
      }
      if (table.key === "pricing_detail") {
        // App 只在第一個子項填入本次總額；只合併一致的總額，不能以合併隱藏衝突金額。
        const amounts = values.slice(start, index).map(function(row) { return row[13]; })
          .filter(function(value) { return optionalString_(value) !== ""; });
        if (amounts.every(function(value) { return sameReportText_(value, amounts[0]); })) {
          sheet.getRange(firstRow + start, 14, index - start, 1).merge()
            .setValue(amounts.length ? amounts[0] : "")
            .setVerticalAlignment("middle").setHorizontalAlignment("right")
            .setBorder(true, true, true, true, false, false, GCGL_REPORT_COLORS.border, SpreadsheetApp.BorderStyle.SOLID);
        }
      }
    }
    start = index;
  }
}

/** A1 切換只重畫此報表；來源仍是完整隱藏資料。 */
function refreshSelectedReport_(spreadsheet, tables, table) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(5000); } catch (_) { markReportsPending_([table.key], true); return; }
  try {
    const stored = readStoredRowsByTable_(spreadsheet, tables), values = {}, ids = {};
    tables.forEach(function(item) {
      const rows = stored[item.key] || [];
      values[item.key] = rows.map(function(row) { return row.slice(GCGL_CONFIG.metadataHeaders.length); });
      ids[item.key] = rows.map(function(row) { return row[1]; });
    });
    const names = collectReportSiteNames_(tables, values);
    if (table.key === "material_orders" && tables.some(function(item) { return item.key === "material_catalog"; })) {
      const catalog = tables.find(function(item) { return item.key === "material_catalog"; });
      const context = buildMaterialPriceContext_(spreadsheet, catalog, values.material_catalog || [], ids.material_catalog || [], stored);
      renderMaterialCostReport_(spreadsheet, table, values[table.key] || [], names,
        catalog.sheetName, context, stored[table.key] || [], tables.find(function(item) { return item.key === "material_summary"; }), true);
    } else {
      renderFlatReport_(spreadsheet, table, values[table.key] || [], names, ids[table.key] || []);
    }
    protectGCGLSheet_(spreadsheet.getSheetByName(reportSheetName_(table)), [spreadsheet.getSheetByName(reportSheetName_(table)).getRange(1, 1)]);
  } catch (error) {
    markReportsPending_([table.key], true);
    throw error;
  } finally { lock.releaseLock(); }
}

/** 先排序原始逐列資料，再合併日期／案場，避免字串排序或合併儲存格打散同筆記錄。 */
function chronologicalWorkLogRows_(spreadsheet, table, values, recordIds) {
  const timezone = spreadsheet.getSpreadsheetTimeZone() || Session.getScriptTimeZone();
  const rawDateIndex = table.headers.indexOf(GCGL_CONFIG.workDateKeyHeader);
  const groupOrder = Object.create(null);
  const rows = values.map(function(row, index) {
    const rawDate = rawDateIndex < 0 ? "" : optionalString_(row[rawDateIndex]);
    const keys = (/^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? [rawDate] : reportDateKeys_(row[0], timezone))
      .filter(function(key) {
        const date = new Date(key + "T12:00:00Z");
        return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === key;
      });
    const dateKey = keys.length === 1 ? keys[0] : "";
    const id = (recordIds || [])[index] || "";
    const groupID = reportRecordGroupID_(table.key, id);
    const key = JSON.stringify([dateKey, row[1], groupID || "row-" + index]);
    if (groupOrder[key] === undefined) groupOrder[key] = index;
    return {row: row, id: id, date: dateKey, group: groupOrder[key], index: index};
  });
  rows.sort(function(left, right) {
    if (left.date !== right.date) {
      if (!left.date) return 1;
      if (!right.date) return -1;
      return left.date < right.date ? -1 : 1;
    }
    return left.group - right.group || left.index - right.index;
  });
  return {values: rows.map(function(item) { return item.row; }),
    recordIds: rows.map(function(item) { return item.id; }),
    dateKeys: rows.map(function(item) { return item.date || "unknown-row:" + item.index; })};
}

function constructionGanttLogs_(tables, valuesByKey) {
  const table = tables.find(function(item) { return item.key === "work_logs"; });
  return table ? {table: table, rows: valuesByKey.work_logs || []} : null;
}

/** 對應同步 schema，不讀取顯示頁的合併格或格式化日期。 */
function constructionGanttFields_(table, names) {
  const headers = table.headers.map(reportCanonicalText_);
  const indexes = names.map(function(name) { return headers.indexOf(name); });
  return function(row) { return indexes.map(function(index) { return index < 0 ? "" : row[index]; }); };
}

function constructionGanttDateKeys_(display, raw, timezone) {
  const valid = function(key) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
    const day = new Date(key + "T00:00:00Z");
    return !isNaN(day.getTime()) && day.toISOString().slice(0, 10) === key;
  };
  if (raw) return valid(raw) ? [raw] : [];
  return reportDateKeys_(display, timezone).filter(valid);
}

function constructionGanttFloor_(value) {
  const text = value.toUpperCase();
  if (text === "RF") return {kind: "R", level: 1};
  const match = /^([BR]?)([1-9]\d*)F$/.exec(text);
  return match ? {kind: match[1], level: Number(match[2])} : null;
}

function constructionGanttShortDate_(key) {
  return key.slice(2).replace(/-/g, "/");
}

/** 自訂名稱先整串比對；只有已知標準樓層才可由標準區間展開。 */
function constructionGanttFloors_(summary, known) {
  if (known.has(summary)) return [summary];
  const floors = new Set();
  const split = function(text) { return text.split(/[、,，]/).map(function(part) { return part.trim(); }); };
  const tokens = split(summary), ambiguous = new Set();
  // 舊記錄未轉義自訂樓層中的分隔符；合併字串碰到這類名稱，不把其中一部分當成另一個樓層。
  known.forEach(function(_, floor) {
    const parts = split(floor);
    if (parts.length < 2) return;
    for (let start = 0; start + parts.length <= tokens.length; start++) {
      if (parts.every(function(part, i) { return part === tokens[start + i]; })) {
        parts.forEach(function(_, i) { ambiguous.add(start + i); });
      }
    }
  });
  tokens.forEach(function(text, i) {
    if (ambiguous.has(i)) return;
    if (known.has(text)) { floors.add(text); return; }
    const range = text.split("-");
    if (range.length !== 2) return;
    const start = constructionGanttFloor_(range[0]), end = constructionGanttFloor_(range[1]);
    if (!start || !end || start.kind !== end.kind ||
        (start.kind === "B" ? start.level < end.level : start.level > end.level)) return;
    known.forEach(function(_, floor) {
      const candidate = constructionGanttFloor_(floor);
      if (candidate && candidate.kind === start.kind && candidate.level >= Math.min(start.level, end.level) &&
          candidate.level <= Math.max(start.level, end.level)) floors.add(floor);
    });
  });
  return Array.from(floors);
}

/** 先索引工項，再掃工程記錄。若最後日期和可對應的記錄不吻合，僅畫已知日期。 */
function constructionGanttRows_(table, values, logs, timezone) {
  const fields = constructionGanttFields_(table, ["案場", "工項", "施工廠商", "樓層/區域", "狀態", "最後記錄日"]);
  const groups = new Map();
  const keyFor = function(site, task, vendor) { return JSON.stringify([site, task, vendor]); };
  const rows = values.map(function(row) {
    const [site, task, vendor, floor, status, last] = fields(row);
    const names = [site, task, vendor, floor].map(function(value) { return optionalString_(value).trim(); });
    const key = keyFor(names[0], names[1], names[2]);
    if (!groups.has(key)) groups.set(key, new Map());
    const floors = groups.get(key);
    if (!floors.has(names[3])) floors.set(names[3], {first: "", last: "", lastIncomplete: "", completed: []});
    return {site: names[0], task: names[1], vendor: names[2], floor: names[3],
      stage: reportCanonicalText_(optionalString_(status).trim()), latest: last, dates: floors.get(names[3])};
  });
  if (logs) {
    const logFields = constructionGanttFields_(logs.table,
      ["案場", "工項", "施工廠商", "樓層/區域", "日期", GCGL_CONFIG.workDateKeyHeader, "進度", "狀態"]);
    logs.rows.forEach(function(row) {
      const [site, task, vendor, floor, displayedDate, rawDate, progress, status] = logFields(row);
      const names = [site, task, vendor, floor].map(function(value) { return optionalString_(value).trim(); });
      if (!names[0] || !names[1] || !names[3]) return;
      const group = groups.get(keyFor(names[0], names[1], names[2]));
      if (!group) return;
      const dates = constructionGanttDateKeys_(displayedDate, optionalString_(rawDate), timezone);
      if (dates.length !== 1) return;
      const date = dates[0];
      const stage = reportCanonicalText_(optionalString_(progress || status).trim());
      constructionGanttFloors_(names[3], group).forEach(function(label) {
        const span = group.get(label);
        if (!span.first || date < span.first) span.first = date;
        if (date > span.last) span.last = date;
        if (stage === "已完成") span.completed.push(date);
        else if (["未開始", "準備中", "施工中", "最後階段"].indexOf(stage) !== -1 &&
            date > span.lastIncomplete) span.lastIncomplete = date;
      });
    });
  }
  return rows.map(function(row) {
    const latest = constructionGanttDateKeys_(row.latest, "", timezone);
    // 舊資料有兩種可能的日／月順序時，只接受工程記錄能印證的日期。
    if (latest.length === 1) row.last = latest[0];
    else row.last = !latest.length || latest.indexOf(row.dates.last) >= 0 ? row.dates.last : "";
    row.first = row.last && row.last === row.dates.last ? row.dates.first : "";
    let label = reportText_(row.stage);
    if (row.stage === "已完成") {
      // 已完成後仍可能有追加記錄，標籤採最近一次進入完成狀態的日期，而非週起始日或最後一次回報。
      const after = row.dates.lastIncomplete;
      const firstCompletion = row.dates.completed.reduce(function(first, date) {
        return date >= after && (!row.last || date <= row.last) && (!first || date < first) ? date : first;
      }, "");
      const completionDate = firstCompletion || (row.last > after ? row.last : "");
      label = completionDate ? reportText_("{date}完成").replace("{date}", constructionGanttShortDate_(completionDate))
        : reportText_("完成日期不明");
    }
    row.label = [[row.task, row.floor].filter(Boolean).join(" "), label].filter(Boolean).join(" · ");
    return row;
  }).sort(function(a, b) {
    return Number(!constructionGanttHasBar_(a)) - Number(!constructionGanttHasBar_(b)) ||
      a.site.localeCompare(b.site) || a.vendor.localeCompare(b.vendor) ||
      a.task.localeCompare(b.task, undefined, {numeric: true}) || a.floor.localeCompare(b.floor, undefined, {numeric: true});
  });
}

function constructionGanttHasBar_(row) {
  return Boolean(row.last) && row.stage !== "未開始";
}

/** 以試算表當地日期為起點，月底沒有同日就落在目標月份的最後一天。 */
function constructionGanttHorizon_(today) {
  const date = new Date(today + "T00:00:00Z");
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + 3);
  const monthEnd = new Date(date.getTime());
  monthEnd.setUTCMonth(monthEnd.getUTCMonth() + 1, 0);
  date.setUTCDate(Math.min(day, monthEnd.getUTCDate()));
  return date.toISOString().slice(0, 10);
}

/** 日曆運算使用 UTC 日序，寫入 Sheets 時以日期序號顯示，不受時區或夏令時間偏移影響。 */
function constructionGanttAxis_(rows, today) {
  const dayMs = 86400000;
  const dayOf = function(key) { return Date.parse(key + "T00:00:00Z") / dayMs; };
  const monday = function(day) { return day - ((day + 3) % 7 + 7) % 7; };
  let start = Infinity, last = -Infinity;
  rows.forEach(function(row) {
    if (constructionGanttHasBar_(row)) {
      start = Math.min(start, dayOf(row.first || row.last));
      last = Math.max(last, dayOf(row.last));
    }
  });
  if (today) {
    start = Math.min(start, dayOf(today));
    last = Math.max(last, dayOf(constructionGanttHorizon_(today)));
  }
  if (!Number.isFinite(start)) return {dates: [], width: 320};
  const firstWeek = monday(start), weekCount = (monday(last) - firstWeek) / 7 + 1;
  return {unit: "week", width: 68, format: "yy/mm/dd",
    dates: Array.from({length: weekCount}, function(_, i) { return firstWeek + i * 7; }),
    index: function(key) { return Math.floor((dayOf(key) - firstWeek) / 7); }};
}

/** 以工作表 ID 登記管理權；僅名稱以「甘特圖_」開頭不算 GCGL 分頁。 */
function constructionGanttSheets_(spreadsheet) {
  const prefix = GCGL_CONFIG.constructionGanttSheetPropertyPrefix + spreadsheet.getId() + "_";
  const properties = PropertiesService.getScriptProperties().getProperties();
  return spreadsheet.getSheets().map(function(sheet) {
    return {siteKey: properties[prefix + sheet.getSheetId()], sheet: sheet};
  }).filter(function(item) { return !!item.siteKey; });
}

function constructionGanttTabName_(site, currentSheet, occupied) {
  const base = GCGL_CONFIG.constructionGanttSheetPrefix +
    site.replace(/[\u0000-\u001f\u007f\\/:?*\[\]]/g, "－").replace(/'+$/, "").trim();
  const currentID = currentSheet ? currentSheet.getSheetId() : null;
  for (let index = 1; ; index++) {
    const suffix = index === 1 ? "" : " (" + index + ")";
    const name = base.slice(0, 100 - suffix.length).replace(/[\uD800-\uDBFF]$/, "") + suffix;
    const key = name.toLowerCase();
    if (!occupied.has(key) || occupied.get(key) === currentID) return name;
  }
}

function constructionGanttScopeSignature_(overview, overviewIds) {
  const names = overview.map(function(row, index) {
    return JSON.stringify([optionalString_(overviewIds && overviewIds[index]), optionalString_(row[0]).trim()]);
  }).sort();
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify(names))
    .map(function(byte) { return (byte & 255).toString(16).padStart(2, "0"); }).join("");
}

/** 每日總覽更新不重畫甘特圖；只有案場新增、移出同步或更名才重排。 */
function constructionGanttScopeChanged_(spreadsheet, overview, overviewIds) {
  if (!Array.isArray(overview)) return false;
  const key = GCGL_CONFIG.constructionGanttScopePropertyPrefix + spreadsheet.getId();
  const previous = PropertiesService.getScriptProperties().getProperty(key);
  return !!previous && previous !== constructionGanttScopeSignature_(overview, overviewIds);
}

/** 工程記錄只需串接一次；各案場獨立決定日期刻度與範圍。 */
function renderConstructionGanttReports_(spreadsheet, table, values, logs, overview, overviewIds) {
  const timezone = spreadsheet.getSpreadsheetTimeZone() || Session.getScriptTimeZone();
  const today = Utilities.formatDate(new Date(), timezone, "yyyy-MM-dd");
  const bySite = new Map();
  constructionGanttRows_(table, values, logs, timezone).forEach(function(row) {
    if (!bySite.has(row.site)) bySite.set(row.site, []);
    bySite.get(row.site).push(row);
  });
  const sites = new Map(), counts = new Map();
  (Array.isArray(overview) ? overview : Array.from(bySite.keys(), function(site) { return [site]; }))
    .forEach(function(row, index) {
      const name = optionalString_(row[0]).trim();
      const recordId = optionalString_(overviewIds && overviewIds[index]);
      const key = recordId.indexOf("site-overview:") === 0 ? recordId : "name:" + name;
      if (sites.has(key)) return;
      sites.set(key, name);
      counts.set(name, (counts.get(name) || 0) + 1);
    });

  const existing = constructionGanttSheets_(spreadsheet);
  const byKey = new Map(existing.map(function(item) { return [item.siteKey, item.sheet]; }));
  const occupied = new Map(spreadsheet.getSheets().map(function(sheet) {
    return [sheet.getName().toLowerCase(), sheet.getSheetId()];
  }));
  const prefix = GCGL_CONFIG.constructionGanttSheetPropertyPrefix + spreadsheet.getId() + "_";
  const properties = PropertiesService.getScriptProperties(), rendered = [];
  sites.forEach(function(site, key) {
    const displayName = site || reportText_("未命名案場");
    let sheet = byKey.get(key);
    const name = constructionGanttTabName_(displayName, sheet, occupied);
    if (!sheet) {
      sheet = insertGeneratedReportSheet_(spreadsheet, name);
      properties.setProperty(prefix + sheet.getSheetId(), key);
    } else if (sheet.getName() !== name) {
      occupied.delete(sheet.getName().toLowerCase());
      sheet.setName(name);
    }
    occupied.set(name.toLowerCase(), sheet.getSheetId());
    // 舊同步明細只含案場名稱；同名時不把一個案場的施工記錄畫到另一個案場。
    const ambiguous = counts.get(site) > 1;
    const records = ambiguous ? [] : bySite.get(site) || [];
    renderConstructionGanttReport_(spreadsheet, sheet, displayName, records, today,
      ambiguous ? reportText_("案場名稱重複，請先在 App 更名") : reportText_("無施工項目"));
    if (records.length) rendered.push({id: sheet.getSheetId(), site: site});
  });

  // App 取消同步某案場或刪除案場時，僅隱藏該自動報表；日後再同步可沿用分頁，不永久刪除。
  const stale = existing.filter(function(item) { return !sites.has(item.siteKey); });
  const staleIds = new Set(stale.map(function(item) { return item.sheet.getSheetId(); }));
  const visible = spreadsheet.getSheets().find(function(sheet) {
    return !staleIds.has(sheet.getSheetId()) && !sheet.isSheetHidden() && !isGCGLInternalSheet_(sheet);
  });
  if (visible) stale.forEach(function(item) { hideInternalSheet_(spreadsheet, item.sheet, visible); });
  if (Array.isArray(overview)) {
    properties.setProperty(GCGL_CONFIG.constructionGanttScopePropertyPrefix + spreadsheet.getId(),
      constructionGanttScopeSignature_(overview, overviewIds));
  }
  return rendered;
}

function renderConstructionGanttReport_(spreadsheet, targetSheet, site, rows, today, emptyLabel) {
  const axis = constructionGanttAxis_(rows, today);
  function labelWidth(text) {
    return Math.max(1, Math.ceil((Array.from(text).length * 14 + 14) / axis.width));
  }
  let span = Math.max(1, axis.dates.length);
  const plans = rows.map(function(row) {
    const needed = labelWidth(row.label);
    if (!constructionGanttHasBar_(row)) return {row: row, needed: needed};
    const start = axis.index(row.first || row.last), end = axis.index(row.last);
    // 色條末格保留註解；放不下的標籤統一緊接色條右側。
    const inline = needed <= Math.max(1, end - start);
    const labelStart = inline ? start : end + 1;
    const labelCount = inline ? needed : Math.min(needed, Math.ceil(360 / axis.width));
    span = Math.max(span, labelStart + labelCount);
    return {row: row, start: start, end: end, labelStart: labelStart, labelCount: labelCount};
  });
  const timeline = 2, lastColumn = span + 1;
  const display = [], fills = [], notes = [], merges = [];
  function addLane(vendor) {
    display.push([/^[=']/.test(vendor) ? "'" + vendor : vendor].concat(Array(span).fill("")));
    fills.push(Array(span).fill(GCGL_REPORT_COLORS.firstRow));
    notes.push(Array(span).fill(null));
    return display.length - 1;
  }
  function addLabel(lane, start, count, text) {
    // setValues 會把開頭的 '=' 當公式；工項／廠商名稱都是使用者文字。
    display[lane][timeline - 1 + start] = /^[=']/.test(text) ? "'" + text : text;
    if (count > 1) merges.push([lane + 5, timeline + start, count]);
  }
  let shownUndated = false;
  plans.forEach(function(plan) {
    const row = plan.row;
    const hasBar = plan.end !== undefined;
    if (!hasBar && !shownUndated && axis.dates.length) {
      const heading = addLane("");
      const undatedTitle = reportText_("未開始／無記錄日期");
      addLabel(heading, 0, Math.min(span, labelWidth(undatedTitle)), undatedTitle);
      fills[heading].fill(GCGL_REPORT_COLORS.secondRow);
      shownUndated = true;
    }
    const lane = addLane(row.vendor);
    if (!hasBar) {
      addLabel(lane, 0, Math.min(span, plan.needed), row.label);
      return;
    }
    const start = plan.start, end = plan.end;
    const fill = row.stage === "已完成" ? GCGL_REPORT_COLORS.lightRed3 : GCGL_REPORT_COLORS.titleFill;
    fills[lane].fill(fill, start, end + 1);
    notes[lane][end] = row.first ? [row.first, row.last].filter(function(date, i, pair) {
      return i === 0 || date !== pair[0];
    }).map(constructionGanttShortDate_).join(" – ")
      : reportText_("僅能確認最後記錄日") + " " + constructionGanttShortDate_(row.last);
    addLabel(lane, plan.labelStart, plan.labelCount, row.label);
  });
  if (!display.length) {
    addLabel(addLane(""), 0, Math.min(span, labelWidth(emptyLabel)), emptyLabel);
  }
  const sheet = prepareReportSheet_(spreadsheet, targetSheet.getName());
  ensureSheetSize_(sheet, 4 + display.length, lastColumn);
  const grid = sheet.getRange(4, 1, display.length + 1, lastColumn);
  clearUnusedReportBorders_(sheet, [grid]);
  grid.setBorder(true, true, true, true, false, true, GCGL_REPORT_COLORS.border, SpreadsheetApp.BorderStyle.SOLID)
    .setFontFamily("Arial").setFontSize(10).setFontColor(GCGL_REPORT_COLORS.text)
    .setVerticalAlignment("middle").setWrap(true);
  sheet.getRange(5, 1, display.length, 1).setNumberFormat("@");
  sheet.getRange(5, timeline, display.length, span).setNumberFormat("@").setBackgrounds(fills).setNotes(notes);
  sheet.getRange(5, 1, display.length, lastColumn).setValues(display);
  merges.forEach(function(item) { sheet.getRange(item[0], item[1], 1, item[2]).merge(); });
  const header = sheet.getRange(4, 1, 1, lastColumn);
  header.setBackground(GCGL_REPORT_COLORS.navy).setFontColor(GCGL_REPORT_COLORS.headerText)
    .setFontWeight("bold").setHorizontalAlignment("center");
  sheet.getRange(4, 1).setValue(reportText_("施工廠商"));
  sheet.setColumnWidths(timeline, span, axis.width);
  sheet.setColumnWidth(1, 180);
  sheet.getRange(1, 1).setNumberFormat("@")
    .setValue(/^[=']/.test(site) ? "'" + site : site).setFontWeight("bold").setBackground(GCGL_REPORT_COLORS.titleFill);
  if (axis.dates.length) {
    sheet.getRange(4, timeline, 1, axis.dates.length).setNumberFormat(axis.format)
      .setValues([axis.dates.map(function(day) { return day + 25569; })]); // 1970-01-01 in Sheets
    const description = sheet.getRange(2, timeline, 1, Math.min(span, Math.ceil(360 / axis.width)));
    if (description.getNumColumns() > 1) description.merge();
    description.setValue(reportText_("首次至最後一次施工記錄")).setWrap(true);
    sheet.getRange(3, timeline).setValue(reportText_("每週"));
  } else {
    sheet.getRange(4, timeline).setValue(reportText_(rows.some(function(row) { return row.last; })
      ? "未開始／無記錄日期" : "無記錄日期"));
  }
  fitReportRowHeights_(sheet, 4, display.length + 1, 1, lastColumn, false);
  sheet.setFrozenRows(4);
  sheet.setFrozenColumns(1);
  finishGeneratedReportGrid_(sheet, 4 + display.length, lastColumn);
}

/** 擁有者仍可確認警告後編輯；以 App 同步來源還原，不保留表格端的獨立完成狀態。 */
function handleMemoCompletionEdit_(event) {
  const range = event.range;
  if (range.getColumn() > 4 || range.getColumn() + range.getNumColumns() <= 4 ||
      range.getRow() + range.getNumRows() <= 4) return false;
  const sheet = range.getSheet();
  const table = loadTableSchemas_().find(function(item) {
    return item.key === "memos" && reportSheetName_(item) === sheet.getName();
  });
  if (!table || sheet.getLastRow() < 4 || sheet.getRange(3, 5).getValue() !== GCGL_CONFIG.memoRecordKeyHeader) return false;
  const firstRow = Math.max(4, range.getRow());
  const lastRow = Math.min(sheet.getLastRow(), range.getRow() + range.getNumRows() - 1);
  if (lastRow < firstRow) return false;
  const stored = readStoredRowsByTable_(sheet.getParent(), [table])[table.key] || [];
  const sourceRows = stored.map(function(row) { return row.slice(GCGL_CONFIG.metadataHeaders.length); });
  const recordIds = stored.map(function(row) { return row[1]; });
  const checkedByKey = new Map(memoCheckboxRows_(sourceRows, recordIds).map(function(item) { return [item.key, item.checked]; }));
  const keys = sheet.getRange(firstRow, 5, lastRow - firstRow + 1, 1).getValues();
  const values = keys.map(function(row) { return checkedByKey.has(row[0]) ? checkedByKey.get(row[0]) : ""; });
  // 原生排序會帶著 E 欄識別移動；同名、多行及公司項目都不依文字或舊列號猜測。
  let start = 0;
  for (let index = 1; index <= values.length; index++) {
    if (index < values.length && (values[index] === "") === (values[start] === "")) continue;
    const target = sheet.getRange(firstRow + start, 4, index - start, 1);
    if (values[start] === "") target.clearContent();
    else target.setValues(values.slice(start, index).map(function(value) { return [value]; }));
    start = index;
  }
  if (values.some(function(value) { return value === ""; })) markReportsPending_(["memos"], false);
  sheet.getParent().toast(reportText_("請從 App 更新備忘錄完成狀態。"), "GCGL", 5);
  return true;
}

function memoSourceSignature_(row) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify(row))
    .map(function(byte) { return (byte & 255).toString(16).padStart(2, "0"); }).join("");
}

function memoCheckboxRows_(sourceRows, recordIds) {
  const occurrences = Object.create(null);
  return sourceRows.flatMap(function(row, index) {
    const content = optionalString_(row[3]);
    const baseKey = optionalString_((recordIds || [])[index]) || "legacy-memo:" + memoSourceSignature_(row.slice(0, 3));
    const pending = Object.create(null);
    pendingMemoContent_(row).split(/\n(?=○ )/).forEach(function(item) {
      if (item.trim()) pending[item.trim()] = (pending[item.trim()] || 0) + 1;
    });
    return content.split(/\n(?=○ )/).filter(function(item) { return !!item.trim(); }).map(function(item) {
      const isPending = row.length > 4 ? (pending[item.trim()] || 0) > 0 : !/ ✓\s*$/.test(item);
      if (isPending && pending[item.trim()]) pending[item.trim()]--;
      const appChecked = !isPending;
      const cleaned = appChecked ? item.replace(/ ✓\s*$/, "") : item;
      // 以項目文字建立識別；其他項目的插入、移除或排序不會把勾選套到另一項。
      const itemKey = baseKey + ":" + memoSourceSignature_([cleaned]);
      const occurrence = occurrences[itemKey] || 0;
      occurrences[itemKey] = occurrence + 1;
      const key = occurrence ? itemKey + ":duplicate:" + occurrence : itemKey;
      const signature = memoSourceSignature_(row.slice(0, 3).concat([cleaned, appChecked]));
      return {date: row[0], site: row[1], content: cleaned, checked: appChecked, key: key, signature: signature};
    });
  });
}

function configureMemoCheckboxes_(sheet, rows, tableBlock) {
  sheet.getRange(3, 5, 1, 2).setValues([[GCGL_CONFIG.memoRecordKeyHeader, GCGL_CONFIG.memoSourceSignatureHeader]]);
  tableBlock.endColumn = 6;
  if (!rows.length) return;
  sheet.getRange(4, 5, rows.length, 2).setNumberFormat("@").setValues(rows.map(function(row) {
    return [row.key, row.signature];
  }));
  const checkboxes = sheet.getRange(4, 4, rows.length, 1);
  checkboxes.setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().setAllowInvalid(false).build())
    .setHorizontalAlignment("center");
  const rule = SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied("=$D4=TRUE")
    .setBackground(GCGL_REPORT_COLORS.lightRed3).setRanges([sheet.getRange(4, 1, rows.length, 4)]).build();
  sheet.setConditionalFormatRules(sheet.getConditionalFormatRules().concat([rule]));
}

function renderFlatReport_(spreadsheet, table, values, siteNames, recordIds) {
  if (table.key === "construction_progress") return; // 只渲染案場甘特圖，不生成共用列表。
  let dateKeys;
  if (table.key === "work_logs") {
    const ordered = chronologicalWorkLogRows_(spreadsheet, table, values, recordIds);
    values = ordered.values;
    recordIds = ordered.recordIds;
    dateKeys = ordered.dateKeys;
  }
  const sheetName = reportSheetName_(table);
  const isPricingReport = ["pricing_progress", "pricing_detail"].indexOf(table.key) !== -1;
  if (isPricingReport || table.key === "work_logs") {
    const previousNames = [table.sheetName, GCGL_CONFIG.defaultSheetNames[table.key]];
    if (table.key === "work_logs") previousNames.push(GCGL_CONFIG.previousWorkLogReportSheetName);
    migrateReadableReportSheet_(spreadsheet, sheetName, previousNames);
  }
  const selectedSite = selectedSiteForReport_(table.key, siteNames);
  const memoSource = table.key === "memos" ? selectReportRows_(table, values, recordIds || [], selectedSite) : null;
  const memoRows = memoSource ? memoCheckboxRows_(memoSource.values, memoSource.recordIds) : [];
  const sheet = prepareReportSheet_(spreadsheet, sheetName,
    table.key === "memos" ? {hiddenColumns: [5, 2], visibleColumns: 4} : undefined);
  // 未完成內容只供總覽計算，不出現在使用者閱讀的備忘錄表格。
  let visibleTable = table, visibleValues = values;
  ["__pending_memo_content", GCGL_CONFIG.workDateKeyHeader].forEach(function(header) {
    const index = visibleTable.headers.indexOf(header);
    if (index < 0) return;
    visibleTable = reportTableWithoutColumn_(visibleTable, index);
    visibleValues = visibleValues.map(function(row) { return withoutArrayIndex_(row, index); });
  });
  let reportTable = table.key === "memos"
    ? reportTableWithoutColumn_(visibleTable, 2)
    : visibleTable;
  let reportValues = table.key === "memos"
    ? visibleValues.map(function(row) { return withoutArrayIndex_(row, 2); })
    : visibleValues;
  if (table.key === "memos") {
    reportTable = Object.assign({}, reportTable, {
      headers: reportTable.headers.concat(["已完成"]),
      widths: (reportTable.widths || []).concat([99]),
      formats: (reportTable.formats || []).concat(["General"])
    });
    reportValues = memoRows.map(function(row) {
      return [row.date, row.site, row.content, row.checked];
    });
  }
  const selectedRows = selectReportRows_(table, reportValues,
    table.key === "memos" ? memoRows.map(function(row) { return row.key; }) : recordIds || [], selectedSite);
  if (usesMergedRecordLayout_(table)) reportValues = selectedRows.values;
  const bodyRows = reportValues.length > 0
    ? reportValues
    : [reportTable.headers.map(function() { return ""; })];
  const tableBlock = writeReportTableBlock_(
    sheet,
    3,
    1,
    reportTable.headers,
    reportDisplayRows_(reportTable, bodyRows),
    reportTable.widths || [],
    reportTable.formats || []
  );
  if (table.key === "work_logs") {
    // 工程記錄的案場、機具使用及備註；不改其他報表同名欄位的寬度。
    [2, 8, 9].forEach(function(column) {
      if (column <= reportTable.headers.length) sheet.setColumnWidth(column, 180);
    });
  }
  if (table.key === "memos") configureMemoCheckboxes_(sheet, memoRows, tableBlock);
  if (usesMergedRecordLayout_(table)) {
    mergeReportRecordCells_(sheet, table, reportValues, selectedRows.recordIds, 4,
      dateKeys && selectedRows.indexes.map(function(index) { return dateKeys[index]; }));
  } else if (table.key === "material_summary") {
    mergeReportLabelColumn_(sheet, reportValues, 0, [], 4);
  } else {
    createReportFilter_(sheet, 3, 1, tableBlock);
  }
  if (table.key === "pricing_progress" && reportValues.length > 0) {
    const progressColumn = reportTable.headers.findIndex(function(header, index) {
      return ["計價進度", "计价进度", "Billing Progress", "Billing progress", "出来高進捗", "기성 진행률", "進度", "Progress", "progress"]
        .indexOf(optionalString_(header)) !== -1 || /%/.test((reportTable.formats || [])[index] || "");
    }) + 1;
    if (progressColumn > 0) {
      const cell = "$" + reportColumnLetter_(progressColumn) + "4";
      const rule = SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied("=AND(ISNUMBER(" + cell + ")," + cell + "=1)")
        .setBackground(GCGL_REPORT_COLORS.lightRed3)
        .setRanges([sheet.getRange(4, 1, reportValues.length, reportTable.headers.length)]).build();
      sheet.setConditionalFormatRules(sheet.getConditionalFormatRules().concat([rule]));
    }
  }
  renderReportSelectors_(sheet, selectedSite, siteNames, requestedReportColumnWidth_(reportTable.headers[0]));
  applyReportSiteFilter_(sheet, table, selectedSite);
  sheet.setFrozenRows(3);
  fitReportRowHeights_(sheet, 3, bodyRows.length + 1, 1, reportTable.headers.length);
  finishGeneratedReportGrid_(sheet, tableBlock.endRow, Math.max(tableBlock.endColumn, table.key === "memos" ? 6 : 1));
}

function isPricingReportKey_(key) {
  return key === "pricing_progress" || key === "pricing_detail";
}

/** 同步 key／欄位不變；保留舊版報表名稱供辨識與舊資料相容。 */
function reportSheetName_(table) {
  if (table.key === "pricing_progress") return GCGL_CONFIG.pricingStatisticsSheetName;
  if (table.key === "pricing_detail") return GCGL_CONFIG.defaultSheetNames.pricing_detail;
  if (table.key === "work_logs") return GCGL_CONFIG.workLogReportSheetName;
  if (table.key === "worker_directory") return GCGL_CONFIG.workerDirectorySheetName;
  return table.sheetName;
}

/** 能沿用原分頁就改名，保留分頁識別碼；不在新報表完成前刪除舊報表。 */
function migrateReadableReportSheet_(spreadsheet, destinationName, previousNames) {
  if (spreadsheet.getSheetByName(destinationName)) return;
  const managedNames = managedGCGLSheetNames_();
  if (managedNames.indexOf(destinationName) === -1) return;
  for (let index = 0; index < previousNames.length; index += 1) {
    const previousName = previousNames[index];
    if (!previousName || previousName === destinationName) continue;
    const sheet = spreadsheet.getSheetByName(previousName);
    if (sheet && managedNames.indexOf(previousName) !== -1) {
      sheet.setName(destinationName);
      return;
    }
  }
}

/** 只建立合併計價表。若欄位不足以配對，保留既有報表，不補建舊分頁。 */
function renderPricingReports_(spreadsheet, tables, valuesByKey, reportKeys, recordIdsByKey) {
  if (tables.length !== 2) return;
  const current = visibleCombinedPricingSheet_(spreadsheet);
  const properties = PropertiesService.getScriptProperties();
  if (current && current.getLastRow() > 0 && !properties.getProperty(GCGL_CONFIG.pdfRenderFailedProperty) &&
      Array.isArray(reportKeys) && !tables.some(function(table) { return reportKeys.indexOf(table.key) !== -1; })) return current;
  return renderCombinedPricingReport_(spreadsheet, tables, valuesByKey, recordIdsByKey || {});
}

/** 不修改試算表上原本已存在的停用分頁，包括其保護設定。 */
function retiredReportNames_(tables) {
  const keys = ["construction_progress", "pricing_progress", "pricing_detail"];
  const defaults = [GCGL_CONFIG.pricingStatisticsSheetName].concat(keys.map(function(key) {
    return GCGL_CONFIG.defaultSheetNames[key];
  }));
  const names = new Set(defaults);
  defaults.forEach(function(name) {
    (GCGL_REPORT_TRANSLATIONS[name] || []).forEach(function(translation) { names.add(translation); });
  });
  tables.forEach(function(table) {
    if (keys.indexOf(table.key) !== -1 && table.sheetName) names.add(table.sheetName);
  });
  tables.forEach(function(table) {
    if (keys.indexOf(table.key) === -1) names.delete(reportSheetName_(table));
  });
  return names;
}

function combinedPricingPropertyKey_(spreadsheet) {
  return GCGL_CONFIG.combinedPricingSheetIdPropertyPrefix + spreadsheet.getId();
}

function combinedPricingSheet_(spreadsheet) {
  const registered = PropertiesService.getScriptProperties().getProperty(combinedPricingPropertyKey_(spreadsheet));
  return registered == null ? null : spreadsheet.getSheets().find(function(sheet) {
    return String(sheet.getSheetId()) === registered;
  }) || null;
}

function visibleCombinedPricingSheet_(spreadsheet) {
  const sheet = combinedPricingSheet_(spreadsheet);
  return sheet && !sheet.isSheetHidden() ? sheet : null;
}

function combinedPricingColumns_(table, fields) {
  const canonical = table.headers.map(reportCanonicalText_);
  const columns = fields.map(function(field) { return canonical.indexOf(field); });
  if (columns.some(function(index) { return index < 0; })) return null;
  return function(row) { return columns.map(function(column) { return row[column]; }); };
}

function combinedPricingModel_(spreadsheet, tables, values, ids) {
  const progress = tables.find(function(table) { return table.key === "pricing_progress"; });
  const details = tables.find(function(table) { return table.key === "pricing_detail"; });
  const identity = ["案場", "層級", "名稱", "類型", "計價表"];
  const progressRow = combinedPricingColumns_(progress, identity.concat(["總價", "已計價", "計價進度", "最後計價日"]));
  const detailRow = combinedPricingColumns_(details, identity.concat(["日期", "品項", "單位", "數量", "單價", "金額",
    "稅率", "含稅", "本次計價總額"]));
  // 過短的舊同步欄位缺少計價表對應資料；原報表照常保留，不猜對應關係。
  if (!progressRow || !detailRow) return null;

  const groups = new Map();
  function groupFor(row) {
    const keyParts = [
      optionalString_(row[0]), reportCanonicalText_(optionalString_(row[1]).trim()),
      optionalString_(row[2]), reportCanonicalText_(optionalString_(row[3]).trim()), optionalString_(row[4])
    ];
    const key = JSON.stringify(keyParts);
    if (!groups.has(key)) groups.set(key, {fields: keyParts, summaries: [], batches: new Map()});
    return groups.get(key);
  }

  (values.pricing_progress || []).forEach(function(raw) {
    const row = progressRow(raw);
    groupFor(row).summaries.push(row.slice(5));
  });

  const timezone = spreadsheet.getSpreadsheetTimeZone() || Session.getScriptTimeZone();
  (values.pricing_detail || []).forEach(function(raw, index) {
    const row = detailRow(raw);
    const group = groupFor(row);
    const recordId = reportRecordGroupID_(details.key, (ids.pricing_detail || [])[index]);
    const date = row[5];
    const dateKeys = constructionGanttDateKeys_(date, "", timezone);
    const dateKey = dateKeys.length === 1 ? dateKeys[0] : "";
    // 同日不同筆不能合併；缺少穩定識別的舊紀錄保留逐列，避免誤加總。
    const key = JSON.stringify([recordId || "row-" + index, dateKey || date]);
    if (!group.batches.has(key)) group.batches.set(key, {date: date, dateKey: dateKey, index: index, rows: []});
    group.batches.get(key).rows.push(row.slice(6));
  });

  const bySite = new Map();
  groups.forEach(function(group) {
    const site = group.fields[0];
    if (!bySite.has(site)) bySite.set(site, []);
    bySite.get(site).push(group);
  });
  return {sites: bySite, timezone: timezone};
}

function combinedPricingDateValue_(value, timezone) {
  const dates = constructionGanttDateKeys_(value, "", timezone);
  if (dates.length !== 1) return value == null ? "" : value;
  return Date.parse(dates[0] + "T00:00:00Z") / 86400000 + 25569;
}

function combinedPricingBatchValues_(batch, timezone) {
  function cents(value) {
    return Math.sign(value) * Math.round(Math.abs(value) * 100) / 100;
  }
  const totals = Array.from(new Set(batch.rows.map(function(row) { return row[7]; })
    .filter(function(value) { return value != null && value !== ""; })));
  const lines = batch.rows.map(function(row, index) {
    const [item, unit, quantity, price, amount, rate, rawIncluded] = row;
    const included = reportCanonicalText_(optionalString_(rawIncluded).trim());
    const factor = typeof rate === "number" && isFinite(rate) && rate >= 0 ? 1 + rate : null;
    let net = "", gross = "";
    if (typeof amount === "number" && isFinite(amount)) {
      if (included === "是") {
        gross = cents(amount);
        if (factor != null) net = cents(amount / factor);
      } else if (included === "否") {
        net = cents(amount);
        if (factor != null) gross = cents(amount * factor);
      }
    }
    return [index ? "" : combinedPricingDateValue_(batch.date, timezone), item, unit, quantity, price, net, rate, gross];
  });
  // App 在整筆做稅金四捨五入。尾筆只吸收可歸因於四捨五入的差額，不改 App 原始總額。
  if (totals.length === 1 && typeof totals[0] === "number" &&
      lines.length && lines.every(function(row) { return typeof row[7] === "number"; })) {
    const last = lines.slice().reverse().find(function(row) { return row[7] !== 0; });
    const sum = lines.reduce(function(total, row) { return total + row[7]; }, 0);
    if (last && Math.abs(totals[0] - sum) <= 1 + lines.length * 0.005) last[7] = cents(last[7] + totals[0] - sum);
  }
  return {lines: lines, totals: totals};
}

function renderCombinedPricingReport_(spreadsheet, tables, values, ids) {
  const model = combinedPricingModel_(spreadsheet, tables, values, ids);
  if (!model) return;
  let sheet = combinedPricingSheet_(spreadsheet);
  if (!sheet) {
    const name = GCGL_CONFIG.combinedPricingSheetName;
    const names = new Set(spreadsheet.getSheets().map(function(item) { return item.getName(); }).concat(managedGCGLSheetNames_()));
    let available = name, suffix = 2;
    while (names.has(available)) available = name + " (" + suffix++ + ")";
    sheet = insertGeneratedReportSheet_(spreadsheet, available);
    PropertiesService.getScriptProperties().setProperty(combinedPricingPropertyKey_(spreadsheet), String(sheet.getSheetId()));
  }

  const reportColumn = 2, width = 8, fullWidth = reportColumn + width - 1;
  const entries = [], contractBlocks = [];
  const summaryHeaders = ["層級", "名稱", "類型", "契約金額", "累計已計價", "計價進度", "最後計價日"].map(reportText_);
  function literal(value) {
    if (value == null) return "";
    return typeof value === "string" && /^[=']/.test(value) ? "'" + value : value;
  }
  function add(kind, row) {
    const cells = Array.from({length: width}, function(_, index) {
      return literal(row[index]);
    });
    entries.push({kind: kind, cells: cells});
  }
  if (!model.sites.size) add("placeholder", [reportText_("尚無記錄")]);
  model.sites.forEach(function(groups, site) {
    const siteName = site || reportText_("未命名案場");
    groups.forEach(function(group) {
      if (contractBlocks.length) add("gap", []);
      const contractStart = entries.length + 1;
      const fields = group.fields;
      const identity = [reportText_(fields[1]), fields[2], reportText_(fields[3])];
      add("contract", [fields[4] || reportText_("未命名計價表")]);
      if (group.summaries.length) {
        add("summaryHeader", summaryHeaders);
        group.summaries.forEach(function(summary) {
          add(summary[2] === 1 ? "completed" : "summary", identity.concat([
            summary[0], summary[1], summary[2], combinedPricingDateValue_(summary[3], model.timezone)
          ]));
        });
      } else {
        add("placeholder", [identity.filter(Boolean).join("／") + "　" + reportText_("無計價統計")]);
      }
      if (group.summaries.length > 1 && group.batches.size) {
        add("warning", [reportText_("計價表名稱重複：明細集中列出，未配對到個別摘要。")]);
      }
      add("detailHeader", ["計價日期", "品項", "單位", "數量", "單價", "未稅金額", "稅率", "含稅金額"].map(reportText_));
      if (!group.batches.size) add("placeholder", [reportText_("無計價明細")]);
      Array.from(group.batches.values()).sort(function(a, b) {
        return (a.dateKey || "z").localeCompare(b.dateKey || "z") || a.index - b.index;
      }).forEach(function(batch) {
        const record = combinedPricingBatchValues_(batch, model.timezone);
        record.lines.forEach(function(line, index) { add(index % 2 ? "detailStripe" : "detail", line); });
        add("total", ["", "", "", "", "", "",
          reportText_(record.totals.length > 1 ? "本次總額不一致" : "本次計價總額"),
          record.totals.length > 1 ? record.totals.join("／") : record.totals[0]]);
      });
      contractBlocks.push({first: contractStart, count: entries.length - contractStart + 1, siteName: siteName});
    });
  });

  sheet = prepareReportSheet_(spreadsheet, sheet.getName());
  ensureSheetSize_(sheet, entries.length, fullWidth);
  const grid = sheet.getRange(1, 1, entries.length, fullWidth);
  const body = sheet.getRange(1, reportColumn, entries.length, width);
  function fieldFormat(kind, value, index) {
    if (typeof value !== "number") return "@";
    if (kind === "summary" || kind === "completed") {
      if (index === 5) return "0%";
      if (index === 6) return "yyyy/mm/dd";
    }
    if (kind === "detail" || kind === "detailStripe") {
      if (index === 0) return "yyyy/mm/dd";
      if (index === 6) return Math.abs(value * 100 - Math.round(value * 100)) < 1e-9 ? "0%" : "0.00%";
    }
    return Number.isInteger(value) ? "#,##0" : "#,##0.00";
  }
  const colors = {contract: GCGL_REPORT_COLORS.titleFill,
    summaryHeader: GCGL_REPORT_COLORS.secondRow, completed: GCGL_REPORT_COLORS.lightRed3,
    detailHeader: GCGL_REPORT_COLORS.navy, detailStripe: GCGL_REPORT_COLORS.secondRow,
    total: "#EDF4FA", warning: "#FFF4CC"};
  body.setNumberFormats(entries.map(function(row) {
    return row.cells.map(function(value, index) { return fieldFormat(row.kind, value, index); });
  })).setValues(entries.map(function(row) { return row.cells; }))
    .setBackgrounds(entries.map(function(row) { return Array(width).fill(colors[row.kind] || GCGL_REPORT_COLORS.firstRow); }))
    .setFontFamily("Arial").setFontSize(10).setFontColor(GCGL_REPORT_COLORS.text)
    .setWrap(true).setVerticalAlignment("middle").setHorizontalAlignment("left");
  sheet.getRange(1, reportColumn + 3, entries.length, 5).setHorizontalAlignment("right");
  [160, 140, 230, 110, 120, 130, 130, 145, 145].forEach(function(columnWidth, index) {
    sheet.setColumnWidth(index + 1, columnWidth);
  });
  clearUnusedReportBorders_(sheet, [grid]);
  // 分組被新增或刪除時，清掉舊輪廓再按本次區塊繪製；空白分隔列不畫框。
  grid.setBorder(false, false, false, false, false, false);
  entries.forEach(function(entry, index) {
    const row = index + 1, kind = entry.kind;
    if (kind === "contract" || kind === "placeholder" || kind === "warning") {
      sheet.getRange(row, reportColumn, 1, kind === "contract" || kind === "warning" ? width : 4).merge()
        .setHorizontalAlignment("left").setFontWeight(kind === "placeholder" ? "normal" : "bold")
        .setFontColor(kind === "contract" ? "#000000" : GCGL_REPORT_COLORS.navy).setFontSize(kind === "contract" ? 12 : 10);
    } else if (kind === "summaryHeader" || kind === "detailHeader") {
      sheet.getRange(row, reportColumn, 1, width).setHorizontalAlignment("center").setFontWeight("bold")
        .setFontColor(kind === "detailHeader" ? GCGL_REPORT_COLORS.headerText : GCGL_REPORT_COLORS.navy);
    } else if (kind === "summary" || kind === "completed") {
      sheet.getRange(row, reportColumn, 1, summaryHeaders.length).setFontSize(12);
    } else if (kind === "total") {
      sheet.getRange(row, reportColumn + 6, 1, 2).setFontWeight("bold").setFontColor(GCGL_REPORT_COLORS.lightRed1);
    }
  });
  contractBlocks.forEach(function(block) {
    // 案場欄只合併到同一張計價表的最後一列，與右側外框對齊。
    const label = sheet.getRange(block.first, 1, block.count, 1);
    if (block.count > 1) label.merge();
    sheet.getRange(block.first, 1).setNumberFormat("@").setValue(literal(block.siteName));
    label.setBackground(GCGL_REPORT_COLORS.secondRow).setFontFamily("Arial")
      .setFontColor(GCGL_REPORT_COLORS.navy).setFontWeight("bold").setWrap(true)
      .setHorizontalAlignment("center").setVerticalAlignment("middle");
    sheet.getRange(block.first, reportColumn, block.count, width)
      .setBorder(true, true, true, true, false, false, GCGL_REPORT_COLORS.border, SpreadsheetApp.BorderStyle.SOLID);
  });
  // 首列直接開始第一張計價表，不能凍結而切到 A 欄的跨列合併。
  fitReportRowHeights_(sheet, 1, entries.length, 1, fullWidth, false, false);
  protectGCGLSheet_(sheet, []);
  finishGeneratedReportGrid_(sheet, entries.length, fullWidth);
  return sheet;
}

function reportTableWithoutColumn_(table, removedIndex) {
  return {
    key: table.key,
    sheetName: table.sheetName,
    headers: withoutArrayIndex_(table.headers, removedIndex),
    widths: withoutArrayIndex_(table.widths || [], removedIndex),
    formats: withoutArrayIndex_(table.formats || [], removedIndex)
  };
}

function supportsReportSiteSelector_(tableKey) {
  return ["site_overview", "monthly_progress", "construction_progress", "attendance", "material_catalog"]
    .indexOf(tableKey) === -1 && !isPricingReportKey_(tableKey);
}

function reportSelectionPropertyKey_(tableKey) {
  return GCGL_CONFIG.reportSelectionPropertyPrefix + tableKey;
}

function selectedSiteForReport_(tableKey, siteNames) {
  const selected = optionalString_(
    PropertiesService.getScriptProperties().getProperty(reportSelectionPropertyKey_(tableKey))
  );
  if (selected && siteNames.indexOf(selected) !== -1) return selected;
  return GCGL_CONFIG.allSitesLabel;
}

function renderReportSelectors_(sheet, selectedSite, siteNames, firstColumnWidth) {
  const validation = SpreadsheetApp.newDataValidation()
    .requireValueInList([reportText_(GCGL_CONFIG.allSitesLabel)].concat(siteNames), true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(1, 1)
    .setValue(selectedSite === GCGL_CONFIG.allSitesLabel ? reportText_(selectedSite) : selectedSite)
    .setDataValidation(validation)
    .clearNote()
    .setBackground(GCGL_REPORT_COLORS.titleFill)
    .setFontColor(GCGL_REPORT_COLORS.text)
    .setFontFamily("Arial")
    .setFontSize(11)
    .setFontWeight("bold")
    .setHorizontalAlignment("left")
    .setVerticalAlignment("middle");
  sheet.setColumnWidth(1, firstColumnWidth || Math.max(sheet.getColumnWidth(1), 180));
  sheet.setRowHeight(1, 30);
}

function applyReportSiteFilter_(sheet, table, selectedSite) {
  if (table.key === "material_summary") {
    // 保留所有案場列供總覽公式與訂單查價；只隱藏未選案場，不刪除計算資料。
    const count = sheet.getLastRow() - 3;
    if (count <= 0) return;
    sheet.showRows(4, count);
    if (!selectedSite || selectedSite === GCGL_CONFIG.allSitesLabel) return;
    const hasSiteCopy = sheet.getRange(3, table.headers.length + 5).getValue() === GCGL_CONFIG.materialSiteNameHeader;
    const sites = sheet.getRange(4, hasSiteCopy ? table.headers.length + 5 : 1, count, 1).getValues();
    if (!hasSiteCopy) {
      sheet.getRange(4, 1, count, 1).getMergedRanges().forEach(function(range) {
        const first = range.getRow() - 4;
        for (let offset = 1; offset < range.getNumRows(); offset++) sites[first + offset] = sites[first].slice();
      });
    }
    let start = 0;
    for (let index = 1; index <= sites.length; index++) {
      const hide = !sameReportText_(sites[start][0], selectedSite);
      if (index < sites.length && hide === !sameReportText_(sites[index][0], selectedSite)) continue;
      if (hide) sheet.hideRows(4 + start, index - start);
      start = index;
    }
    return;
  }
  const filter = sheet.getFilter();
  if (!filter) return;
  const siteIndex = reportSiteColumnIndex_(table.key);
  if (siteIndex < 0) return;
  const siteColumn = siteIndex + 1;
  if (!selectedSite || selectedSite === GCGL_CONFIG.allSitesLabel) {
    filter.removeColumnFilterCriteria(siteColumn);
    return;
  }
  const criteria = SpreadsheetApp.newFilterCriteria()
    .whenTextEqualTo(selectedSite)
    .build();
  filter.setColumnFilterCriteria(siteColumn, criteria);
}

function createReportFilter_(sheet, startRow, startColumn, tableBlock) {
  const rowCount = tableBlock.endRow - startRow + 1;
  const columnCount = tableBlock.endColumn - startColumn + 1;
  sheet.getRange(startRow, startColumn, rowCount, columnCount).createFilter();
}

/** 僅覆寫指定欄位，保留其他欄寬；名稱包含各 App 語言實際同步的表頭。 */
function requestedReportColumnWidth_(header) {
  const label = optionalString_(header).trim().toLowerCase();
  const narrowTextHeaders = ["樓層/區域", "樓層／區域", "樓層",
    "楼层/区域", "楼层／区域", "楼层", "floor / area", "floor", "階／エリア", "층/구역"];
  if (narrowTextHeaders.indexOf(label) !== -1) return 99;
  if (["施工廠商", "施工单位", "contractor", "施工業者", "시공업체"].indexOf(label) !== -1) return 180;
  if (["工項", "施工項目", "施工项", "work item", "공종"].indexOf(label) !== -1) return 180;
  const dateHeaders = [
    "日期", "最後計價日", "最後記錄日", "最後訂購日", "到貨日期", "職安卡到期日", "體檢到期日", "勞保到期日",
    "最后计价日期", "最后记录日期", "最后订购日期", "到货日期",
    "date", "last billing date", "last record date", "last order date", "date received",
    "日付", "最終出来高日", "最終記録日", "最終発注日", "納品日",
    "날짜", "최종 기성일", "최종 기록일", "최종 주문일", "입고일"
  ];
  if (dateHeaders.indexOf(label) !== -1) return 180;
  const compactHeaders = [
    "層級", "類型", "總價", "已計價", "計價進度", "單位", "數量", "單價", "金額",
    "稅率", "含稅", "目前進度", "狀態", "進度", "施工進度", "人數", "加班時數",
    "訂購數量", "已送貨數量", "未送貨數量", "小計", "送貨狀態", "施工人員姓名", "本次計價總額",
    "层级", "类型", "总价", "已计价", "计价进度", "单位", "数量", "单价", "金额",
    "税率", "含税", "目前进度", "状态", "进度", "施工进度", "人数", "加班时数",
    "订购数量", "已送货数量", "未送货数量", "小计", "送货状态", "施工人员姓名", "本次计价总额",
    "level", "type", "total", "billed", "billing progress", "unit", "quantity", "unit price", "amount",
    "tax rate", "tax included", "current progress", "status", "progress", "construction progress", "crew size",
    "overtime hours", "order quantity", "delivered quantity", "undelivered quantity", "subtotal",
    "delivery status", "worker name", "current billing total",
    "区分", "タイプ", "総額", "出来高累計", "出来高進捗", "単位", "単価", "税込",
    "現在の進捗", "状態", "進捗", "施工進捗", "残業時間", "発注数量", "納品済み数量",
    "未納品数量", "配送状況", "作業員氏名", "今回出来高総額",
    "구분", "유형", "총액", "기성 누계", "기성 진행률", "단위", "수량", "단가", "금액",
    "세율", "세금 포함", "현재 진행률", "상태", "진행률", "공사 진행률", "인원", "연장 근무 시간",
    "주문 수량", "배송 완료 수량", "미배송 수량", "소계", "배송 상태", "작업자 이름", "이번 기성 총액"
  ];
  return compactHeaders.indexOf(label) !== -1 ? 99 : 0;
}

/** 使用原生有界條件格式；同步或使用者調整狀態文字後，顏色都跟隨儲存格內容。 */
function applyReportTextHighlight_(sheet, firstRow, rowCount, column, matches, background, fontColor, firstColumn, columnCount) {
  if (rowCount < 1) return;
  const cell = "$" + reportColumnLetter_(column) + firstRow;
  const formula = "=OR(" + matches.map(function(value) {
    return cell + '=\"' + value.replace(/\"/g, '\"\"') + '\"';
  }).join(",") + ")";
  const builder = SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied(formula)
    .setBackground(background).setRanges([sheet.getRange(firstRow, firstColumn || column, rowCount, columnCount || 1)]);
  if (fontColor) builder.setFontColor(fontColor);
  sheet.setConditionalFormatRules(sheet.getConditionalFormatRules().concat([builder.build()]));
}

function writeReportTableBlock_(sheet, startRow, startColumn, headers, rows, widths, formats) {
  const rowCount = Math.max(rows.length, 1);
  const columnCount = headers.length;
  ensureSheetSize_(sheet, startRow + rowCount, startColumn + columnCount - 1);
  const headerRange = sheet.getRange(startRow, startColumn, 1, columnCount);
  const bodyRange = sheet.getRange(startRow + 1, startColumn, rowCount, columnCount);
  const tableRange = sheet.getRange(startRow, startColumn, rowCount + 1, columnCount);

  headerRange.setValues([headers.map(reportHeader_)])
    .setBackground(GCGL_REPORT_COLORS.navy)
    .setFontColor(GCGL_REPORT_COLORS.headerText)
    .setFontFamily("Arial")
    .setFontSize(10)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setWrap(true);
  bodyRange.setValues(rows)
    .setFontColor(GCGL_REPORT_COLORS.text)
    .setFontFamily("Arial")
    .setFontSize(10)
    .setVerticalAlignment("middle")
    .setWrap(true);
  const banding = tableRange.applyRowBanding(
    SpreadsheetApp.BandingTheme.BLUE,
    true,
    false
  );
  banding
    .setHeaderRowColor(GCGL_REPORT_COLORS.navy)
    .setFirstRowColor(GCGL_REPORT_COLORS.firstRow)
    .setSecondRowColor(GCGL_REPORT_COLORS.secondRow);
  clearUnusedReportBorders_(sheet, [tableRange]);
  tableRange.setBorder(
    true,
    true,
    true,
    true,
    true,
    true,
    GCGL_REPORT_COLORS.border,
    SpreadsheetApp.BorderStyle.SOLID
  );
  sheet.setRowHeight(startRow, 28);

  headers.forEach(function(header, index) {
    const width = requestedReportColumnWidth_(header) ||
      Math.max(70, Math.min(420, Number(widths[index]) || 110));
    sheet.setColumnWidth(startColumn + index, width);
    const format = optionalString_(formats[index]);
    if (format) bodyRange.offset(0, index, rowCount, 1).setNumberFormat(format);
    if (/^[#0]/.test(format)) {
      bodyRange.offset(0, index, rowCount, 1).setHorizontalAlignment("right");
    } else {
      bodyRange.offset(0, index, rowCount, 1).setHorizontalAlignment("left");
    }
  });
  return {
    endRow: startRow + rowCount,
    endColumn: startColumn + columnCount - 1
  };
}

/** 最終欄寬／合併完成後逐列適高；呼叫範圍只含 GCGL 的可見表格，不含總覽或隱藏識別欄。 */
function fitReportRowHeights_(sheet, startRow, rowCount, startColumn, columnCount, useNative, hasHeader) {
  if (rowCount < 1 || columnCount < 1) return;
  useNative = useNative !== false;
  hasHeader = hasHeader !== false;
  const range = sheet.getRange(startRow, startColumn, rowCount, columnCount);
  range.setWrap(true);
  const merges = range.getMergedRanges().filter(function(merged) {
    return merged.getRow() >= startRow && merged.getColumn() >= startColumn &&
      merged.getRow() + merged.getNumRows() <= startRow + rowCount &&
      merged.getColumn() + merged.getNumColumns() <= startColumn + columnCount;
  });
  if (useNative) {
    // 重設舊高度，內容變少也會縮回；未合併的一般列交由 Google 原生量測。
    sheet.setRowHeights(startRow, rowCount, 24);
    sheet.autoResizeRows(startRow, rowCount);
    if (hasHeader) sheet.setRowHeight(startRow, Math.max(28, sheet.getRowHeight(startRow)));
    if (merges.length === 0) return;
  }
  // Google 不會可靠地自動量測合併格；按實際欄寬／字級估算，且不讓隱藏長識別碼撐高。
  const values = range.getDisplayValues(), fonts = range.getFontSizes();
  const widths = Array.from({length: columnCount}, function(_, index) {
    return sheet.getColumnWidth(startColumn + index);
  });
  const covered = new Set(), affectedRows = new Set(), constraints = [];
  merges.forEach(function(merged) {
    const row = merged.getRow() - startRow, column = merged.getColumn() - startColumn;
    const rows = merged.getNumRows(), columns = merged.getNumColumns();
    for (let r = row; r < row + rows; r++) {
      affectedRows.add(r);
      for (let c = column; c < column + columns; c++) covered.add(r + ":" + c);
    }
    constraints.push({row: row, rows: rows, height: reportTextFitHeight_(values[row][column],
      widths.slice(column, column + columns).reduce(function(sum, width) { return sum + width; }, 0), fonts[row][column])});
  });
  const heights = values.map(function(cells, row) {
    let height = hasHeader && row === 0 ? 28 : 24;
    cells.forEach(function(text, column) {
      if (!covered.has(row + ":" + column)) height = Math.max(height, reportTextFitHeight_(text, widths[column], fonts[row][column]));
    });
    return height;
  });
  // 先滿足小範圍，再檢查跨多列的總高度；合併格不會讓每一列都重複增加同樣高度。
  constraints.sort(function(a, b) { return a.rows - b.rows; }).forEach(function(item) {
    const available = heights.slice(item.row, item.row + item.rows).reduce(function(sum, height) { return sum + height; }, 0);
    const extra = Math.max(0, item.height - available);
    for (let row = item.row; extra > 0 && row < item.row + item.rows; row++) {
      heights[row] += Math.floor(extra / item.rows) + (row - item.row < extra % item.rows ? 1 : 0);
    }
  });
  // 相鄰同高度一次寫入，不逐格呼叫服務；一般原生量測列不被估算值覆寫。
  for (let row = 0; row < rowCount;) {
    if (useNative && !affectedRows.has(row)) { row++; continue; }
    let end = row + 1;
    while (end < rowCount && heights[end] === heights[row] && (!useNative || affectedRows.has(end))) end++;
    // 固定估算後的範圍高度，避免隱藏欄或合併格再次自行把單列撐高。
    sheet.setRowHeightsForced(startRow + row, end - row, heights[row]);
    row = end;
  }
}

/** 保守估算手動換行及欄寬折行；CJK／韓文按全形寬，拉丁字母按比例字寬。 */
function reportTextFitHeight_(value, width, fontSize) {
  const text = optionalString_(value).replace(/\r\n?/g, "\n");
  if (!text) return 0;
  const em = (Number(fontSize) || 10) * 4 / 3;
  const available = Math.max(em, width - 12);
  const characterWidth = function(character) {
    const code = character.codePointAt(0);
    if (/[\u0300-\u036f\ufe00-\ufe0f\u200d]/.test(character)) return 0;
    const factor = code >= 0x2e80 ? 1 : /[MW@#%&]/.test(character) ? 0.9 :
      /[\s.,:;!|ilI'`]/.test(character) ? (character === "\t" ? 1.4 : 0.32) : 0.6;
    return factor * em * 1.05;
  };
  let lines = 0;
  text.split("\n").forEach(function(line) {
    let used = 0;
    lines++;
    // 英文依單字折行；長單字與中日韓文字仍可逐字折行。
    (line.match(/[A-Za-z0-9_./@#%&'`:+-]+|./gu) || []).forEach(function(token) {
      const characters = Array.from(token);
      const tokenWidth = characters.reduce(function(sum, character) { return sum + characterWidth(character); }, 0);
      if (used > 0 && characters.length > 1 && tokenWidth <= available && used + tokenWidth > available) { lines++; used = 0; }
      characters.forEach(function(character) {
        const pixels = characterWidth(character);
        if (used > 0 && used + pixels > available) { lines++; used = 0; }
        used += pixels;
      });
    });
  });
  return Math.ceil(lines * Math.ceil(em * 1.2) + 8);
}

/** 由擁有者手動執行；不改動資料、單價、同步密碼或部署網址。 */
function configureGCGLReportWarnings() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet() || configuredSpreadsheet_();
  applyGCGLReportProtection_(spreadsheet);
  console.log("已設定編輯警告；案場下拉選單、材料單價表及材料統計的單價輸入格不警告。" +
    "包含擁有者在內的編輯者均可確認警告後繼續修改，這不是禁止編輯。");
}

/** 保留舊函式名稱，方便已使用鎖定版的使用者套用新的警告模式。 */
function lockGCGLReportSheets() {
  return configureGCGLReportWarnings();
}

/** 只列出同步設定與報表使用的名稱，不以所有分頁或名稱前綴判斷。 */
function managedGCGLSheetNames_(tables) {
  tables = tables || loadTableSchemas_();
  if (tables.length === 0) {
    const mapping = loadManagedTables_();
    tables = GCGL_CONFIG.expectedTableKeys.map(function(key) {
      return {key: key, sheetName: mapping[key] || GCGL_CONFIG.defaultSheetNames[key]};
    });
  }
  tables = tables.filter(function(table) { return table.key !== "construction_progress"; });
  return uniqueStrings_(tables.map(function(table) { return table.sheetName; })
    .concat(tables.map(reportSheetName_), [
      GCGL_CONFIG.pricingStatisticsSheetName,
      GCGL_CONFIG.workLogReportSheetName,
      GCGL_CONFIG.previousWorkLogReportSheetName,
      GCGL_CONFIG.workerAttendanceSheetName,
      GCGL_CONFIG.rawDataSheetName,
      GCGL_CONFIG.syncLogSheetName,
      GCGL_CONFIG.memorySheetName,
      GCGL_CONFIG.materialPricesSheetName,
      GCGL_CONFIG.workerWagesSheetName,
      GCGL_CONFIG.workerDetailsSheetName
    ]));
}

function gcglSheetProtections_(sheet) {
  return sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET)
    .filter(function(protection) {
      return ["GCGL：編輯前警告（材料單價除外）",
        "GCGL：自動報表唯讀（僅材料單價可輸入）"]
        .indexOf(protection.getDescription()) !== -1;
    });
}

/** 修復舊版誤套在自訂分頁的 GCGL 規則；使用者自己的保護不動。 */
function removeUnmanagedGCGLProtection_(sheet) {
  gcglSheetProtections_(sheet).forEach(function(protection) {
    if (protection.canEdit()) protection.remove();
    else console.warn("請由原設定帳號移除「" + sheet.getName() + "」的舊 GCGL 保護。");
  });
}

/** 受管理分頁整頁編輯警告；案場篩選、單價與工資輸入除外。 */
function applyGCGLReportProtection_(spreadsheet) {
  const tables = loadTableSchemas_();
  const managedNames = managedGCGLSheetNames_(tables);
  const catalog = tables.find(function(table) {
    return table.key === "material_catalog";
  });
  const catalogName = catalog ? catalog.sheetName :
    loadManagedTables_().material_catalog || GCGL_CONFIG.defaultSheetNames.material_catalog;
  const selectorSheetNames = tables.filter(function(table) {
    return supportsReportSiteSelector_(table.key);
  }).map(reportSheetName_);
  const ganttSheetIds = new Set(constructionGanttSheets_(spreadsheet).map(function(item) { return item.sheet.getSheetId(); }));
  const combinedPricing = combinedPricingSheet_(spreadsheet);
  const retiredNames = retiredReportNames_(tables);
  spreadsheet.getSheets().forEach(function(sheet) {
    if (isLegacyRawSheetName_(sheet.getName()) || isArchivedLegacyWorkerAttendance_(sheet)) return;
    if (sheet.getName() === GCGL_CONFIG.memorySheetName && !ownedGCGLMemorySheet_(sheet)) return;
    if (retiredNames.has(sheet.getName()) && (!combinedPricing || sheet.getSheetId() !== combinedPricing.getSheetId())) return;
    if (managedNames.indexOf(sheet.getName()) === -1 && !workerMonthForSheet_(sheet) &&
        !ganttSheetIds.has(sheet.getSheetId()) && (!combinedPricing || combinedPricing.getSheetId() !== sheet.getSheetId())) {
      removeUnmanagedGCGLProtection_(sheet);
      return;
    }
    const inputRanges = materialPriceInputRanges_(sheet, catalogName);
    if (selectorSheetNames.indexOf(sheet.getName()) !== -1) {
      inputRanges.push(sheet.getRange(1, 1));
    }
    if (tables.some(function(table) { return table.key === "site_overview" && table.sheetName === sheet.getName(); })) {
      inputRanges.push(sheet.getRange(1, 7));
    }
    const summary = tables.find(function(table) {
      return table.key === "material_summary" && table.sheetName === sheet.getName();
    });
    if (summary) Array.prototype.push.apply(inputRanges, materialSummaryPriceInputRanges_(sheet, summary));
    if (isWorkerAttendanceSheet_(sheet)) {
      Array.prototype.push.apply(inputRanges, workerWageInputRanges_(sheet));
    }
    Array.prototype.push.apply(inputRanges, workerDirectoryInputRanges_(sheet));
    protectGCGLSheet_(sheet, inputRanges);
  });
}

function materialSummaryPriceInputRanges_(sheet, table) {
  const layout = materialSummaryInputLayout_(sheet, table);
  if (!layout) return [];
  const keys = sheet.getRange(4, layout.keyColumn, sheet.getLastRow() - 3, 1).getValues();
  const ranges = [];
  let start = -1;
  for (let index = 0; index <= keys.length; index++) {
    const hasItem = index < keys.length && validMaterialPriceKey_(keys[index][0]);
    if (hasItem && start === -1) start = index;
    if (!hasItem && start !== -1) {
      ranges.push(sheet.getRange(start + 4, layout.priceColumn, index - start, 1));
      start = -1;
    }
  }
  return ranges;
}

function materialPriceInputRanges_(sheet, catalogName) {
  if (sheet.getName() !== catalogName) return [];
  const layout = materialCatalogLayout_(sheet);
  if (!layout || sheet.getLastRow() < layout.firstDataRow) return [];
  const rows = sheet.getRange(layout.firstDataRow, 1, sheet.getLastRow() - layout.firstDataRow + 1, layout.width).getValues();
  const ranges = [];
  layout.blocks.forEach(function(block) {
    let start = -1;
    for (let index = 0; index <= rows.length; index++) {
      const hasItem = index < rows.length && optionalString_(rows[index][block.key - 1]) !== "";
      if (hasItem && start === -1) start = index;
      if (!hasItem && start !== -1) {
        ranges.push(sheet.getRange(start + layout.firstDataRow, block.price, index - start, 1));
        start = -1;
      }
    }
  });
  return ranges;
}

function sameProtectionRanges_(left, right) {
  if (left.length !== right.length) return false;
  return left.every(function(range, index) {
    const target = right[index];
    return range.getRow() === target.getRow() && range.getColumn() === target.getColumn() &&
      range.getNumRows() === target.getNumRows() && range.getNumColumns() === target.getNumColumns();
  });
}

/** 只維護本程式的保護，不移除使用者既有的其他保護規則。 */
function protectGCGLSheet_(sheet, inputRanges) {
  const description = "GCGL：編輯前警告（材料單價除外）";
  const managed = gcglSheetProtections_(sheet);
  if (managed.some(function(protection) { return !protection.canEdit(); })) {
    throw new Error("無法更新「" + sheet.getName() + "」的 GCGL 保護，請由原設定帳號執行。");
  }
  const protection = managed[0] || sheet.protect();
  protection.setDescription(description);
  // 直接把本程式的舊限制編輯規則轉為警告；不另外留下擋住編輯的舊規則。
  // 警告模式不調整編輯者權限，擁有者與其他編輯者都能確認後繼續修改。
  if (!protection.isWarningOnly()) protection.setWarningOnly(true);
  if (!sameProtectionRanges_(protection.getUnprotectedRanges(), inputRanges)) {
    protection.setUnprotectedRanges(inputRanges);
  }
  // 先完成警告與例外範圍，再清理本程式的重複規則。
  managed.slice(1).forEach(function(duplicate) { duplicate.remove(); });
}

function withoutArrayIndex_(values, removedIndex) {
  if (!Array.isArray(values)) return [];
  return values.filter(function(_, index) { return index !== removedIndex; });
}

function sameReportText_(left, right) {
  return optionalString_(left) === optionalString_(right);
}

function uniqueStrings_(values) {
  const result = [];
  const seen = {};
  values.forEach(function(value) {
    const text = optionalString_(value);
    if (!text || seen[text]) return;
    seen[text] = true;
    result.push(text);
  });
  return result;
}

function uniqueNumbers_(values) {
  const seen = {};
  return values.filter(function(value) {
    const key = String(value);
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function validateRowDeltaTables_(rawTables) {
  if (!Array.isArray(rawTables)) throw new Error("tables 必須是陣列。");
  const normalized = validateTables_(rawTables.map(function(rawTable) {
    return {
      key: rawTable && rawTable.key,
      sheetName: rawTable && rawTable.sheetName,
      headers: rawTable && rawTable.headers,
      widths: rawTable && rawTable.widths,
      formats: rawTable && rawTable.formats,
      rows: rawTable && rawTable.upserts
    };
  }), true, true);

  return normalized.map(function(table, index) {
    const rawTable = rawTables[index] || {};
    const deletedRecordIds = Array.isArray(rawTable.deletedRecordIds)
      ? rawTable.deletedRecordIds.map(function(recordId, recordIndex) {
          return requiredString_(
            recordId,
            table.key + ".deletedRecordIds[" + recordIndex + "]"
          );
        })
      : [];
    if (uniqueStrings_(deletedRecordIds).length !== deletedRecordIds.length) {
      throw new Error(table.key + ".deletedRecordIds 含有重複識別碼。");
    }
    const upsertIDs = {};
    table.rows.forEach(function(row) { upsertIDs[row.recordId] = true; });
    if (deletedRecordIds.some(function(recordId) { return upsertIDs[recordId]; })) {
      throw new Error(table.key + " 同一筆記錄不可同時新增及刪除。");
    }
    table.upserts = table.rows;
    table.deletedRecordIds = deletedRecordIds;
    delete table.rows;
    return table;
  });
}

function validateTables_(rawTables, rowsContainSiteId, allowsPartial) {
  if (!Array.isArray(rawTables)) {
    throw new Error("tables 必須是陣列。");
  }

  const seenKeys = {};
  const tables = rawTables.map(function(rawTable, tableIndex) {
    const key = requiredString_(rawTable && rawTable.key, "tables[" + tableIndex + "].key");
    if (GCGL_CONFIG.expectedTableKeys.indexOf(key) === -1) {
      throw new Error("未知的資料表 key：" + key);
    }
    if (seenKeys[key]) {
      throw new Error("資料表 key 重複：" + key);
    }
    seenKeys[key] = true;

    const headers = rawTable.headers;
    if (!Array.isArray(headers) || headers.length === 0) {
      throw new Error(key + ".headers 不可為空。");
    }
    if (headers.length > GCGL_CONFIG.maxVisibleColumns) {
      throw new Error(key + " 欄位數量過多。");
    }
    const normalizedHeaders = headers.map(function(value, headerIndex) {
      return requiredString_(value, key + ".headers[" + headerIndex + "]");
    });

    const rows = Array.isArray(rawTable.rows) ? rawTable.rows : [];
    if (rows.length > GCGL_CONFIG.maxRowsPerTable) {
      throw new Error(key + " 資料列超過第一版允許的上限。");
    }
    const seenRecordIDs = {};
    rows.forEach(function(row, rowIndex) {
      if (!row || !Array.isArray(row.values)) {
        throw new Error(key + ".rows[" + rowIndex + "].values 必須是陣列。");
      }
      if (row.values.length !== normalizedHeaders.length) {
        throw new Error(key + ".rows[" + rowIndex + "] 的欄位數量不正確。");
      }
      const recordId = requiredString_(row.recordId, key + ".rows[" + rowIndex + "].recordId");
      if (seenRecordIDs[recordId]) {
        throw new Error(key + " 含有重複 recordId：" + recordId);
      }
      seenRecordIDs[recordId] = true;
      if (rowsContainSiteId) {
        requiredString_(row.siteId, key + ".rows[" + rowIndex + "].siteId");
      }
    });

    const widths = Array.isArray(rawTable.widths)
      ? normalizedHeaders.map(function(_, index) { return rawTable.widths[index]; })
      : null;
    const formats = Array.isArray(rawTable.formats)
      ? normalizedHeaders.map(function(_, index) { return rawTable.formats[index] || ""; })
      : null;

    return {
      key: key,
      sheetName: sanitizeSheetName_(rawTable.sheetName || GCGL_CONFIG.defaultSheetNames[key]),
      headers: normalizedHeaders,
      rows: rows,
      widths: widths,
      formats: formats
    };
  });

  const missingKeys = GCGL_CONFIG.expectedTableKeys.filter(function(key) {
    return GCGL_CONFIG.optionalTableKeys.indexOf(key) === -1 && !seenKeys[key];
  });
  if (!allowsPartial && missingKeys.length > 0) {
    throw new Error("缺少資料表：" + missingKeys.join(", "));
  }

  return tables;
}

function buildStoredRow_(siteId, row, visibleColumnCount, operationId, fallbackUpdatedAt) {
  const recordId = requiredString_(row.recordId, "row.recordId");
  const values = row.values.map(sanitizeCellValue_);
  if (values.length !== visibleColumnCount) {
    throw new Error("recordId " + recordId + " 的資料欄位數量不正確。");
  }
  return [
    siteId,
    recordId,
    optionalString_(row.updatedAt) || optionalString_(fallbackUpdatedAt) || new Date().toISOString(),
    operationId
  ].concat(values);
}

function sanitizeCellValue_(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (typeof value !== "string") {
    throw new Error("儲存格只接受文字、數字、布林值或空值。");
  }

  // 避免使用者輸入內容被 Google 試算表解讀為公式。
  if (/^[=+\-@]/.test(value)) {
    return "'" + value;
  }
  return value;
}

function validateEnvelope_(payload) {
  const properties = PropertiesService.getScriptProperties();
  const configuredToken = properties.getProperty(GCGL_CONFIG.tokenProperty);
  if (!configuredToken) {
    throw new Error("Apps Script 尚未設定，請先執行 setupGCGLSync()。" );
  }
  if (!tokensMatch_(configuredToken, optionalString_(payload.token))) {
    throw new Error("同步密碼不正確。");
  }
  if (Number(payload.schemaVersion) !== GCGL_CONFIG.schemaVersion) {
    throw new Error(
      "同步格式版本不相容。App=" + payload.schemaVersion +
      "，Apps Script=" + GCGL_CONFIG.schemaVersion
    );
  }

  requiredString_(payload.action, "action");
  requiredString_(payload.operationId, "operationId");
}

function parsePayload_(event) {
  const contents = event && event.postData && event.postData.contents;
  if (!contents) throw new Error("沒有收到同步資料。");
  try {
    return JSON.parse(contents);
  } catch (_) {
    throw new Error("同步資料不是有效的 JSON。");
  }
}

function configuredSpreadsheet_() {
  const spreadsheetId = PropertiesService
    .getScriptProperties()
    .getProperty(GCGL_CONFIG.spreadsheetProperty);
  if (!spreadsheetId) {
    throw new Error("尚未設定目標試算表，請先執行 setupGCGLSync()。" );
  }
  return SpreadsheetApp.openById(spreadsheetId);
}

function isConfigured_() {
  const properties = PropertiesService.getScriptProperties();
  return Boolean(
    properties.getProperty(GCGL_CONFIG.spreadsheetProperty) &&
    properties.getProperty(GCGL_CONFIG.tokenProperty)
  );
}

function saveManagedTables_(tables) {
  const mapping = Object.assign({}, loadManagedTables_());
  tables.forEach(function(table) {
    mapping[table.key] = table.sheetName;
  });
  PropertiesService
    .getScriptProperties()
    .setProperty(GCGL_CONFIG.managedTablesProperty, JSON.stringify(mapping));
}

function loadManagedTables_() {
  const raw = PropertiesService
    .getScriptProperties()
    .getProperty(GCGL_CONFIG.managedTablesProperty);
  if (!raw) return GCGL_CONFIG.defaultSheetNames;
  try {
    return JSON.parse(raw);
  } catch (_) {
    return GCGL_CONFIG.defaultSheetNames;
  }
}

/** 舊版每類型一張 hidden sheet 的名稱，只用於一次性資料搬移。 */
function legacyRawSheetName_(tableKey) {
  return (GCGL_CONFIG.legacyRawSheetPrefix + requiredString_(tableKey, "tableKey")).slice(0, 100);
}

function isLegacyRawSheetName_(name) {
  return name.indexOf(GCGL_CONFIG.legacyRawSheetPrefix) === 0 &&
    GCGL_CONFIG.expectedTableKeys.some(function(key) { return name === legacyRawSheetName_(key); });
}

function isGCGLInternalSheet_(sheet) {
  const name = sheet.getName();
  return name === GCGL_CONFIG.syncLogSheetName ||
    name === GCGL_CONFIG.rawDataSheetName ||
    (name === GCGL_CONFIG.memorySheetName && ownedGCGLMemorySheet_(sheet)) ||
    name === GCGL_CONFIG.materialPricesSheetName ||
    name === GCGL_CONFIG.workerWagesSheetName ||
    name === GCGL_CONFIG.workerDetailsSheetName;
}

/** Google 不允許隱藏最後一張可見分頁，必要時先建立／顯示總覽。 */
function visibleReportSheet_(spreadsheet) {
  const visible = spreadsheet.getSheets().find(function(sheet) {
    return !isGCGLInternalSheet_(sheet) && !sheet.isSheetHidden();
  });
  if (visible) return visible;
  const name = loadManagedTables_().site_overview || GCGL_CONFIG.defaultSheetNames.site_overview;
  let overview = spreadsheet.getSheetByName(name);
  if (!overview) overview = spreadsheet.insertSheet(name);
  if (overview.isSheetHidden()) overview.showSheet();
  return overview;
}

function hideInternalSheet_(spreadsheet, sheet, previousActiveSheet) {
  if (sheet.isSheetHidden()) return;
  const visible = previousActiveSheet &&
    !isGCGLInternalSheet_(previousActiveSheet) && !previousActiveSheet.isSheetHidden()
    ? previousActiveSheet
    : visibleReportSheet_(spreadsheet);
  const active = spreadsheet.getActiveSheet();
  if (active && active.getSheetId() === sheet.getSheetId()) {
    spreadsheet.setActiveSheet(visible);
  }
  sheet.hideSheet();
}

function hideInternalSheets_(spreadsheet, skipReorder) {
  if (!spreadsheet) return;
  const internalSheets = orderedInternalSheets_(spreadsheet);
  if (internalSheets.length === 0) return;
  const visible = visibleReportSheet_(spreadsheet);
  const active = spreadsheet.getActiveSheet();
  if (active && isGCGLInternalSheet_(active)) spreadsheet.setActiveSheet(visible);
  internalSheets.forEach(function(sheet) { if (!sheet.isSheetHidden()) sheet.hideSheet(); });
  if (skipReorder) return; // 本輪重建結束才一次排序，避免做兩次相同操作。
  let position = spreadsheet.getSheets().length;
  internalSheets.reverse().forEach(function(sheet) {
    if (spreadsheet.getSheets()[position - 1].getSheetId() !== sheet.getSheetId()) {
      moveGCGLSheet_(spreadsheet, sheet, position);
    }
    position -= 1;
  });
  if (active && !isGCGLInternalSheet_(active) && !active.isSheetHidden()) spreadsheet.setActiveSheet(active);
}

/** 保存欄名、欄寬與格式，讓刪除案場或手動重建報表時仍可還原版面。 */
function saveTableSchemas_(tables) {
  const schemasByKey = {};
  loadTableSchemas_().forEach(function(schema) {
    if (schema && schema.key) schemasByKey[schema.key] = schema;
  });
  tables.forEach(function(table) {
    schemasByKey[table.key] = {
      key: table.key,
      sheetName: table.sheetName,
      headers: table.headers,
      widths: table.widths || [],
      formats: table.formats || []
    };
  });
  const schemas = GCGL_CONFIG.expectedTableKeys
    .map(function(key) { return schemasByKey[key]; })
    .filter(function(schema) { return Boolean(schema); });
  PropertiesService
    .getScriptProperties()
    .setProperty(GCGL_CONFIG.tableSchemasProperty, JSON.stringify(schemas));
}

function loadTableSchemas_() {
  const raw = PropertiesService
    .getScriptProperties()
    .getProperty(GCGL_CONFIG.tableSchemasProperty);
  if (!raw) return [];
  try {
    const schemas = JSON.parse(raw);
    return Array.isArray(schemas) ? schemas : [];
  } catch (_) {
    return [];
  }
}

function ensureSyncLogSheet_(spreadsheet) {
  const previousActiveSheet = spreadsheet.getActiveSheet();
  let sheet = spreadsheet.getSheetByName(GCGL_CONFIG.syncLogSheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(GCGL_CONFIG.syncLogSheetName);
    protectGCGLSheet_(sheet, []);
  }
  hideInternalSheet_(spreadsheet, sheet, previousActiveSheet);
  sheet.getRange(1, 1, 1, 4).setValues([[
    "operation_id",
    "action",
    "received_at",
    "site_id"
  ]]);
  sheet.setFrozenRows(1);
  return sheet;
}

function wasOperationProcessed_(spreadsheet, operationId) {
  const sheet = ensureSyncLogSheet_(spreadsheet);
  if (sheet.getLastRow() < 2) return false;
  return Boolean(
    sheet
      .getRange(2, 1, sheet.getLastRow() - 1, 1)
      .createTextFinder(operationId)
      .matchEntireCell(true)
      .findNext()
  );
}

function recordProcessedOperation_(spreadsheet, payload) {
  const sheet = ensureSyncLogSheet_(spreadsheet);
  const siteId = payload.site && payload.site.id
    ? String(payload.site.id)
    : optionalString_(payload.siteId);
  sheet.appendRow([
    payload.operationId,
    payload.action,
    new Date().toISOString(),
    siteId
  ]);

  const excessRows = sheet.getLastRow() - 1 - GCGL_CONFIG.maxSyncLogRows;
  if (excessRows > 0) {
    sheet.deleteRows(2, excessRows);
  }
}

function ensureSheetSize_(sheet, requiredRows, requiredColumns) {
  if (sheet.getMaxRows() < requiredRows) {
    sheet.insertRowsAfter(sheet.getMaxRows(), requiredRows - sheet.getMaxRows());
  }
  if (sheet.getMaxColumns() < requiredColumns) {
    sheet.insertColumnsAfter(
      sheet.getMaxColumns(),
      requiredColumns - sheet.getMaxColumns()
    );
  }
}

function sanitizeSheetName_(value) {
  const name = requiredString_(value, "sheetName")
    .replace(/[\\/?*\[\]:]/g, "_")
    .slice(0, 100);
  if (!name) throw new Error("工作表名稱不可為空。");
  if ([GCGL_CONFIG.syncLogSheetName, GCGL_CONFIG.memorySheetName, GCGL_CONFIG.materialPricesSheetName,
      GCGL_CONFIG.workerWagesSheetName, GCGL_CONFIG.workerDetailsSheetName].indexOf(name) !== -1) {
    throw new Error("工作表名稱不可使用系統保留名稱。");
  }
  if (name.indexOf(GCGL_CONFIG.rawSheetPrefix) === 0) {
    throw new Error("工作表名稱不可使用系統保留前綴。");
  }
  return name;
}

function requiredString_(value, fieldName) {
  const text = optionalString_(value);
  if (!text) throw new Error(fieldName + " 不可為空。");
  return text;
}

function optionalString_(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function arraysEqual_(left, right) {
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index += 1) {
    if (String(left[index]) !== String(right[index])) return false;
  }
  return true;
}

function tokensMatch_(left, right) {
  if (!left || !right || left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function createSyncToken_() {
  return (
    Utilities.getUuid().replace(/-/g, "") +
    Utilities.getUuid().replace(/-/g, "")
  );
}

function jsonResponse_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
