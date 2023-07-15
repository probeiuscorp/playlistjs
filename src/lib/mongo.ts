import { Collection, ConnectOptions, Db, Document, MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import invariant from 'tiny-invariant';

const options: ConnectOptions = {

};
const uri = process.env.MONGODB_URI as string;
invariant(uri, 'env.MONGODB_URI is not set');

const g = global as any;

export const connection = ((): Promise<MongoClient> => {
    if(process.env.NODE_ENV === 'development') {
        if(!g._mongoClient) return g._mongoClient = new MongoClient(uri, options).connect();
        return g._mongoClient;
    }
    return new MongoClient(uri).connect();
})();

let mongoClient: MongoClient | null = null;
let database: Db | null = null;
export async function connectToDatabase() {
    try {
        if(mongoClient && database) {
            return { mongoClient, database };
        }
        
        if(process.env.NODE_ENV === 'development') {
            if(!g._mongoClient) {
                mongoClient = await (new MongoClient(uri, options)).connect();
                g._mongoClient = mongoClient;
            } else {
                mongoClient = g._mongoClient as MongoClient;
            }
        } else {
            mongoClient = await (new MongoClient(uri, options)).connect();
        }

        database = mongoClient.db('playlistjs');
        return { mongoClient, database };
    } catch (e) {
        console.error(e);
    }
}

export async function collection<TDocument extends Document>(name: string): Promise<Collection<TDocument>>;
export async function collection<TDocument extends Document>(db: string, name: string): Promise<Collection<TDocument>>;
export async function collection(_1: string, _2?: string): Promise<Collection> {
    // The things we do to keep our variables blue
    const [db, name] = (() => {
        if(_2) return [_1, _2];
        return ['playlistjs', _1];
    })();

    const mongo = await connection;
    return mongo.db(db).collection(name);
}

export function createHandler<T = unknown>(handler: (req: NextApiRequest, res: NextApiResponse<T>) => void) {
    return handler;
}