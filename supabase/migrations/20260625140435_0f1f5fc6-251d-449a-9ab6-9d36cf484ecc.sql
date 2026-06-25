CREATE TABLE public.suscriptores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.suscriptores TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.suscriptores TO authenticated;
GRANT ALL ON public.suscriptores TO service_role;

ALTER TABLE public.suscriptores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede suscribirse"
  ON public.suscriptores FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Solo admin puede ver suscriptores"
  ON public.suscriptores FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Solo admin puede borrar suscriptores"
  ON public.suscriptores FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));