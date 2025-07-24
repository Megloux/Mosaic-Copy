-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL
);

INSERT INTO categories (id, name) VALUES
    ('c1', 'Abs'),
    ('c2', 'Obliques'),
    ('c3', 'LowerBodyHeavyPressing'),
    ('c4', 'LowerBodyLungesSquatsDeadlifts'),
    ('c5', 'LowerBodyStraps'),
    ('c6', 'UpperBody'),
    ('c7', 'Variations');
