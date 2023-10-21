import { Request, Response } from 'express';
import { prisma } from '../db/client';
import * as bcrypt from 'bcrypt';

interface UserSignupBody {
    email: string;
    password: string;
    name: string;
}

interface UserLoginBody {
    email: string;
    password: string;
}

export const userSignup = async (request: Request, response: Response): Promise<void> => {
    const newUser: UserSignupBody = request.body;

    try {
        await prisma.user.create({
            data: {
                email: newUser.email,
                name: newUser.name,
                password: await bcrypt.hash(newUser.password, 12)
            }
        });
        response.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'An error occurred. Contact administrator or check server logs' });
    }
};

export const userLogin = async (request: Request, response: Response): Promise<void> => {
    const loginBody: UserLoginBody = request.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: loginBody.email
            }
        });

        if (!user) {
            throw new Error(`User ${loginBody.email} not found`);
        }

        if (!(await bcrypt.compare(loginBody.password, user.password))) {
            throw new Error('Invalid password');
        }

        request.session.email = user.email;
        response.redirect('/user-show-html');
    } catch (error) {
        console.error(error);
        response.status(401).send('User not found or wrong password');
    }
};

export const userShow = (request: Request, response: Response): void => {
    if (request.session && request.session.email) {
        const userMessage = `L'utente loggato è ${request.session.email}`;
        console.log('request.session', request.session);
        response.status(200).json({ message: userMessage });
    } else {
        response.status(401).json({ error: 'Utente non loggato' });
    }
};

export const getUserPosts = async (req: Request, res: Response): Promise<void> => {
    const userEmail = req.query.email as string;

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
            res.status(404).json({ error: 'Utente non trovato' });
        } else {
            const userPosts = user.blogPosts;
            res.status(200).json(userPosts);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Errore nel recupero dei post dell'utente" });
    }
};
