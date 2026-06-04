const ApiError =
    require('../utils/ApiError');

const PatientRepository =
    require('../repositories/PatientRepository');

const TriageRepository =
    require('../repositories/TriageRepository');

const AnamneseRepository =
    require('../repositories/AnamneseRepository');

const ConsultationRepository =
    require('../repositories/ConsultationRepository');

const ConsultationCidRepository =
    require(
        '../repositories/ConsultationCidRepository'
    );

const CidRepository =
    require(
        '../repositories/CidRepository'
    );

class ConsultationService {

    async create(data) {

        const patient =
            await PatientRepository.findById(
                data.patient_id
            );

        if (!patient) {

            throw new ApiError(
                'Paciente não encontrado',
                404
            );

        }

        if (data.triage_id) {

            const triage =
                await TriageRepository.findById(
                    data.triage_id
                );

            if (!triage) {

                throw new ApiError(
                    'Triagem não encontrada',
                    404
                );

            }

        }

        if (data.anamnese_id) {

            const anamnese =
                await AnamneseRepository.findById(
                    data.anamnese_id
                );

            if (!anamnese) {

                throw new ApiError(
                    'Anamnese não encontrada',
                    404
                );

            }

        }

        return ConsultationRepository.create(
            data
        );
    }

    async findById(id) {

        const consultation =
            await ConsultationRepository.findById(
                id
            );

        if (!consultation) {

            throw new ApiError(
                'Consulta não encontrada',
                404
            );

        }

        return consultation;
    }

    async findByPatient(patientId) {

        return ConsultationRepository.findByPatient(
            patientId
        );
    }

    async update(id, data) {

        const consultation =
            await ConsultationRepository.findById(
                id
            );

        if (!consultation) {

            throw new ApiError(
                'Consulta não encontrada',
                404
            );

        }

        if (data.triage_id) {

            const triage =
                await TriageRepository.findById(
                    data.triage_id
                );

            if (!triage) {

                throw new ApiError(
                    'Triagem não encontrada',
                    404
                );

            }

        }

        if (data.anamnese_id) {

            const anamnese =
                await AnamneseRepository.findById(
                    data.anamnese_id
                );

            if (!anamnese) {

                throw new ApiError(
                    'Anamnese não encontrada',
                    404
                );

            }

        }

        return ConsultationRepository.update(
            id,
            {
                ...data,
                patient_id: consultation.patient_id,
                doctor_id: consultation.doctor_id
            }
        );

    }

    async saveCids(
        consultationId,
        cidIds
    ) {

        const consultation =
            await ConsultationRepository.findById(
                consultationId
            );

        if (!consultation) {

            throw new ApiError(
                'Consulta não encontrada',
                404
            );

        }

        const cids =
            await CidRepository.findManyByIds(
                cidIds
            );

        if (cids.length !== cidIds.length) {

            throw new ApiError(
                'Um ou mais CIDs são inválidos',
                400
            );

        }

        await ConsultationCidRepository
            .replaceCids(
                consultationId,
                cidIds
            );

        return ConsultationCidRepository
            .findByConsultation(
                consultationId
            );

    }

}

module.exports =
    new ConsultationService();