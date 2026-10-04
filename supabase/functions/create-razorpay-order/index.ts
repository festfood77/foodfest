import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const MAX_TICKETS = 3;

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    // Only allow POST
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({
          error: "Method not allowed",
        }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Read request body
    const body = await req.json();

    const {
      mobile,
      tickets,
      totalAmount,
      quantities,
    } = body;

    // Validate mobile number
    const isEmail = mobile.includes("@");
    let cleanMobile = mobile;
    
    if (isEmail) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mobile)) {
        return new Response(JSON.stringify({ error: "Invalid email address" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    } else {
      cleanMobile = mobile.replace(/\D/g, '').slice(-10);
      if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
        return new Response(JSON.stringify({ error: "Invalid mobile number" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // Validate tickets
    const parsedTickets = Number(tickets);
    if (!Number.isInteger(parsedTickets) || parsedTickets < 1 || parsedTickets > 4) {
      return new Response(JSON.stringify({ error: "Invalid ticket count" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Calculate dates and types
    const datesSet = new Set<string>();
    const typesSet = new Set<string>();

    if (quantities && typeof quantities === "object") {
      Object.entries(quantities).forEach(([id, qty]) => {
        if (typeof qty === "number" && qty > 0) {
          if (id.includes("_d1")) datesSet.add("18 Dec 2026");
          if (id.includes("_d2")) datesSet.add("19 Dec 2026");
          if (id.includes("_d3")) datesSet.add("20 Dec 2026");
          if (id === "vip") {
            datesSet.add("18 Dec 2026");
            datesSet.add("19 Dec 2026");
            datesSet.add("20 Dec 2026");
            typesSet.add("VIP All Access Pass");
          }
      
          if (id.startsWith("eb1")) typesSet.add("Early Bird Pass");
          if (id.startsWith("eb2")) typesSet.add("Early Bird Plus");
          if (id.startsWith("t1")) typesSet.add("Standard Ticket");
          if (id.startsWith("t2")) typesSet.add("Standard Ticket Plus");
        }
      });
    }

    const booked_dates = Array.from(datesSet);
    const booked_types = Array.from(typesSet);

    // Environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY",
    )!;

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Razorpay credentials are not configured");
    }

    // Supabase admin client
    const supabase = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
    );

    // Create Razorpay order
    const razorpayResponse = await fetch(
      "https://api.razorpay.com/v1/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":
            "Basic " +
            btoa(`${razorpayKeyId}:${razorpayKeySecret}`),
        },
        body: JSON.stringify({
          amount: totalAmount * 100,
          currency: "INR",
          receipt: `booking_${crypto.randomUUID()}`,
        }),
      },
    );

    const razorpayData = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      console.error("Razorpay error:", razorpayData);

      return new Response(
        JSON.stringify({
          error: "Failed to create Razorpay order",
        }),
        {
          status: 502,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Save booking in Supabase
    const { data: booking, error: bookingError } =
      await supabase
        .from("bookings")
        .insert({
          mobile: cleanMobile,
          tickets: parsedTickets,
          total_amount: totalAmount,
          booked_dates,
          booked_types,
          payment_status: "pending",
          razorpay_order_id: razorpayData.id,
        })
        .select("id")
        .single();

    if (bookingError) {
      console.error("Booking insert error:", bookingError);

      return new Response(
        JSON.stringify({
          error: "Failed to create booking",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Return only what the frontend needs
    return new Response(
      JSON.stringify({
        bookingId: booking.id,
        orderId: razorpayData.id,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        keyId: razorpayKeyId,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Unexpected error:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});