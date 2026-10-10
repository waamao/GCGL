/**
 * GCGL 工程歷程 → Google 試算表同步 Web App
 *
 * 支援：
 * - ping：測試連線
 * - replaceSite：以 App 傳來的完整案場快照，取代該案場在所有工作表的資料
 * - deleteSite：移除該案場在所有工作表的資料
 * - fullSync：以 App 完整資料取代所有受管理工作表
 * - syncChanged：只取代內容有變化的資料表
 * - syncRows：依 recordId 逐筆新增、修改或刪除資料列
 *
 * 同步要求只更新隱藏原始資料；可見報表由短延遲的單次工作集中重建。
 * 初始設定會建立每日午夜的總覽更新工作，跨日刷新日期與今日工程記錄。
 *
 * 請先在綁定試算表的 Apps Script 編輯器執行 setupGCGLSync()，
 * 再部署為「網頁應用程式」。
 */

const GCGL_CONFIG = Object.freeze({
  schemaVersion: 1,
  spreadsheetProperty: "GCGL_SPREADSHEET_ID",
  tokenProperty: "GCGL_SYNC_TOKEN",
  managedTablesProperty: "GCGL_MANAGED_TABLES",
  tableSchemasProperty: "GCGL_TABLE_SCHEMAS",
  reportSelectionPropertyPrefix: "GCGL_REPORT_SITE_SELECTION_",
  pricingReportLayoutProperty: "GCGL_PRICING_REPORT_LAYOUT",
  pricingStatisticsSheetName: "計價統計",
  workLogReportSheetName: "工程記錄",
  previousWorkLogReportSheetName: "施工記錄",
  reportRebuildPendingProperty: "GCGL_REPORT_REBUILD_PENDING",
  reportRebuildGenerationProperty: "GCGL_REPORT_REBUILD_GENERATION",
  reportRebuildChangedKeysProperty: "GCGL_REPORT_REBUILD_CHANGED_KEYS",
  reportRebuildTriggerIdProperty: "GCGL_REPORT_REBUILD_TRIGGER_ID",
  lastDataSyncAtProperty: "GCGL_LAST_DATA_SYNC_AT",
  reportRebuildHandler: "processPendingGCGLReportRebuild",
  reportRebuildDelayMilliseconds: 5000,
  dailyOverviewRefreshHandler: "refreshGCGLDailyOverview",
  dailyOverviewTriggerIdProperty: "GCGL_DAILY_OVERVIEW_TRIGGER_ID",
  dailyOverviewTimeZoneProperty: "GCGL_DAILY_OVERVIEW_TIME_ZONE",
  allSitesLabel: "全部案場",
  syncLogSheetName: "__GCGL_SYNC_LOG",
  rawDataSheetName: "__GCGL_DATA",
  materialPricesSheetName: "__GCGL_MATERIAL_PRICES",
  materialPricesHeaders: ["__price_key", "__catalog_id", "__category", "__item", "__unit_price"],
  materialPriceKeyHeader: "__material_price_key",
  materialCatalogIdHeader: "__material_catalog_id",
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
    "material_catalog"
  ],
  optionalTableKeys: ["material_catalog"],
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
    material_catalog: "材料單價表"
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
  border: "#CCD6E0",
  text: "#263238"
});

/** 在試算表開啟時加入操作選單。 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("GCGL 同步")
    .addItem("初始設定／查看同步密碼", "setupGCGLSyncFromMenu")
    .addItem("重建報表版面", "rebuildGCGLReports")
    .addItem("重新產生同步密碼", "rotateGCGLSyncTokenFromMenu")
    .addToUi();
  hideInternalSheets_(SpreadsheetApp.getActiveSpreadsheet());
}

/** 在一般資料頁切換案場時，直接套用標題列的原生篩選。 */
function onEdit(event) {
  if (!event || !event.range) return;
  const range = event.range;
  if (handleMaterialSummaryPriceEdit_(event)) return;
  if (range.getRow() !== 1 || range.getColumn() !== 1) return;

  const sheet = range.getSheet();
  const tables = loadTableSchemas_();
  if (sheet.getName() === GCGL_CONFIG.pricingStatisticsSheetName) {
    const selectedSite = optionalString_(range.getValue()) || GCGL_CONFIG.allSitesLabel;
    const properties = PropertiesService.getScriptProperties();
    ["pricing_progress", "pricing_detail"].forEach(function(key) {
      properties.setProperty(reportSelectionPropertyKey_(key), selectedSite);
    });
    applyPricingReportSiteFilter_(sheet, selectedSite);
    return;
  }
  const table = tables.find(function(item) {
    return reportSheetName_(item) === sheet.getName() && supportsReportSiteSelector_(item.key);
  });
  if (!table) return;

  const selectedSite = optionalString_(range.getValue()) || GCGL_CONFIG.allSitesLabel;
  PropertiesService.getScriptProperties().setProperty(
    reportSelectionPropertyKey_(table.key), selectedSite
  );
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

  // material_catalog 是 optional；若 App 這次未提供，沿用既有資料，與舊版行為一致。
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
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const tables = loadTableSchemas_();
  if (tables.length === 0) {
    SpreadsheetApp.getUi().alert("目前沒有同步資料，請先從 App 執行立即完整同步。");
    return;
  }
  renderReportSheets_(spreadsheet, tables);
  SpreadsheetApp.flush();
  clearReportRebuildState_();
  resetDeferredReportTriggers_();
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
  const properties = PropertiesService.getScriptProperties();
  const triggerId = event && event.triggerUid ? String(event.triggerUid) : "";
  if (properties.getProperty(GCGL_CONFIG.reportRebuildPendingProperty) !== "1") {
    clearDeferredReportTrigger_(triggerId);
    return;
  }

  const generationAtStart = Number(
    properties.getProperty(GCGL_CONFIG.reportRebuildGenerationProperty) || "0"
  );
  const changedKeys = loadPendingReportKeys_();
  try {
    const tables = loadTableSchemas_();
    if (tables.length === 0) {
      clearReportRebuildState_();
      return;
    }
    renderReportSheets_(configuredSpreadsheet_(), tables, changedKeys);
    SpreadsheetApp.flush();

    const latestGeneration = Number(
      properties.getProperty(GCGL_CONFIG.reportRebuildGenerationProperty) || "0"
    );
    if (latestGeneration === generationAtStart) {
      clearReportRebuildState_();
    }
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    // 保留 pending，稍後建立新的單次觸發條件重試。
  } finally {
    clearDeferredReportTrigger_(triggerId);
    if (properties.getProperty(GCGL_CONFIG.reportRebuildPendingProperty) === "1") {
      try {
        ensureDeferredReportTrigger_();
      } catch (error) {
        console.error(error && error.stack ? error.stack : error);
      }
    }
  }
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
}

