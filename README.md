# SOD Conflict Detection

React 19 + TypeScript + Vite + Tailwind v4 frontend for an SAP
Segregation-of-Duties (SoD) conflict detector. Uploads SAP user-role
exports to an n8n workflow that cross-references them against a rule set
and emails the conflict report to the address you provide.

The companion n8n workflow is checked in at [`n8n-workflow.json`](./n8n-workflow.json).

## What it does

Posts a multipart form submission to the n8n `formTrigger` node `On Form
Submission4`. The two form fields are taken **verbatim** from the workflow JSON:

| Field name        | UI control                | n8n `fieldType` |
| ----------------- | ------------------------- | --------------- |
| `SAP_USER_DATA`   | File picker (.xlsx, .xls) | `file`          |
| `Send to`         | Email text input          | (default text)  |

The webhook the form posts to is built from the n8n form-trigger
`webhookId` `92662720-a8cb-465d-9bef-6751cf7e55fd`.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in VITE_N8N_WEBHOOK_URL
npm run dev                  # http://localhost:5174
```

For a self-hosted n8n the URL is typically:

```
https://<your-n8n-host>/form/92662720-a8cb-465d-9bef-6751cf7e55fd
```

…or, with a production webhook node and a custom path:

```
https://<your-n8n-host>/webhook/<custom-path>
```

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # serves the built bundle locally
```
