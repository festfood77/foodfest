import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const TICKET_PRICE = 299;
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
      fullName,
      mobile,
      email,
      age,
      date,
      tickets,
    } = body;

    // Validate full name
    if (
      typeof fullName !== "string" ||
      fullName.trim().length < 3
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid full name",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Validate mobile number
    if (
      typeof mobile !== "string" ||
      !/^[6-9]\d{9}$/.test(mobile)
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid mobile number",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Validate email
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid email address",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Validate age
    const parsedAge = Number(age);

    if (
      !Number.isInteger(parsedAge) ||
      parsedAge < 5 ||
      parsedAge > 100
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid age",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Validate date
    if (
      typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid visit date",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Validate tickets
    const parsedTickets = Number(tickets);

    if (
      !Number.isInteger(parsedTickets) ||
      parsedTickets < 1 ||
      parsedTickets > MAX_TICKETS
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid ticket count",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Calculate amount on the server.
    // Never trust totalAmount sent by the frontend.
    const totalAmount = parsedTickets * TICKET_PRICE;

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
          full_name: fullName.trim(),
          mobile,
          email: email.trim(),
          age: parsedAge,
          visit_date: date,
          tickets: parsedTickets,
          total_amount: totalAmount,
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