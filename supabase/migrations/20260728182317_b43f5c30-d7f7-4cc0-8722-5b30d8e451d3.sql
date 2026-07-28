
-- Convert has_role to SECURITY INVOKER (users can read their own roles via RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- Convert set_updated_at to SECURITY INVOKER (trivial trigger)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- log_product_change: trigger only — revoke direct execute privileges
REVOKE ALL ON FUNCTION public.log_product_change() FROM PUBLIC, anon, authenticated;

-- claim_first_admin: must remain SECURITY DEFINER (writes to user_roles),
-- but restrict execution to signed-in users only
REVOKE ALL ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

-- has_role no longer needs elevated grants; ensure authenticated can call it in policies
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
