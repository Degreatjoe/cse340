import db from './db.js';


export const getAllOrganizations = async () => {
    const query = 'SELECT organization_id, name, description, contact_email, logo_filename FROM public.organization';
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching organizations:', error);
        throw error;
    }
};