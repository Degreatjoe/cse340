import bcrypt from 'bcrypt';
import { authenticateUser, createUser, getAllUsers } from '../models/users.js';
import { getVolunteerProjects } from '../models/volunteer.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        await createUser(name.trim(), email.trim(), passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'Registration failed. Check your details or try another email.');
        res.redirect('/register');
    }
};

const showLoginForm = (req, res) => {
    if (req.query.loggedOut === '1') {
    req.flash('success', 'Logout successful!');
    }

    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email?.trim(), password);
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        req.session.user = user;
        req.flash('success', 'Login successful!');

        if (res.locals.NODE_ENV === 'development') {
            console.log('User logged in:', user);
        }

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

const requireLogin = (req, res, next) => {
    if (!req.session?.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }

    next();
};

const requireRole = (role, deniedRedirect = '/') => (req, res, next) => {
    if (!req.session?.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }

    if (req.session.user.role_name !== role) {
        req.flash('error', 'You do not have permission to access that page.');
        return res.redirect(deniedRedirect);
    }

    next();
};

const showDashboard = async (req, res) => {
    const { name, email } = req.session.user;
    const volunteerProjects = await getVolunteerProjects(req.session.user.user_id);
    res.render('dashboard', { title: 'Dashboard', name, email, volunteerProjects });
};

const showUsersPage = async (req, res) => {
    const users = await getAllUsers();
    res.render('users', { title: 'Registered Users', users });
};

const processLogout = (req, res, next) => {
    if (!req.session) {
        return res.redirect('/login?loggedOut=1');
    }

        req.flash('success', 'Logout successful!');
    req.session.destroy((error) => {
        if (error) {
            return next(error);
        }

        res.clearCookie('connect.sid');
        res.redirect('/login?loggedOut=1');
    });
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
};