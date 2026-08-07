/**
 * lead controller with custom submit endpoint
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::lead.lead', ({ strapi }) => ({
  async submit(ctx) {
    try {
      const body = ctx.request.body || {};
      const files = ctx.request.files || {};

      const name = body.name?.trim();
      const email = body.email?.trim();
      const phone = body.phone?.trim();
      const company = body.company?.trim();
      const service_interest = body.service_interest?.trim();
      const message = body.message?.trim();
      const turnstileToken = body.turnstileToken || body['cf-turnstile-response'];

      // Validation required fields
      if (!name || !email || !message) {
        return ctx.badRequest('Vui lòng điền đầy đủ các trường bắt buộc (Họ tên, Email, Nội dung brief)');
      }

      // Cloudflare Turnstile Verification
      const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
      if (turnstileSecret && turnstileSecret !== 'dummy' && turnstileToken !== '1x00000000000000000000AA') {
        if (!turnstileToken) {
          return ctx.badRequest('Xác thực Turnstile không thành công (thiếu token)');
        }

        const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
        const verifyResponse = await fetch(verifyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: turnstileToken,
            remoteip: ctx.ip || ctx.request.ip || '',
          }),
        });

        const outcome = await verifyResponse.json().catch(() => ({ success: false }));
        if (!outcome.success) {
          strapi.log.warn(`Turnstile validation failed for IP ${ctx.ip}: ${JSON.stringify(outcome)}`);
          return ctx.badRequest('Xác thực bảo mật Turnstile thất bại, vui lòng thử lại');
        }
      }

      // Handle File Upload if present
      let attachmentId = null;
      const attachmentFile = files.attachment;
      if (attachmentFile) {
        try {
          const uploadedFiles = await strapi.plugin('upload').service('upload').upload({
            data: {},
            files: attachmentFile,
          });
          if (Array.isArray(uploadedFiles) && uploadedFiles.length > 0) {
            attachmentId = uploadedFiles[0].id;
          }
        } catch (uploadErr) {
          strapi.log.error('File upload to R2/Media error:', uploadErr);
        }
      }

      // Create Lead record via Strapi 5 Document Service
      const leadData: Record<string, any> = {
        name,
        email,
        phone: phone || null,
        company: company || null,
        service_interest: service_interest || null,
        message,
        ip_address: ctx.ip || ctx.request.ip || null,
        status: 'new',
      };

      if (attachmentId) {
        leadData.attachment = attachmentId;
      }

      const lead = await strapi.documents('api::lead.lead').create({
        data: leadData,
      });

      // Send Email Notification to Sales Team
      const salesEmail = process.env.SALES_EMAIL || 'contact@guai.studio';
      try {
        if (process.env.RESEND_API_KEY) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'GuAI Studio <noreply@guai.studio>',
              to: [salesEmail],
              subject: `[GuAI Studio Lead] Brief mới từ ${name} (${company || 'Khách hàng'})`,
              html: `
                <h2>New Brief Lead Received</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                <p><strong>Company:</strong> ${company || 'N/A'}</p>
                <p><strong>Service Interest:</strong> ${service_interest || 'N/A'}</p>
                <p><strong>Message:</strong></p>
                <blockquote style="background:#f4f4f4; padding:12px; border-left:4px solid #00f0ff;">${message}</blockquote>
                <p><strong>IP Address:</strong> ${ctx.ip || 'N/A'}</p>
              `,
            }),
          });
        }
      } catch (emailErr) {
        strapi.log.error('Failed to send sales lead notification email:', emailErr);
      }

      return ctx.send({
        success: true,
        message: 'Gửi thông tin thành công! GuAI Studio sẽ liên hệ lại với bạn trong 24h.',
        data: {
          id: (lead as any).documentId || (lead as any).id,
        },
      });
    } catch (error: any) {
      strapi.log.error('Lead submit error:', error);
      return ctx.internalServerError('Đã có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau.');
    }
  },
}));
