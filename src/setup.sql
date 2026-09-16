-- organization table
create table organization (
organization_id serial primary key,
name varchar(150) not null,
description text not null,
contact_email varchar(255) not null,
logo_filename varchar(255) not null
)

-- organization seed data
insert into organization (name, description, contact_email, logo_filename) 
values
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


-- projects table
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_service_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

-- seed data for projects
INSERT INTO projects
    (organization_id, title, description, location, date)
VALUES
    -- BrightFuture Builders
    (1, 'Community Park Renovation',
     'Renovate playground equipment, benches, and walking areas in a local community park.',
     'Central Community Park',
     '2026-10-03'),

    (1, 'Neighborhood Housing Repair',
     'Help repair and improve homes for families in need of basic housing assistance.',
     'Oakwood Neighborhood',
     '2026-10-10'),

    (1, 'Community Center Painting',
     'Paint and refresh the interior and exterior of a neighborhood community center.',
     'Westside Community Center',
     '2026-10-17'),

    (1, 'Accessible Ramp Construction',
     'Construct accessibility ramps to improve access to community facilities.',
     'Riverside Community Hall',
     '2026-10-24'),

    (1, 'School Garden Construction',
     'Build raised garden beds and outdoor learning spaces at a local school.',
     'BrightFuture Elementary School',
     '2026-10-31'),

    -- GreenHarvest Growers
    (2, 'Community Vegetable Garden',
     'Create a shared vegetable garden where residents can grow fresh produce.',
     'Greenfield Neighborhood',
     '2026-10-04'),

    (2, 'Urban Farming Workshop',
     'Teach residents basic techniques for growing food in small urban spaces.',
     'GreenHarvest Learning Center',
     '2026-10-11'),

    (2, 'School Garden Project',
     'Develop a school garden to teach students about sustainable agriculture.',
     'Lincoln Elementary School',
     '2026-10-18'),

    (2, 'Community Composting Day',
     'Set up community composting stations and educate residents about composting.',
     'Downtown Community Garden',
     '2026-10-25'),

    (2, 'Harvest Donation Drive',
     'Collect fresh produce from local growers and distribute it to families in need.',
     'GreenHarvest Community Farm',
     '2026-11-01'),

    -- UnityServe Volunteers
    (3, 'Food Bank Volunteer Day',
     'Help sort, organize, and distribute donated food to local families.',
     'Unity Food Bank',
     '2026-10-05'),

    (3, 'Senior Center Assistance',
     'Assist staff and residents with activities and improvements at a local senior center.',
     'Riverside Senior Center',
     '2026-10-12'),

    (3, 'Neighborhood Cleanup',
     'Volunteers will collect litter and help beautify public areas in the neighborhood.',
     'Eastside Neighborhood',
     '2026-10-19'),

    (3, 'Charity Clothing Drive',
     'Collect, sort, and organize clothing donations for families and individuals in need.',
     'UnityServe Community Center',
     '2026-10-26'),

    (3, 'Holiday Charity Preparation',
     'Prepare donated supplies and care packages for distribution to local families.',
     'UnityServe Volunteer Center',
     '2026-11-02');

select * from projects;



-- categories table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- junction table ( for many to many relationship )
CREATE TABLE project_categories (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

-- seed data for category
INSERT INTO categories (name)
VALUES
    ('Community Development'),
    ('Environment'),
    ('Education'),
    ('Food & Agriculture'),
    ('Volunteer Support');


-- seed data for project_category
INSERT INTO project_categories (project_id, category_id)
VALUES
    -- BrightFuture Builders
    (1, 1),
    (2, 1),
    (3, 1),
    (4, 1),
    (5, 3),

    -- GreenHarvest Growers
    (6, 2),
    (7, 3),
    (8, 3),
    (9, 2),
    (10, 4),

    -- UnityServe Volunteers
    (11, 5),
    (12, 5),
    (13, 1),
    (14, 5),
    (15, 5);
INSERT INTO project_categories (project_id, category_id)
VALUES
    (5, 2);

