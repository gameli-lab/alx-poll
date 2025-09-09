-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create polls table
CREATE TABLE polls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    allow_multiple BOOLEAN NOT NULL DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    total_votes INTEGER NOT NULL DEFAULT 0
);

-- Create poll_options table
CREATE TABLE poll_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    text VARCHAR(500) NOT NULL,
    votes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Ensure a user can only vote once per poll (unless allow_multiple is true)
    UNIQUE(poll_id, user_id, option_id)
);

-- Create indexes for better performance
CREATE INDEX idx_polls_author_id ON polls(author_id);
CREATE INDEX idx_polls_created_at ON polls(created_at DESC);
CREATE INDEX idx_polls_is_active ON polls(is_active);
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_option_id ON votes(option_id);

-- Create function to update total_votes in polls table
CREATE OR REPLACE FUNCTION update_poll_total_votes()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total votes count for the poll
    UPDATE polls 
    SET total_votes = (
        SELECT COUNT(*) 
        FROM votes 
        WHERE poll_id = COALESCE(NEW.poll_id, OLD.poll_id)
    )
    WHERE id = COALESCE(NEW.poll_id, OLD.poll_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create function to update option votes count
CREATE OR REPLACE FUNCTION update_option_votes()
RETURNS TRIGGER AS $$
BEGIN
    -- Update votes count for the specific option
    UPDATE poll_options 
    SET votes = (
        SELECT COUNT(*) 
        FROM votes 
        WHERE option_id = COALESCE(NEW.option_id, OLD.option_id)
    )
    WHERE id = COALESCE(NEW.option_id, OLD.option_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update total votes when votes are inserted/updated/deleted
CREATE TRIGGER trigger_update_poll_total_votes
    AFTER INSERT OR UPDATE OR DELETE ON votes
    FOR EACH ROW
    EXECUTE FUNCTION update_poll_total_votes();

-- Create trigger to update option votes when votes are inserted/updated/deleted
CREATE TRIGGER trigger_update_option_votes
    AFTER INSERT OR UPDATE OR DELETE ON votes
    FOR EACH ROW
    EXECUTE FUNCTION update_option_votes();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at on polls and poll_options
CREATE TRIGGER trigger_update_polls_updated_at
    BEFORE UPDATE ON polls
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_poll_options_updated_at
    BEFORE UPDATE ON poll_options
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to check if user can vote (respects allow_multiple setting)
CREATE OR REPLACE FUNCTION can_user_vote(
    p_poll_id UUID,
    p_user_id UUID,
    p_option_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    poll_allow_multiple BOOLEAN;
    existing_vote_count INTEGER;
BEGIN
    -- Get poll's allow_multiple setting
    SELECT allow_multiple INTO poll_allow_multiple
    FROM polls
    WHERE id = p_poll_id;
    
    -- If allow_multiple is false, check if user already voted on this poll
    IF NOT poll_allow_multiple THEN
        SELECT COUNT(*) INTO existing_vote_count
        FROM votes
        WHERE poll_id = p_poll_id AND user_id = p_user_id;
        
        IF existing_vote_count > 0 THEN
            RETURN FALSE;
        END IF;
    END IF;
    
    -- Check if user already voted for this specific option
    SELECT COUNT(*) INTO existing_vote_count
    FROM votes
    WHERE poll_id = p_poll_id AND user_id = p_user_id AND option_id = p_option_id;
    
    RETURN existing_vote_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Create function to check if poll is active and not expired
CREATE OR REPLACE FUNCTION is_poll_active(p_poll_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    poll_is_active BOOLEAN;
    poll_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT is_active, expires_at INTO poll_is_active, poll_expires_at
    FROM polls
    WHERE id = p_poll_id;
    
    -- Poll must be active
    IF NOT poll_is_active THEN
        RETURN FALSE;
    END IF;
    
    -- If poll has expiration, check if it's not expired
    IF poll_expires_at IS NOT NULL AND poll_expires_at < NOW() THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create RLS (Row Level Security) policies
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policy for polls: users can read all active polls, but only modify their own
CREATE POLICY "Users can view all polls" ON polls
    FOR SELECT USING (true);

CREATE POLICY "Users can create polls" ON polls
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own polls" ON polls
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own polls" ON polls
    FOR DELETE USING (auth.uid() = author_id);

-- Policy for poll_options: users can read all options, but only modify options for their own polls
CREATE POLICY "Users can view all poll options" ON poll_options
    FOR SELECT USING (true);

CREATE POLICY "Users can create poll options for their polls" ON poll_options
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE id = poll_id AND author_id = auth.uid()
        )
    );

CREATE POLICY "Users can update poll options for their polls" ON poll_options
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE id = poll_id AND author_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete poll options for their polls" ON poll_options
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE id = poll_id AND author_id = auth.uid()
        )
    );

-- Policy for votes: users can read all votes, but only create/delete their own votes
CREATE POLICY "Users can view all votes" ON votes
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own votes" ON votes
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        is_poll_active(poll_id) AND
        can_user_vote(poll_id, user_id, option_id)
    );

CREATE POLICY "Users can delete their own votes" ON votes
    FOR DELETE USING (auth.uid() = user_id);

-- Create view for polls with author information
CREATE VIEW polls_with_author AS
SELECT 
    p.*,
    au.email as author_email,
    au.raw_user_meta_data->>'name' as author_name,
    au.raw_user_meta_data->>'avatar_url' as author_avatar
FROM polls p
JOIN auth.users au ON p.author_id = au.id;

-- Grant necessary permissions
GRANT SELECT ON polls_with_author TO authenticated;
GRANT ALL ON polls TO authenticated;
GRANT ALL ON poll_options TO authenticated;
GRANT ALL ON votes TO authenticated;
