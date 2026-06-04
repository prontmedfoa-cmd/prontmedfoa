const ApiError =
    require('../utils/ApiError');

const ConsultationRepository =
    require('../repositories/ConsultationRepository');

const MedicationRepository =
    require('../repositories/MedicationRepository');

const PrescriptionRepository =
    require('../repositories/PrescriptionRepository');

const PrescriptionItemRepository =
    require('../repositories/PrescriptionItemRepository');

class PrescriptionService {

    async create(data) {

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

        if (
            !data.items ||
            !data.items.length
        ) {

            throw new ApiError(
                'Receita sem medicamentos',
                400
            );

        }

        const medicationIds =
            data.items.map(
                item => item.medication_id
            );

        const medications =
            await MedicationRepository.findManyByIds(
                medicationIds
            );

        if (
            medications.length !==
            medicationIds.length
        ) {

            throw new ApiError(
                'Um ou mais medicamentos são inválidos',
                400
            );

        }

        const prescription =
            await PrescriptionRepository.create({

                consultation_id:
                    data.consultation_id,

                doctor_id:
                    data.doctor_id,

                notes:
                    data.notes

            });

        await PrescriptionItemRepository.createMany(

            prescription.id,

            data.items

        );

        return prescription;

    }

}

module.exports =
    new PrescriptionService();