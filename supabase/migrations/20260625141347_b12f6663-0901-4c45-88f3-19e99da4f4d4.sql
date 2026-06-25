
-- 1) Restringir EXECUTE en has_role (SECURITY DEFINER)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

-- 2) Reescribir políticas de mensajes para no requerir has_role en el path anónimo
DROP POLICY IF EXISTS "Cualquiera puede leer mensajes publicados" ON public.mensajes;

CREATE POLICY "Anon ve mensajes publicados"
  ON public.mensajes FOR SELECT
  TO anon
  USING (publicado = true);

CREATE POLICY "Autenticados ven publicados o todos si admin"
  ON public.mensajes FOR SELECT
  TO authenticated
  USING (publicado = true OR public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3) Endurecer INSERT en suscriptores (quitar WITH CHECK true)
DROP POLICY IF EXISTS "Cualquiera puede suscribirse" ON public.suscriptores;

CREATE POLICY "Suscripcion con email valido"
  ON public.suscriptores FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND char_length(email) BETWEEN 5 AND 254
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );
