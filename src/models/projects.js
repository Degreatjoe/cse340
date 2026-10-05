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

export const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO projects (title, description, location, date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

export const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `
        UPDATE projects
        SET title = $2,
            description = $3,
            location = $4,
            date = $5,
            organization_id = $6
        WHERE project_id = $1
        RETURNING project_id;
    `;

    const queryParams = [projectId, title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to update project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};
