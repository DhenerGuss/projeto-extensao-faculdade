-- 1. Crie seu usuario admin em Authentication > Users no Supabase.
-- 2. Copie o UUID desse usuario e substitua COLE_O_USER_ID_DO_ADMIN_AQUI.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Depois de criar o usuario admin, rode esta linha trocando pelo UUID real:
-- insert into public.admin_users (user_id)
-- values ('COLE_O_USER_ID_DO_ADMIN_AQUI')
-- on conflict (user_id) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.products
  add column if not exists display_order integer;

create index if not exists products_display_order_idx
  on public.products (display_order);

alter table public.products enable row level security;

drop policy if exists "products_select_public" on public.products;
drop policy if exists "products_insert_admin" on public.products;
drop policy if exists "products_update_admin" on public.products;
drop policy if exists "products_delete_admin" on public.products;

create policy "products_select_public"
on public.products
for select
to anon, authenticated
using (true);

create policy "products_insert_admin"
on public.products
for insert
to authenticated
with check (public.is_admin());

create policy "products_update_admin"
on public.products
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "products_delete_admin"
on public.products
for delete
to authenticated
using (public.is_admin());

create or replace function public.reorder_products(product_ids text[])
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  update public.products
  set display_order = ordered_products.product_position
  from unnest(product_ids) with ordinality as ordered_products(product_id, product_position)
  where public.products.id::text = ordered_products.product_id;
end;
$$;

revoke execute on function public.reorder_products(text[]) from public;
grant execute on function public.reorder_products(text[]) to authenticated;

drop policy if exists "product_images_select_public" on storage.objects;
drop policy if exists "product_images_insert_admin" on storage.objects;
drop policy if exists "product_images_update_admin" on storage.objects;
drop policy if exists "product_images_delete_admin" on storage.objects;

create policy "product_images_select_public"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'produtos');

create policy "product_images_insert_admin"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'produtos' and public.is_admin());

create policy "product_images_update_admin"
on storage.objects
for update
to authenticated
using (bucket_id = 'produtos' and public.is_admin())
with check (bucket_id = 'produtos' and public.is_admin());

create policy "product_images_delete_admin"
on storage.objects
for delete
to authenticated
using (bucket_id = 'produtos' and public.is_admin());
