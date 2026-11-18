# RepurposeKit

A bilingual BYOK content repurposing workspace built for Hatchable.

## What is implemented
- Marketing landing page with English/Arabic language switch and RTL direction.
- Hatchable email-code end-user authentication.
- Authenticated project saving, listing and deletion. Rows are scoped to the signed-in user.
- Direct browser-to-provider generation for OpenAI and Gemini. The API key is held in JavaScript memory only; it is never sent to RepurposeKit API routes, written to the database, localStorage or sessionStorage.
- Content prompt for LinkedIn, X, short video, Instagram, newsletter, YouTube SEO, article titles, a 7-day calendar and executive summary.
- TXT/Markdown source file import (2 MB cap), plus PDF text extraction (up to 10 MB / 60 pages) and DOCX text extraction (up to 10 MB) in the browser using PDF.js and Mammoth. Scanned/image-only PDFs are not OCR'd.
- Copy, Markdown, TXT, CSV, JSON and Notion-ready Markdown export.

## Important limits in this build
- Public article URL extraction is available for many pages through a server-side browser session. Some publishers block automated reading; paste the article body when extraction fails. YouTube transcript extraction is not implemented; paste the transcript.
- PDF and DOCX parsing are not implemented. Convert to text first or paste the extracted text.
- API key testing and generation require the browser to reach the selected provider. Provider CORS rules, key permissions, model availability and billing are controlled by that provider.
- AI provider costs are paid by the user to OpenAI or Google. RepurposeKit does not proxy or subsidize generation.
- Internal lifetime licensing is implemented: hashed single-use codes, customer activation/status, owner-only code issuance/revocation, and server-side project limits (Starter 20, Pro 100, Agency 1,000; free accounts 3). Codes are generated inside the owner-only admin API and plaintext is returned once. This is NOT yet connected to AppSumo's vendor redemption API or to a payment provider webhook; AppSumo-origin codes must not be described as automatically verified until that integration is completed.
- No automatic social publishing is included.

## Deploy
This project is hosted natively by Hatchable; it is not a Next.js/Prisma deployment. The Hatchable platform handles hosting, Postgres and passwordless email-code auth.

1. In the Hatchable console, complete the Email auth setup if prompted.
2. Deploy the project from the console or through the Hatchable deploy action.
3. In Project Settings, change visibility to Public if you intend to let customers visit the landing page. A preview URL is temporary and is not a permanent public setting.
4. Test signup/login, then create a project and verify it appears in My projects.
5. Add your custom domain in Hatchable project settings and follow the DNS instructions shown there.

## API key privacy model
The key is kept in a page-level JavaScript variable and the password input. It is cleared on refresh/navigation/sign-out. The browser sends it directly to the chosen provider. This means the provider receives the key and request, as required for BYOK; RepurposeKit's own backend does not receive it. Never paste an API key on a shared or untrusted device.

## Database
The migrations create a `projects` table with a text user_id, source metadata, brand settings and generated outputs. The user id is supplied by Hatchable auth and is not a locally managed password/account table.

## AppSumo readiness checklist (not yet complete)
- Complete production QA for browser-based OpenAI/Gemini requests and supported model list.
- Validate PDF/DOCX extraction across real customer documents, including malformed files, scanned PDFs and mobile browsers.
- Add provider-supported automatic article/YouTube transcript import, or keep paste-only wording.
- Implement checkout and signed webhook verification for a payment provider.
- Implement hashed one-time AppSumo redemption codes, activation status, duplicate redemption prevention, and refund/revocation handling.
- Add plan entitlements and project limits in server-side API routes (not just UI).
- Add privacy policy, terms, support contact, data deletion and backup/restore procedures.
- Test mobile, Arabic RTL, account recovery, export formats, abuse limits and data isolation.
- Obtain AppSumo approval before claiming an AppSumo deal is available.