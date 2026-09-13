import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

async function generateRazorpaySignature(
  orderId: string,
  paymentId: string,
  secret: string,
) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const data = enc.encode(`${orderId}|${paymentId}`);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      booking_id,
    } = await req.json();

    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!razorpayKeySecret) {
      throw new Error("Razorpay secret missing");
    }

    const expectedSignature = await generateRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpayKeySecret,
    );

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: updatedBooking, error } = await supabase
      .from("bookings")
      .update({
        payment_status: "paid",
      })
      .eq("id", booking_id)
      .eq("razorpay_order_id", razorpay_order_id)
      .select("*")
      .single();

    if (error || !updatedBooking) {
      throw new Error(
        `Database error: ${error?.message || "Booking not found"}`,
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
