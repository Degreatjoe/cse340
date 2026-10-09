// Import any needed model functions
import { body, validationResult } from 'express-validator';
import {
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
} from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { isVolunteer } from '../models/volunteer.js';


const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Project title is required.')
        .bail()
        .isLength({ min: 3, max: 150 }).withMessage('Project title must be between 3 and 150 characters.'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.')
        .bail()
        .isLength({ max: 999 }).withMessage('Description must be fewer than 1000 characters.'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required.')
        .bail()
        .isLength({ max: 200 }).withMessage('Location must be 200 characters or fewer.'),
    body('date')
        .notEmpty().withMessage('Project date is required.')
        .bail()
        .isISO8601({ strict: true, strictSeparator: true }).withMessage('Enter a valid project date.'),
    body('organizationId')
        .notEmpty().withMessage('Select an organization.')
        .bail()
        .isInt({ min: 1 }).withMessage('Select a valid organization.')
        .toInt()
];

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
    const userId = req.session?.user?.user_id;
    const [project, categories, volunteering] = await Promise.all([
        getProjectDetails(projectId),
        getCategoriesByProjectId(projectId),
        userId ? isVolunteer(userId, projectId) : false
    ]);
    const title = 'Project Details';

    res.render('project', { title, project, categories, isVolunteer: volunteering });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
};

const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(({ msg }) => req.flash('error', msg));
        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        await createProject(title, description, location, date, organizationId);
        req.flash('success', 'New service project created successfully!');
        res.redirect('/projects');
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const [project, organizations] = await Promise.all([
        getProjectDetails(projectId),
        getAllOrganizations()
    ]);
    const projectDate = project.date instanceof Date
        ? project.date.toISOString().slice(0, 10)
        : String(project.date).slice(0, 10);
    const title = 'Edit Service Project';

    res.render('edit-project', { title, project, projectDate, organizations });
};

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(({ msg }) => req.flash('error', msg));
        return res.redirect(`/edit-project/${projectId}`);
    }

    const { title, description, location, date, organizationId } = req.body;
    await updateProject(projectId, title, description, location, date, organizationId);

    req.flash('success', 'Service project updated successfully!');
    res.redirect(`/project/${projectId}`);
};

// Export any controller functions
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
};