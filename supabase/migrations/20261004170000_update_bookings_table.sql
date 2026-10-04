alter table public.bookings
  drop column full_name,
  drop column email,
  drop column age,
  drop column visit_date;

alter table public.bookings
  add column booked_dates text[] not null default '{}',
  add column booked_types text[] not null default '{}';

alter table public.bookings drop constraint if exists bookings_age_check;
alter table public.bookings drop constraint if exists bookings_tickets_check;

alter table public.bookings add constraint bookings_tickets_check check (tickets >= 1 and tickets <= 4);
