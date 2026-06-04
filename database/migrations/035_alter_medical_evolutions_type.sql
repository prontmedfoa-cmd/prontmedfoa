ALTER TABLE medical_evolutions

ADD COLUMN evolution_type
VARCHAR(50)
NOT NULL
DEFAULT 'MEDICA';