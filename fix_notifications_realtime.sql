-- Enable RLS on notifications (just to be sure)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users so realtime subscriptions work
CREATE POLICY "Allow public read access on notifications"
    ON public.notifications
    FOR SELECT
    USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access on notifications"
    ON public.notifications
    FOR ALL
    USING (true)
    WITH CHECK (true);
