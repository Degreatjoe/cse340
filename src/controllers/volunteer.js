import {
    addVolunteer as addVolunteerSignup,
    removeVolunteer as removeVolunteerSignup
} from '../models/volunteer.js';
import { getProjectDetails } from '../models/projects.js';

const getValidProjectId = (value) => {
    const projectId = Number(value);
    return Number.isInteger(projectId) && projectId > 0 ? projectId : null;
};

const processVolunteerSignup = async (req, res, next) => {
    const projectId = getValidProjectId(req.params.id);
    if (!projectId) {
        return res.status(400).send('Invalid project ID');
    }

    try {
        const project = await getProjectDetails(projectId);
        if (!project) {
            return res.status(404).send('Project not found');
        }

        await addVolunteerSignup(req.session.user.user_id, projectId);
        req.flash('success', 'You are now volunteering for this project.');
        return res.redirect(`/project/${projectId}`);
    } catch (error) {
        return next(error);
    }
};

const processVolunteerRemoval = async (req, res, next) => {
    const projectId = getValidProjectId(req.params.id);
    if (!projectId) {
        return res.status(400).send('Invalid project ID');
    }

    try {
        const project = await getProjectDetails(projectId);
        if (!project) {
            return res.status(404).send('Project not found');
        }

        await removeVolunteerSignup(req.session.user.user_id, projectId);
        req.flash('success', 'You are no longer volunteering for this project.');

        if (req.body.returnTo === 'dashboard') {
            return res.redirect('/dashboard');
        }

        return res.redirect(`/project/${projectId}`);
    } catch (error) {
        return next(error);
    }
};

export { processVolunteerSignup, processVolunteerRemoval };
