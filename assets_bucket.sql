-- Create a public bucket named "assets" for storing QR Codes and other public images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assets', 'assets', true) 
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all files in the assets bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'assets');

-- Allow authenticated users (like admin) to upload files to the assets bucket
CREATE POLICY "Admin Upload Access" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'assets');

-- Allow authenticated users to update files
CREATE POLICY "Admin Update Access" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'assets');
