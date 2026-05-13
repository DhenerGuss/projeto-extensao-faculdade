alter table public.products
  add column if not exists display_order integer;

create index if not exists products_display_order_idx
  on public.products (display_order);

with ordered_products as (
  select
    id,
    row_number() over (order by created_at desc) as new_display_order
  from public.products
  where display_order is null
)
update public.products
set display_order = ordered_products.new_display_order
from ordered_products
where public.products.id = ordered_products.id;
