create table
profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  username text unique not null,
  pos_x integer not null default 0,
  pos_y integer not null default 0,
  pos_z integer not null default 0,
  texture text not null default 'default',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create function public.create_row_profile()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.raw_user_meta_data is not null then
    insert into "public"."profile" (user_id, username)
    values (new.id, new.raw_user_meta_data ->> 'username');
  else
    raise notice 'No user metadata provided for user %', new.id;
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_row_profile();
