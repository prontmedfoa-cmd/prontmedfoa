const express =
    require('express');

const path =
    require('path');

const app =
    express();

/*
|--------------------------------------------------------------------------
| Middlewares Globais
|--------------------------------------------------------------------------
*/

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: true
    })
);

/*
|--------------------------------------------------------------------------
| EJS
|--------------------------------------------------------------------------
*/

app.set(
    'view engine',
    'ejs'
);

app.set(
    'views',
    path.join(
        __dirname,
        'views'
    )
);

/*
|--------------------------------------------------------------------------
| Arquivos Públicos
|--------------------------------------------------------------------------
*/

app.use(
    express.static(
        path.join(
            __dirname,
            '../public'
        )
    )
);

/*
|--------------------------------------------------------------------------
| Rotas WEB (Páginas)
|--------------------------------------------------------------------------
*/

const authViews =
    require(
        './routes/web/authViews'
    );

const dashboardViews =
    require(
        './routes/web/dashboardViews'
    );

const patientViews =
    require(
        './routes/web/patientViews'
    );

const triageViews =
    require(
        './routes/web/triageViews'
    );

const anamneseViews =
    require(
        './routes/web/anamneseViews'
    );

const consultationViews =
    require(
        './routes/web/consultationViews'
    );

const prescriptionViews =
    require(
        './routes/web/prescriptionViews'
    );

const moduleViews =
    require(
        './routes/web/moduleViews'
    );

app.use(
    authViews
);

app.use(
    dashboardViews
);

app.use(
    patientViews
);

app.use(
    triageViews
);

app.use(
    anamneseViews
);

app.use(
    consultationViews
);

app.use(
    prescriptionViews
);

app.use(
    moduleViews
);

/*
|--------------------------------------------------------------------------
| Página Inicial
|--------------------------------------------------------------------------
*/

app.get(
    '/',
    (req, res) => {

        return res.redirect(
            '/login'
        );

    }
);

/*
|--------------------------------------------------------------------------
| Rotas API
|--------------------------------------------------------------------------
*/

app.use(
    '/api/auth',
    require(
        './routes/authRoutes'
    )
);

app.use(
    '/api/users',
    require(
        './routes/userRoutes'
    )
);

app.use(
    '/api/patients',
    require(
        './routes/patientRoutes'
    )
);

app.use(
    '/api/triages',
    require(
        './routes/triageRoutes'
    )
);

app.use(
    '/api/risk-classifications',
    require(
        './routes/riskClassificationRoutes'
    )
);

app.use(
    '/api/anamneses',
    require(
        './routes/anamneseRoutes'
    )
);

app.use(
    '/api/consultations',
    require(
        './routes/consultationRoutes'
    )
);

app.use(
    '/api/prescriptions',
    require(
        './routes/prescriptionRoutes'
    )
);

app.use(
    '/api/evolutions',
    require(
        './routes/medicalEvolutionRoutes'
    )
);

app.use(
    '/api/attachments',
    require(
        './routes/attachmentRoutes'
    )
);

/*
|--------------------------------------------------------------------------
| Middleware de Erros
|--------------------------------------------------------------------------
*/

const errorMiddleware =
    require(
        './middlewares/errorMiddleware'
    );

app.use(
    errorMiddleware
);

module.exports =
    app;