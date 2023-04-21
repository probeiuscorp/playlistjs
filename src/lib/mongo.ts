import { Collection, MongoClient, MongoClientOptions } from 'mongodb';
import invariant from 'tiny-invariant';

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {};
invariant(uri, 'env.MONGODB_URI is not set');

const g = global as any;

export const connection = ((): Promise<MongoClient> => {
    if(process.env.NODE_ENV === 'development') {
        if(!g._mongoClient) return g._mongoClient = new MongoClient(uri, options).connect();
        return g._mongoClient;
    }
    return new MongoClient(uri, options).connect();
})();

export async function collection(name: string): Promise<Collection>;
export async function collection(db: string, name: string): Promise<Collection>;
export async function collection(_1: string, _2?: string): Promise<Collection> {
    const [db, name] = (() => {
        if(_2) return [_1, _2];
        return ['playlistjs', _1];
    })();

    const mongo = await connection;
    return mongo.db(db).collection(name);
}