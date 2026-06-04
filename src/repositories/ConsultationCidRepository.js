const db =
    require('../config/database');

class ConsultationCidRepository {

    async replaceCids(
        consultationId,
        cidIds
    ) {

        await db.query(
            `
        DELETE FROM consultation_cids

        WHERE consultation_id = $1
        `,
            [consultationId]
        );

        if (!cidIds.length) {

            return;

        }

        const values = [];
        const params = [];

        let index = 1;

        for (const cidId of cidIds) {

            values.push(
                `($${index}, $${index + 1})`
            );

            params.push(
                consultationId,
                cidId
            );

            index += 2;
        }

        await db.query(
            `
        INSERT INTO consultation_cids (

            consultation_id,
            cid_id

        )

        VALUES

        ${values.join(',')}
        `,
            params
        );

    }

    async findByConsultation(
        consultationId
    ) {

        const { rows } =
            await db.query(
                `
                SELECT

                    c.id,
                    c.code,
                    c.description

                FROM consultation_cids cc

                INNER JOIN cids c

                    ON c.id = cc.cid_id

                WHERE cc.consultation_id = $1

                ORDER BY c.code
                `,
                [consultationId]
            );

        return rows;
    }

}

module.exports =
    new ConsultationCidRepository();