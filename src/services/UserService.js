const bcrypt = require('bcrypt');

const ApiError =
    require('../utils/ApiError');

const UserRepository =
    require('../repositories/UserRepository');

class UserService {

    async findAll() {
        return UserRepository.findAll();
    }

    async findById(id) {
        return UserRepository.findById(id);
    }

    async create(data) {

        const existingUser =
            await UserRepository.findByEmail(
                data.email
            );

        if (existingUser) {

            throw new ApiError(
                'E-mail já cadastrado',
                400
            );
        }

        const password_hash =
            await bcrypt.hash(
                data.password,
                10
            );

        return UserRepository.create({

            role_id:
                data.role_id,

            full_name:
                data.full_name,

            cpf:
                data.cpf,

            email:
                data.email,

            password_hash

        });

    }

    async update(id, data) {

        const existingUser =
            await UserRepository.findById(id);

        if (!existingUser) {

            throw new ApiError(
                'Usuário não encontrado',
                404
            );
        }

        if (data.email && data.email !== existingUser.email) {

            const emailExists =
                await UserRepository.findByEmail(
                    data.email
                );

            if (emailExists) {

                throw new ApiError(
                    'E-mail já cadastrado',
                    400
                );
            }
        }

        return UserRepository.update(id, {

            role_id: data.role_id,
            full_name: data.full_name,
            cpf: data.cpf,
            email: data.email

        });

    }

    async delete(id) {

        const user =
            await UserRepository.findById(id);

        if (!user) {

            throw new ApiError(
                'Usuário não encontrado',
                404
            );
        }

        return UserRepository.softDelete(id);

    }

}

module.exports =
    new UserService();