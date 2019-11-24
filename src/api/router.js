const express = require('express')
const router = new express.Router()
const activity = require('./awsactivity')  


router.post('/activities',  (req, res) =>
{
    activity.addActivity(req.body ).then((data) => {
        res.send(data);
    }).catch((error) => {
        res.status(400).send(error);
    })
})

// router.get('/activities',  (req, res) =>
// {
//     activity.getActivities(req.body ).then((data) => {
//         console.log(data)
//         res.send(data);
//     }).catch((error) => {
//         console.log(error)
//         res.status(400).send(error);
//     })
// })

router.get('/activities/:id',  (req, res) =>
{
    const _id = req.params.id; 

    console.log('req.params',req.params)  
    console.log('req.body',req.body)  
    console.log('_id',_id)
    console.log('req.query',req.query)  
    activity.getActivity(_id ,req.query).then((data) => {
        console.log('data',data)      
        res.send(data);
    }).catch((error) => {
        console.log('error',error)
        res.status(400).send(error);
    })
})

router.patch('/activities/:id',  (req, res) =>
{
    const _id = req.params.id;  
    activity.updateActivity(_id,req.body ).then((data) => {
        res.send(data);
    }).catch((error) => {
        //console.log("error ",error) 
        res.status(400).send(error);
    })
})


router.delete('/activities/:id',  (req, res) =>
{    
    const _id = req.params.id;  
    activity.deleteActivity(_id ).then((data) => {
        res.send(data);
    }).catch((error) => {
        res.status(400).send(error);
    })
})

module.exports = router 