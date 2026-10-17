-- Dalab Fresh schema. Applied by `npm run db:setup`; safe to run more than once.

create table if not exists categories (
  id    text primary key,
  name  jsonb not null,           -- { "de": "...", "en": "...", "so": "..." }
  icon  text  not null,
  sort  int   not null default 0
);

create table if not exists products (
  id              int primary key,
  name            jsonb   not null,
  size            jsonb   not null,
  price           int     not null check (price > 0),   -- cents
  was             int     check (was is null or was > price),
  category        text    not null references categories(id),
  icon            text    not null,
  hue             int     not null default 30,
  keywords        text[]  not null default '{}',
  home_favourite  boolean not null default false,
  image           text,                                 -- Cloudinary public id
  active          boolean not null default true,
  sort            int     not null default 0
);

create table if not exists stores (
  id     text primary key,
  name   text  not null,
  city   text  not null,
  area   text  not null,
  hours  jsonb not null,
  sort   int   not null default 0
);

create table if not exists orders (
  id             text primary key,
  placed_at      timestamptz not null default now(),
  mode           text  not null check (mode in ('delivery', 'collect')),
  slot_id        text  not null,
  store_id       text  not null references stores(id),
  customer_name  text  not null,
  email          text  not null,
  phone          text,
  address        text,
  payment        text  not null check (payment in ('card', 'cash')),
  lang           text  not null default 'de',
  items          jsonb not null,
  quote          jsonb not null
);

create index if not exists orders_placed_at_idx on orders (placed_at desc);
create index if not exists orders_email_idx on orders (lower(email));

-- Bundled photos (paths under /public), used until a Cloudinary image is uploaded.
alter table products add column if not exists photo text;
alter table categories add column if not exists photo text;
