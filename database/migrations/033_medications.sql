CREATE TABLE medications (

    id SERIAL PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    active_ingredient VARCHAR(255),

    presentation VARCHAR(255),

    active BOOLEAN NOT NULL
        DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP

);