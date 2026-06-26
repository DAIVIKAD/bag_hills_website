const SPREADSHEET_ID = "1GTJUsOYQOj0Lf8wFgcTEh2bULqT431AsI6LDXPUw-kA";
const CONTACT_SHEET_NAME = "Contact Messages";
const FEEDBACK_SHEET_NAME = "Feedback";

const CONTACT_HEADERS = [
  "Timestamp",
  "Form Type",
  "Name",
  "Phone / WhatsApp",
  "Email",
  "Message",
];

const FEEDBACK_HEADERS = [
  "Timestamp",
  "Form Type",
  "Name",
  "Place / City",
  "Rating",
  "Feedback",
];

function doGet() {
  return jsonResponse({
    success: true,
    status: "success",
    message: "Bag Hills form endpoint is running.",
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const payload = parsePayload(e);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (payload.formType === "contact") {
      validateRequired(payload, ["name", "phone", "message"]);
      const sheet = getPreparedSheet(spreadsheet, CONTACT_SHEET_NAME, CONTACT_HEADERS);

      sheet.appendRow([
        new Date(),
        payload.formType,
        payload.name,
        payload.phone,
        payload.email || "",
        payload.message,
      ]);
    } else if (payload.formType === "feedback") {
      validateRequired(payload, ["name", "rating", "feedback"]);
      const sheet = getPreparedSheet(spreadsheet, FEEDBACK_SHEET_NAME, FEEDBACK_HEADERS);

      sheet.appendRow([
        new Date(),
        payload.formType,
        payload.name,
        payload.place || "",
        payload.rating,
        payload.feedback,
      ]);
    } else {
      throw new Error("Unknown form type.");
    }

    return jsonResponse({
      success: true,
      status: "success",
      message: "Saved successfully.",
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      status: "error",
      message: error.message || "Unable to save response.",
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
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Missing request body.");
  }

  var contentType = e.postData.type || "";
  var contents = e.postData.contents;

  // Handle JSON (text/plain or application/json)
  try {
    return JSON.parse(contents);
  } catch (jsonError) {
    // Not JSON, try URL-encoded
  }

  // Handle application/x-www-form-urlencoded
  if (contentType.indexOf("form-urlencoded") !== -1 || contents.indexOf("=") !== -1) {
    var params = {};
    var pairs = contents.split("&");
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split("=");
      if (pair.length === 2) {
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1].replace(/\+/g, " "));
      }
    }
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
