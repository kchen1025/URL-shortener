export const createUrlMapping: string = `
  drop table if exists url_mapping;
  create table if not exists url_mapping (
    id serial primary key,
    long_url text not null,
    short_code text not null,
    visited int4 not null default 0,
    added timestamptz not null default now(),
    updated timestamptz not null default now()
  );
  -- we don't want multiple short codes to be the same
  create unique index short_code_unique on url_mapping (short_code);
  comment on column url_mapping.long_url is 'original valid url passed in to be shortened';
  comment on column url_mapping.short_code is 'generated short hash for long_url to be mapped to';
  comment on column url_mapping.visited is 'number of times specific short code has been visited';

  create or replace function trigger_last_updated() returns trigger as $$
  begin
    new.updated := now();
    return new;
  end;
  $$ language plpgsql;

  create trigger
    trigger_last_updated
  before update on
    url_mapping
  for each row execute procedure
    trigger_last_updated();
`;

export const seedUrlMapping: string = `
  insert into url_mapping(long_url, short_code) values ('https://www.amazon.com', '123456');
  insert into url_mapping(long_url, short_code) values ('https://www.google.com', 'abcdef');
`;
