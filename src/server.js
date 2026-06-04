require('dotenv').config();

const app =
    require('./app');

const runMigrations =
    require('../database/migration');

const runSeeds =
    require('../database/seed');

const createAdmin =
    require('../database/createAdmin');

const PORT =
    process.env.PORT || 3000;

async function startServer() {

    try {

        await runMigrations();

        await runSeeds();

        await createAdmin();

        app.listen(
            PORT,
            () => {

                console.log(
                    `Servidor iniciado na porta ${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            'Falha ao iniciar aplicação:',
            error
        );

        process.exit(1);

    }
}

startServer();

// require('dotenv').config();

// const app = require('./app');

// const runMigrations =
//     require('../database/migration');

// const runSeeds =
//     require('../database/seed');

// const createAdmin =
//     require('../database/createAdmin');

// async function startServer() {

//     try {

//         await runMigrations();

//         await runSeeds();

//         await createAdmin();

//         app.listen(
//             process.env.PORT,
//             () => {

//                 console.log(
//                     `Servidor iniciado na porta ${process.env.PORT}`
//                 );

//             }
//         );

//     } catch (error) {

//         console.error(
//             'Falha ao iniciar aplicação:',
//             error
//         );

//         process.exit(1);

//     }
// }

// startServer();