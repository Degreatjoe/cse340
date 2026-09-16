import db from './db.js';

export const getAllCategories = async () => {
    const query = 'SELECT category_id, name FROM public.categories';
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};