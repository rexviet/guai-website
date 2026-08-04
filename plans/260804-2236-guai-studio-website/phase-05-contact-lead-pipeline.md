# Phase 5: Contact Form & Lead Pipeline

## Context Links
- [Solution Design](./solution-design.md) - Section 5.3: Sequence Diagram

## Overview
- **Priority:** P1
- **Current status:** Pending
- **Brief description:** Build the frontend contact form with Cloudflare Turnstile, and implement a custom Strapi endpoint to process leads, upload attachments to R2, and send email notifications.

## Requirements
- Astro contact page form with file attachment capability.
- Cloudflare Turnstile integration to prevent spam.
- Custom Strapi POST `/api/leads` route.
- Email notifications sent to the sales team upon lead submission.

## Architecture
- Client-side form submission to Strapi backend.
- Custom Strapi Controller/Route to bypass standard REST API restrictions and handle custom logic (Turnstile verification, manual R2 upload, Resend integration).

## Related Code Files
- `[NEW]` `apps/web/src/pages/contact.astro`
- `[NEW]` `apps/web/src/components/forms/ContactForm.astro`
- `[NEW]` `apps/cms/src/api/lead/routes/lead-custom.ts`
- `[NEW]` `apps/cms/src/api/lead/controllers/lead-custom.ts`
- `[NEW]` `apps/cms/src/api/lead/services/lead-custom.ts`

## Implementation Steps
1. Create the `lead` Content-Type in Strapi (no public read/write via default routes).
2. Create custom route `POST /api/leads`.
3. In the custom controller:
   - Validate Cloudflare Turnstile token using server-side fetch.
   - Upload the attached file directly to R2 if present.
   - Insert the lead record into the database via Strapi entityService.
   - Call Resend/Brevo API to send a notification email.
4. Build the Astro `ContactForm` component, integrating Turnstile client script and `fetch` to `/api/leads`.
5. Implement success/error states and redirects on the frontend.

## Todo List
- [ ] Create `lead` schema in Strapi
- [ ] Implement Turnstile validation logic
- [ ] Implement custom Lead controller in Strapi
- [ ] Setup Resend/Brevo email integration
- [ ] Build frontend Contact Form with Turnstile

## Success Criteria
- Submitting the form creates a Lead record in Strapi.
- Attachments are uploaded and accessible via URL.
- Notification email is sent successfully.
- Invalid Turnstile tokens are rejected.

## Risk Assessment
- **Risk:** Abuse of the `/api/leads` endpoint.
- **Mitigation:** Strictly enforce Turnstile and implement rate limiting on Nginx or Strapi.

## Security Considerations
- Turnstile secret key and Resend API key must remain on the server, never exposed to the client.

## Next Steps
- Phase 6: CI/CD Pipeline
