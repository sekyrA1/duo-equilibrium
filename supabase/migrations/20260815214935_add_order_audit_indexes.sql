create index customers_created_by_idx on public.customers (created_by);
create index orders_created_by_idx on public.orders (created_by);
create index orders_updated_by_idx on public.orders (updated_by);
create index order_status_history_changed_by_idx on public.order_status_history (changed_by);
