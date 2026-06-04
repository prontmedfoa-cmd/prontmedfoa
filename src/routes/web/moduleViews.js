const express = require('express');
const router = express.Router();

const modules = [
    {
        path: 'triages',
        title: 'Triagens',
        description: 'Registre e acompanhe os sinais vitais dos pacientes antes do atendimento clínico.'
    },
    {
        path: 'anamneses',
        title: 'Anamneses',
        description: 'Documente o histórico clínico e as queixas principais dos pacientes.'
    },
    {
        path: 'consultations',
        title: 'Consultas',
        description: 'Gerencie os atendimentos médicos e os resultados das consultas.'
    },
    {
        path: 'prescriptions',
        title: 'Prescrições',
        description: 'Emita receitas e acompanhe os tratamentos medicinais dos pacientes.'
    },
    {
        path: 'evolutions',
        title: 'Evoluções',
        description: 'Registre as evoluções do caso e o progresso do tratamento.'
    },
    {
        path: 'attachments',
        title: 'Anexos',
        description: 'Armazene documentos e imagens de apoio ao cuidado clínico.'
    }
];

modules.forEach(module => {
    router.get(`/${module.path}`, (req, res) => {
        res.render('pages/module', {
            title: module.title,
            description: module.description
        });
    });
});

module.exports = router;
