import db from './db.js';

const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO public.volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING user_id, project_id;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows[0] ?? null;
};

const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM public.volunteers
        WHERE user_id = $1 AND project_id = $2
        RETURNING user_id, project_id;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows[0] ?? null;
};

const getVolunteerProjects = async (userId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date,
               o.name AS organization_name
        FROM public.projects AS p
        JOIN public.volunteers AS v ON p.project_id = v.project_id
        JOIN public.organization AS o ON o.organization_id = p.organization_id
        WHERE v.user_id = $1
        ORDER BY p.project_id DESC;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

const isVolunteer = async (userId, projectId) => {
    const query = `
        SELECT 1
        FROM public.volunteers
        WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rowCount > 0;
};

export { addVolunteer, removeVolunteer, getVolunteerProjects, isVolunteer };
