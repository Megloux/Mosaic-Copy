-- Studios table
CREATE TABLE studios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL
);

INSERT INTO studios (id, name) VALUES
    ('s1', 'HILI');

ON CONFLICT (id) DO NOTHING;
