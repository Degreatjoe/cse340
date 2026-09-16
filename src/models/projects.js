import db from './db.js';


export const getAllProjects = async () => {
    const query = `
        SELECT 
            p.project_id,
            o.name AS organization_name,
            p.organization_id,
            p.title,
            p.description,
            p.location,
            p.date
        FROM projects AS p
        JOIN organization AS o
            ON p.organization_id = o.organization_id
        ORDER BY p.date;
    `;

    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};
