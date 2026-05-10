# Apps Script Gallery API

This document covers the `script.google.com` backend used by category gallery pages.

## Purpose

Provide category photo metadata from Google Drive without making direct Drive API metadata calls from the browser.

Frontend usage:

- `js/features/category-gallery.js`
- Calls: `GET <WEB_APP_URL>?category=<slug>`

## Current Categories

- `birthday`
- `corporate`
- `graduation`
- `marriage`

Each category maps to a Drive subfolder ID inside your Photos structure.

## Required Apps Script Deployment Settings

When deploying Web App:

- Execute as: `Me`
- Who has access: `Anyone`

If these change, browser requests may fail.

## Authorization Requirement

Because script uses `DriveApp`, project owner must authorize Drive scope once.

Recommended one-time auth function:

```javascript
function authTest() {
  DriveApp.getFolderById("1J0S3ykJAtxrG5gmRNOZl3o19CN4LNJZb").getName();
}
```

Run `authTest` from Apps Script editor and accept requested permissions.

## Response Contract

Successful response shape:

```json
{
  "ok": true,
  "category": "birthday",
  "folderId": "....",
  "count": 12,
  "photos": [
    {
      "id": "FILE_ID",
      "name": "image.jpg",
      "mimeType": "image/jpeg",
      "createdTime": "2026-05-08T...",
      "thumb": "https://drive.google.com/thumbnail?id=FILE_ID&sz=w480",
      "full": "https://drive.google.com/thumbnail?id=FILE_ID&sz=w1800"
    }
  ]
}
```

Error response shape:

```json
{
  "ok": false,
  "error": "invalid_category|server_error",
  "message": "..."
}
```

## Caching

Apps Script cache:

- `CacheService.getScriptCache()`
- TTL: `1800s` (30 minutes)

Frontend cache:

- `localStorage` key: `frenzy_drive_gallery_cache_v2`
- TTL: `30 minutes`

## Troubleshooting

### `unauthorized`

Script still contains secret check or old deployment version.

Action:

1. Save latest script code
2. Deploy new Web App version
3. Re-test `?category=birthday`

### `You do not have permission to call DriveApp.getFolderById`

Drive scope not authorized.

Action:

1. Run `authTest`
2. Grant permissions
3. Redeploy Web App

### `insufficientFilePermissions`

Folder/files not publicly readable for unauthenticated web app consumers.

Action:

1. Ensure each category folder is `Anyone with the link` + Viewer
2. Ensure photo files inherit or match public viewer access

### Thumbnail `429` from `lh3.googleusercontent.com`

Image CDN throttling.

Mitigations already in frontend:

- smaller thumbnails (`w480`)
- initial eager limit (`6`)
- deferred load via `IntersectionObserver`
- jittered retry backoff

## Operational Checklist

1. Category folder IDs in `assets/data/photo-categories.json` are current.
2. Web App URL in `GALLERY_WEBAPP_URL` is correct.
3. Apps Script deployment is latest version.
4. Test endpoint returns `ok: true` for all categories.
