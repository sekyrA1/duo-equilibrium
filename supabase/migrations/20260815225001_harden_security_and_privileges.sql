-- Restrict the Data API roles to the operations used by the application.
revoke all privileges on table
  public.profiles,
  public.customers,
  public.orders,
  public.order_items,
  public.order_status_history
from anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (display_name, role, active) on table public.profiles to authenticated;

grant select on table public.customers to authenticated;
grant insert (
  name, contact_name, email, phone, cpf, cnpj, birth_date, profession,
  address_line, address_number, address_complement, neighborhood, city,
  state, postal_code, height, weight, event_code, created_by
) on table public.customers to authenticated;
grant update (
  name, contact_name, email, phone, cpf, cnpj, birth_date, profession,
  address_line, address_number, address_complement, neighborhood, city,
  state, postal_code, height, weight, event_code
) on table public.customers to authenticated;
grant delete on table public.customers to authenticated;

grant select on table public.orders to authenticated;
grant insert (
  order_number, customer_id, status, issue_date, subtotal, discount_pct,
  discount_amount, freight, total, amount_received, installments,
  installment_amount, representative, signature_city, notes,
  customer_snapshot, order_snapshot, created_by, updated_by
) on table public.orders to authenticated;
grant update (
  order_number, customer_id, status, issue_date, subtotal, discount_pct,
  discount_amount, freight, total, amount_received, installments,
  installment_amount, representative, signature_city, notes,
  customer_snapshot, order_snapshot, updated_by
) on table public.orders to authenticated;
grant delete on table public.orders to authenticated;

grant select on table public.order_items to authenticated;
grant insert (
  order_id, product_name, quantity, foam_line, piston, saddle_model,
  saddle_size, seat_color, frame_finish, unit_price, manufacturing_notes
) on table public.order_items to authenticated;
grant update (
  product_name, quantity, foam_line, piston, saddle_model, saddle_size,
  seat_color, frame_finish, unit_price, manufacturing_notes
) on table public.order_items to authenticated;

grant select on table public.order_status_history to authenticated;

-- New objects created by the application owner are private until explicitly exposed.
alter default privileges for role postgres in schema public
  revoke all privileges on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all privileges on sequences from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;

-- Creation must always carry the authenticated user's identifier.
drop policy if exists customers_insert_sales on public.customers;
create policy customers_insert_sales on public.customers for insert to authenticated
  with check (
    private.current_user_has_role(array['admin', 'sales'])
    and created_by = (select auth.uid())
  );

drop policy if exists orders_insert_sales on public.orders;
create policy orders_insert_sales on public.orders for insert to authenticated
  with check (
    private.current_user_has_role(array['admin', 'sales'])
    and created_by = (select auth.uid())
    and updated_by = (select auth.uid())
  );

-- Permanent deletion is an administrative action. Sales can cancel an order instead.
drop policy if exists orders_delete_sales on public.orders;
drop policy if exists orders_delete_admin on public.orders;
create policy orders_delete_admin on public.orders for delete to authenticated
  using (private.current_user_has_role(array['admin']));
