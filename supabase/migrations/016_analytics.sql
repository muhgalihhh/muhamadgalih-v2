create table analytics_pageviews (
  id bigint generated always as identity primary key,
  path text not null,
  referrer_source text not null default 'direct',
  session_id text not null,
  created_at timestamptz not null default now()
);

create index analytics_pageviews_created_at_idx on analytics_pageviews (created_at);
create index analytics_pageviews_session_id_idx on analytics_pageviews (session_id);

alter table analytics_pageviews enable row level security;

create policy "anyone can insert a pageview"
  on analytics_pageviews for insert
  to anon, authenticated
  with check (true);

create policy "authenticated can read pageviews"
  on analytics_pageviews for select
  to authenticated
  using (true);
