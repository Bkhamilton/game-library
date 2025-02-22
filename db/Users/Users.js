import * as SQLite from 'expo-sqlite';

// Function to get all users
export const getUsers = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Users');
        return allRows;
    } catch (error) {
        console.error('Error getting users:', error);
        throw error;
    }
};

export const getUser = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Users LIMIT 1');
        return allRows[0];
    } catch (error) {
        console.error('Error getting users:', error);
        throw error;
    }
};

// Function to insert a user
export const insertUser = async (db, user) => {
    try {
        const result = await db.runAsync('INSERT INTO Users (username, name) VALUES (?, ?)', [user.username, user.name]);
        console.log(result);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
};

// Function to update a user
export const updateUser = async (db, userId, username, name) => {
    try {
        await db.runAsync('UPDATE Users SET username = ?, name = ? WHERE id = ?', [username, name, userId]);
        console.log("User updated");
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Function to delete a user
export const deleteUser = async (db, userId) => {
    try {
        await db.runAsync('DELETE FROM Users WHERE id = ?', [userId]);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
