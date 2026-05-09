# Setup Guide

This guide walks through full project setup for local development and production-ready gallery data using Apps Script.

## 1. Local Project Setup

From project root:

```bash
npm install
export GALLERY_WEBAPP_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
npm run dev
```

Open:

- `http://localhost:8081`

Build output:

```bash
npm run build
```

## 2. Apps Script Gallery API Setup

Use your Apps Script project for gallery metadata endpoint.

Required deployment settings:

- Execute as: `Me`
- Who has access: `Anyone`

### One-time authorization

Run this once in Apps Script editor:

```javascript
function authTest() {
  DriveApp.getFolderById("1J0S3ykJAtxrG5gmRNOZl3o19CN4LNJZb").getName();
}
```

Approve requested permissions.

### Deploy Web App

1. `Deploy` → `Manage deployments`
2. Edit Web App deployment
3. Click `Deploy` (creates latest version)

Test:

- `https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec?category=birthday`

Expected: JSON with `"ok": true`.

## 3. Drive Folder Setup

Required category folders:

- Birthday
- Corporate
- Graduation
- Marriage

In `assets/data/photo-categories.json`, ensure each category has correct:

- `driveFolderId`
- `driveFolderUrl`

Drive sharing:

- Category folders and files should be `Anyone with the link` (Viewer).

## 4. Email Script Setup (onFormSubmit)

For enquiry notification script:

1. Ensure `onFormSubmit(e)` exists in Apps Script.
2. Create installable trigger for form/spreadsheet submit event.
3. Verify recipient email and field label mapping.
4. Test with a real form submission.

## 5. Production Checklist

1. `GALLERY_WEBAPP_URL` set on hosting platform.
2. Apps Script endpoint returns `ok: true` for all categories.
3. Category pages load photos and open lightbox correctly.
4. Back link from category pages returns users to `/#gallery` when relevant.
5. Hard refresh once after major gallery script changes.

## Related Docs

- `documentation/architecture.md`
- `documentation/apps-script-gallery-api.md`
- `documentation/apps-script-email-workflow.md`
