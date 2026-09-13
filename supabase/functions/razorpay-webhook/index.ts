import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as crypto from "node:crypto";

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return new Response("Missing signature", { status: 400 });
    }

    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not configured");
      return new Response("Webhook secret not configured", { status: 500 });
    }

    // Get the raw body for signature verification
    const rawBody = await req.text();

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid signature", { expectedSignature, signature });
      return new Response("Invalid signature", { status: 400 });
    }

    // Parse the payload
    const payload = JSON.parse(rawBody);
    const event = payload.event;

    console.log(`Received webhook event: ${event}`);

    // We only care about successful payments
    if (event === "order.paid" || event === "payment.captured") {
      const orderId =
        payload.payload?.payment?.entity?.order_id ||
        payload.payload?.order?.entity?.id;

      if (orderId) {
        const paymentId = payload.payload?.payment?.entity?.id;
        
        // Environment variables
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

        // Supabase admin client
        const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

        const { error } = await supabase
          .from("bookings")
          .update({ 
            payment_status: "paid",
            ...(paymentId && { razorpay_payment_id: paymentId })
          })
          .eq("razorpay_order_id", orderId);

        if (error) {
          console.error("Failed to update booking status:", error);
          return new Response("Failed to update booking status", { status: 500 });
        }
        
        console.log(`Successfully updated booking for order ${orderId} to paid`);
      }
    } else if (event === "payment.failed") {
      const orderId = payload.payload?.payment?.entity?.order_id;
      if (orderId) {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

        await supabase
          .from("bookings")
          .update({ payment_status: "failed" })
          .eq("razorpay_order_id", orderId);
      }
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
