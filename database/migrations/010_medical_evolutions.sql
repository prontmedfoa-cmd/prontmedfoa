CREATE TABLE medical_evolutions (

    id BIGSERIAL PRIMARY KEY,

    patient_id BIGINT NOT NULL,

    consultation_id BIGINT NOT NULL,

    professional_id BIGINT NOT NULL,

    evolution_text TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_evolution_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(id),

    CONSTRAINT fk_evolution_consultation
        FOREIGN KEY (consultation_id)
        REFERENCES consultations(id),

    CONSTRAINT fk_evolution_professional
        FOREIGN KEY (professional_id)
        REFERENCES users(id)

);

-- -- tabela recomandada
-- CREATE TABLE medical_evolutions (

--     id SERIAL PRIMARY KEY,

--     patient_id INTEGER NOT NULL,

--     consultation_id INTEGER,

--     professional_id INTEGER NOT NULL,

--     evolution_type VARCHAR(50)
--         NOT NULL
--         DEFAULT 'MEDICA',

--     evolution_text TEXT NOT NULL,

--     created_at TIMESTAMP NOT NULL
--         DEFAULT CURRENT_TIMESTAMP,

--     updated_at TIMESTAMP NOT NULL
--         DEFAULT CURRENT_TIMESTAMP,

--     CONSTRAINT fk_medical_evolution_patient
--         FOREIGN KEY (patient_id)
--         REFERENCES patients(id),

--     CONSTRAINT fk_medical_evolution_consultation
--         FOREIGN KEY (consultation_id)
--         REFERENCES consultations(id),

--     CONSTRAINT fk_medical_evolution_professional
--         FOREIGN KEY (professional_id)
--         REFERENCES users(id)

-- );
