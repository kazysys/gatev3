import mongoose from 'mongoose';

const connection = { isConnected: false };

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    connection.isConnected = db.connection.readyState === 1; // 1 significa conectado
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
}

export default dbConnect;
