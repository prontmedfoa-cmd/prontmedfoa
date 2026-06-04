DROP VIEW IF EXISTS vw_patient_summary CASCADE;

CREATE VIEW vw_patient_summary AS

SELECT

    p.id,
    p.full_name,
    p.cpf,
    p.phone,
    p.email,

    last_appointment.scheduled_at
        AS last_appointment_date,

    last_triage.blood_pressure,
    last_triage.weight,
    last_triage.height,

    last_anamnese.chief_complaint,

    last_evolution.evolution_text,

    last_cid.code
        AS last_cid_code,

    last_cid.description
        AS last_cid_description,

    COALESCE(
        stats.total_consultations,
        0
    ) AS total_consultations,

    COALESCE(
        stats.total_prescriptions,
        0
    ) AS total_prescriptions

FROM patients p

/*
|--------------------------------------------------------------------------
| Último agendamento
|--------------------------------------------------------------------------
*/

LEFT JOIN LATERAL (

    SELECT

        scheduled_at

    FROM appointments

    WHERE patient_id = p.id

    ORDER BY scheduled_at DESC

    LIMIT 1

) last_appointment ON TRUE

/*
|--------------------------------------------------------------------------
| Última triagem
|--------------------------------------------------------------------------
*/

LEFT JOIN LATERAL (

    SELECT

        blood_pressure,
        weight,
        height

    FROM triages

    WHERE patient_id = p.id

    ORDER BY created_at DESC

    LIMIT 1

) last_triage ON TRUE

/*
|--------------------------------------------------------------------------
| Última anamnese
|--------------------------------------------------------------------------
*/

LEFT JOIN LATERAL (

    SELECT

        chief_complaint

    FROM anamneses

    WHERE patient_id = p.id

    ORDER BY created_at DESC

    LIMIT 1

) last_anamnese ON TRUE

/*
|--------------------------------------------------------------------------
| Última evolução
|--------------------------------------------------------------------------
*/

LEFT JOIN LATERAL (

    SELECT

        evolution_text

    FROM medical_evolutions

    WHERE patient_id = p.id

    ORDER BY created_at DESC

    LIMIT 1

) last_evolution ON TRUE

/*
|--------------------------------------------------------------------------
| Último CID registrado
|--------------------------------------------------------------------------
*/

LEFT JOIN LATERAL (

    SELECT

        cid.code,
        cid.description

    FROM consultations c

    INNER JOIN consultation_cids cc
        ON cc.consultation_id = c.id

    INNER JOIN cids cid
        ON cid.id = cc.cid_id

    WHERE c.patient_id = p.id

    ORDER BY c.created_at DESC

    LIMIT 1

) last_cid ON TRUE

/*
|--------------------------------------------------------------------------
| Estatísticas do paciente
|--------------------------------------------------------------------------
*/

LEFT JOIN (

    SELECT

        c.patient_id,

        COUNT(
            DISTINCT c.id
        ) AS total_consultations,

        COUNT(
            DISTINCT pr.id
        ) AS total_prescriptions

    FROM consultations c

    LEFT JOIN prescriptions pr
        ON pr.consultation_id = c.id

    GROUP BY c.patient_id

) stats

ON stats.patient_id = p.id;