const ApiError =
    require('../utils/ApiError');

const PatientRepository =
    require('../repositories/PatientRepository');

const ConsultationRepository =
    require('../repositories/ConsultationRepository');

const MedicalEvolutionRepository =
    require(
        '../repositories/MedicalEvolutionRepository'
    );

class MedicalEvolutionService {

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

        if (!data.evolution_text) {

            throw new ApiError(
                'Texto da evolução é obrigatório',
                400
            );

        }

        if (data.consultation_id) {

            const consultation =
                await ConsultationRepository.findById(
                    data.consultation_id
                );

            if (!consultation) {

                throw new ApiError(
                    'Consulta não encontrada',
                    404
                );

            }

        }

        return MedicalEvolutionRepository.create(
            data
        );

    }

    async findById(id) {

        const evolution =
            await MedicalEvolutionRepository.findById(
                id
            );

        if (!evolution) {

            throw new ApiError(
                'Evolução não encontrada',
                404
            );

        }

        return evolution;
    }

    async findByPatient(patientId) {

        return MedicalEvolutionRepository.findByPatient(
            patientId
        );

    }

}

module.exports =
    new MedicalEvolutionService();