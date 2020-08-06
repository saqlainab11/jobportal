const express = require('express');
const Joi = require('joi'); //used for validation
const app = express();
app.use(express.json());


const jobs = [
    { title: 'Node Js Developers', id: 1 },
    { title: 'MERN Stack Developer', id: 2 },
    { title: 'FULL Stack Developer', id: 3 }
]

//READ Request Handlers
app.get('/', (req, res) => {
    res.send('Welcome to JobPortal REST API with Node.js');
});

app.get('/api/jobs', (req, res) => {
    res.send(jobs);
});

app.get('/api/jobs/:id', (req, res) => {
    const job = jobs.find(c => c.id === parseInt(req.params.id));

    if (!job) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>');
    res.send(job);
});


//CREATE Request Handler
app.post('/api/jobs', (req, res) => {
    const job = {
        id: jobs.length + 1,
        title: req.body.title
    };
    jobs.push(job);
    res.send(job);
});


//UPDATE Request Handler
app.put('/api/jobs/:id', (req, res) => {
    const job = jobs.find(c => c.id === parseInt(req.params.id));
    if (!job) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Not Found!! </h2>');


    // console.log(req.body)
    // console.log(jobs)
    job.title = req.body.title;
    res.send(job);
});



//DELETE Request Handler
app.delete('/api/jobs/:id', (req, res) => {

    const job = jobs.find(c => c.id === parseInt(req.params.id));
    if (!job) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;"> Not Found!! </h2>');

    const index = jobs.indexOf(job);
    jobs.splice(index, 1);

    res.send(job);
});




//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));