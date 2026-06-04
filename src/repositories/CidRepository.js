const db =
    require('../config/database');

class CidRepository {

    async findById(id) {

        const { rows } =
            await db.query(
                `
                SELECT *

                FROM cids

                WHERE id = $1
                `,
                [id]
            );

        return rows[0] || null;
    }

    async findManyByIds(ids) {

        const { rows } =
            await db.query(
                `
                SELECT *

                FROM cids

                WHERE id = ANY($1)
                `,
                [ids]
            );

        return rows;
    }

}

module.exports =
    new CidRepository();