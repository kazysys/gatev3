import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials'; // Altere para importar apenas o que precisa
import User from '../../../models/User'; // Importando seu modelo de usuário
import dbConnect from '../../../lib/dbConnect';
import bcrypt from 'bcryptjs'; // Não se esqueça de importar o bcrypt

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

                // Verifica se credentials está definido
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
    session: {
        // Removendo a propriedade 'jwt'
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
