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
    return res.status(405).send("Method Not Allowed");
  }

  // Verify webhook berasal dari Xendit
  const headers = req.headers;

  const webhookToken = headers["x-callback-token"];

  if (webhookToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
    return res.status(401).send("Unauthorized");
  }

  const body = req.body as XenditWebhookBody;

  // 1. find order
  // 2. if success, update order to success
  const order = await db.order.findUnique({
    where: {
      id: body.data.reference_id,
    },
  });

  if (!order) {
    return res.status(404).send("Order not found");
  }

  if (body.data.status !== "SUCCEEDED") {
    // update order menjadi failed
    return res.status(422).send("Payment not succeeded");
  }

  await db.order.update({
    where: {
      id: order.id,
    },
    data: {
      paidAt: new Date(),
      status: "PROCESSING",
    },
  });

  return res.status(200).send("OK");
};

export default handler;
