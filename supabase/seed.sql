-- Sample data for testing the polls schema
-- Note: This assumes you have users in your auth.users table
-- You may need to adjust the user IDs based on your actual users

-- Insert sample polls (replace 'your-user-id-here' with actual user IDs from auth.users)
INSERT INTO polls (id, title, description, author_id, is_active, allow_multiple, expires_at) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'What is your favorite programming language?',
  'Help us understand the community preferences for our next project',
  (SELECT id FROM auth.users LIMIT 1),
  true,
  false,
  NOW() + INTERVAL '7 days'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Which features should we prioritize?',
  'Multiple selections allowed - choose all that apply',
  (SELECT id FROM auth.users LIMIT 1),
  true,
  true,
  NOW() + INTERVAL '14 days'
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'How satisfied are you with our service?',
  'This poll has already expired',
  (SELECT id FROM auth.users LIMIT 1),
  true,
  false,
  NOW() - INTERVAL '1 day'
);

-- Insert poll options for the first poll
INSERT INTO poll_options (poll_id, text) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'JavaScript/TypeScript'),
('550e8400-e29b-41d4-a716-446655440001', 'Python'),
('550e8400-e29b-41d4-a716-446655440001', 'Rust'),
('550e8400-e29b-41d4-a716-446655440001', 'Go'),
('550e8400-e29b-41d4-a716-446655440001', 'Other');

-- Insert poll options for the second poll
INSERT INTO poll_options (poll_id, text) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Dark mode'),
('550e8400-e29b-41d4-a716-446655440002', 'Mobile app'),
('550e8400-e29b-41d4-a716-446655440002', 'API improvements'),
('550e8400-e29b-41d4-a716-446655440002', 'Better documentation'),
('550e8400-e29b-41d4-a716-446655440002', 'Performance optimization');

-- Insert poll options for the third poll
INSERT INTO poll_options (poll_id, text) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'Very satisfied'),
('550e8400-e29b-41d4-a716-446655440003', 'Satisfied'),
('550e8400-e29b-41d4-a716-446655440003', 'Neutral'),
('550e8400-e29b-41d4-a716-446655440003', 'Dissatisfied'),
('550e8400-e29b-41d4-a716-446655440003', 'Very dissatisfied');

-- Note: Votes will be automatically counted by the triggers when inserted
-- You can add sample votes like this (replace user IDs as needed):
-- INSERT INTO votes (poll_id, option_id, user_id) VALUES
-- ('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM poll_options WHERE poll_id = '550e8400-e29b-41d4-a716-446655440001' AND text = 'JavaScript/TypeScript' LIMIT 1), (SELECT id FROM auth.users LIMIT 1));
