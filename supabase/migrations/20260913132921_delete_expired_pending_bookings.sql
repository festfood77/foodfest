create extension if not exists pg_cron;

select cron.schedule(
  'delete-expired-pending-bookings',
  '*/15 * * * *',
  $$
    delete from public.bookings
    where payment_status = 'pending'
      and created_at < now() - interval '2 hours';
  $$
);