/** App 顯示語言改變時沿用原工作表，避免留下另一組舊語言分頁。 */
function migrateManagedSheetNames_(spreadsheet, previousMapping, tables) {
  tables.forEach(function(table) {
    // 這三類資料的可見名稱由報表控制，不跟著 App 的原始資料表名稱改回舊分頁。
    if (["pricing_progress", "pricing_detail", "work_logs"].indexOf(table.key) !== -1) return;
    const oldName = previousMapping[table.key];
    if (!oldName || oldName === table.sheetName) return;

    const oldSheet = spreadsheet.getSheetByName(oldName);
    if (!oldSheet) return;
    const targetSheet = spreadsheet.getSheetByName(table.sheetName);
    if (targetSheet) {
      spreadsheet.deleteSheet(oldSheet);
    } else {
      oldSheet.setName(table.sheetName);
    }
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
 * 所有可辨識資料寫入並重新讀取驗證成功後，才刪除舊 hidden sheets。
 */
function migrateLegacyRawSheets_(spreadsheet) {
  const legacySheets = GCGL_CONFIG.expectedTableKeys.map(function(tableKey) {
    return {
      tableKey: tableKey,
      sheet: spreadsheet.getSheetByName(legacyRawSheetName_(tableKey))
    };
  }).filter(function(item) { return Boolean(item.sheet); });
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
      // 搬移階段以舊版 raw sheet 為來源，確保第一次轉換完整保留原資料。
      rowByKey[key] = unifiedRow;
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

  legacySheets.forEach(function(item) {
    if (spreadsheet.getSheets().length > 1 && item.sheet) {
      spreadsheet.deleteSheet(item.sheet);
    }
  });
}

// MARK: - 可閱讀報表分頁

function renderReportSheets_(spreadsheet, tables, changedKeys) {
  let reportError = null;
  try {
    // 重建前補存未觸發 onEdit 的手動單價；公式值不能被誤認成案場覆寫。
    captureMaterialSummaryPrices_(spreadsheet, tables);
    hideInternalSheets_(spreadsheet);
    removeLegacyDashboardSheets_(spreadsheet);
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
    const reportKeys = reportKeysForChangedTables_(changedKeys);
    const materialCatalogTable = tables.find(function(table) {
      return table.key === "material_catalog";
    });
    const materialPriceContext = materialCatalogTable
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
    const pricingTables = tables.filter(function(table) {
      return ["pricing_progress", "pricing_detail"].indexOf(table.key) !== -1;
    });
    if (pricingTables.length > 0 && (
      pricingTables.some(function(table) { return reportKeys.indexOf(table.key) !== -1; }) ||
      !spreadsheet.getSheetByName(GCGL_CONFIG.pricingStatisticsSheetName)
    )) {
      renderPricingStatisticsReport_(spreadsheet, pricingTables, valuesByKey, siteNames);
    }
    tables.filter(function(table) {
      return ["material_catalog", "monthly_progress", "pricing_progress", "pricing_detail"].indexOf(table.key) === -1 &&
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
      } else if (table.key === "attendance") {
        renderAttendanceReport_(
          spreadsheet,
          table,
          valuesByKey[table.key],
          recordIdsByKey[table.key]
        );
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
        renderFlatReport_(spreadsheet, table, valuesByKey[table.key], siteNames);
      }
    });
    removeMonthlyProgressReportSheet_(spreadsheet, tables);
    removeReplacedReportSheets_(spreadsheet, tables);
    placeReportTabs_(spreadsheet, tables, previousActiveSheetId);
  } catch (error) {
    reportError = error;
    throw error;
  } finally {
    try {
      applyGCGLReportProtection_(spreadsheet);
    } catch (error) {
      if (!reportError) throw error;
      console.error("GCGL 報表保護未完成：" + error.message);
    }
  }
}

/** 月份資料仍保存在隱藏原始資料分頁；移除不再使用的可見圖表分頁。 */
function removeMonthlyProgressReportSheet_(spreadsheet, tables) {
  const table = tables.find(function(item) { return item.key === "monthly_progress"; });
  if (!table) return;
  const sheet = spreadsheet.getSheetByName(table.sheetName);
  if (sheet && spreadsheet.getSheets().some(function(item) {
    return item.getSheetId() !== sheet.getSheetId() && !item.isSheetHidden();
  })) spreadsheet.deleteSheet(sheet);
}

/** 依指定順序排列受管理分頁；材料單價表維持最後，其他自訂分頁不刪除。 */
function placeReportTabs_(spreadsheet, tables, previousActiveSheetId) {
  const reportOrder = [
    "site_overview", "pricing_progress", "pricing_detail", "construction_progress",
    "work_logs", "memos", "attendance", "material_summary", "material_orders"
  ];
  let position = 1;
  const placedSheetIds = {};
  reportOrder.forEach(function(key) {
    const table = tables.find(function(item) { return item.key === key; });
    const sheet = table && spreadsheet.getSheetByName(reportSheetName_(table));
    if (!sheet || placedSheetIds[sheet.getSheetId()]) return;
    placedSheetIds[sheet.getSheetId()] = true;
    const current = spreadsheet.getSheets()[position - 1];
    if (!current || current.getSheetId() !== sheet.getSheetId()) {
      spreadsheet.setActiveSheet(sheet);
      spreadsheet.moveActiveSheet(position);
    }
    position += 1;
  });
  const catalogTable = tables.find(function(table) { return table.key === "material_catalog"; });
  const catalog = catalogTable && spreadsheet.getSheetByName(catalogTable.sheetName);
  const lastSheet = spreadsheet.getSheets().slice(-1)[0];
  if (catalog && (!lastSheet || lastSheet.getSheetId() !== catalog.getSheetId())) {
    spreadsheet.setActiveSheet(catalog);
    spreadsheet.moveActiveSheet(spreadsheet.getSheets().length);
  }
  const previousActiveSheet = spreadsheet.getSheets().find(function(sheet) {
    return sheet.getSheetId() === previousActiveSheetId && !sheet.isSheetHidden();
  });
  if (previousActiveSheet) spreadsheet.setActiveSheet(previousActiveSheet);
}

/**
 * 一般變更只重建受影響的可見分頁。當某頁第一次出現該案場資料時，該資料表
 * 本身也會被列為已變更，因此案場下拉選單會一起更新。總覽另外依賴工程記錄、
 * 備忘錄、材料訂購、材料統計及月份進度。
 */
function reportKeysForChangedTables_(changedKeys) {
  const keys = Array.isArray(changedKeys) && changedKeys.length > 0
    ? uniqueStrings_(changedKeys)
    : GCGL_CONFIG.expectedTableKeys.slice();
  const result = keys.slice();
  if (keys.indexOf("pricing_progress") !== -1 || keys.indexOf("pricing_detail") !== -1) {
    result.push("pricing_progress", "pricing_detail");
  }
  if (keys.indexOf("material_catalog") !== -1 || keys.indexOf("material_summary") !== -1) {
    result.push("material_summary", "material_orders");
  }
  if (["work_logs", "memos", "material_orders", "material_summary", "material_catalog", "monthly_progress"].some(function(key) {
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

/** 清除上一版自動產生的儀表板；所有資料仍由隱藏原始資料分頁保存。 */
function removeLegacyDashboardSheets_(spreadsheet) {
  ["案場儀表板", "__GCGL_DASHBOARD_DATA"].forEach(function(sheetName) {
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (sheet && spreadsheet.getSheets().length > 1) {
      spreadsheet.deleteSheet(sheet);
    }
  });
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

function prepareReportSheet_(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) sheet = spreadsheet.insertSheet(sheetName);
  if (sheet.isSheetHidden()) sheet.showSheet();

  sheet.getCharts().forEach(function(chart) { sheet.removeChart(chart); });
  sheet.getBandings().forEach(function(banding) { banding.remove(); });
  const filter = sheet.getFilter();
  if (filter) filter.remove();
  sheet
    .getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns())
    .getMergedRanges()
    .forEach(function(range) { range.breakApart(); });
  sheet.showColumns(1, sheet.getMaxColumns());
  sheet.clear();
  sheet.getRange(1, 2).clearDataValidations().clearNote();
  sheet.clearConditionalFormatRules();
  sheet.setHiddenGridlines(true);
  sheet.setFrozenRows(0);
  sheet.setFrozenColumns(0);
  sheet.setTabColor(GCGL_REPORT_COLORS.navy);
  return sheet;
}

function renderSiteOverviewReport_(spreadsheet, table, valuesByKey, recordIdsByKey, siteNames, materialSummaryTable, monthlyTable) {
  const sheet = prepareReportSheet_(spreadsheet, table.sheetName);
  const siteIndex = reportSiteColumnIndex_(table.key);
  const summaryColumn = 6;
  const monthlySourceColumn = 24;
  const monthlySourceWidth = monthlyTable ? monthlyTable.headers.length - 1 : 0;
  const companyMemoText = buildPendingCompanyMemoSummary_(
    valuesByKey.memos || [],
    recordIdsByKey.memos || []
  );
  const memoLines = ["備忘錄"].concat(companyMemoText.split("\n"));
  let startRow = memoLines.length + 3;
  let monthlySourceRow = 1;

  ensureSheetSize_(sheet, Math.max(siteNames.length * 12 + startRow, 10),
    Math.max(summaryColumn, monthlySourceColumn + monthlySourceWidth - 1));
  sheet.setColumnWidths(1, 2, 120);
  sheet.setColumnWidth(3, 220);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 440);
  sheet.setColumnWidth(summaryColumn, 420);
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

  const companyMemoRange = sheet.getRange(2, 1, memoLines.length, summaryColumn);
  companyMemoRange
    .setBackground("#FFF7F7")
    .setFontColor(GCGL_REPORT_COLORS.text)
    .setFontFamily("Arial")
    .setFontSize(11)
    .setFontWeight("normal")
    .setWrap(true)
    .setHorizontalAlignment("left")
    .setVerticalAlignment("top")
    .setBorder(
      true,
      true,
      true,
      true,
      false,
      false,
      GCGL_REPORT_COLORS.red,
      SpreadsheetApp.BorderStyle.SOLID_MEDIUM
    );
  memoLines.forEach(function(line, index) {
    sheet.getRange(index + 2, 1, 1, summaryColumn).merge().setValue(line);
    const visibleLineCount = line.split("\n").reduce(function(count, part) {
      return count + Math.max(1, Math.ceil(part.length / 100));
    }, 0);
    sheet.setRowHeight(index + 2, index === 0 ? 28 : Math.max(24, visibleLineCount * 18 + 6));
  });
  sheet.getRange(2, 1).setFontWeight("bold");

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
      siteName
    );
    const recordText = buildTodaySiteSummary_(spreadsheet, siteName, valuesByKey, pendingSiteItems);
    const renderedLineCount = recordText.split("\n").reduce(function(count, line) {
      return count + Math.max(1, Math.ceil(line.length / 35));
    }, 0);
    const metricLabels = [
      "承攬總價", "追加金額", "合計總價", "已計價", "計價進度", "施工進度", "總出工數"
    ];
    const metricRows = metricLabels.map(function(label, index) {
      return [label, index === 6 ? totalWork : (overviewRow[index + 1] === undefined ? "" : overviewRow[index + 1])];
    });
    metricRows.push(["材料成本", 0], ["未填單價品項", 0]);
    const resourceRows = vendorTotals.map(function(vendor) {
      return [vendor.name + " 累計出工數", vendor.people];
    });
    // E 欄圖表高 250px；F 欄今日記錄按內容延長，不裁切機具、備註與未完成項目。
    const blockRows = Math.max(10, metricRows.length, resourceRows.length,
      Math.ceil(renderedLineCount * 17 / 28) + 1);
    ensureSheetSize_(sheet, startRow + blockRows + 2,
      Math.max(summaryColumn, monthlySourceColumn + monthlySourceWidth - 1));
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
      .setValue("月份進度")
      .setBackground(GCGL_REPORT_COLORS.titleFill)
      .setFontColor(GCGL_REPORT_COLORS.text)
      .setFontFamily("Arial")
      .setFontSize(11)
      .setFontWeight("bold");
    sheet.getRange(startRow, summaryColumn)
      .setValue("今日工程記錄")
      .setBackground(GCGL_REPORT_COLORS.titleFill)
      .setFontColor(GCGL_REPORT_COLORS.text)
      .setFontFamily("Arial")
      .setFontSize(11)
      .setFontWeight("bold");

    sheet.getRange(startRow + 1, 1, metricRows.length, 2)
      .setValues(metricRows)
      .setFontColor(GCGL_REPORT_COLORS.text)
      .setFontFamily("Arial")
      .setFontSize(10)
      .setVerticalAlignment("middle")
      .setBorder(true, true, true, true, true, true, GCGL_REPORT_COLORS.border, SpreadsheetApp.BorderStyle.SOLID);
    sheet.getRange(startRow + 1, 1, metricRows.length, 1).setFontWeight("bold");
    sheet.getRange(startRow + 1, 2, metricRows.length, 1).setHorizontalAlignment("right");
    sheet.getRange(startRow + 1, 2, 4, 1).setNumberFormat("#,##0");
    sheet.getRange(startRow + 5, 2, 2, 1).setNumberFormat("0%");
    sheet.getRange(startRow + 7, 2).setNumberFormat("#,##0.########");

    if (resourceRows.length > 0) {
      sheet.getRange(startRow + 1, 3, resourceRows.length, 2)
        .setValues(resourceRows)
        .setFontColor(GCGL_REPORT_COLORS.text)
        .setFontFamily("Arial")
        .setFontSize(10)
        .setVerticalAlignment("middle")
        .setBorder(true, true, true, true, true, true, GCGL_REPORT_COLORS.border, SpreadsheetApp.BorderStyle.SOLID);
      sheet.getRange(startRow + 1, 3, resourceRows.length, 1).setFontWeight("bold").setWrap(true);
      sheet.getRange(startRow + 1, 4, resourceRows.length, 1)
        .setHorizontalAlignment("right").setNumberFormat("#,##0.########");
    }
    const costCell = sheet.getRange(startRow + 8, 2).setNumberFormat("#,##0.##");
    const missingPriceCell = sheet.getRange(startRow + 9, 2).setNumberFormat("#,##0");
    if (hasMaterials && costReportExists) {
      const costFormulas = siteMaterialCostFormulas_(siteName, materialSummaryTable, materialRows.length);
      costCell.setFormula(costFormulas.total);
      missingPriceCell.setFormula(costFormulas.missingCount);
    } else {
      // 舊版資料尚無單價報表時，保留未填單價的品項數供使用者辨識。
      const unpricedItemCount = materialRows.filter(function(row) {
        return sameReportText_(row[0], siteName) && Number(row[3]) !== 0;
      }).length;
      if (hasMaterials) sheet.getRange(startRow + 8, 1).setNote("尚未建立單價表");
      costCell.setValue(0);
      missingPriceCell.setValue(unpricedItemCount);
    }

    for (let index = 0; index < Math.max(metricRows.length, resourceRows.length); index++) {
      if (index % 2 === 1) sheet.getRange(startRow + index + 1, 1, 1, 4)
        .setBackground(GCGL_REPORT_COLORS.secondRow);
    }
    const chartArea = sheet.getRange(startRow + 1, 5, blockRows, 1)
      .setBackground(GCGL_REPORT_COLORS.firstRow)
      .setBorder(true, true, true, true, false, false,
        GCGL_REPORT_COLORS.border, SpreadsheetApp.BorderStyle.SOLID);
    const chartResult = insertSiteMonthlyProgressChart_(
      sheet, monthlyTable, valuesByKey.monthly_progress || [], siteName,
      startRow + 1, monthlySourceRow, monthlySourceColumn
    );
    monthlySourceRow = chartResult.nextSourceRow;
    if (!chartResult.hasChart) {
      chartArea.merge()
        .setValue("尚無月份進度資料")
        .setFontFamily("Arial").setFontSize(10)
        .setFontColor(GCGL_REPORT_COLORS.text)
        .setHorizontalAlignment("center").setVerticalAlignment("middle");
    }
    sheet.getRange(startRow + 1, summaryColumn, blockRows, 1).merge()
      .setValue(recordText)
      .setBackground(GCGL_REPORT_COLORS.firstRow)
      .setFontColor(GCGL_REPORT_COLORS.text)
      .setFontFamily("Arial")
      .setFontSize(10)
      .setWrap(true)
      .setHorizontalAlignment("left")
      .setVerticalAlignment("top")
      .setBorder(true, true, true, true, false, false, GCGL_REPORT_COLORS.border, SpreadsheetApp.BorderStyle.SOLID);
    startRow += blockRows + 3;
  });
  if (monthlySourceWidth > 0) sheet.hideColumns(monthlySourceColumn, monthlySourceWidth);
}

/** 工程記錄已在 App 以 displayGroupID 去除逐樓層重複；此處只加總每筆原始顯示人數。 */
function buildSiteVendorWorkTotals_(siteName, workRows) {
  const totals = new Map();
  workRows.forEach(function(row) {
    if (!sameReportText_(row[1], siteName)) return;
    const vendorName = optionalString_(row[4]) || "未指定廠商";
    const people = Number(row[6]);
    totals.set(vendorName, (totals.get(vendorName) || 0) + (Number.isFinite(people) ? people : 0));
  });
  return Array.from(totals, function(entry) { return { name: entry[0], people: entry[1] }; })
    .sort(function(left, right) { return left.name.localeCompare(right.name, "zh-Hant", { numeric: true }); });
}

/** 使用公式連到材料統計，先加總已填單價的成本，另外計算未填單價的品項數。 */
function siteMaterialCostFormulas_(siteName, table, sourceRowCount) {
  const reference = quoteSheetNameForFormula_(table.sheetName);
  const lastRow = Math.max(sourceRowCount + 3, 4);
  const siteRange = reference + "!$A$4:$A$" + lastRow;
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

function buildPendingCompanyMemoSummary_(memoRows, memoRecordIds) {
  const contents = [];
  memoRows.forEach(function(row, index) {
    const recordId = optionalString_(memoRecordIds[index]);
    if (recordId.indexOf("memo-company:") !== 0) return;
    const pendingContent = pendingMemoContent_(row);
    if (pendingContent) contents.push(pendingContent);
  });
  return contents.length > 0 ? contents.join("\n") : "無未完成項目";
}

/** 案場未完成事項只顯示於對應案場的今日工程記錄，保留項目原有的換行。 */
function buildPendingSiteMemoLines_(memoRows, memoRecordIds, siteName) {
  const lines = [];
  memoRows.forEach(function(row, index) {
    if (optionalString_(memoRecordIds[index]).indexOf("memo-company:") === 0) return;
    if (!sameReportText_(row[1], siteName)) return;
    const pendingContent = pendingMemoContent_(row);
    if (!pendingContent) return;
    pendingContent.split(/\n(?=○ )/).forEach(function(item) {
      const itemText = item.trim().replace(/^○\s*/, "");
      if (itemText) lines.push("○ " + itemText);
    });
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
  const memos = (valuesByKey.memos || []).filter(function(row) {
    return sameReportText_(row[1], siteName) && reportDateKeys_(row[0], timezone).indexOf(todayKey) !== -1;
  });
  const workLogs = (valuesByKey.work_logs || []).filter(function(row) {
    return sameReportText_(row[1], siteName) && reportDateKeys_(row[0], timezone).indexOf(todayKey) !== -1;
  });
  const materialOrders = (valuesByKey.material_orders || []).filter(function(row) {
    return sameReportText_(row[1], siteName) && reportDateKeys_(row[0], timezone).indexOf(todayKey) !== -1;
  });
  const parts = [];
  if (memos.length > 0) {
    parts.push("備忘錄：\n" + memos.map(function(row) {
      return optionalString_(row[3]) || "（無內容）";
    }).join("\n"));
  }
  const recordsByVendor = {};
  const vendorOrder = [];
  workLogs.forEach(function(row) {
    const vendor = optionalString_(row[4]) || "未指定";
    if (!recordsByVendor[vendor]) {
      recordsByVendor[vendor] = [];
      vendorOrder.push(vendor);
    }
    recordsByVendor[vendor].push(row);
  });
  vendorOrder.forEach(function(vendor) {
    const lines = [
      "施工廠商：" + vendor
    ];
    recordsByVendor[vendor].forEach(function(row, itemIndex) {
      lines.push(
        (itemIndex + 1) + ". " + (optionalString_(row[2]) || "未填施工項目"),
        "↳ 樓層：" + (optionalString_(row[3]) || "未填"),
        "↳ 人數：" + (optionalString_(row[6]) || "0") + " 人"
      );
      const equipment = optionalString_(row[7]);
      const notes = optionalString_(row[8]);
      if (equipment) lines.push("↳ 機具：" + equipment);
      if (notes) lines.push("↳ 備註：" + notes);
    });
    parts.push(lines.join("\n"));
  });
  if (materialOrders.length > 0) {
    parts.push("材料訂購：\n" + materialOrders.map(function(row) {
      const item = optionalString_(row[3]) || "未填品項";
      const quantity = optionalString_(row[4]) || "0";
      const status = optionalString_(row[5]);
      return item + " × " + quantity + (status ? "（" + status + "）" : "");
    }).join("\n"));
  }
  if (pendingSiteItems && pendingSiteItems.length > 0) {
    parts.push("未完成項目：\n" + pendingSiteItems.join("\n"));
  }
  return parts.length > 0
    ? parts.join("\n\n")
    : "今日尚無工程記錄、備忘錄或材料訂購";
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
    : "尚無記錄";
  return "案場總覽　" + dateKey.replace(/-/g, "/") + " " + weekdays[weekdayIndex] +
    "　同步資料時間：" + syncText;
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

  const source = [headers].concat(rows);
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

function renderAttendanceReport_(spreadsheet, table, values, recordIds) {
  const sheet = prepareReportSheet_(spreadsheet, table.sheetName);
  const bodyRows = values.length > 0 ? values : [table.headers.map(function() { return ""; })];
  writeReportTableBlock_(
    sheet,
    1,
    1,
    table.headers,
    bodyRows,
    table.widths || [],
    table.formats || []
  );
  mergeAttendanceDateCells_(sheet, values);
  mergeAttendanceOvertimeCells_(sheet, values, recordIds || []);
  // 日期／加班欄合併完成後再畫框線，避免合併動作留下不完整的表格邊框。
  const tableRange = sheet.getRange(1, 1, bodyRows.length + 1, table.headers.length);
  tableRange.setBorder(true, true, true, true, true, true,
    GCGL_REPORT_COLORS.border, SpreadsheetApp.BorderStyle.SOLID);
  tableRange.getMergedRanges().forEach(function(range) {
    range.setBorder(true, true, true, true, false, false,
      GCGL_REPORT_COLORS.border, SpreadsheetApp.BorderStyle.SOLID);
  });
  sheet.setFrozenRows(1);
}

function mergeAttendanceDateCells_(sheet, values) {
  let groupStartIndex = 0;
  for (let index = 1; index <= values.length; index += 1) {
    const isSameDate = index < values.length &&
      sameReportText_(values[index][0], values[groupStartIndex][0]);
    if (isSameDate) continue;

    const groupSize = index - groupStartIndex;
    if (groupSize > 1) {
      sheet.getRange(groupStartIndex + 2, 1, groupSize, 1)
        .merge()
        .setVerticalAlignment("middle")
        .setHorizontalAlignment("center");
    }
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

function attendanceRecordGroupId_(recordId) {
  const match = optionalString_(recordId).match(/^attendance:([^:]+):/i);
  return match ? match[1] : "";
}

/**
 * 材料單價表是 App 資料與使用者輸入的交界：A 欄以隱藏的品項 UUID 穩定對應，
 * B／C 欄由 App 更新，D 欄單價永遠沿用原值。既有列維持原順序，新品項只追加到最後。
 */
function renderMaterialCatalogReport_(spreadsheet, table, values, recordIds) {
  let sheet = spreadsheet.getSheetByName(table.sheetName);
  if (!sheet) sheet = spreadsheet.insertSheet(table.sheetName);
  if (sheet.isSheetHidden()) sheet.showSheet();

  const oldDataRowCount = Math.max(sheet.getLastRow() - 1, 0);
  let existingRows = [];
  if (oldDataRowCount > 0 && sheet.getMaxColumns() >= 4) {
    existingRows = sheet.getRange(2, 1, oldDataRowCount, 4).getValues();
  }
  const outputRows = mergeMaterialCatalogRows_(values, recordIds, existingRows);

  const managedColumnCount = 4;
  const rowsToClear = Math.max(oldDataRowCount, outputRows.length);
  ensureSheetSize_(sheet, Math.max(outputRows.length + 1, 2), managedColumnCount);
  if (rowsToClear > 0) {
    sheet.getRange(2, 1, rowsToClear, managedColumnCount)
      .clearContent()
      .clearDataValidations();
  }
  const filter = sheet.getFilter();
  if (filter) filter.remove();
  sheet.getBandings().forEach(function(banding) { banding.remove(); });

  const headers = ["品項識別碼", "分類", "品項名稱", "單價"];
  sheet.getRange(1, 1, 1, managedColumnCount)
    .setValues([headers])
    .setBackground(GCGL_REPORT_COLORS.navy)
    .setFontColor(GCGL_REPORT_COLORS.headerText)
    .setFontFamily("Arial")
    .setFontSize(10)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  if (outputRows.length > 0) {
    const bodyRange = sheet.getRange(2, 1, outputRows.length, managedColumnCount);
    bodyRange.setValues(outputRows)
      .setFontColor(GCGL_REPORT_COLORS.text)
      .setFontFamily("Arial")
      .setFontSize(10)
      .setVerticalAlignment("middle");
    sheet.getRange(2, 4, outputRows.length, 1)
      .setNumberFormat("#,##0.##")
      .setHorizontalAlignment("right")
      .setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireNumberGreaterThanOrEqualTo(0)
          .setAllowInvalid(true)
          .setHelpText("請輸入材料單價。")
          .build()
      );
    const tableRange = sheet.getRange(1, 1, outputRows.length + 1, managedColumnCount);
    const banding = tableRange.applyRowBanding(SpreadsheetApp.BandingTheme.BLUE, true, false);
    banding
      .setHeaderRowColor(GCGL_REPORT_COLORS.navy)
      .setFirstRowColor(GCGL_REPORT_COLORS.firstRow)
      .setSecondRowColor(GCGL_REPORT_COLORS.secondRow);
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
    sheet.getRange(2, 4, outputRows.length, 1).setBackground("#FFF4CC");
    sheet.getRange(1, 1, outputRows.length + 1, managedColumnCount).createFilter();
    sheet.autoResizeRows(2, outputRows.length);
  }

  sheet.getRange(1, 4).setNote("請在此欄輸入材料單價；同步不會清除或移動既有品項的單價。");
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 260);
  sheet.setColumnWidth(4, 120);
  sheet.setRowHeight(1, 30);
  sheet.setFrozenRows(1);
  sheet.setHiddenGridlines(true);
  sheet.setTabColor(GCGL_REPORT_COLORS.red);
  sheet.showColumns(1, managedColumnCount);
  sheet.hideColumns(1);
}

function mergeMaterialCatalogRows_(values, recordIds, existingRows) {
  const existingPrices = {};
  const existingOrder = [];
  (existingRows || []).forEach(function(row) {
    const recordId = optionalString_(row[0]);
    if (!recordId || Object.prototype.hasOwnProperty.call(existingPrices, recordId)) return;
    existingPrices[recordId] = row[3];
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
    priceContext, storedRows, summaryTable) {
  if (table.key === "material_summary") captureMaterialSummaryPrices_(spreadsheet, [table]);
  const context = priceContext || buildMaterialPriceContext_(spreadsheet,
    {sheetName: priceSheetName}, [], []);
  const identities = materialReportPriceIdentities_(table, values, storedRows || [], context);
  saveMaterialPriceEntries_(spreadsheet, identities.map(function(identity) {
    return [identity.key, identity.catalogId, identity.category, identity.item];
  }));
  const sheet = prepareReportSheet_(spreadsheet, table.sheetName);
  // 舊版硬性數字驗證可能殘留；先移除，避免重建時的空白占位或公式被拒絕。
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).clearDataValidations();
  const headers = table.headers.concat(["單價", "小計",
    GCGL_CONFIG.materialPriceKeyHeader, GCGL_CONFIG.materialCatalogIdHeader]);
  const widths = (table.widths || []).concat([110, 130, 180, 180]);
  const formats = (table.formats || []).concat(["#,##0.##", "#,##0.##", "@", "@"]);
  const bodyRows = values.length > 0
    ? values.map(function(row, index) {
        return row.concat(["", "", identities[index].key, identities[index].catalogId]);
      })
    : [headers.map(function() { return ""; })];
  const selectedSite = selectedSiteForReport_(table.key, siteNames);
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
      priceFormulas.push([materialReportPriceFormula_(table, rowNumber, priceSheetName, summaryTable)]);
      subtotalFormulas.push([
        "=IF(OR(" + priceCell + "=\"\"," + quantityCell + "=\"\"),\"\"," +
          quantityCell + "*" + priceCell + ")"
      ]);
    }
    sheet.getRange(4, priceColumn, values.length, 1).setFormulas(priceFormulas);
    sheet.getRange(4, subtotalColumn, values.length, 1).setFormulas(subtotalFormulas);
    if (table.key === "material_summary") {
      const priceRange = sheet.getRange(4, priceColumn, values.length, 1);
      priceRange.setBackground("#FFF4CC");
      applyMaterialSummaryPriceValidation_(priceRange);
    }
  }

  createReportFilter_(sheet, 3, 1, tableBlock);
  renderReportSelectors_(sheet, selectedSite, siteNames);
  if (table.key === "material_summary") {
    sheet.getRange(2, 1).setValue("可依照各案場修改材料單價")
      .setFontFamily("Arial").setFontSize(11).setFontColor("#D93025")
      .setHorizontalAlignment("left").setVerticalAlignment("middle").setWrap(false);
  }
  applyReportSiteFilter_(sheet, table, selectedSite);
  sheet.setFrozenRows(3);
  sheet.hideColumns(table.headers.length + 3, 2);
}

/** 單價另存於隱藏頁；同步只更新報表，不會寫入或清除這份使用者輸入。 */
function readMaterialPriceRows_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(GCGL_CONFIG.materialPricesSheetName);
  if (!sheet || sheet.getLastRow() === 0) return [];
  if (!arraysEqual_(sheet.getRange(1, 1, 1, 5).getValues()[0], GCGL_CONFIG.materialPricesHeaders)) {
    throw new Error("案場材料單價資料格式不正確，已保留原資料，請勿刪除隱藏單價頁。");
  }
  const rows = sheet.getLastRow() < 2 ? [] : sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
  const seen = {};
  rows.forEach(function(row) {
    if (!validMaterialPriceKey_(row[0]) || seen[row[0]] || materialPriceInputValue_(row[4]) === undefined) {
      throw new Error("案場材料單價包含無效或重複識別，已保留原資料，請先還原隱藏單價頁。");
    }
    seen[row[0]] = true;
  });
  return rows;
}

function saveMaterialPriceEntries_(spreadsheet, entries) {
  if (entries.length === 0) return;
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const rows = readMaterialPriceRows_(spreadsheet);
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
    let sheet = spreadsheet.getSheetByName(GCGL_CONFIG.materialPricesSheetName);
    if (!sheet) sheet = spreadsheet.insertSheet(GCGL_CONFIG.materialPricesSheetName);
    protectGCGLSheet_(sheet, []);
    ensureSheetSize_(sheet, Math.max(rows.length + 1, 2), 5);
    if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, 5).setValues([GCGL_CONFIG.materialPricesHeaders]);
    // 只寫有改動的連續列，避免每次輸入單價都重寫整份保存資料。
    const indexesToWrite = Object.keys(changed).map(Number).sort(function(a, b) { return a - b; });
    let start = 0;
    while (start < indexesToWrite.length) {
      let end = start + 1;
      while (end < indexesToWrite.length && indexesToWrite[end] === indexesToWrite[end - 1] + 1) end++;
      const first = indexesToWrite[start];
      sheet.getRange(first + 2, 1, end - start, 5).setValues(rows.slice(first, first + end - start));
      start = end;
    }
    hideInternalSheet_(spreadsheet, sheet, spreadsheet.getActiveSheet());
  } finally {
    lock.releaseLock();
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
  if (sheet && sheet.getLastRow() >= 2) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues().forEach(function(row) {
      add(aliases, row[1], row[2], optionalString_(row[0]));
    });
  }
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

function materialReportPriceFormula_(table, row, priceSheetName, summaryTable) {
  const key = "$" + reportColumnLetter_(table.headers.length + 3) + row;
  const catalogId = "$" + reportColumnLetter_(table.headers.length + 4) + row;
  const criterion = materialPriceCriterion_(key);
  const catalog = quoteSheetNameForFormula_(priceSheetName);
  const saved = quoteSheetNameForFormula_(GCGL_CONFIG.materialPricesSheetName);
  const defaults = 'IF(' + catalogId + '="","",IF(COUNTIFS(' + catalog + '!$A:$A,' +
    catalogId + ',' + catalog + '!$D:$D,"<>")=0,"",SUMIFS(' + catalog + '!$D:$D,' + catalog + '!$A:$A,' + catalogId + ')))';
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
  rows.forEach(function(row, index) {
    const key = row[layout.keyColumn - 1], price = materialPriceInputValue_(row[layout.priceColumn - 1]);
    formulas.push([materialReportPriceFormula_(table, startRow + index, catalog.sheetName, null)]);
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

function renderFlatReport_(spreadsheet, table, values, siteNames) {
  const sheetName = reportSheetName_(table);
  if (table.key === "work_logs") {
    migrateReadableReportSheet_(spreadsheet, sheetName, [table.sheetName,
      GCGL_CONFIG.defaultSheetNames.work_logs, GCGL_CONFIG.previousWorkLogReportSheetName]);
  }
  const sheet = prepareReportSheet_(spreadsheet, sheetName);
  // 未完成內容只供總覽計算，不出現在使用者閱讀的備忘錄表格。
  const pendingContentIndex = table.headers.indexOf("__pending_memo_content");
  const visibleTable = pendingContentIndex >= 0
    ? reportTableWithoutColumn_(table, pendingContentIndex)
    : table;
  const visibleValues = pendingContentIndex >= 0
    ? values.map(function(row) { return withoutArrayIndex_(row, pendingContentIndex); })
    : values;
  const reportTable = table.key === "memos"
    ? reportTableWithoutColumn_(visibleTable, 2)
    : visibleTable;
  const reportValues = table.key === "memos"
    ? visibleValues.map(function(row) { return withoutArrayIndex_(row, 2); })
    : visibleValues;
  const bodyRows = reportValues.length > 0
    ? reportValues
    : [reportTable.headers.map(function() { return ""; })];
  const selectedSite = selectedSiteForReport_(table.key, siteNames);
  const tableBlock = writeReportTableBlock_(
    sheet,
    3,
    1,
    reportTable.headers,
    bodyRows,
    reportTable.widths || [],
    reportTable.formats || []
  );
  createReportFilter_(sheet, 3, 1, tableBlock);
  renderReportSelectors_(sheet, selectedSite, siteNames);
  applyReportSiteFilter_(sheet, table, selectedSite);
  sheet.setFrozenRows(3);
}

/** 同步仍保留兩種計價資料的 key／欄位，僅合併可見報表，不需更新 App。 */
function reportSheetName_(table) {
  if (["pricing_progress", "pricing_detail"].indexOf(table.key) !== -1) {
    return GCGL_CONFIG.pricingStatisticsSheetName;
  }
  if (table.key === "work_logs") return GCGL_CONFIG.workLogReportSheetName;
  return table.sheetName;
}

/** 能沿用原分頁就改名，保留分頁識別碼；不在新報表完成前刪除舊報表。 */
function migrateReadableReportSheet_(spreadsheet, destinationName, previousNames) {
  if (spreadsheet.getSheetByName(destinationName)) return;
  for (let index = 0; index < previousNames.length; index += 1) {
    const previousName = previousNames[index];
    if (!previousName || previousName === destinationName) continue;
    const sheet = spreadsheet.getSheetByName(previousName);
    if (sheet) {
      sheet.setName(destinationName);
      return;
    }
  }
}

/** 只有替代報表成功建立後才移除舊的可見分頁；隱藏原始資料不變。 */
function removeReplacedReportSheets_(spreadsheet, tables) {
  const currentNames = tables.map(reportSheetName_);
  tables.filter(function(table) {
    return ["pricing_progress", "pricing_detail", "work_logs"].indexOf(table.key) !== -1;
  }).forEach(function(table) {
    if (!spreadsheet.getSheetByName(reportSheetName_(table))) return;
    const previousNames = [table.sheetName, GCGL_CONFIG.defaultSheetNames[table.key]];
    if (table.key === "work_logs") previousNames.push(GCGL_CONFIG.previousWorkLogReportSheetName);
    uniqueStrings_(previousNames).forEach(function(name) {
      if (currentNames.indexOf(name) !== -1) return;
      const oldSheet = spreadsheet.getSheetByName(name);
      if (oldSheet && spreadsheet.getSheets().length > 1) spreadsheet.deleteSheet(oldSheet);
    });
  });
}

/** 進度在上、明細在下；兩表的數值／格式保持原樣，共用 A1 案場選擇。 */
function renderPricingStatisticsReport_(spreadsheet, tables, valuesByKey, siteNames) {
  const sheetName = GCGL_CONFIG.pricingStatisticsSheetName;
  migrateReadableReportSheet_(spreadsheet, sheetName,
    tables.map(function(table) { return table.sheetName; }).concat([
      GCGL_CONFIG.defaultSheetNames.pricing_progress, GCGL_CONFIG.defaultSheetNames.pricing_detail
    ]));
  const sheet = prepareReportSheet_(spreadsheet, sheetName);
  sheet.showRows(1, sheet.getMaxRows());
  const ordered = ["pricing_progress", "pricing_detail"].map(function(key) {
    return tables.find(function(table) { return table.key === key; });
  }).filter(function(table) { return Boolean(table); });
  const widths = [];
  ordered.forEach(function(table) {
    table.headers.forEach(function(_, index) {
      widths[index] = Math.max(widths[index] || 0, Number((table.widths || [])[index]) || 110);
    });
  });
  let titleRow = 2;
  const sections = [];
  ordered.forEach(function(table) {
    const values = valuesByKey[table.key] || [];
    const bodyRows = values.length > 0 ? values : [table.headers.map(function() { return ""; })];
    const headerRow = titleRow + 1;
    const block = writeReportTableBlock_(sheet, headerRow, 1, table.headers,
      bodyRows, widths, table.formats || []);
    sheet.getRange(titleRow, 1).setValue(table.key === "pricing_progress" ? "計價進度" : "計價明細")
      .setFontFamily("Arial").setFontSize(12).setFontWeight("bold")
      .setFontColor(GCGL_REPORT_COLORS.text);
    sheet.setRowHeight(titleRow, 28);
    sections.push({ startRow: headerRow + 1, rowCount: bodyRows.length,
      siteColumn: reportSiteColumnIndex_(table.key) + 1 });
    titleRow = block.endRow + 2;
  });
  PropertiesService.getScriptProperties().setProperty(GCGL_CONFIG.pricingReportLayoutProperty,
    JSON.stringify({ sheetId: sheet.getSheetId(), sections: sections }));
  const selectionKey = ordered[0].key;
  const selectedSite = selectedSiteForReport_(selectionKey, siteNames);
  renderReportSelectors_(sheet, selectedSite, siteNames);
  applyPricingReportSiteFilter_(sheet, selectedSite);
  sheet.setFrozenRows(3);
}

/** 兩表不可共用單一原生 Filter；以列顯示／隱藏保留兩組表頭和標題。 */
function applyPricingReportSiteFilter_(sheet, selectedSite) {
  const raw = PropertiesService.getScriptProperties().getProperty(GCGL_CONFIG.pricingReportLayoutProperty);
  let layout;
  try { layout = JSON.parse(raw || "null"); } catch (_) { return; }
  if (!layout || layout.sheetId !== sheet.getSheetId() || !Array.isArray(layout.sections)) return;
  layout.sections.forEach(function(section) {
    if (!(section.startRow > 0 && section.rowCount > 0 && section.siteColumn > 0) ||
        section.startRow + section.rowCount - 1 > sheet.getMaxRows()) return;
    sheet.showRows(section.startRow, section.rowCount);
    if (!selectedSite || selectedSite === GCGL_CONFIG.allSitesLabel) return;
    const names = sheet.getRange(section.startRow, section.siteColumn, section.rowCount, 1).getValues();
    let hiddenStart = -1;
    for (let index = 0; index <= names.length; index += 1) {
      const name = index < names.length ? optionalString_(names[index][0]) : "";
      const shouldHide = name !== "" && name !== selectedSite;
      if (shouldHide && hiddenStart === -1) hiddenStart = index;
      if (!shouldHide && hiddenStart !== -1) {
        sheet.hideRows(section.startRow + hiddenStart, index - hiddenStart);
        hiddenStart = -1;
      }
    }
  });
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
  return ["site_overview", "monthly_progress", "attendance", "material_catalog"]
    .indexOf(tableKey) === -1;
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

function renderReportSelectors_(sheet, selectedSite, siteNames) {
  const validation = SpreadsheetApp.newDataValidation()
    .requireValueInList([GCGL_CONFIG.allSitesLabel].concat(siteNames), true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(1, 1)
    .setValue(selectedSite)
    .setDataValidation(validation)
    .clearNote()
    .setBackground(GCGL_REPORT_COLORS.titleFill)
    .setFontColor(GCGL_REPORT_COLORS.text)
    .setFontFamily("Arial")
    .setFontSize(11)
    .setFontWeight("bold")
    .setHorizontalAlignment("left")
    .setVerticalAlignment("middle");
  sheet.setColumnWidth(1, Math.max(sheet.getColumnWidth(1), 180));
  sheet.setRowHeight(1, 30);
}

function applyReportSiteFilter_(sheet, table, selectedSite) {
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

function writeReportTableBlock_(sheet, startRow, startColumn, headers, rows, widths, formats) {
  const rowCount = Math.max(rows.length, 1);
  const columnCount = headers.length;
  ensureSheetSize_(sheet, startRow + rowCount, startColumn + columnCount - 1);
  const headerRange = sheet.getRange(startRow, startColumn, 1, columnCount);
  const bodyRange = sheet.getRange(startRow + 1, startColumn, rowCount, columnCount);
  const tableRange = sheet.getRange(startRow, startColumn, rowCount + 1, columnCount);

  headerRange.setValues([headers])
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

  headers.forEach(function(_, index) {
    const width = Math.max(70, Math.min(420, Number(widths[index]) || 110));
    sheet.setColumnWidth(startColumn + index, width);
    const format = optionalString_(formats[index]);
    if (format) bodyRange.offset(0, index, rowCount, 1).setNumberFormat(format);
    if (/^[#0]/.test(format)) {
      bodyRange.offset(0, index, rowCount, 1).setHorizontalAlignment("right");
    } else {
      bodyRange.offset(0, index, rowCount, 1).setHorizontalAlignment("left");
    }
  });
  sheet.autoResizeRows(startRow + 1, rowCount);
  return {
    endRow: startRow + rowCount,
    endColumn: startColumn + columnCount - 1
  };
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

/** 整頁編輯警告；案場篩選、共用單價及有效材料統計列的單價除外。 */
function applyGCGLReportProtection_(spreadsheet) {
  const tables = loadTableSchemas_();
  const catalog = tables.find(function(table) {
    return table.key === "material_catalog";
  });
  const catalogName = catalog ? catalog.sheetName :
    loadManagedTables_().material_catalog || GCGL_CONFIG.defaultSheetNames.material_catalog;
  const selectorSheetNames = tables.filter(function(table) {
    return supportsReportSiteSelector_(table.key);
  }).map(reportSheetName_);
  spreadsheet.getSheets().forEach(function(sheet) {
    const inputRanges = materialPriceInputRanges_(sheet, catalogName);
    if (selectorSheetNames.indexOf(sheet.getName()) !== -1) {
      inputRanges.push(sheet.getRange(1, 1));
    }
    const summary = tables.find(function(table) {
      return table.key === "material_summary" && table.sheetName === sheet.getName();
    });
    if (summary) Array.prototype.push.apply(inputRanges, materialSummaryPriceInputRanges_(sheet, summary));
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
  if (sheet.getName() !== catalogName || sheet.getMaxColumns() < 4 ||
      sheet.getLastRow() < 2) return [];
  if (!arraysEqual_(sheet.getRange(1, 1, 1, 4).getValues()[0],
      ["品項識別碼", "分類", "品項名稱", "單價"])) return [];
  const ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  const ranges = [];
  let start = -1;
  for (let index = 0; index <= ids.length; index++) {
    const hasItem = index < ids.length && optionalString_(ids[index][0]) !== "";
    if (hasItem && start === -1) start = index;
    if (!hasItem && start !== -1) {
      ranges.push(sheet.getRange(start + 2, 4, index - start, 1));
      start = -1;
    }
  }
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
  const legacyDescription = "GCGL：自動報表唯讀（僅材料單價可輸入）";
  const managed = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET)
    .filter(function(protection) {
      const existingDescription = protection.getDescription();
      return existingDescription === description || existingDescription === legacyDescription;
    });
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

function isGCGLInternalSheet_(sheet) {
  const name = sheet.getName();
  return name === GCGL_CONFIG.syncLogSheetName ||
    name === GCGL_CONFIG.rawDataSheetName ||
    name === GCGL_CONFIG.materialPricesSheetName ||
    name === "案場儀表板" ||
    name === "__GCGL_DASHBOARD_DATA" ||
    GCGL_CONFIG.expectedTableKeys.some(function(key) { return name === legacyRawSheetName_(key); });
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

function hideInternalSheets_(spreadsheet) {
  if (!spreadsheet) return;
  const internalSheets = spreadsheet.getSheets().filter(function(sheet) {
    return isGCGLInternalSheet_(sheet) && !sheet.isSheetHidden();
  });
  if (internalSheets.length === 0) return;
  const visible = visibleReportSheet_(spreadsheet);
  const active = spreadsheet.getActiveSheet();
  if (active && isGCGLInternalSheet_(active)) spreadsheet.setActiveSheet(visible);
  internalSheets.forEach(function(sheet) { sheet.hideSheet(); });
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
  if (name === GCGL_CONFIG.syncLogSheetName || name === GCGL_CONFIG.materialPricesSheetName) {
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
