import connectDb from "./mongoose";
import mongoose from "mongoose";

export async function start() {
    await connectDb()
        .then(()=> console.log('Conexão com MongoDB estabelecida'))
        .then(() => mongoose.connection.dropDatabase())
}