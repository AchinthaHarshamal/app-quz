import { log } from 'console';
import mongoose, { Connection, ConnectOptions } from 'mongoose';

class DBConnection {
    static conn: Connection | null = null;
    static promise: Promise<Connection> | null = null;

    static async connect(): Promise<Connection> {
        if (DBConnection?.conn?.readyState === 1) {
            return DBConnection.conn;
        } else {
            DBConnection.conn = null;
            DBConnection.promise = null;
        }

        const url: string = process.env.MONGODB_URI as string;
        const options: ConnectOptions = {};

        if (!DBConnection.promise) {
            log('Connecting to MongoDB...');
            DBConnection.promise = mongoose.connect(url, options).then((conn) => {
                DBConnection.conn = conn.connection;
                return DBConnection.conn;
            });
        }

        DBConnection.conn = await DBConnection.promise;
        return DBConnection.conn;
    }
}

export default DBConnection;