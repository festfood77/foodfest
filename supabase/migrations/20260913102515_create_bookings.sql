create table public.bookings (
  id uuid primary key default gen_random_uuid(),

  full_name text not null,
  mobile text not null,
  email text not null,
  age integer not null,
  visit_date date not null,

  tickets integer not null default 1,
  total_amount integer not null,

  payment_status text not null default 'pending',
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint bookings_tickets_check
    check (tickets >= 1 and tickets <= 3),

  constraint bookings_age_check
    check (age >= 5 and age <= 100),

  constraint bookings_amount_check
    check (total_amount > 0),

  constraint bookings_payment_status_check
    check (payment_status in ('pending', 'paid', 'failed'))
);