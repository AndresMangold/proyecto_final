const express = require('express');
const http = require('http');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const methodOverride = require('method-override');
const swaggerJSDoc = require('swagger-jsdoc');
const { serve, setup } = require('swagger-ui-express');
const moment = require('moment'); 
const { DEFAULT_MAX_AGE } = require('./constants');

const createProductRouter = require('./routes/createProduct.router');
const productsRouter = require('./routes/products.router');
const cartRouter = require('./routes/cart.router');
const sessionRouter = require('./routes/session.router');
const userRouter = require('./routes/user.router');  
const mockingProduct = require('./routes/mockingProduct.router');
const loggerTestRouter = require('./routes/loggerTest.router');
const adminRouter = require('./routes/admin.router');
const { errorHandler } = require('./middlewares/errorHandler.middleware'); 
const { useLogger } = require('./middlewares/logger.middleware'); 

const initializePassport = require('./config/passport.config');
const initializePassportGitHub = require('./config/passport-github.config');
const initializePassportJWT = require('./config/passport-jwt.config');
const { verifyToken } = require('./utils/jwt');

const { dbName, mongoUrl } = require('./dbConfig');

const app = express();

const hbs = exphbs.create({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: `${__dirname}/views/layouts`,
    partialsDir: `${__dirname}/views/partials`,
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        formatDate: function (date) {
            if (!date) return 'Nunca';
            return moment(date).format('DD/MM/YYYY HH:mm:ss');
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));

app.use(express.static(`${__dirname}/public`));
app.use(express.static('public'));

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        ttl: 5 * 60 
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 5 * 60 * 1000 } 
}));

initializePassport();
initializePassportGitHub();
initializePassportJWT();
app.use(passport.initialize());
app.use(passport.session());

app.use(useLogger);

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'API de Andrés',
            description: 'API de Andrés para CoderH!'
        },
    },
    apis: [`${__dirname}/../src/docs/*.yaml`],
};
const specs = swaggerJSDoc(swaggerOptions);

app.use('/apidocs', serve, setup(specs));

app.get('/', (req, res) => {
    res.redirect('/sessions/login');
});

app.get('/', (req, res) => {
    res.redirect('/sessions/login');
});

app.use('/sessions', sessionRouter);
app.use('/api/users', verifyToken, userRouter);  
app.use('/api/createProduct', verifyToken, createProductRouter);
app.use('/api/products', verifyToken, productsRouter);
app.use('/api/cart', verifyToken, cartRouter);
app.use('/api/mockingproducts', mockingProduct);
app.use('/loggertest', loggerTestRouter);
app.use('/admin', verifyToken, adminRouter);

app.use((req, res, next) => {
    res.status(404).send('Page Not Found');
});

app.use(errorHandler);

const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

const main = async () => {
    try {
        await mongoose.connect(mongoUrl, { dbName: dbName });
        server.listen(PORT, () => {
            console.log('Servidor cargado!');
            console.log(`http://localhost:${PORT}/sessions/login`);
        });
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
    }
};

main();

module.exports = server;
