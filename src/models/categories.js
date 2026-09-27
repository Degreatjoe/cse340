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

export const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM public.categories
        WHERE category_id = $1;
    `;

    try {
        const result = await db.query(query, [categoryId]);
        return result.rows[0] ?? null;
    } catch (error) {
        console.error('Error fetching category details:', error);
        throw error;
    }
};

export const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM public.categories AS c
        JOIN public.project_categories AS pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;

    try {
        const result = await db.query(query, [projectId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching project categories:', error);
        throw error;
    }
};

export const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT p.project_id, p.title
        FROM public.projects AS p
        JOIN public.project_categories AS pc
            ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.date;
    `;

    try {
        const result = await db.query(query, [categoryId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching category projects:', error);
        throw error;
    }
};