import type { APIRoute } from 'astro';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const CONTACT_TO = 'eric@fadetechs.com';

const sanitize = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim() : '');

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const contentType = request.headers.get('content-type') ?? '';
    let name = '';
    let email = '';
    let message = '';

    if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      name = sanitize(formData.get('name'));
      email = sanitize(formData.get('email'));
      message = sanitize(formData.get('message'));
    } else if (contentType.includes('application/json')) {
      const payload = (await request.json()) as Record<string, unknown>;
      name = typeof payload.name === 'string' ? payload.name.trim() : '';
      email = typeof payload.email === 'string' ? payload.email.trim() : '';
      message = typeof payload.message === 'string' ? payload.message.trim() : '';
    } else {
      // Fallback defensivo para clientes que no envían Content-Type.
      const rawBody = await request.text();
      const params = new URLSearchParams(rawBody);
      name = (params.get('name') ?? '').trim();
      email = (params.get('email') ?? '').trim();
      message = (params.get('message') ?? '').trim();
    }

    if (!name || !email || !message) {
      return redirect('/contact?status=error');
    }

    const apiKey = import.meta.env.RESEND_API_KEY;
    const from = import.meta.env.RESEND_FROM_EMAIL || 'Contacto Web <onboarding@resend.dev>';

    if (!apiKey) {
      console.error('Falta RESEND_API_KEY');
      return redirect('/contact?status=error');
    }

    const textBody = [
      'Nuevo mensaje desde el formulario de contacto',
      '',
      `Nombre: ${name}`,
      `Email: ${email}`,
      '',
      'Mensaje:',
      message,
    ].join('\n');

    const htmlBody = `
      <h2>Nuevo mensaje desde el formulario de contacto</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message.replace(/\n/g, '<br />')}</p>
    `;

    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [CONTACT_TO],
        reply_to: email,
        subject: `Nuevo contacto: ${name}`,
        text: textBody,
        html: htmlBody,
      }),
    });

    if (!resendResponse.ok) {
      const errorPayload = await resendResponse.text();
      console.error('Error al enviar con Resend:', resendResponse.status, errorPayload);
      return redirect('/contact?status=error');
    }

    return redirect('/contact?status=ok');
  } catch (error) {
    console.error('Error en /api/contact:', error);
    return redirect('/contact?status=error');
  }
};
