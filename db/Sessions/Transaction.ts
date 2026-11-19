import type { SQLiteDatabase } from 'expo-sqlite';
import { Platform } from 'react-native';

const queues = new WeakMap<SQLiteDatabase, Promise<void>>();

export async function serializeSessionDatabase<T>(db: SQLiteDatabase, task: () => Promise<T>): Promise<T> {
    const previous = queues.get(db) ?? Promise.resolve();
    let release!: () => void;
    const current = new Promise<void>(resolve => { release = resolve; });
    queues.set(db, current);
    await previous;
    try {
        return await task();
    } finally {
        release();
        if (queues.get(db) === current) queues.delete(db);
    }
}

export function withSessionDatabaseTransaction<T>(
    db: SQLiteDatabase, task: (tx: SQLiteDatabase) => Promise<T>,
): Promise<T> {
    return serializeSessionDatabase(db, async () => {
        if (Platform.OS !== 'web') {
            let value!: T;
            await db.withExclusiveTransactionAsync(async tx => { value = await task(tx); });
            return value;
        }

        // Expo web's persistent VFS doesn't provide connection-level locking.
        // Serialize cooperating callers; unrelated users of the shared handle
        // must still stay out until the transaction ends.
        await db.execAsync('BEGIN IMMEDIATE');
        try {
            const value = await task(db);
            await db.execAsync('COMMIT');
            return value;
        } catch (error) {
            try {
                await db.execAsync('ROLLBACK');
            } catch {
                // SQLite may have already rolled back. Preserve the original error.
            }
            throw error;
        }
    });
}
