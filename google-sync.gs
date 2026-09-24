/**
 * GCGL 專案報告 → Google 試算表同步 Web App
 *
 * 第一版支援：
 * - ping：測試連線
 * - replaceSite：以 App 傳來的完整案場快照，取代該案場在所有工作表的資料
 * - deleteSite：移除該案場在所有工作表的資料
 * - fullSync：以 App 完整資料取代所有受管理工作表
 *
 * 請先在綁定試算表的 Apps Script 編輯器執行 setupGCGLSync()，
 * 再部署為「網頁應用程式」。
 */

const GCGL_CONFIG = Object.freeze({
  schemaVersion: 1,
  spreadsheetProperty: "GCGL_SPREADSHEET_ID",
  tokenProperty: "GCGL_SYNC_TOKEN",
  managedTablesProperty: "GCGL_MANAGED_TABLES",
  syncLogSheetName: "__GCGL_SYNC_LOG",
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

/** 在試算表開啟時加入操作選單。 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("GCGL 同步")
    .addItem("初始設定／查看同步密碼", "setupGCGLSyncFromMenu")
    .addItem("重新產生同步密碼", "rotateGCGLSyncTokenFromMenu")
    .addToUi();
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
    service: "GCGL Project Report Sync",
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
  const managedTables = loadManagedTables_();
  let removedRows = 0;

  Object.keys(managedTables).forEach(function(key) {
    const sheet = spreadsheet.getSheetByName(managedTables[key]);
    if (!sheet || sheet.getLastRow() < 2) return;
    removedRows += removeSiteRowsFromExistingSheet_(sheet, siteId);
  });

  return { siteId: siteId, removedRows: removedRows };
}

/** 以 App 傳來的全部資料重新建立所有受管理工作表。 */
function fullSync_(spreadsheet, payload) {
  const tables = validateTables_(payload.tables, true);
  migrateManagedSheetNames_(spreadsheet, loadManagedTables_(), tables);
  saveManagedTables_(tables);

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

  return { tableCount: tables.length, rowCount: totalRows };
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
  let sheet = spreadsheet.getSheetByName(table.sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(table.sheetName);
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
          "工作表「" + table.sheetName + "」欄位已變更，請從 App 執行完整重新同步。"
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
  sheet.hideColumns(1, GCGL_CONFIG.metadataHeaders.length);

  const visibleStartColumn = GCGL_CONFIG.metadataHeaders.length + 1;
  const header = sheet.getRange(1, visibleStartColumn, 1, table.headers.length);
  header
    .setBackground("#1F4E78")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 30);

  if (Array.isArray(table.widths)) {
    table.widths.forEach(function(width, index) {
      const safeWidth = Math.max(60, Math.min(500, Number(width) || 100));
      sheet.setColumnWidth(visibleStartColumn + index, safeWidth);
    });
  } else {
    sheet.autoResizeColumns(visibleStartColumn, table.headers.length);
  }
}

function applyColumnFormats_(sheet, table, rowCount) {
  if (!Array.isArray(table.formats)) return;
  const visibleStartColumn = GCGL_CONFIG.metadataHeaders.length + 1;
  table.formats.forEach(function(format, index) {
    if (!format) return;
    sheet.getRange(2, visibleStartColumn + index, rowCount, 1).setNumberFormat(String(format));
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

function validateTables_(rawTables, rowsContainSiteId) {
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
    rows.forEach(function(row, rowIndex) {
      if (!row || !Array.isArray(row.values)) {
        throw new Error(key + ".rows[" + rowIndex + "].values 必須是陣列。");
      }
      if (row.values.length !== normalizedHeaders.length) {
        throw new Error(key + ".rows[" + rowIndex + "] 的欄位數量不正確。");
      }
      requiredString_(row.recordId, key + ".rows[" + rowIndex + "].recordId");
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
  if (missingKeys.length > 0) {
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
  const mapping = {};
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
