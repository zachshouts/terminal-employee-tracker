USE employees;

INSERT INTO department(name)
VALUES 
    ('Paint'),
    ('Hardware'),
    ('Grocery'),
    ('Flooring');

INSERT INTO role(title, salary, department_id)
VALUES
    ('Paint Manager', 80000, 1),
    ('Mixer', 40000, 1),
    ('Hardware Manager', 100000, 2),
    ('Builder', 55000, 2),
    ('Grocery Manager', 70000, 3),
    ('Stocker', 30000, 3),
    ('Flooring Manager', 60000, 4),
    ('Installer', 55000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
    ('Lia', 'Ayers', 1, null),
    ('Tomas', 'Galvan', 2, 1),
    ('Dan', 'Gonzalez', 3, null),
    ('Taya', 'Moreno', 4, 3),
    ('Yasin', 'Sanders', 4, 3),
    ('Uzair', 'Franklin', 5, null),
    ('Phoenix', 'Morris', 6, 6),
    ('Pearl', 'Burton', 7, null),
    ('Issac', 'Johnson', 8, 8);
