const ApiError =
    require('../utils/ApiError');

const TriageRepository =
    require('../repositories/TriageRepository');

const PatientRepository =
    require('../repositories/PatientRepository');

const RiskClassificationRepository =
    require(
        '../repositories/RiskClassificationRepository'
    );

class TriageService {

    async create(data) {

        if (!data.patient_id) {

            throw new ApiError(
                'Paciente é obrigatório',
                400
            );

        }

        if (!data.risk_classification_id) {

            throw new ApiError(
                'Classificação de risco é obrigatória',
                400
            );

        }

        const riskClassification =
            await RiskClassificationRepository.findById(
                data.risk_classification_id
            );

        if (!riskClassification) {

            throw new ApiError(
                'Classificação de risco inválida',
                400
            );

        }

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

        if (
            data.weight !== undefined &&
            data.weight !== null &&
            Number(data.weight) <= 0
        ) {

            throw new ApiError(
                'Peso inválido',
                400
            );

        }

        if (
            data.height !== undefined &&
            data.height !== null &&
            Number(data.height) <= 0
        ) {

            throw new ApiError(
                'Altura inválida',
                400
            );

        }

        let bmi = null;

        if (
            data.weight &&
            data.height
        ) {

            bmi = Number(
                (
                    Number(data.weight) /
                    (
                        Number(data.height) *
                        Number(data.height)
                    )
                ).toFixed(2)
            );

        }

        return await TriageRepository.create({

            ...data,

            bmi,

            nurse_id:
                data.nurse_id

        });

    }

    async findById(id) {

        const triage =
            await TriageRepository.findById(id);

        if (!triage) {

            throw new ApiError(
                'Triagem não encontrada',
                404
            );

        }

        return triage;

    }

    async findByPatient(patientId) {

        const patient =
            await PatientRepository.findById(
                patientId
            );

        if (!patient) {

            throw new ApiError(
                'Paciente não encontrado',
                404
            );

        }

        return await TriageRepository.findByPatient(
            patientId
        );

    }

    async update(id, data) {

        const triage =
            await TriageRepository.findById(
                id
            );

        if (!triage) {

            throw new ApiError(
                'Triagem não encontrada',
                404
            );

        }

        if (!data.risk_classification_id) {

            throw new ApiError(
                'Classificação de risco é obrigatória',
                400
            );

        }

        const riskClassification =
            await RiskClassificationRepository.findById(
                data.risk_classification_id
            );

        if (!riskClassification) {

            throw new ApiError(
                'Classificação de risco inválida',
                400
            );

        }

        const weight =
            data.weight !== undefined &&
            data.weight !== null
                ? Number(data.weight)
                : triage.weight;

        const height =
            data.height !== undefined &&
            data.height !== null
                ? Number(data.height)
                : triage.height;

        if (
            data.weight !== undefined &&
            data.weight !== null &&
            weight <= 0
        ) {

            throw new ApiError(
                'Peso inválido',
                400
            );

        }

        if (
            data.height !== undefined &&
            data.height !== null &&
            height <= 0
        ) {

            throw new ApiError(
                'Altura inválida',
                400
            );

        }

        let bmi = triage.bmi;

        if (
            weight !== undefined &&
            weight !== null &&
            height !== undefined &&
            height !== null
        ) {

            bmi = Number(
                (
                    weight /
                    (height * height)
                ).toFixed(2)
            );

        }

        return TriageRepository.update(
            id,
            {
                ...data,
                nurse_id: triage.nurse_id,
                bmi
            }
        );

    }

}

module.exports =
    new TriageService();