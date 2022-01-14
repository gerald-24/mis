const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const sql = require('mssql')
const mysql = require('mysql')
const router = express.Router();




router.use(cors()) //Cross-Origin Resource Sharing (CORS)
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
// ========================== connection ==============================//
// ========================== mysql ==============================//
const knexmysql = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'mis',
        options: {
            "enableArithAbort": true
        }
    }
});

// ========================== your routes here ==============================//
router.get('/', (req, res) => {
    res.send('TYPE “C” OFFENSE C.22. Unauthorized possession or use of company materials, supplies, tools or equipment of another. ')
}),

    // ========================== User Details ==============================//
    router.get('/users', (req, res) => {
        knexmysql.select()
            .from("users")
            .where('deletedDate', null)
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/users/:uid', (req, res) => {
        knexmysql.select()
            .from("users")
            .where("uid", req.params.uid)
            .where('deletedDate', null)
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/users/log/:username', (req, res) => {
        knexmysql.select()
            .from("users")
            .where("userName", req.params.username)
            .where('deletedDate', null)
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.post('/users/insert', (req, res) => {
        let objData = req.body
        console.log(objData)
        knexmysql('users')
            .insert(objData)
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    router.post('/users/update', (req, res) => {
        let objData = req.body
        let date = new Date()
        knexmysql('users')
            .where('uid', objData.uid)
            .update({
                userName: objData.userName,
                password: objData.password,
                position: objData.position,
                isAdmin: objData.isAdmin,
                active: objData.active,
                updatedDate: date
            })
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    router.post('/users/delete', (req, res) => {
        let objData = req.body
        let date = new Date()
        knexmysql('users')
            .where('uid', objData.uid)
            .update({
                deletedDate: date
            })
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    //==================================================//
    router.get('/userdetails', (req, res) => {
        knexmysql.select()
            .from("userdetails")
            .where('deletedDate', null)
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/userdetails/:uid', (req, res) => {
        knexmysql.select()
            .from("userdetails")
            .where("uid", req.params.uid)
            .where('deletedDate', null)
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.post('/userdetails/insert', (req, res) => {
        let objData = req.body
        console.log(objData)
        knexmysql('userdetails')
            .insert(objData)
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    router.post('/userdetails/update', (req, res) => {
        let objData = req.body
        let date = new Date()
        knexmysql('userdetails')
            .where('uid', objData.uid)
            .update({
                name: objData.name,
                address: objData.address,
                bdate: objData.bdate,
                bplace: objData.bplace,
                gender: objData.gender,
                updatedDate: date
            })
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    router.post('/userdetails/delete', (req, res) => {
        let objData = req.body
        let date = new Date()
        knexmysql('userdetails')
            .where('uid', objData.uid)
            .update({
                deletedDate: date
            })
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    // =======================================================================//


    // ========================== Residents Details ==============================//
    router.get('/residents', (req, res) => {
        knexmysql.select()
            .from("residents")
            .where('deletedDate', null)
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/residents/:rid', (req, res) => {
        knexmysql.select()
            .from("residents")
            .where("rid", req.params.rid)
            .where('deletedDate', null)
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.post('/residents/insert', (req, res) => {
        let objData = req.body
        console.log(objData)
        knexmysql('residents')
            .insert(objData)
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    router.post('/residents/update', (req, res) => {
        let objData = req.body
        let date = new Date()
        knexmysql('residents')
            .where('rid', objData.rid)
            .update({
                fname: objData.fname,
                mname: objData.mname,
                lname: objData.lname,
                suffix: objData.suffix,
                address: objData.address,
                bdate: objData.bdate,
                bplace: objData.bplace,
                gender: objData.gender,
                email: objData.email,
                phone: objData.phone,
                mapaddress: objData.mapaddress,
                updatedDate: date
            })
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    router.post('/residents/delete', (req, res) => {
        let date = new Date()
        let objData = req.body
        knexmysql('residents')
            .where('rid', objData.rid)
            .update({
                deletedDate: date
            })
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    // =======================================================================//

    // ========================== Brgy Properties Details ==============================//
    router.get('/brgyproperties', (req, res) => {
        knexmysql.select()
            .from("brgyproperties")
            .where('disposedDate', null)
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/brgyproperties/:bpid', (req, res) => {
        knexmysql.select()
            .from("brgyproperties")
            .where("bpid", req.params.bpid)
            .where('disposedDate', null)
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.post('/brgyproperties/insert', (req, res) => {
        let objData = req.body
        console.log(objData)
        knexmysql('brgyproperties')
            .insert(objData)
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    router.post('/brgyproperties/update', (req, res) => {
        let objData = req.body
        let date = new Date()
        knexmysql('brgyproperties')
            .where('bpid', objData.bpid)
            .update({
                name: objData.name,
                description: objData.description,
                totalqty: objData.totalqty,
                updatedDate: date
            })
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    router.post('/brgyproperties/dispose', (req, res) => {
        let objData = req.body
        let date = new Date()
        knexmysql('brgyproperties')
            .where('bpid', objData.bpid)
            .update({
                disposedDate: date
            })
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    // =======================================================================//


    // ========================== log bp Details ==============================//
    router.get('/log_bp', (req, res) => {
        knexmysql.select()
            .from("log_bp")
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/log_bp/:logid', (req, res) => {
        knexmysql.select()
            .from("log_bp")
            .where("logid", req.params.logid)
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.post('/log_bp/insert', (req, res) => {
        let objData = req.body
        console.log(objData)
        knexmysql('log_bp')
            .insert(objData)
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    router.post('/log_bp/update', (req, res) => {
        let objData = req.body
        knexmysql('log_bp')
            .where('logid', objData.logid)
            .update({
                rid: objData.rid,
                bpid: objData.bpid,
                qty: objData.qty,
                borrowdt: objData.borrowdt,
                returndt: objData.returndt,
            })
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    router.post('/log_bp/return', (req, res) => {
        let objData = req.body
        let date = new Date()
        knexmysql('log_bp')
            .where('logid', objData.logid)
            .update({
                returndt: date
            })
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    // =======================================================================//

    // ========================== log reports Details ==============================//
    router.get('/log_reports', (req, res) => {
        knexmysql.select()
            .from("log_reports")
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.post('/log_reports/insert', (req, res) => {
        let objData = req.body
        console.log(objData)
        knexmysql('log_reports')
            .insert(objData)
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    // =======================================================================//

    // ========================== Daily Time Record ==============================//
    router.get('/dailytimerecord', (req, res) => {
        knexmysql.select()
            .from("dailytimerecord")
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.post('/dailytimerecord/insert', (req, res) => {
        let objData = req.body
        console.log(objData)
        knexmysql('dailytimerecord')
            .insert(objData)
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    // =======================================================================//

    // ========================== Services Record ==============================//
    router.get('/services', (req, res) => {
        knexmysql.select()
            .from("services")
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.post('/services/insert', (req, res) => {
        let objData = req.body
        console.log(objData)
        knexmysql('services')
            .insert(objData)
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    router.post('/services/update', (req, res) => {
        let objData = req.body
        knexmysql('services')
            .where('sid', objData.sid)
            .update({
                rid: objData.rid,
                type: objData.type,
                details: objData.details,
                datetime: objData.datetime,
            })
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    // =======================================================================//





    module.exports = router;
