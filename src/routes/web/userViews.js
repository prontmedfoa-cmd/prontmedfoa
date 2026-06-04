const express = require('express');
const router = express.Router();

// Listar usuários
router.get(
    '/admin/users',
    (req, res) => {
        res.render('users/index', {
            title: 'Gerenciar Usuários'
        });
    }
);

// Criar novo usuário
router.get(
    '/admin/users/new',
    (req, res) => {
        res.render('users/create', {
            title: 'Novo Usuário'
        });
    }
);

// Editar usuário
router.get(
    '/admin/users/:id/edit',
    (req, res) => {
        res.render('users/edit', {
            title: 'Editar Usuário',
            userId: req.params.id
        });
    }
);

// Visualizar usuário
router.get(
    '/admin/users/:id',
    (req, res) => {
        res.render('users/show', {
            title: 'Detalhes do Usuário',
            userId: req.params.id
        });
    }
);

module.exports = router;
