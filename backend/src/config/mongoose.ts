import mongoose from 'mongoose';

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dsw-corretora-acoes');
        console.log('MongoDB conectado com sucesso');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        process.exit(1);
    }
};

export default connectDb;