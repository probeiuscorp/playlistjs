import { Collection, Document, MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import invariant from 'tiny-invariant';

const uri = process.env.MONGODB_URI;
invariant(uri, 'env.MONGODB_URI is not set');

const g = global as any;

export const connection = ((): Promise<MongoClient> => {
    if(process.env.NODE_ENV === 'development') {
        if(!g._mongoClient) return g._mongoClient = new MongoClient(uri).connect();
        return g._mongoClient;
    }
    return new MongoClient(uri).connect();
})();

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