const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

var url='';
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
    dotenv.config();
     url = process.env.MONGOLAB_URI
}else {
    url= process.env.MONGOLAB_URI;
}

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch(err => console.log(err))



var Schema = mongoose.Schema;

var JobSchema = new Schema({
    _id: Number,
    title: String, 
    company: String,
    shift: String,
    salary_range: String,
});



var Job = mongoose.model('Jobs', JobSchema);


//READ Request Handlers
app.get('/', (req, res) => {
    res.send('Welcome to JobPortal REST API with Node.js');
});

app.get('/api/jobs', (req, res) => {
    Job.find((err, document) => {
        if (err) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>');
        res.send(document);
    })
});

app.get('/api/jobs/:id', (req, res) => {
    Job.find({ _id: req.params.id }, (err, document) => {
        if (err) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>');
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