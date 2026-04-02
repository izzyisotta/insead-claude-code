-- Profiles (auto-created on signup)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;
create policy "Public profiles" on profiles for select using (true);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Anonymous'),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Documents
create table documents (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  type text not null check (type in ('workflow', 'tool', 'skill', 'resource')),
  categories text[] not null default '{}',
  content text not null default '',
  link text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table documents enable row level security;
create policy "Public documents" on documents for select using (true);
create policy "Users insert own docs" on documents for insert with check (auth.uid() = author_id);
create policy "Users update own docs" on documents for update using (auth.uid() = author_id);
create policy "Users delete own docs" on documents for delete using (auth.uid() = author_id);

-- Index for category queries
create index idx_documents_categories on documents using gin(categories);
create index idx_documents_author on documents(author_id);
create index idx_documents_type on documents(type);
