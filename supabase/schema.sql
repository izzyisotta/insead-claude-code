-- Documents (simple: no auth, just a name)
create table if not exists documents (
  id uuid default gen_random_uuid() primary key,
  author_name text not null,
  title text not null,
  description text not null,
  type text not null check (type in ('workflow', 'tool', 'skill', 'resource')),
  categories text[] not null default '{}',
  content text not null default '',
  link text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Allow public read/write (simple first draft, no auth)
alter table documents enable row level security;
create policy "Public read" on documents for select using (true);
create policy "Public insert" on documents for insert with check (true);
create policy "Public update" on documents for update using (true);
create policy "Public delete" on documents for delete using (true);

-- Indexes
create index if not exists idx_documents_categories on documents using gin(categories);
create index if not exists idx_documents_author on documents(author_name);
create index if not exists idx_documents_type on documents(type);
