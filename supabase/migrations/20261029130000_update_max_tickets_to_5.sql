alter table public.bookings drop constraint if exists bookings_tickets_check;
alter table public.bookings add constraint bookings_tickets_check check (tickets >= 1 and tickets <= 5);
