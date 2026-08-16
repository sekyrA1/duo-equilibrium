create policy orders_delete_sales on public.orders for delete to authenticated
  using (private.current_user_has_role(array['admin', 'sales']));

grant delete on public.orders to authenticated;
