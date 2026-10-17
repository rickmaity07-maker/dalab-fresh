import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { DICTS, describeSlot } from "./i18n";
import { formatEur } from "./pricing";
import type { Order, Store } from "./types";

// SMTP settings come from the environment (any provider: Brevo, Mailjet, IONOS, Gmail app password...).
// Without them, development uses a throwaway Ethereal inbox and logs a link to view each email.
let transport: Promise<Transporter | null> | undefined;

function getTransport() {
  transport ??= (async () => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (SMTP_HOST) {
      const port = Number(SMTP_PORT || 587);
      return nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined });
    }
    if (process.env.NODE_ENV === "production") {
      console.warn("[mail] SMTP_HOST is not set; order emails are not being sent.");
      return null;
    }
    const test = await nodemailer.createTestAccount();
    console.info(`[mail] Using Ethereal test inbox ${test.user}. Set SMTP_* in .env.local to send real email.`);
    return nodemailer.createTransport({ host: test.smtp.host, port: test.smtp.port, secure: test.smtp.secure, auth: { user: test.user, pass: test.pass } });
  })().catch((err) => {
    console.error("[mail] Could not set up a mail transport:", err);
    transport = undefined;
    return null;
  });
  return transport;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function render(order: Order, store: Store, now: Date) {
  const t = DICTS[order.lang];
  const money = (c: number) => formatEur(c, order.lang);
  const when = t.email.when(order.mode, describeSlot(order.slotId, now, order.lang), store.name);
  const rows = order.items.map((i) => ({ label: `${i.qty} × ${i.name}`, amount: money(i.price * i.qty) }));
  const totals = [
    ...(order.quote.savings ? [{ label: t.basket.youSave, amount: money(order.quote.savings) }] : []),
    { label: t.basket.subtotal, amount: money(order.quote.subtotal) },
    { label: order.mode === "collect" ? t.basket.collect : t.basket.delivery, amount: order.quote.fee ? money(order.quote.fee) : t.basket.free },
  ];

  const text = [
    t.email.hello(order.name),
    t.email.intro,
    "",
    `${order.id}`,
    when,
    ...(order.address ? [order.address] : []),
    t.email.payment(order.payment),
    "",
    ...rows.map((r) => `${r.label}  ${r.amount}`),
    "",
    ...totals.map((r) => `${r.label}: ${r.amount}`),
    `${t.basket.total}: ${money(order.quote.total)}`,
    "",
    t.email.bye,
  ].join("\n");

  const line = (l: string, a: string, strong = false) =>
    `<tr><td style="padding:6px 0;${strong ? "font-weight:700;font-size:17px" : ""}">${esc(l)}</td><td style="padding:6px 0;text-align:right;white-space:nowrap;${strong ? "font-weight:700;font-size:17px" : ""}">${esc(a)}</td></tr>`;

  // Table layout and inline styles: email clients ignore most modern CSS.
  const html = `<!doctype html><html lang="${order.lang}"><body style="margin:0;background:#f6f6f3;font-family:Arial,Helvetica,sans-serif;color:#0f1a2e">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" style="max-width:560px;background:#fdfdfb;border-radius:16px;overflow:hidden" cellspacing="0" cellpadding="0">
<tr><td style="height:10px;background:#d93a26"></td></tr>
<tr><td style="padding:28px 28px 8px"><div style="font-size:22px;font-weight:800">Dalab Fresh</div></td></tr>
<tr><td style="padding:0 28px 8px;line-height:1.5"><p>${esc(t.email.hello(order.name))}<br>${esc(t.email.intro)}</p>
<p style="background:#ecede8;border-radius:12px;padding:14px 16px;margin:16px 0"><b>${esc(order.id)}</b><br>${esc(when)}${order.address ? `<br>${esc(order.address)}` : ""}<br>${esc(t.email.payment(order.payment))}</p></td></tr>
<tr><td style="padding:0 28px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:15px;border-bottom:1px solid #dcdfd8">${rows.map((r) => line(r.label, r.amount)).join("")}</table>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:15px;margin-top:8px">${totals.map((r) => line(r.label, r.amount)).join("")}${line(t.basket.total, money(order.quote.total), true)}</table></td></tr>
<tr><td style="padding:20px 28px 28px;color:#586174;font-size:14px">${esc(t.email.bye)}</td></tr>
</table></td></tr></table></body></html>`;

  return { subject: t.email.subject(order.id), text, html };
}

/** Sends the customer confirmation and a copy to the store. Never throws: a mail outage must not fail an order. */
export async function sendOrderEmails(order: Order, store: Store, now = new Date()) {
  const tx = await getTransport();
  if (!tx) return;
  const from = process.env.MAIL_FROM || "Dalab Fresh <bestellung@dalab-fresh.de>";
  try {
    const msg = render(order, store, now);
    const info = await tx.sendMail({ from, to: order.email, ...msg });
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.info(`[mail] Customer email for ${order.id}: ${preview}`);

    const staff = process.env.STORE_EMAIL;
    if (staff) {
      const de = render({ ...order, lang: "de" }, store, now);
      await tx.sendMail({
        from, to: staff, replyTo: order.email,
        subject: DICTS.de.email.staffSubject(order.id, formatEur(order.quote.total, "de")),
        text: `${order.name} <${order.email}>${order.phone ? `, ${order.phone}` : ""}\n${store.name}\n\n${de.text}`,
      });
    }
  } catch (err) {
    console.error(`[mail] Could not send email for ${order.id}:`, err);
  }
}
