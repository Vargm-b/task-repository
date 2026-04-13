ALTER TABLE assignments DROP COLUMN IF EXISTS attachment_url;

-- para almacenar el archivo binario
ALTER TABLE assignments 
ADD COLUMN attachment_data BYTEA,
ADD COLUMN attachment_name TEXT,
ADD COLUMN attachment_mime TEXT;