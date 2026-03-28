create table if not exists agent_actions (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  agent_id text not null,
  tool text not null,
  action text not null,
  params jsonb not null default '{}'::jsonb,
  user_role text,
  status text not null default 'evaluated',
  risk_score int not null default 0,
  decision text not null,
  reasons jsonb not null default '[]'::jsonb,
  evaluation jsonb not null default '{}'::jsonb,
  trust_score int not null default 0
);

create table if not exists audit_logs (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  action_id bigint references agent_actions(id) on delete cascade,
  tool text not null,
  decision text not null,
  risk_score int not null default 0,
  reasons jsonb not null default '[]'::jsonb,
  approved boolean not null default false,
  evaluation jsonb not null default '{}'::jsonb,
  trust_score int not null default 0
);

create table if not exists policies (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text not null,
  enabled boolean not null default true,
  config jsonb not null default '{}'::jsonb
);
