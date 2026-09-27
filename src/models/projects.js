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

export const getUpcomingProjects = async (number_of_projects) => {
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
        WHERE p.date > CURRENT_DATE
        ORDER BY p.date
        LIMIT $1;
    `;

    try {
        const result = await db.query(query, [number_of_projects]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching upcoming projects:', error);
        throw error;
    }
};

export const getProjectDetails = async (id) => {
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
        WHERE p.project_id = $1;
    `;

    try {
        const result = await db.query(query, [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching project details:', error);
        throw error;
    }
};

export const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM projects
        WHERE organization_id = $1
        ORDER BY date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};
