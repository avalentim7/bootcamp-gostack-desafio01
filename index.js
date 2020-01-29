const express = require('express');
const server = express();

server.use(express.json());

const projects = [];

function logRequests(req, res, next) {
    console.count('Request count');

    return next();
}

server.use(logRequests)

function checkExistingProject(req, res, next) {
    const { id } = req.params;
    const project = projects.find(x => x.id == id);
    if (!project)
        return res.status(400).json('Project not found');

    return next();
}

server.get('/projects', (req, res) => {
    return res.json(projects);
})

server.post('/projects', (req, res) => {
    const { id, title } = req.body;
    const project = { id, title, tasks: [] }
    projects.push(project);

    return res.json(project);
})

server.put('/projects/:id', checkExistingProject, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    
    const project = projects.find(x => x.id === id);

    project.title = title;

    return res.json(projects);
})

server.delete('/projects/:id', checkExistingProject, (req, res) => {
    const { id } = req.params;
    projects.splice(projects.findIndex(x => x.id === id), 1);

    return res.send();
})

server.post('/projects/:id/tasks', checkExistingProject, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    
    const project = projects.find(x=> x.id === id);
    
    project.tasks.push(title);
    
    return res.json(project);
})
 
server.listen(3333);