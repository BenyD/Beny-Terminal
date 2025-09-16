-- Create file metadata table for enhanced file management
CREATE TABLE IF NOT EXISTS file_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL, -- Original filename in storage
  display_name TEXT NOT NULL, -- User-friendly display name
  description TEXT, -- File description
  tags TEXT[], -- Array of tags
  category TEXT DEFAULT 'uncategorized', -- File category
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT DEFAULT 'admin' -- Since we only have one user
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_file_metadata_category ON file_metadata(category);
CREATE INDEX IF NOT EXISTS idx_file_metadata_tags ON file_metadata USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_file_metadata_created_at ON file_metadata(created_at);

-- Enable RLS on file_metadata table
ALTER TABLE file_metadata ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role to manage file metadata
CREATE POLICY "Allow service role to manage file metadata" ON file_metadata
FOR ALL TO service_role
USING (true);

-- Policy: Allow public read access to file metadata (for public files)
CREATE POLICY "Allow public read access to file metadata" ON file_metadata
FOR SELECT TO public
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_file_metadata_updated_at 
    BEFORE UPDATE ON file_metadata 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
