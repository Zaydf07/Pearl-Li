import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY && RESEND_API_KEY !== "re_123" ? new Resend(RESEND_API_KEY) : null;
const FROM   = process.env.EMAIL_FROM ?? "Pearl & Li <orders@pearlandli.com>";
const SITE   = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// ── Shared styles ────────────────────────────────────────────────────────────
const base = `
  font-family: 'Georgia', serif;
  background: #f8f7f5;
  margin: 0; padding: 0;
`;
const card = `
  max-width: 600px; margin: 40px auto; background: #ffffff;
  border: 1px solid #e8e4df;
`;
const header = `
  background: #0a0a0a; padding: 36px 40px; text-align: center;
`;
const body = `padding: 36px 40px;`;
const footer = `
  padding: 24px 40px; border-top: 1px solid #e8e4df;
  text-align: center; font-size: 11px; color: #a09990;
  font-family: 'Helvetica Neue', sans-serif; letter-spacing: .04em;
`;
const h1 = `
  font-family: 'Georgia', serif; font-size: 26px; font-weight: 400;
  color: #0a0a0a; margin: 0 0 8px;
`;
const eyebrow = `
  font-size: 9px; letter-spacing: .24em; text-transform: uppercase;
  color: #4a9e7a; font-family: 'Helvetica Neue', sans-serif; margin-bottom: 12px;
`;
const label = `
  font-size: 9px; letter-spacing: .18em; text-transform: uppercase;
  color: #a09990; font-family: 'Helvetica Neue', sans-serif;
  font-weight: 600; margin-bottom: 4px;
`;
const value = `font-size: 13px; color: #1a1a1a; margin-bottom: 16px; line-height: 1.5;`;
const btn   = `
  display: inline-block; background: #0a0a0a; color: #ffffff;
  padding: 14px 32px; text-decoration: none;
  font-family: 'Helvetica Neue', sans-serif; font-size: 10px;
  letter-spacing: .2em; text-transform: uppercase; font-weight: 600;
`;

// ── Order confirmation ────────────────────────────────────────────────────────
interface OrderItem { name: string; qty: number; price: number; }

interface OrderConfirmationData {
  to:           string;
  customerName: string;
  orderId:      string;
  items:        OrderItem[];
  total:        number;
  address:      string;
  shippingMethod: string;
}

export async function sendOrderConfirmation(data: OrderConfirmationData) {
  if (!resend) return;

  const itemRows = data.items.map(i => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; font-size: 13px; color: #1a1a1a;">${i.name}</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; font-size: 13px; color: #6b6560; text-align: center;">× ${i.qty}</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; font-size: 13px; color: #1a1a1a; text-align: right; font-family: Georgia, serif;">$${(i.price * i.qty).toLocaleString()}</td>
    </tr>
  `).join("");

  const shippingLabel: Record<string, string> = {
    standard:    "Standard Delivery (5–7 business days)",
    express:     "Express Delivery (2–3 business days)",
    "white-glove": "White Glove Service (Next day)",
  };

  const html = `
    <div style="${base}">
      <div style="${card}">
        <div style="${header}">
          <div style="font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #ffffff; letter-spacing: .08em;">
            Pearl <span style="color: #4a9e7a;">&</span> Li
          </div>
        </div>
        <div style="${body}">
          <div style="${eyebrow}">Order Confirmed</div>
          <h1 style="${h1}">Thank You, ${data.customerName.split(" ")[0]}.</h1>
          <p style="font-size: 15px; color: #6b6560; line-height: 1.7; margin: 0 0 28px; font-family: Georgia, serif;">
            Your order has been received and is being carefully prepared. We'll notify you once it has been dispatched.
          </p>

          <div style="background: #f8f7f5; padding: 20px 24px; margin-bottom: 28px; border: 1px solid #e8e4df;">
            <div style="${label}">Order Reference</div>
            <div style="font-family: monospace; font-size: 13px; color: #4a9e7a;">#PL-${data.orderId.slice(-8).toUpperCase()}</div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr>
                <th style="text-align: left; font-size: 8px; letter-spacing: .18em; text-transform: uppercase; color: #a09990; padding-bottom: 10px; font-family: 'Helvetica Neue', sans-serif; font-weight: 600; border-bottom: 1.5px solid #e8e4df;">Item</th>
                <th style="text-align: center; font-size: 8px; letter-spacing: .18em; text-transform: uppercase; color: #a09990; padding-bottom: 10px; font-family: 'Helvetica Neue', sans-serif; font-weight: 600; border-bottom: 1.5px solid #e8e4df;">Qty</th>
                <th style="text-align: right; font-size: 8px; letter-spacing: .18em; text-transform: uppercase; color: #a09990; padding-bottom: 10px; font-family: 'Helvetica Neue', sans-serif; font-weight: 600; border-bottom: 1.5px solid #e8e4df;">Price</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding-top: 14px; font-size: 8px; letter-spacing: .18em; text-transform: uppercase; color: #a09990; font-family: 'Helvetica Neue', sans-serif; font-weight: 600;">Total</td>
                <td style="padding-top: 14px; text-align: right; font-family: Georgia, serif; font-size: 18px; color: #0a0a0a;">$${data.total.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>

          <div style="display: grid; gap: 0; margin-bottom: 28px;">
            <div style="${label}">Delivery Address</div>
            <div style="${value}">${data.address}</div>
            <div style="${label}">Shipping Method</div>
            <div style="${value}">${shippingLabel[data.shippingMethod] ?? data.shippingMethod}</div>
          </div>

          <div style="text-align: center;">
            <a href="${SITE}/account" style="${btn}">View My Order</a>
          </div>
        </div>
        <div style="${footer}">
          Pearl &amp; Li · Fine Jewellery &amp; Luxury Goods<br />
          Questions? Reply to this email or visit <a href="${SITE}/consultation" style="color: #4a9e7a; text-decoration: none;">pearlandli.com</a>
        </div>
      </div>
    </div>
  `;

  await resend.emails.send({
    from:    FROM,
    to:      data.to,
    subject: `Your Pearl & Li order has been confirmed — #PL-${data.orderId.slice(-8).toUpperCase()}`,
    html,
  });
}

