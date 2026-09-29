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
  reportRebuildPendingProperty: "GCGL_REPORT_REBUILD_PENDING",
  reportRebuildGenerationProperty: "GCGL_REPORT_REBUILD_GENERATION",
  reportRebuildChangedKeysProperty: "GCGL_REPORT_REBUILD_CHANGED_KEYS",
  reportRebuildTriggerIdProperty: "GCGL_REPORT_REBUILD_TRIGGER_ID",
  lastDataSyncAtProperty: "GCGL_LAST_DATA_SYNC_AT",
  reportRebuildHandler: "processPendingGCGLReportRebuild",
  reportRebuildDelayMilliseconds: 5000,
  allSitesLabel: "全部案場",
  syncLogSheetName: "__GCGL_SYNC_LOG",
  rawSheetPrefix: "__GCGL_DATA_",
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
    "material_orders"
  ],
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
    material_orders: "材料訂購"
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
}

/** 在一般資料頁切換案場時，直接套用標題列的原生篩選。 */
function onEdit(event) {
  if (!event || !event.range) return;
  const range = event.range;
  if (range.getRow() !== 1 || range.getColumn() !== 2) return;

  const sheet = range.getSheet();
  const tables = loadTableSchemas_();
  const table = tables.find(function(item) {
    return item.sheetName === sheet.getName() && supportsReportSiteSelector_(item.key);
  });
  if (!table) return;

  const selectedSite = optionalString_(range.getValue()) || GCGL_CONFIG.allSitesLabel;
  PropertiesService.getScriptProperties().setProperty(
    reportSelectionPropertyKey_(table.key),
    selectedSite
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

  ensureSyncLogSheet_(spreadsheet);
  resetDeferredReportTriggers_();
  if (properties.getProperty(GCGL_CONFIG.reportRebuildPendingProperty) === "1") {
    ensureDeferredReportTrigger_();
  }

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

    const spreadsheet = configuredSpreadsheet_();
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

  let totalRows = 0;
  tables.forEach(function(table) {
    const incomingRows = table.rows.map(function(row) {
      return buildStoredRow_(
        siteId,
        row,
        table.headers.length,
        payload.operationId,
        payload.sentAt
      );
    });
    totalRows += incomingRows.length;
    rewriteTableReplacingSite_(spreadsheet, table, siteId, incomingRows);
  });

  SpreadsheetApp.flush();
  recordSuccessfulDataSync_();
  markReportsPending_(tables.map(function(table) { return table.key; }));

  return {
    siteId: siteId,
    siteName: optionalString_(site.name),
    tableCount: tables.length,
    rowCount: totalRows
  };
}

/** 從所有受管理工作表移除某案場。 */
function deleteSite_(spreadsheet, payload) {
  const siteId = requiredString_(payload.siteId, "siteId");
  const tables = loadTableSchemas_();
  let removedRows = 0;

  tables.forEach(function(table) {
    const sheet = spreadsheet.getSheetByName(rawSheetName_(table.key));
    if (!sheet || sheet.getLastRow() < 2) return;
    removedRows += removeSiteRowsFromExistingSheet_(sheet, siteId);
  });

  SpreadsheetApp.flush();
  recordSuccessfulDataSync_();
  markReportsPending_(tables.map(function(table) { return table.key; }));

  return { siteId: siteId, removedRows: removedRows };
}

/** 以 App 傳來的全部資料重新建立所有受管理工作表。 */
function fullSync_(spreadsheet, payload) {
  const tables = validateTables_(payload.tables, true);
  migrateManagedSheetNames_(spreadsheet, loadManagedTables_(), tables);
  saveManagedTables_(tables);
  saveTableSchemas_(tables);

  let totalRows = 0;
  tables.forEach(function(table) {
    const incomingRows = table.rows.map(function(row) {
      const siteId = requiredString_(row.siteId, table.key + ".rows[].siteId");
      return buildStoredRow_(
        siteId,
        row,
        table.headers.length,
        payload.operationId,
        payload.sentAt
      );
    });
    totalRows += incomingRows.length;
    rewriteWholeTable_(spreadsheet, table, incomingRows);
  });

  SpreadsheetApp.flush();
  recordSuccessfulDataSync_();
  markReportsPending_(tables.map(function(table) { return table.key; }));

  return { tableCount: tables.length, rowCount: totalRows };
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

  let totalRows = 0;
  tables.forEach(function(table) {
    const incomingRows = table.rows.map(function(row) {
      const siteId = requiredString_(row.siteId, table.key + ".rows[].siteId");
      return buildStoredRow_(
        siteId,
        row,
        table.headers.length,
        payload.operationId,
        payload.sentAt
      );
    });
    totalRows += incomingRows.length;
    rewriteWholeTable_(spreadsheet, table, incomingRows);
  });

  SpreadsheetApp.flush();
  recordSuccessfulDataSync_();
  markReportsPending_(tables.map(function(table) { return table.key; }));
  return { tableCount: tables.length, rowCount: totalRows };
}

/** 依穩定 recordId 只新增、修改或刪除實際變動的資料列。 */
function syncRows_(spreadsheet, payload) {
  const tables = validateRowDeltaTables_(payload.tables);
  if (tables.length === 0) {
    return { tableCount: 0, upsertedRowCount: 0, deletedRowCount: 0 };
  }

  migrateManagedSheetNames_(spreadsheet, loadManagedTables_(), tables);
  saveManagedTables_(tables);
  saveTableSchemas_(tables);

  let upsertedRowCount = 0;
  let deletedRowCount = 0;
  tables.forEach(function(table) {
    const result = applyRowDelta_(spreadsheet, table, payload.operationId, payload.sentAt);
    upsertedRowCount += result.upsertedRowCount;
    deletedRowCount += result.deletedRowCount;
  });

  SpreadsheetApp.flush();
  recordSuccessfulDataSync_();
  markReportsPending_(tables.map(function(table) { return table.key; }));
  return {
    tableCount: tables.length,
    upsertedRowCount: upsertedRowCount,
    deletedRowCount: deletedRowCount
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

function markReportsPending_(changedKeys) {
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

function rewriteTableReplacingSite_(spreadsheet, table, siteId, incomingRows) {
  const sheet = ensureTableSheet_(spreadsheet, table, false);
  const totalColumns = GCGL_CONFIG.metadataHeaders.length + table.headers.length;
  const existingRows = readStoredRows_(sheet, totalColumns).filter(function(row) {
    return String(row[0]) !== siteId;
  });
  writeStoredRows_(sheet, table, existingRows.concat(incomingRows));
}

function rewriteWholeTable_(spreadsheet, table, incomingRows) {
  const sheet = ensureTableSheet_(spreadsheet, table, true);
  writeStoredRows_(sheet, table, incomingRows);
}

function applyRowDelta_(spreadsheet, table, operationId, sentAt) {
  const sheet = ensureTableSheet_(spreadsheet, table, false);
  const totalColumns = GCGL_CONFIG.metadataHeaders.length + table.headers.length;
  const existingRowCount = Math.max(sheet.getLastRow() - 1, 0);
  const rowNumberByRecordId = {};
  if (existingRowCount > 0) {
    sheet.getRange(2, 2, existingRowCount, 1).getDisplayValues().forEach(function(values, index) {
      const recordId = optionalString_(values[0]);
      if (!recordId) return;
      if (rowNumberByRecordId[recordId]) {
        throw new Error("隱藏資料表「" + table.sheetName + "」含有重複 recordId，請執行完整同步。");
      }
      rowNumberByRecordId[recordId] = index + 2;
    });
  }

  const updates = [];
  const inserts = [];
  table.upserts.forEach(function(row) {
    const storedRow = buildStoredRow_(
      requiredString_(row.siteId, table.key + ".upserts[].siteId"),
      row,
      table.headers.length,
      operationId,
      sentAt
    );
    const rowNumber = rowNumberByRecordId[row.recordId];
    if (rowNumber) {
      updates.push({ rowNumber: rowNumber, values: storedRow });
    } else {
      inserts.push(storedRow);
    }
  });

  writeStoredRowUpdates_(sheet, table, totalColumns, updates);

  const deletedRowNumbers = table.deletedRecordIds
    .map(function(recordId) { return rowNumberByRecordId[recordId]; })
    .filter(function(rowNumber) { return Boolean(rowNumber); });
  deleteStoredRows_(sheet, deletedRowNumbers);

  if (inserts.length > 0) {
    const startRow = sheet.getLastRow() + 1;
    ensureSheetSize_(sheet, startRow + inserts.length - 1, totalColumns);
    sheet.getRange(startRow, 1, inserts.length, totalColumns).setValues(inserts);
    applyColumnFormatsToRange_(sheet, table, startRow, inserts.length);
  }

  refreshFilter_(sheet, totalColumns);
  return {
    upsertedRowCount: updates.length + inserts.length,
    deletedRowCount: deletedRowNumbers.length
  };
}

function writeStoredRowUpdates_(sheet, table, totalColumns, updates) {
  if (updates.length === 0) return;
  const sorted = updates.slice().sort(function(left, right) {
    return left.rowNumber - right.rowNumber;
  });
  let group = [];
  const flushGroup = function() {
    if (group.length === 0) return;
    const startRow = group[0].rowNumber;
    sheet.getRange(startRow, 1, group.length, totalColumns)
      .setValues(group.map(function(item) { return item.values; }));
    applyColumnFormatsToRange_(sheet, table, startRow, group.length);
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

function removeSiteRowsFromExistingSheet_(sheet, siteId) {
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  if (lastRow < 2 || lastColumn < GCGL_CONFIG.metadataHeaders.length) return 0;

  const rows = sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
  const retained = rows.filter(function(row) {
    return String(row[0]) !== siteId;
  });
  const removedCount = rows.length - retained.length;
  if (removedCount === 0) return 0;

  sheet.getRange(2, 1, lastRow - 1, lastColumn).clearContent();
  if (retained.length > 0) {
    sheet.getRange(2, 1, retained.length, lastColumn).setValues(retained);
  }
  refreshFilter_(sheet, lastColumn);
  return removedCount;
}

function ensureTableSheet_(spreadsheet, table, allowsHeaderReplacement) {
  const storageName = rawSheetName_(table.key);
  let sheet = spreadsheet.getSheetByName(storageName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(storageName);
    migrateLegacyTableData_(spreadsheet, sheet, table);
  }

  const expectedHeaders = GCGL_CONFIG.metadataHeaders.concat(table.headers);
  ensureSheetSize_(sheet, 2, expectedHeaders.length);

  if (sheet.getLastRow() >= 2) {
    const existingHeaders = sheet
      .getRange(1, 1, 1, Math.min(sheet.getLastColumn(), expectedHeaders.length))
      .getDisplayValues()[0];
    if (!arraysEqual_(existingHeaders, expectedHeaders)) {
      if (allowsHeaderReplacement) {
        // fullSync 是欄位版本或顯示語言改變時的修復入口。
        sheet.clearContents();
      } else {
        throw new Error(
          "資料表「" + table.sheetName + "」欄位已變更，請從 App 執行完整重新同步。"
        );
      }
    }
  }

  sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
  formatTableSheet_(sheet, table, expectedHeaders.length);
  return sheet;
}

function readStoredRows_(sheet, totalColumns) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet.getRange(2, 1, lastRow - 1, totalColumns).getValues();
}

function writeStoredRows_(sheet, table, rows) {
  const totalColumns = GCGL_CONFIG.metadataHeaders.length + table.headers.length;
  const oldDataRows = Math.max(sheet.getLastRow() - 1, 0);
  const rowsToClear = Math.max(oldDataRows, rows.length);
  if (rowsToClear > 0) {
    ensureSheetSize_(sheet, rowsToClear + 1, totalColumns);
    sheet.getRange(2, 1, rowsToClear, totalColumns).clearContent();
  }
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, totalColumns).setValues(rows);
    applyColumnFormats_(sheet, table, rows.length);
  }
  refreshFilter_(sheet, totalColumns);
}

function formatTableSheet_(sheet, table, totalColumns) {
  sheet.setFrozenRows(1);
  const header = sheet.getRange(1, 1, 1, totalColumns);
  header
    .setBackground("#E9EEF3")
    .setFontColor("#263238")
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 30);
  if (!sheet.isSheetHidden()) sheet.hideSheet();
}

function applyColumnFormats_(sheet, table, rowCount) {
  applyColumnFormatsToRange_(sheet, table, 2, rowCount);
}

function applyColumnFormatsToRange_(sheet, table, startRow, rowCount) {
  if (rowCount <= 0) return;
  if (!Array.isArray(table.formats)) return;
  const visibleStartColumn = GCGL_CONFIG.metadataHeaders.length + 1;
  table.formats.forEach(function(format, index) {
    if (!format) return;
    sheet.getRange(startRow, visibleStartColumn + index, rowCount, 1)
      .setNumberFormat(String(format));
  });
}

function refreshFilter_(sheet, totalColumns) {
  const filter = sheet.getFilter();
  if (filter) filter.remove();
  const visibleColumnCount = totalColumns - GCGL_CONFIG.metadataHeaders.length;
  if (visibleColumnCount <= 0) return;
  const filterRows = Math.max(sheet.getLastRow(), 2);
  sheet
    .getRange(1, GCGL_CONFIG.metadataHeaders.length + 1, filterRows, visibleColumnCount)
    .createFilter();
}

// MARK: - 可閱讀報表分頁

function renderReportSheets_(spreadsheet, tables, changedKeys) {
  removeLegacyDashboardSheets_(spreadsheet);
  const valuesByKey = {};
  const recordIdsByKey = {};
  tables.forEach(function(table) {
    const rawSheet = spreadsheet.getSheetByName(rawSheetName_(table.key));
    const totalColumns = GCGL_CONFIG.metadataHeaders.length + table.headers.length;
    const storedRows = rawSheet ? readStoredRows_(rawSheet, totalColumns) : [];
    valuesByKey[table.key] = storedRows.map(function(row) {
      return row.slice(GCGL_CONFIG.metadataHeaders.length);
    });
    recordIdsByKey[table.key] = storedRows.map(function(row) {
      return optionalString_(row[1]);
    });
  });

  const siteNames = collectReportSiteNames_(tables, valuesByKey);
  const reportKeys = reportKeysForChangedTables_(changedKeys);
  tables.filter(function(table) {
    return reportKeys.indexOf(table.key) !== -1;
  }).forEach(function(table) {
    if (table.key === "site_overview") {
      renderSiteOverviewReport_(spreadsheet, table, valuesByKey, siteNames);
    } else if (table.key === "monthly_progress") {
      renderMonthlyProgressReport_(spreadsheet, table, valuesByKey[table.key], siteNames);
    } else if (table.key === "attendance") {
      renderAttendanceReport_(
        spreadsheet,
        table,
        valuesByKey[table.key],
        recordIdsByKey[table.key]
      );
    } else {
      renderFlatReport_(spreadsheet, table, valuesByKey[table.key], siteNames);
    }
  });
}

/**
 * 一般變更只重建受影響的可見分頁。當某頁第一次出現該案場資料時，該資料表
 * 本身也會被列為已變更，因此案場下拉選單會一起更新。總覽另外依賴工程記錄、
 * 備忘錄及材料訂購。
 */
function reportKeysForChangedTables_(changedKeys) {
  const keys = Array.isArray(changedKeys) && changedKeys.length > 0
    ? uniqueStrings_(changedKeys)
    : GCGL_CONFIG.expectedTableKeys.slice();
  const result = keys.slice();
  if (["work_logs", "memos", "material_orders"].some(function(key) {
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
  sheet.clearConditionalFormatRules();
  sheet.setHiddenGridlines(true);
  sheet.setFrozenRows(0);
  sheet.setFrozenColumns(0);
  sheet.setTabColor(GCGL_REPORT_COLORS.navy);
  return sheet;
}

function renderSiteOverviewReport_(spreadsheet, table, valuesByKey, siteNames) {
  const sheet = prepareReportSheet_(spreadsheet, table.sheetName);
  const siteIndex = reportSiteColumnIndex_(table.key);
  const headers = withoutArrayIndex_(table.headers, siteIndex);
  const widths = withoutArrayIndex_(table.widths || [], siteIndex);
  const formats = withoutArrayIndex_(table.formats || [], siteIndex);
  const summaryColumn = headers.length + 2;
  let startRow = 3;

  ensureSheetSize_(sheet, Math.max(siteNames.length * 6, 10), summaryColumn);
  sheet.setColumnWidth(summaryColumn - 1, 24);
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

  siteNames.forEach(function(siteName) {
    const siteRows = (valuesByKey.site_overview || [])
      .filter(function(row) { return sameReportText_(row[siteIndex], siteName); })
      .map(function(row) { return withoutArrayIndex_(row, siteIndex); });
    const bodyRows = siteRows.length > 0 ? siteRows : [headers.map(function() { return ""; })];
    const tableEndColumn = headers.length;

    ensureSheetSize_(sheet, startRow + bodyRows.length + 3, summaryColumn);
    sheet.getRange(startRow, 1, 1, tableEndColumn).merge()
      .setValue(siteName)
      .setBackground(GCGL_REPORT_COLORS.titleFill)
      .setFontColor(GCGL_REPORT_COLORS.text)
      .setFontFamily("Arial")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("left")
      .setVerticalAlignment("middle");
    sheet.getRange(startRow, summaryColumn)
      .setValue("今日工程進度")
      .setBackground(GCGL_REPORT_COLORS.titleFill)
      .setFontColor(GCGL_REPORT_COLORS.text)
      .setFontFamily("Arial")
      .setFontSize(11)
      .setFontWeight("bold");

    const tableBlock = writeReportTableBlock_(
      sheet,
      startRow + 1,
      1,
      headers,
      bodyRows,
      widths,
      formats
    );
    const recordBottomRow = Math.max(tableBlock.endRow, startRow + 3);
    const recordRange = sheet.getRange(
      startRow + 1,
      summaryColumn,
      recordBottomRow - startRow,
      1
    );
    recordRange.merge()
      .setValue(buildTodaySiteSummary_(spreadsheet, siteName, valuesByKey))
      .setBackground(GCGL_REPORT_COLORS.firstRow)
      .setFontColor(GCGL_REPORT_COLORS.text)
      .setFontFamily("Arial")
      .setFontSize(10)
      .setWrap(true)
      .setHorizontalAlignment("left")
      .setVerticalAlignment("top")
      .setBorder(true, true, true, true, false, false, GCGL_REPORT_COLORS.border, SpreadsheetApp.BorderStyle.SOLID);
    sheet.setRowHeight(startRow, 30);
    sheet.setRowHeight(startRow + 1, 28);
    sheet.setRowHeight(recordBottomRow, Math.max(54, Math.min(180, recordRange.getValue().split("\n").length * 17)));
    startRow = recordBottomRow + 3;
  });
}

function buildTodaySiteSummary_(spreadsheet, siteName, valuesByKey) {
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
  return parts.length > 0
    ? parts.join("\n\n")
    : "今日尚無工程進度、備忘錄或材料訂購";
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

function renderMonthlyProgressReport_(spreadsheet, table, values, siteNames) {
  const sheet = prepareReportSheet_(spreadsheet, table.sheetName);
  const siteIndex = reportSiteColumnIndex_(table.key);
  const headers = withoutArrayIndex_(table.headers, siteIndex);
  let chartRow = 2;
  let sourceRow = 1;
  const sourceColumn = 24;
  ensureSheetSize_(sheet, Math.max(values.length + siteNames.length * 2 + 2, 80), sourceColumn + headers.length - 1);
  sheet.setColumnWidths(sourceColumn, headers.length, 2);

  siteNames.forEach(function(siteName) {
    const rows = values
      .filter(function(row) { return sameReportText_(row[siteIndex], siteName); })
      .map(function(row) { return withoutArrayIndex_(row, siteIndex); });
    if (rows.length === 0) {
      sheet.getRange(chartRow, 1).setValue(siteName + "：尚無月份進度資料")
        .setFontFamily("Arial")
        .setFontSize(12)
        .setFontWeight("bold");
      chartRow += 3;
      return;
    }

    const source = [headers].concat(rows);
    sheet.getRange(sourceRow, sourceColumn, source.length, headers.length).setValues(source);
    if (headers.length >= 3) {
      sheet.getRange(sourceRow + 1, sourceColumn + 1, rows.length, 2).setNumberFormat("0%");
    }
    const builder = sheet.newChart();
    builder.setChartType(Charts.ChartType.LINE);
    builder.addRange(sheet.getRange(sourceRow, sourceColumn, source.length, headers.length));
    builder.setNumHeaders(1);
    builder.setPosition(chartRow, 1, 0, 0);
    builder.setOption("title", siteName + "－月份進度");
    builder.setOption("width", 920);
    builder.setOption("height", 310);
    builder.setOption("legend", { position: "top" });
    builder.setOption("colors", [GCGL_REPORT_COLORS.blue, GCGL_REPORT_COLORS.red]);
    builder.setOption("lineWidth", 3);
    builder.setOption("pointSize", 5);
    builder.setOption("vAxis", { minValue: 0, maxValue: 1, format: "0%", gridlines: { count: 3 } });
    builder.setOption("hAxis", { slantedText: false });
    sheet.insertChart(builder.build());
    chartRow += 18;
    sourceRow += source.length + 2;
  });
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

function renderFlatReport_(spreadsheet, table, values, siteNames) {
  const sheet = prepareReportSheet_(spreadsheet, table.sheetName);
  const reportTable = table.key === "memos"
    ? reportTableWithoutColumn_(table, 2)
    : table;
  const reportValues = table.key === "memos"
    ? values.map(function(row) { return withoutArrayIndex_(row, 2); })
    : values;
  const bodyRows = reportValues.length > 0
    ? reportValues
    : [reportTable.headers.map(function() { return ""; })];
  const selectedSite = selectedSiteForReport_(table.key, siteNames);
  renderReportSiteSelector_(sheet, selectedSite, siteNames);
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
  applyReportSiteFilter_(sheet, table, selectedSite);
  sheet.setFrozenRows(3);
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
  return ["site_overview", "monthly_progress", "attendance"].indexOf(tableKey) === -1;
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

function renderReportSiteSelector_(sheet, selectedSite, siteNames) {
  const options = [GCGL_CONFIG.allSitesLabel].concat(siteNames);
  const validation = SpreadsheetApp.newDataValidation()
    .requireValueInList(options, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(1, 1)
    .setValue("案場")
    .setFontFamily("Arial")
    .setFontSize(11)
    .setFontWeight("bold")
    .setVerticalAlignment("middle");
  sheet.getRange(1, 2)
    .setValue(selectedSite)
    .setDataValidation(validation)
    .setBackground(GCGL_REPORT_COLORS.titleFill)
    .setFontColor(GCGL_REPORT_COLORS.text)
    .setFontFamily("Arial")
    .setFontSize(11)
    .setFontWeight("bold")
    .setHorizontalAlignment("left")
    .setVerticalAlignment("middle");
  sheet.setColumnWidth(1, Math.max(sheet.getColumnWidth(1), 90));
  sheet.setColumnWidth(2, Math.max(sheet.getColumnWidth(2), 180));
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
    return !seenKeys[key];
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

function rawSheetName_(tableKey) {
  return (GCGL_CONFIG.rawSheetPrefix + requiredString_(tableKey, "tableKey")).slice(0, 100);
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
  let sheet = spreadsheet.getSheetByName(GCGL_CONFIG.syncLogSheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(GCGL_CONFIG.syncLogSheetName);
  }
  sheet.getRange(1, 1, 1, 4).setValues([[
    "operation_id",
    "action",
    "received_at",
    "site_id"
  ]]);
  sheet.setFrozenRows(1);
  if (!sheet.isSheetHidden()) sheet.hideSheet();
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
  if (name === GCGL_CONFIG.syncLogSheetName) {
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
