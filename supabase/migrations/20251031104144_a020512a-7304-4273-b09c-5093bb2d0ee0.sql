-- Create storage bucket for license documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('license-documents', 'license-documents', false);

-- Create policies for license documents
CREATE POLICY "Users can upload their own documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'license-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'license-documents' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Admins can view all license documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'license-documents' 
  AND has_role(auth.uid(), 'admin')
);