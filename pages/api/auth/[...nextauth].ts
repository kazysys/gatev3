import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../models/User';
import dbConnect from '../../../lib/dbConnect';
import bcrypt from 'bcryptjs';

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Usuário", type: "text" },
                password: { label: "Senha", type: "password" }
            },
            async authorize(credentials) {
                await dbConnect();

                if (!credentials) {
                    throw new Error('Credenciais não fornecidas');
                }

                const user = await User.findOne({ username: credentials.username });
                if (user && (await bcrypt.compare(credentials.password, user.password))) {
                    return { id: user._id, name: user.username, email: user.email };
                }
                return null;
            }
        })
    ],
    session: {},
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id; // Agora o TypeScript reconhece session.user.id
            }
            return session;
        }
    }
});
