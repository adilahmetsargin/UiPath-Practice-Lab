create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Practice Analyst',
  current_level integer not null default 1,
  xp integer not null default 0,
  progress_percentage numeric(5,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id text primary key,
  level_number integer not null unique,
  title text not null,
  summary text not null,
  focus text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id text primary key,
  lesson_id text not null references public.lessons(id) on delete cascade,
  title text not null,
  difficulty text not null,
  xp integer not null default 0,
  practical_task text not null,
  expected_result text not null,
  hint text not null,
  practice_url text,
  sort_order integer not null default 1
);

create table if not exists public.submissions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id text not null references public.tasks(id) on delete cascade,
  note text not null,
  ai_feedback jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id text not null references public.tasks(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique(user_id, task_id)
);

create table if not exists public.badges (
  id text primary key,
  name text not null,
  description text not null,
  xp_required integer not null default 0
);

create table if not exists public.user_badges (
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id text not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

alter table public.profiles enable row level security;
alter table public.submissions enable row level security;
alter table public.progress enable row level security;
alter table public.user_badges enable row level security;
alter table public.lessons enable row level security;
alter table public.tasks enable row level security;
alter table public.badges enable row level security;

create policy "Profiles are readable by owner" on public.profiles for select using (auth.uid() = id);
create policy "Profiles are editable by owner" on public.profiles for update using (auth.uid() = id);
create policy "Lessons are readable by everyone" on public.lessons for select using (true);
create policy "Tasks are readable by everyone" on public.tasks for select using (true);
create policy "Badges are readable by everyone" on public.badges for select using (true);
create policy "Submissions are owned by user" on public.submissions for all using (auth.uid() = user_id);
create policy "Progress is owned by user" on public.progress for all using (auth.uid() = user_id);
create policy "User badges are owned by user" on public.user_badges for all using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Practice Analyst'));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
