// Import any needed model functions
import { body, validationResult } from 'express-validator';
import { getAllOrganizations, 
        getOrganizationDetails, 
    createOrganization,
    updateOrganization
    } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

const organizationValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Organization name is required.')
        .bail()
        .isLength({ min: 2, max: 150 }).withMessage('Organization name must be between 2 and 150 characters.'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.')
        .bail()
        .isLength({ max: 500 }).withMessage('Description must be 500 characters or fewer.'),
    body('contactEmail')
        .trim()
        .notEmpty().withMessage('Contact email is required.')
        .bail()
        .isEmail().withMessage('Enter a valid contact email address.')
];

// Define any controller functions
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};


const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organization', {title, organizationDetails, projects});
};

const showEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const title = 'Edit Organization';

    res.render('edit-organization', { title, organizationDetails });
};

const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
}

const processNewOrganizationForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(({ msg }) => req.flash('error', msg));
        return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations    

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
    
    // Set a success flash message
    req.flash('success', 'Organization added successfully!');
    
    res.redirect(`/organization/${organizationId}`);
};

const processEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(({ msg }) => req.flash('error', msg));
        return res.redirect(`/edit-organization/${organizationId}`);
    }

    const { name, description, contactEmail, logoFilename } = req.body;
    await updateOrganization(organizationId, name, description, contactEmail, logoFilename);

    req.flash('success', 'Organization updated successfully!');
    res.redirect(`/organization/${organizationId}`);
};

// Export any controller functions
export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showEditOrganizationForm,
    showNewOrganizationForm,
    processNewOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
};