-- Enable realtime for diagrams table
ALTER TABLE diagrams REPLICA IDENTITY FULL;

-- Add the table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE diagrams;