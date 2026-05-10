# Apps Script Email Workflow

This document covers the Google Apps Script email automation currently used for enquiry notifications.

## Purpose

Send formatted notification emails when a form submission is received.

Current function in script editor:

- `onFormSubmit(e)`

## Trigger Model

Recommended trigger type:

- **Installable trigger** for `onFormSubmit`
- Event source: spreadsheet/form response destination

Do not rely on a manually run function for production notifications.

## Expected Event Shape

The script reads `e.namedValues` and maps form fields by label.

Common field labels in current script include:

- `Name`
- `Email`
- `Phone`
- `Event Date`
- `Event Type`
- `Message`
- `Timestamp`

If field labels change in Google Form/Sheet headers, update script mappings accordingly.

## Ownership + Permissions

The trigger executes under the account that owns/created the trigger.

Best practice:

1. Use the same owner account as operations mailbox owner.
2. Keep script and response spreadsheet owned by the same Google account when possible.
3. Reauthorize after major scope changes.

## Deployment Notes

For pure trigger-based email scripts, web app deployment is not required.

Use Web App deployment only if exposing endpoints (for example the gallery API script).

## Troubleshooting

### No email sent

Check:

1. Trigger exists and is enabled.
2. Function name matches exactly (`onFormSubmit`).
3. Script executions show no errors.
4. Recipient mailbox and spam folder.

### `TypeError` on `e.namedValues`

Cause:

- Function run manually from editor (`Run`) without event object.

Action:

- Test by submitting an actual form response.

### Missing/blank values in email

Cause:

- Form label mismatch with expected keys.

Action:

- Verify labels and update key lookups in script.

### Timezone mismatch in timestamps

Action:

1. Verify script timezone in Apps Script project settings.
2. Confirm explicit timezone conversion logic in script.

## Operational Checklist

1. Trigger exists for `onFormSubmit`.
2. Recipient email is current.
3. Field labels in form match script keys.
4. Latest successful execution exists in Apps Script execution log.
5. Test submission sent after any script changes.
