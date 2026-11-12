/**
 * 屏東廠線上品保查核表 — Google 試算表後端
 *
 * 安裝：
 * 1. 建立一個新的 Google 試算表 → 擴充功能 → Apps Script
 * 2. 把這個檔案的內容全部貼上，存檔
 * 3. 修改下面的 TOKEN（自己取一組密碼），網頁的「雲端同步設定」要填同一組
 * 4. 部署 → 新增部署作業 → 類型選「網頁應用程式」
 *    執行身分：我　／　誰可以存取：所有人
 * 5. 第一次部署會要求授權（試算表、雲端硬碟），按允許
 * 6. 複製「網頁應用程式網址」（.../exec 結尾），貼到網頁的「雲端同步設定」
 *
 * 之後修改程式碼要重新部署：部署 → 管理部署作業 → 編輯 → 版本選「新版本」，網址不變。
 */
const TOKEN = 'change-me';                 // ← 改成自己的密碼
const FOLDER_NAME = '屏東廠線上品保查核表';  // 雲端硬碟中存放 Excel 的資料夾

const DAILY = '每日紀錄';
const DETAIL = '查核明細';
const DAILY_HEAD = ['日期', '得分', '總分', '指數', '製表', '存檔時間', 'Excel', '表單資料'];
const DETAIL_HEAD = ['日期', '查核項目', '序號', '品名/桶位', '內容', '結果', '備註'];

function doGet(e) {
  const p = e.parameter || {};
  if (p.token !== TOKEN) return out({ ok: false, error: '密碼錯誤' });
  if (p.action === 'month') return out({ ok: true, records: readDaily().filter(r => r.month === p.ym) });
  if (p.action === 'latest') {
    const rs = readDaily().filter(r => !p.before || r.date < p.before).sort((a, b) => b.date.localeCompare(a.date));
    return out({ ok: true, record: rs[0] || null });
  }
  if (p.action === 'ping') return out({ ok: true, sheet: SpreadsheetApp.getActive().getName() });
  return out({ ok: false, error: '未知的動作' });
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return out({ ok: false, error: '資料格式錯誤' }); }
  if (body.token !== TOKEN) return out({ ok: false, error: '密碼錯誤' });
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (body.action === 'save') return out(saveRecord(body.record, body.details || []));
    if (body.action === 'excel') return out(saveExcel(body.date, body.filename, body.data));
    if (body.action === 'delete') return out(deleteRecord(body.date));
    return out({ ok: false, error: '未知的動作' });
  } finally {
    lock.releaseLock();
  }
}

function saveRecord(rec, details) {
  const sh = sheet(DAILY, DAILY_HEAD);
  const row = findRow(sh, rec.date);
  const link = row ? sh.getRange(row, 7).getValue() : '';
  const values = [[rec.date, rec.score, rec.total, rec.total ? Math.round(rec.score / rec.total * 1000) / 10 : '',
    rec.maker || '', new Date(), link, rec.form]];
  if (row) sh.getRange(row, 1, 1, values[0].length).setValues(values);
  else sh.appendRow(values[0]);

  const dt = deleteDetails(rec.date);
  if (details.length) dt.getRange(dt.getLastRow() + 1, 1, details.length, DETAIL_HEAD.length).setValues(details);
  return { ok: true };
}

// 刪除某一天：每日紀錄那一列與查核明細；雲端硬碟的 Excel 備份保留不動
function deleteRecord(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return { ok: false, error: '日期格式錯誤' };
  const sh = sheet(DAILY, DAILY_HEAD);
  const row = findRow(sh, date);
  if (row) sh.deleteRow(row);
  deleteDetails(date);
  return { ok: true, found: !!row };
}
function deleteDetails(date) {
  const dt = sheet(DETAIL, DETAIL_HEAD);
  const last = dt.getLastRow();
  if (last > 1) {
    const dates = dt.getRange(2, 1, last - 1, 1).getDisplayValues();
    for (let i = dates.length - 1; i >= 0; i--) if (dates[i][0] === date) dt.deleteRow(i + 2);
  }
  return dt;
}

function saveExcel(date, filename, b64) {
  const blob = Utilities.newBlob(Utilities.base64Decode(b64),
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', filename);
  const folder = getFolder();
  const old = folder.getFilesByName(filename);
  while (old.hasNext()) old.next().setTrashed(true);
  const file = folder.createFile(blob);
  const sh = sheet(DAILY, DAILY_HEAD);
  const row = findRow(sh, date);
  if (row) sh.getRange(row, 7).setValue(file.getUrl());
  return { ok: true, url: file.getUrl() };
}

/* ---------- helpers ---------- */
function readDaily() {
  const sh = sheet(DAILY, DAILY_HEAD);
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, DAILY_HEAD.length).getDisplayValues().map(r => ({
    date: r[0], month: r[0].slice(0, 7), score: Number(r[1]), total: Number(r[2]), maker: r[4], excel: r[6], form: r[7]
  }));
}
function findRow(sh, date) {
  const n = sh.getLastRow() - 1;
  if (n < 1) return 0;
  const dates = sh.getRange(2, 1, n, 1).getDisplayValues();
  for (let i = 0; i < dates.length; i++) if (dates[i][0] === date) return i + 2;
  return 0;
}
function sheet(name, head) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange('A:A').setNumberFormat('@');   // 日期以文字 yyyy-mm-dd 保存
  }
  return sh;
}
function getFolder() {
  const it = DriveApp.getFoldersByName(FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
}
function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
