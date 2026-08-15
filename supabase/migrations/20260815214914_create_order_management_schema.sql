create schema if not exists private;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'viewer' check (role in ('admin', 'sales', 'factory', 'viewer')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text,
  email text,
  phone text,
  cpf text,
  cnpj text,
  birth_date date,
  profession text,
  address_line text,
  address_number text,
  address_complement text,
  neighborhood text,
  city text,
  state text check (state is null or char_length(state) = 2),
  postal_code text,
  height text,
  weight text,
  event_code text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique check (order_number is null or order_number ~ '^PED-[0-9]{4}-[0-9]{3,}$'),
  customer_id uuid references public.customers(id) on delete restrict,
  status text not null default 'draft' check (status in ('draft', 'confirmed', 'in_production', 'quality_check', 'ready', 'delivered', 'canceled')),
  issue_date date not null default current_date,
  subtotal numeric(12,2) not null default 0 check (subtotal >= 0),
  discount_pct numeric(5,2) not null default 0 check (discount_pct >= 0 and discount_pct <= 100),
  discount_amount numeric(12,2) not null default 0 check (discount_amount >= 0),
  freight numeric(12,2) not null default 0 check (freight >= 0),
  total numeric(12,2) not null default 0 check (total >= 0),
  amount_received numeric(12,2) not null default 0 check (amount_received >= 0),
  installments integer not null default 1 check (installments >= 1),
  installment_amount numeric(12,2) not null default 0 check (installment_amount >= 0),
  representative text,
  signature_city text,
  notes text,
  customer_snapshot jsonb not null default '{}'::jsonb,
  order_snapshot jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_name text not null default 'Mocho Sela',
  quantity integer not null default 1 check (quantity > 0),
  foam_line text not null check (foam_line in ('3 cm', '5 cm')),
  piston text check (piston is null or piston in ('P', 'M')),
  saddle_model text not null default 'Mocho sela',
  saddle_size text not null default 'Padrão' check (saddle_size in ('Padrão', 'Soft', 'Soft Plus')),
  seat_color text not null default 'Preto' check (seat_color in ('Preto', 'Azul Marinho', 'Caramelo', 'Marrom', 'Creme', 'Vermelho', 'Verde Musgo')),
  frame_finish text not null default 'Metal cromado prata' check (frame_finish = 'Metal cromado prata'),
  unit_price numeric(12,2) not null default 0 check (unit_price >= 0),
  manufacturing_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  previous_status text,
  new_status text not null check (new_status in ('draft', 'confirmed', 'in_production', 'quality_check', 'ready', 'delivered', 'canceled')),
  note text,
  changed_by uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now()
);

create index customers_email_idx on public.customers (lower(email)) where email is not null;
create index customers_phone_idx on public.customers (phone) where phone is not null;
create index orders_status_idx on public.orders (status);
create index orders_issue_date_idx on public.orders (issue_date desc);
create index orders_customer_idx on public.orders (customer_id);
create index order_items_order_idx on public.order_items (order_id);
create index order_status_history_order_idx on public.order_status_history (order_id, changed_at desc);

create or replace function private.current_user_has_role(required_roles text[])
returns boolean language sql stable security definer set search_path = public, pg_temp
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and active and role = any(required_roles));
$$;

create or replace function private.touch_updated_at()
returns trigger language plpgsql set search_path = public, pg_temp
as $$ begin new.updated_at = now(); return new; end; $$;

create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(coalesce(new.email, 'usuario'), '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function private.record_order_status_change()
returns trigger language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.order_status_history (order_id, previous_status, new_status, changed_by)
    values (new.id, null, new.status, auth.uid());
  elsif old.status is distinct from new.status then
    insert into public.order_status_history (order_id, previous_status, new_status, changed_by)
    values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function private.touch_updated_at();
create trigger customers_updated_at before update on public.customers for each row execute function private.touch_updated_at();
create trigger orders_updated_at before update on public.orders for each row execute function private.touch_updated_at();
create trigger order_items_updated_at before update on public.order_items for each row execute function private.touch_updated_at();
create trigger auth_user_profile after insert on auth.users for each row execute function private.handle_new_user();
create trigger order_status_audit after insert or update of status on public.orders for each row execute function private.record_order_status_change();

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;

create policy profiles_select_self_or_admin on public.profiles for select to authenticated
  using ((select auth.uid()) = id or private.current_user_has_role(array['admin']));
create policy profiles_update_admin on public.profiles for update to authenticated
  using (private.current_user_has_role(array['admin']))
  with check (private.current_user_has_role(array['admin']));

create policy customers_select_active_staff on public.customers for select to authenticated
  using (private.current_user_has_role(array['admin', 'sales', 'factory', 'viewer']));
create policy customers_insert_sales on public.customers for insert to authenticated
  with check (private.current_user_has_role(array['admin', 'sales']) and (created_by is null or created_by = (select auth.uid())));
create policy customers_update_sales on public.customers for update to authenticated
  using (private.current_user_has_role(array['admin', 'sales']))
  with check (private.current_user_has_role(array['admin', 'sales']));
create policy customers_delete_admin on public.customers for delete to authenticated
  using (private.current_user_has_role(array['admin']));

create policy orders_select_active_staff on public.orders for select to authenticated
  using (private.current_user_has_role(array['admin', 'sales', 'factory', 'viewer']));
create policy orders_insert_sales on public.orders for insert to authenticated
  with check (private.current_user_has_role(array['admin', 'sales']) and (created_by is null or created_by = (select auth.uid())));
create policy orders_update_sales on public.orders for update to authenticated
  using (private.current_user_has_role(array['admin', 'sales']))
  with check (private.current_user_has_role(array['admin', 'sales']));

create policy order_items_select_active_staff on public.order_items for select to authenticated
  using (private.current_user_has_role(array['admin', 'sales', 'factory', 'viewer']));
create policy order_items_insert_sales on public.order_items for insert to authenticated
  with check (private.current_user_has_role(array['admin', 'sales']));
create policy order_items_update_sales on public.order_items for update to authenticated
  using (private.current_user_has_role(array['admin', 'sales']))
  with check (private.current_user_has_role(array['admin', 'sales']));

create policy order_status_history_select_active_staff on public.order_status_history for select to authenticated
  using (private.current_user_has_role(array['admin', 'sales', 'factory', 'viewer']));

revoke all on schema private from public;
grant usage on schema private to authenticated;
revoke execute on function private.current_user_has_role(text[]) from public, anon;
grant execute on function private.current_user_has_role(text[]) to authenticated;
revoke execute on function private.touch_updated_at() from public, anon, authenticated;
revoke execute on function private.handle_new_user() from public, anon, authenticated;
revoke execute on function private.record_order_status_change() from public, anon, authenticated;

revoke all on all tables in schema public from anon;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.customers to authenticated;
grant select, insert, update on public.orders to authenticated;
grant select, insert, update on public.order_items to authenticated;
grant select on public.order_status_history to authenticated;
