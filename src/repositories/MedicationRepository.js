const db =
    require('../config/database');

class MedicationRepository {

    async findById(id) {

        const { rows } =
            await db.query(
                `
                SELECT *

                FROM medications

                WHERE id = $1

                AND active = TRUE
                `,
                [id]
            );

        return rows[0] || null;
    }

    async search(search) {

        const { rows } =
            await db.query(
                `
                SELECT *

                FROM medications

                WHERE active = TRUE

                AND name ILIKE $1

                ORDER BY name

                LIMIT 20
                `,
                [`%${search}%`]
            );

        return rows;
    }
    
    async findManyByIds(ids) {

    const { rows } =
        await db.query(
            `
            SELECT *

            FROM medications

            WHERE active = TRUE

            AND id = ANY($1)
            `,
            [ids]
        );

    return rows;
}

}

module.exports =
    new MedicationRepository();