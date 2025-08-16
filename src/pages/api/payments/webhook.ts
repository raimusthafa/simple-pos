import { db } from "@/server/db";
import type { NextApiHandler } from "next";

type XenditWebhookBody = {
    "event": "payment.succeeded",
    "data": {
        "id": string,
        "amount": number,
        "payment_request_id": string,
        "reference_id": string,
        "status": "SUCCEEDED" | "FAILED",
};
};

const handler: NextApiHandler = async (req, res) => {
    // Set response type to JSON
    res.setHeader('Content-Type', 'application/json');

    try {
        if(req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        // verify webhook dari xendit
        const headers = req.headers;
        const webhookToken = headers["x-callback-token"];

        if (webhookToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const body = req.body as XenditWebhookBody;
        
        // Validate required fields
        if (!body?.data?.reference_id) {
            console.error('Missing reference_id in webhook payload:', body);
            return res.status(400).json({ error: "Missing reference_id" });
        }

        const order = await db.order.findUnique({
            where: {
                id: body.data.reference_id,
            },
        });

        if (!order) {
            console.error('Order not found:', body.data.reference_id);
            return res.status(404).json({ error: "Order not found" });
        }

        if (body.data.status !== "SUCCEEDED") {
            return res.status(422).json({ error: "Payment not succeeded" });
        };

        await db.order.update({
            where : {
                id: order.id,
            },
            data: {
                paidAt: new Date(),
                status: "PROCESSING",
            },
        });

        return res.status(200).json({ success: true, message: "Order updated successfully" });
    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export default handler;