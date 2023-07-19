import { Collection, ConnectOptions, Db, Document, MongoClient } from 'mongodb';
import invariant from 'tiny-invariant';

const options: ConnectOptions = {

};
const uri = process.env.MONGODB_URI as string;
invariant(uri, 'env.MONGODB_URI is not set');

const g = global as any;

export const connection = ((): MongoClient => {
    if(process.env.NODE_ENV === 'development') {
        if(!g._mongoClient) return g._mongoClient = new MongoClient(uri, options);
        return g._mongoClient;
    }
    return new MongoClient(uri);
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

export function collection<TDocument extends Document>(name: string): Collection<TDocument>;
export function collection<TDocument extends Document>(db: string, name: string): Collection<TDocument>;
export function collection(_1: string, _2?: string) {
    // The things we do to keep our variables blue
    const [db, name] = (() => {
        if(_2) return [_1, _2];
        return ['playlistjs', _1];
    })();

    return connection.db(db).collection(name);
}