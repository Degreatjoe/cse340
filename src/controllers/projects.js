// Import any needed model functions
import { getAllProjects, getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';


const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const title = "Upcoming Service Projects";

    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

        const formattedProjects = projects.map(project => ({
            ...project,
            date: project.date
                ? new Date(project.date).toLocaleDateString()
                : 'TBD'
        }));

        res.render('projects', { title, projects: formattedProjects });
    } catch (error) {
        console.error('Error loading projects:', error);
        res.status(500).send('Unable to load projects');
    }
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const [project, categories] = await Promise.all([
        getProjectDetails(projectId),
        getCategoriesByProjectId(projectId)
    ]);
    const title = 'Project Details';

    res.render('project', { title, project, categories });
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };