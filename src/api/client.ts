// n8n form-trigger webhook for the SAP SoD workflow.
// Field names below come straight from "SAP SOD Project (Live).json"
//   → node "On Form Submission4" → formFields.values:
//     [ { fieldLabel: "SAP_USER_DATA", fieldType: "file" },
//       { fieldLabel: "Send to" } ]
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL
  ?? 'https://appsecure.onus.paytmdgt.io/webhook/sap-sod-tester';

export const SAP_USER_DATA_FIELD = 'SAP_USER_DATA';
export const SEND_TO_FIELD       = 'Send to';

export interface SubmitSodJobInput {
  file: File;
  sendTo: string;
}

export interface SubmitSodJobResult {
  status: number;
  ok: boolean;
  body: string;
}

export async function submitSodJob({ file, sendTo }: SubmitSodJobInput): Promise<SubmitSodJobResult> {
  const fd = new FormData();
  fd.append(SAP_USER_DATA_FIELD, file, file.name);
  fd.append(SEND_TO_FIELD, sendTo);

  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    body: fd,
  });
  const body = await res.text().catch(() => '');
  if (!res.ok) {
    throw new Error(`n8n webhook responded ${res.status}${body ? ` — ${body}` : ''}`);
  }
  return { status: res.status, ok: res.ok, body };
}

export function getWebhookUrl(): string {
  return WEBHOOK_URL;
}
