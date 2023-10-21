import express, { Router, json } from 'express';
import session from 'express-session';
import createMemoryStore from 'memorystore';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import { userShow, userLogin, userSignup } from './controllers/user.controllers';
declare module 'express-session' {
    interface SessionData {
        email: string;
    }
}

const app = express();
const MemoryStore = createMemoryStore(session);
const prisma = new PrismaClient();

app.use(cookieParser());

const sessionMiddleware = session({
    secret: 'sdjfsldkjjklk',
    resave: true,
    store: new MemoryStore({
        checkPeriod: 86400000
    }),
    saveUninitialized: false,
    cookie: {
        maxAge: 86400000,
        sameSite: 'strict'
    }
});

app.use((req, res, next) => {
    if (req.cookies.cookie_content_user_accepted === 'true') {
        sessionMiddleware(req, res, next);
    } else {
        next();
    }
});

app.use(express.urlencoded({ extended: true }));
app.use(json());

const port = 8000;

const userRouter = Router();
userRouter.post('/signup', userSignup);
userRouter.post('/login', userLogin);
userRouter.get('/show', userShow);

app.use('/user', userRouter);

app.get('/user/posts', async (req, res) => {
    const userEmail = req.query.email as string;

    if (!userEmail) {
        return res.status(400).json({ error: 'Email non specificata nella query string.' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: userEmail
            },
            include: {
                blogPosts: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: "Nessun utente trovato per l'email specificata." });
        }

        res.json(user.blogPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Errore durante la richiesta dei post utente.' });
    }
});

app.use('/', express.static(`${__dirname}/../public`));

app.listen(port, () => {
    console.log(`App started on port ${port}`);
});
