-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create categories table
create table if not exists categories (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create exercises table
create table if not exists exercises (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    category_id uuid references categories(id) on delete cascade,
    difficulty_level integer check (difficulty_level between 1 and 5),
    equipment_needed text[],
    video_url text,
    instructions text[],
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create blocks table
create table if not exists blocks (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    exercises jsonb not null default '[]'::jsonb,
    total_duration integer,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create templates table
create table if not exists templates (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    blocks jsonb not null default '[]'::jsonb,
    estimated_duration integer,
    difficulty_level integer check (difficulty_level between 1 and 5),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Add some initial categories
insert into categories (name, description) values
    ('Mat Work', 'Classical Pilates exercises performed on the mat'),
    ('Reformer', 'Exercises utilizing the Pilates reformer machine'),
    ('Tower', 'Exercises performed on the Pilates tower/wall unit');

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Add updated_at triggers to all tables
create trigger update_categories_updated_at
    before update on categories
    for each row
    execute function update_updated_at_column();

create trigger update_exercises_updated_at
    before update on exercises
    for each row
    execute function update_updated_at_column();

create trigger update_blocks_updated_at
    before update on blocks
    for each row
    execute function update_updated_at_column();

create trigger update_templates_updated_at
    before update on templates
    for each row
    execute function update_updated_at_column();
