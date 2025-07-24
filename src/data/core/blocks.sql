-- Blocks table
CREATE TABLE blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL
);

INSERT INTO blocks (id, name) VALUES
    ('b1', 'CenterCore'),
    ('b2', 'RightLeg'),
    ('b3', 'LeftLeg'),
    ('b4', 'RightOblique'),
    ('b5', 'LeftOblique'),
    ('b6', 'UpperBody'),
    ('b7', 'Bilateral');

ON CONFLICT (id) DO NOTHING;
