const UserService =
    require('../services/UserService');

class UserController {

    async list(
        req,
        res,
        next
    ) {

        try {

            const users =
                await UserService.findAll();

            return res.json(users);

        } catch (error) {

            next(error);

        }

    }

    async show(
        req,
        res,
        next
    ) {

        try {

            const user =
                await UserService.findById(
                    req.params.id
                );

            return res.json(user);

        } catch (error) {

            next(error);

        }

    }

    async create(
        req,
        res,
        next
    ) {

        try {

            const user =
                await UserService.create(
                    req.body
                );

            return res
                .status(201)
                .json(user);

        } catch (error) {

            next(error);

        }

    }

    async update(
        req,
        res,
        next
    ) {

        try {

            const user =
                await UserService.update(
                    req.params.id,
                    req.body
                );

            return res.json(user);

        } catch (error) {

            next(error);

        }

    }

    async delete(
        req,
        res,
        next
    ) {

        try {

            await UserService.delete(
                req.params.id
            );

            return res.status(204).send();

        } catch (error) {

            next(error);

        }

    }

}

module.exports =
    new UserController();