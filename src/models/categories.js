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

export const createCategory = async (name) => {
    const query = `
        INSERT INTO public.categories (name)
        VALUES ($1)
        RETURNING category_id;
    `;

    const result = await db.query(query, [name]);
    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    return result.rows[0].category_id;
};

export const updateCategory = async (categoryId, name) => {
    const query = `
        UPDATE public.categories
        SET name = $2
        WHERE category_id = $1
        RETURNING category_id;
    `;

    const result = await db.query(query, [categoryId, name]);
    if (result.rows.length === 0) {
        throw new Error('Failed to update category');
    }

    return result.rows[0].category_id;
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

const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO public.project_categories (project_id, category_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [projectId, categoryId]);
};

export const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM public.project_categories
        WHERE project_id = $1;
    `;

    await db.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
};