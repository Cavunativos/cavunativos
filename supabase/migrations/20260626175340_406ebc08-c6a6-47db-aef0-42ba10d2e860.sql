
CREATE POLICY "Mensajes públicos - lectura" ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'mensajes');

CREATE POLICY "Mensajes - admin sube" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'mensajes' AND EXISTS (
  SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
));

CREATE POLICY "Mensajes - admin actualiza" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'mensajes' AND EXISTS (
  SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
));

CREATE POLICY "Mensajes - admin borra" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'mensajes' AND EXISTS (
  SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
));
