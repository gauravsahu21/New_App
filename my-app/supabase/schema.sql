create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  phone_number text,
  village text,
  points integer not null default 0 check (points >= 0),
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'user_id'
  ) then
    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'profiles'
        and column_name = 'id'
        and data_type = 'uuid'
    ) then
      if exists (
        select 1
        from public.profiles as profile
        left join auth.users as auth_user on auth_user.id = profile.id
        where auth_user.id is null
      ) then
        raise exception 'Cannot rename profiles.id: some values do not match auth.users.id';
      end if;

      alter table public.profiles rename column id to user_id;
    else
      raise exception 'profiles has no user_id column or UUID id column linked to auth.users';
    end if;
  end if;
end;
$$;

alter table public.profiles
  add column if not exists email text,
  add column if not exists display_name text,
  add column if not exists phone_number text,
  add column if not exists village text,
  add column if not exists points integer not null default 0 check (points >= 0);

alter table public.profiles enable row level security;

revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (display_name) on table public.profiles to authenticated;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, email, display_name, phone_number, village)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'phone_number',
    new.raw_user_meta_data ->> 'village'
  )
  on conflict (user_id) do update set
    email = excluded.email,
    display_name = coalesce(excluded.display_name, profiles.display_name),
    phone_number = coalesce(excluded.phone_number, profiles.phone_number),
    village = coalesce(excluded.village, profiles.village);

  return new;
end;
$$;

drop trigger if exists create_profile_after_signup on auth.users;
create trigger create_profile_after_signup
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();

insert into public.profiles (user_id, email, display_name, phone_number, village)
select
  id,
  lower(email),
  coalesce(raw_user_meta_data ->> 'display_name', raw_user_meta_data ->> 'name'),
  raw_user_meta_data ->> 'phone_number',
  raw_user_meta_data ->> 'village'
from auth.users
on conflict (user_id) do update set
  email = excluded.email,
  display_name = coalesce(profiles.display_name, excluded.display_name),
  phone_number = coalesce(profiles.phone_number, excluded.phone_number),
  village = coalesce(profiles.village, excluded.village);

create or replace function public.add_user_points(p_user_id uuid, p_points integer)
returns integer
language sql
security invoker
set search_path = ''
as $$
  insert into public.profiles as existing_profile (user_id, points)
  select p_user_id, p_points
  where p_points > 0
  on conflict (user_id) do update
  set points = existing_profile.points + excluded.points
  returning points;
$$;

revoke all on function public.add_user_points(uuid, integer) from public, anon, authenticated;
grant execute on function public.add_user_points(uuid, integer) to service_role;