// ── Status update ─────────────────────────────────────────────────────────────
interface StatusUpdateData {
  to:           string;
  customerName: string;
  orderId:      string;
  status:       string;
  tracking?:    string | null;
  carrier?:     string | null;
  items:        OrderItem[];
}

const STATUS_COPY: Record<string, { subject: string; eyebrowText: string; heading: string; body: string }> = {
  processing: {
    subject:     "Your order is being prepared",
    eyebrowText: "Processing",
    heading:     "We're preparing your order.",
    body:        "Your pieces are being carefully selected and packaged by our team in Rome. We'll be in touch as soon as your order is on its way.",
  },
  shipped: {
    subject:     "Your order is on its way",
    eyebrowText: "Shipped",
    heading:     "Your order has been dispatched.",
    body:        "Your Pearl & Li pieces are now on their way to you. You can track your shipment using the details below.",
  },
  delivered: {
    subject:     "Your order has been delivered",
    eyebrowText: "Delivered",
    heading:     "Your order has arrived.",
    body:        "We hope your pieces bring you as much joy as it brought us to create them. If you have any questions, we're always here.",
  },
};

export async function sendStatusUpdate(data: StatusUpdateData) {
  if (!resend) return;
  const copy = STATUS_COPY[data.status];
  if (!copy) return; // don't send for pending or cancelled

  const trackingBlock = data.tracking ? `
    <div style="background: #f8f7f5; border: 1px solid #e8e4df; padding: 20px 24px; margin: 24px 0;">
      <div style="${label}">Tracking Information</div>
      <div style="font-size: 13px; color: #1a1a1a; margin-bottom: 4px;">${data.carrier ?? "Carrier"}</div>
      <div style="font-family: monospace; font-size: 14px; color: #4a9e7a; letter-spacing: .06em;">${data.tracking}</div>
    </div>
  ` : "";

  const html = `
    <div style="${base}">
      <div style="${card}">
        <div style="${header}">
          <div style="font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #ffffff; letter-spacing: .08em;">
            Pearl <span style="color: #4a9e7a;">&</span> Li
          </div>
        </div>
        <div style="${body}">
          <div style="${eyebrow}">${copy.eyebrowText}</div>
          <h1 style="${h1}">${copy.heading}</h1>
          <p style="font-size: 15px; color: #6b6560; line-height: 1.7; margin: 0 0 8px; font-family: Georgia, serif;">
            Dear ${data.customerName.split(" ")[0]},
          </p>
          <p style="font-size: 15px; color: #6b6560; line-height: 1.7; margin: 0 0 24px; font-family: Georgia, serif;">
            ${copy.body}
          </p>

          <div style="background: #f8f7f5; padding: 16px 24px; margin-bottom: 8px; border: 1px solid #e8e4df;">
            <div style="${label}">Order Reference</div>
            <div style="font-family: monospace; font-size: 13px; color: #4a9e7a;">#PL-${data.orderId.slice(-8).toUpperCase()}</div>
          </div>

          ${trackingBlock}

          <div style="text-align: center; margin-top: 28px;">
            <a href="${SITE}/account" style="${btn}">View Order Details</a>
          </div>
        </div>
        <div style="${footer}">
          Pearl &amp; Li · Fine Jewellery &amp; Luxury Goods<br />
          <a href="${SITE}/consultation" style="color: #4a9e7a; text-decoration: none;">pearlandli.com</a>
        </div>
      </div>
    </div>
  `;

  await resend.emails.send({
    from:    FROM,
    to:      data.to,
    subject: `Pearl & Li — ${copy.subject}`,
    html,
  });
}
