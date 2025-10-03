import { db } from "@/server/db";
import type { NextApiHandler } from "next";

type XenditWebhookBody = {
  event: "payment.succeeded";
  data: {
    id: string;
    amount: number;
    payment_request_id: string;
    reference_id: string;
    status: "SUCCEEDED" | "FAILED";
  };
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify webhook berasal dari Xendit
  const headers = req.headers;
  const webhookToken = headers["x-callback-token"];

  if (webhookToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
    return res.status(401).json({ error: "Invalid webhook token" });
  }

  const body = req.body as XenditWebhookBody;

  // Find and validate order
  const order = await db.order.findUnique({
    where: {
      id: body.data.reference_id,
    },
  });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  // Validate payment amount
  if (body.data.amount !== order.grandtotal) {
    return res.status(400).json({ error: "Payment amount mismatch" });
  }

  if (body.data.status !== "SUCCEEDED") {
    await db.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "AWAITING_PAYMENT",
      },
    });
    return res.status(422).json({ error: "Payment failed" });
  }

  // Update order to processing status
  await db.order.update({
    where: {
      id: order.id,
    },
    data: {
      paidAt: new Date(),
      status: "PROCESSING",
    },
  });

  return res.status(200).json({ success: true });
};

export default handler;
