create table
profile (
  id uuid primary key references auth.users not null,
  username text unique not null,
  texture text not null default 'default',
  is_in_game boolean not null default false,
  high_score integer not null default 0,
  pos_x float not null default 0,
  pos_y float not null default 0,
  pos_z float not null default 0,
  rotation_x integer not null default 0,
  rotation_y integer not null default 0,
  rotation_z integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter publication supabase_realtime add table profile;
create function public.create_row_profile()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.raw_user_meta_data is not null then
    insert into "public"."profile" (id, username)
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
