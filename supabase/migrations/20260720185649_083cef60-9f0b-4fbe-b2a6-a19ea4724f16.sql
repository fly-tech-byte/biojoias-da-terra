
DROP INDEX IF EXISTS public.products_name_trgm_idx;
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION pg_trgm SET SCHEMA extensions;
CREATE INDEX products_name_trgm_idx ON public.products USING gin (name extensions.gin_trgm_ops);
