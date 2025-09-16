-- Create assets storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assets',
  'assets',
  true,
  52428800, -- 50MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'video/mp4', 'video/webm', 'video/quicktime']
);

-- Note: RLS is already enabled on storage.objects by default in Supabase
-- The following policies will be created to control access to the assets bucket

-- Policy: Allow public access to view files in assets bucket
CREATE POLICY "Allow public access to view files" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'assets');

-- Policy: Allow service role to manage files in assets bucket
CREATE POLICY "Allow service role to manage files" ON storage.objects
FOR ALL TO service_role
USING (bucket_id = 'assets');

-- Policy: Allow authenticated users to upload files to assets bucket
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'assets');

-- Policy: Allow authenticated users to delete files from assets bucket
CREATE POLICY "Allow authenticated users to delete files" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'assets');

-- Policy: Allow authenticated users to update files in assets bucket
CREATE POLICY "Allow authenticated users to update files" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'assets');
