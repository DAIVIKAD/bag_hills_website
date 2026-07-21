const SPREADSHEET_ID = "1GTJUsOYQOj0Lf8wFgcTEh2bULqT431AsI6LDXPUw-kA";
const INQUIRY_SHEET_NAME = "Tourism Inquiries";

const INQUIRY_HEADERS = [
  "Timestamp",
  "Name",
  "Email",
  "Phone",
  "Visit Purpose",
  "Group Size",
  "Preferred Activity",
  "Planned Visit Date",
  "Message",
  "Status",
];

function doGet() {
  return jsonResponse({
    success: true,
    status: "success",
    message: "Bag Hills tourism inquiry endpoint is running.",
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const payload = parsePayload(e);
    validateRequired(payload, ["name", "email"]);

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getPreparedSheet(spreadsheet, INQUIRY_SHEET_NAME, INQUIRY_HEADERS);

    sheet.appendRow([
      new Date(),
      payload.name,
      payload.email,
      payload.phone || "",
      payload.visitPurpose || "",
      payload.groupSize || "",
      payload.activity || "",
      payload.visitDate || "",
      payload.message || "",
      payload.status || "New",
    ]);

    return jsonResponse({
      success: true,
      status: "success",
      message: "Inquiry saved successfully.",
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      status: "error",
      message: error.message || "Unable to save inquiry.",
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (error) {
      // The lock may not exist if waitLock failed.
    }
  }
}

function parsePayload(e) {
  if (!e) {
    throw new Error("Missing request body.");
  }

  if (e.parameter && Object.keys(e.parameter).length > 0) {
    return e.parameter;
  }

  if (!e.postData || !e.postData.contents) {
    throw new Error("Missing request body.");
  }

  const contents = e.postData.contents;

  try {
    return JSON.parse(contents);
  } catch (jsonError) {
    // Not JSON; continue with URL-encoded parsing.
  }

  if (contents.indexOf("=") !== -1) {
    const params = {};
    const pairs = contents.split("&");

    pairs.forEach(function (pair) {
      const parts = pair.split("=");
      const key = decodeURIComponent(parts[0] || "");
      const value = decodeURIComponent((parts[1] || "").replace(/\+/g, " "));

      if (key) {
        params[key] = value;
      }
    });

    return params;
  }

  throw new Error("Unable to parse request body.");
}

function validateRequired(payload, fields) {
  fields.forEach(function (field) {
    if (!payload[field] || String(payload[field]).trim() === "") {
      throw new Error("Missing required field: " + field);
    }
  });
}

function getPreparedSheet(spreadsheet, sheetName, headers) {
  const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
  const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const needsHeaders = currentHeaders.join("") === "" || currentHeaders.join("|") !== headers.join("|");

  if (needsHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }

  return sheet;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
