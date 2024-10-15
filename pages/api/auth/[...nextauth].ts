import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials'; 
import User from '../../../models/User'; 
import dbConnect from '../../../lib/dbConnect';
import bcrypt from 'bcryptjs'; // Importação do bcrypt

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
                
                const user = await User.findOne({ username: credentials.username });
                if (user && (await bcrypt.compare(credentials.password, user.password))) {
                    return { id: user._id, name: user.username, email: user.email };
                }
                return null;
            }
        })
    ],
    session: {
        jwt: true,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            return session;
        }
    }
});
