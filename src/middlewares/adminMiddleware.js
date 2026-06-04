module.exports = (req, res, next) => {

    const user = req.user;

    if (!user || user.role_name !== 'ADMIN') {

        return res.status(403).json({
            error: 'Acesso permitido apenas para administradores'
        });
    }

    next();

};
