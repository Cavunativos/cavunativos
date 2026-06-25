
-- Reemplazar políticas de mensajes que usan has_role por chequeo inline
DROP POLICY IF EXISTS "Autenticados ven publicados o todos si admin" ON public.mensajes;
DROP POLICY IF EXISTS "Solo admin puede insertar" ON public.mensajes;
DROP POLICY IF EXISTS "Solo admin puede actualizar" ON public.mensajes;
DROP POLICY IF EXISTS "Solo admin puede borrar" ON public.mensajes;

CREATE POLICY "Autenticados ven publicados o admin ve todo"
  ON public.mensajes FOR SELECT
  TO authenticated
  USING (
    publicado = true
    OR EXISTS (SELECT 1 FROM public.user_roles ur
               WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
  );

CREATE POLICY "Solo admin puede insertar"
  ON public.mensajes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
  );

CREATE POLICY "Solo admin puede actualizar"
  ON public.mensajes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
  );

CREATE POLICY "Solo admin puede borrar"
  ON public.mensajes FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
  );

-- Suscriptores: reemplazar políticas que usan has_role
DROP POLICY IF EXISTS "Solo admin puede ver suscriptores" ON public.suscriptores;
DROP POLICY IF EXISTS "Solo admin puede borrar suscriptores" ON public.suscriptores;

CREATE POLICY "Solo admin puede ver suscriptores"
  ON public.suscriptores FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
  );

CREATE POLICY "Solo admin puede borrar suscriptores"
  ON public.suscriptores FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
  );
