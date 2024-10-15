import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from '../../../models/User'; // ajuste o caminho conforme necessário
import dbConnect from '../../../utils/dbConnect'; // ajuste o caminho conforme necessário

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await dbConnect();

        if (!credentials) {
          throw new Error("Credenciais não fornecidas");
        }

        const user = await User.findOne({ username: credentials.username });

        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return { id: user._id, name: user.username, email: user.email };
        }

        throw new Error("Nome de usuário ou senha inválidos");
      },
    }),
  ],
};
