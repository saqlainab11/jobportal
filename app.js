const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
app.use(express.json());


var url='';
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
     url = process.env.MONGOLAB_URI
}else {
    //get envoirnment variables from heroku if live 
    url= process.env.MONGOLAB_URI;
}




//connect to mongodb using mongoose
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        //connection successfull
        console.log("MongoDB Connected");
    })
    .catch(err => console.log(err))



var Schema = mongoose.Schema;

// create job schema
var JobSchema = new Schema({
    _id: Number,
    title: String, 
    company: String,
    shift: String,
    salary_range: String,
});


// create job model
var Job = mongoose.model('Jobs', JobSchema);


//READ Request Handlers
app.get('/', (req, res) => {
    // res.send('Welcome to JobPortal \n REST API with Node.js');
    res.send('<html>\n' +
'<head>\n' +
'\t<title></title>\n' +
'\t<style type="text/css">\n' +
'\t</style>\n' +
'</head>\n' +
'<body>\n' +
'<h2>JobPortal</h2>\n' +
'\n' +
'<p>This is the Rest Api for job portal. following are the available APIs:</p>\n' +
'<p>Base Url: https://evening-hamlet-98501.herokuapp.com/ </p>'+
'\n' +
'<table border="1" cellpadding="1" cellspacing="1" style="width:1000px;">\n' +
'\t<tbody>\n' +
'\t\t<tr>\n' +
'\t\t\t<td>Endpoint</td>\n' +
'\t\t\t<td>Method</td>\n' +
'\t\t\t<td>parameter</td>\n' +
'\t\t\t<td>description</td>\n' +
'\t\t</tr>\n' +
'\t\t<tr>\n' +
'\t\t\t<td>/api/jobs</td>\n' +
'\t\t\t<td>GET</td>\n' +
'\t\t\t<td>&nbsp;</td>\n' +
'\t\t\t<td>fetch all jobs</td>\n' +
'\t\t</tr>\n' +
'\t\t<tr>\n' +
'\t\t\t<td>/api/jobs/1</td>\n' +
'\t\t\t<td>GET</td>\n' +
'\t\t\t<td>ID</td>\n' +
'\t\t\t<td>fetch job with id number 1</td>\n' +
'\t\t</tr>\n' +
'\t\t<tr>\n' +
'\t\t\t<td>/api/jobs</td>\n' +
'\t\t\t<td>POST</td>\n' +
'\t\t\t<td>\n' +
'\t\t\t<p>title,company, shift, salary_range</p>\n' +
'\n' +
'\t\t\t<p>(raw json formate)</p>\n' +
'\t\t\t</td>\n' +
'\t\t\t<td>to add new job with fields</td>\n' +
'\t\t</tr>\n' +
'\t\t<tr>\n' +
'\t\t\t<td>/api/jobs/1</td>\n' +
'\t\t\t<td>PUT</td>\n' +
'\t\t\t<td>id</td>\n' +
'\t\t\t<td>update a job on the basis of id</td>\n' +
'\t\t</tr>\n' +
'\t\t<tr>\n' +
'\t\t\t<td>/api/jobs/1</td>\n' +
'\t\t\t<td>DELETE</td>\n' +
'\t\t\t<td>id</td>\n' +
'\t\t\t<td>delete job record on the basis of id</td>\n' +
'\t\t</tr>\n' +
'\t</tbody>\n' +
'</table>\n' +
'\n' +
'<p>&nbsp;</p>\n' +
'</body>\n' +
'</html>\n')
});

app.get('/api/jobs', (req, res) => {
    Job.find((err, document) => {
        if (err)  
            res.send({ statsu: false, error: err });
        res.send(document);
    })
});

app.get('/api/jobs/:id', (req, res) => {
    Job.find({ _id: req.params.id }, (err, document) => {
        if (err)  
            res.send({ statsu: false, error: err });
        res.send(document);
    })
});


//CREATE Request Handler
app.post('/api/jobs', (req, res) => {
    Job.find((err, document) => {
        if (err) {
            res.send({ statsu: false, error: err });
        } else {
            let nextId = 0;
            document.forEach(item => {
                if (item._id > nextId) {
                    nextId = item._id;
                }
            })

            const doc = new Job();
            doc._id = nextId + 1;
            doc.title = req.body.title;
            doc.company = req.body.company;
            doc.shift = req.body.shift;
            doc.salary_range = req.body.salary_range;

            doc.save((err, result) => {
                if (err) {
                    res.send({ statsu: false, error: err });
                }
                res.send(result);
            });
        }

    })
});


//UPDATE Request Handler
app.put('/api/jobs/:id', (req, res) => {
    let query = {
        _id: req.params.id
    };
    let fieldsToUpdate = {
        company: req.body.company,
        title: req.body.title,
        shift: req.body.shift,
        salary_range: req.body.salary_range
    }

    Job.updateOne(query, fieldsToUpdate, (err, result) => {
        if (err) {
            res.send({ statsu: false, error: err });
        } else {
            res.send({ status: true });
        }
    })


});



//DELETE Request Handler
app.delete('/api/jobs/:id', (req, res) => {

    let query = {
        _id: req.params.id
    }

    Job.deleteOne(query, (err, result) => {
        if (err) {
            res.send({ statsu: false, error: err });
        } else {
            res.send({ status: true });
        }

    })

});




//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));