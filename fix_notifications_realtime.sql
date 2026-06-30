-- Enable replication for notifications table so that the client gets realtime updates
alter publication supabase_realtime add table notifications;
