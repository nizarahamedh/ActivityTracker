var AWS = require("aws-sdk");
require('../config/awsconfig.js')
var docClient = new AWS.DynamoDB.DocumentClient();
var table = "Activity";

// return addActivityImpl as Promise
const addActivity =   (body ) =>
{
    console.log("body",body)
     return new Promise((resolve, reject) => {
        addActivityImpl(body).then( result =>{
            console.log("result",result)
            resolve(result)
        }).catch( e =>{
            console.log("e",e)
            reject({error:e.message} )
        })
    })
}

// Add Activity function to do Validation, generation of Activity Id and insert Activity
//The function is async . All AWS DynamoDB methods are awaited to synchronize 
const  addActivityImpl =   async (body ) =>
{
    const matchFound = false //await checkActivity (body);
    //console.log("matchFound"+matchFound)
    if(matchFound)
        throw( new Error("Activity found with same Person and date")); 
    // const dataId =  await getActivityIds();
    // var id = 1;
    // if(dataId)
    // {
    //     id = dataId.MaxId+1;
    // }
    // await addActivityId(id);
    // body.ActivityNumber=id
    const data = await addActivityAws(body)
    const retData = {}// {ActivityNumber:id}
    return retData;
   
}

// Actual Activity Addition function to DynamoDB
const addActivityAws =   (body ) =>
{
     return new Promise((resolve, reject) => {        
        var params = {
            TableName:table,
            Item:{}          
        };
        params.Item = {...body}       
        //console.log("Adding a new item...", params.Item);    
        docClient.put(params,  function(err, data) {
            if(err)
                 reject(err); 
            resolve(data)
        });
    })
}

//  function to create/update ActivityId Maxid
const addActivityId=   (id ) =>
{
     return new Promise((resolve, reject) => {        
        var params = {
            TableName:'ActivityId',
            Item:{}          
        };
        params.Item = {Id:1,MaxId:id}       
        //console.log("Adding a new itemId...", params.Item);    
        docClient.put(params,  function(err, data) {
            if(err)
                 reject(err); 
            resolve(data)
        });
    })
}

//  function to retreive ActivityId Maxid
const getActivityIds =  () =>
{
    return new Promise((resolve, reject) => {     
        var params = {
            TableName:'ActivityId'   
        };
        //console.log("scanning Ids...");
        docClient.scan(params,  function(err, data) {
            //console.log("data from getActivityIds",data);
            if(err)
                return reject(err)
            resolve(data.Items[0])

        });
     })
}

//  function to check Activity with same firstName, surName, email and dateOfBirth
//This is not efficient way of checking the duplicate as it scans whole table
//This method is constructed to show some kind of data validation
const checkActivity = (body,id ) =>
{
    return new Promise((resolve, reject) => {     
        var params = {
            TableName:'Activity'   
        };
        //console.log("scanning Activitys...");
        docClient.scan(params,  function(err, data) {
            if(err)
            {
                //console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
                return reject(err)
            }
            else
            {
                var matchFound =  data.Items.some(function (Activity) { 
                    var check = false;
                    if(id)
                    {
                       
                        check =  id != Activity.ActivityNumber && Activity.firstName === body.firstName && employee.surName === body.surName 
                        && employee.email === body.email
                        && employee.dateOfBirth === body.dateOfBirth;
                    }
                    else
                    {
                        check =  employee.firstName === body.firstName && employee.surName === body.surName 
                        && employee.email === body.email
                        && employee.dateOfBirth === body.dateOfBirth; 
                    }
                    //console.log(" check for id",id , check )
                    return check;                   
                    });
                resolve(matchFound)
            }
        });
     })
}

//  function to getAllActivities
const getActivities = (body ) =>
{
    return new Promise((resolve, reject) => {           
        var params = {
            TableName:table   
        };
        //console.log("scanning item...");
        docClient.scan(params,  function(err, data) {
            if(err)
                return reject(err)
            resolve(data)
        });
    })
}

//  function to getSingleActivity
const getActivity = (id ,query) =>
{
    console.log(id, query)
    return new Promise((resolve, reject) => {
        // if(!isNumeric(id))           
        //     return reject('Numbers must be non-negative')
        var params = {
            TableName:table,
            Key: {
                "person": id,
                "activityDate": query.activityDate,
                }
        };
        docClient.get(params,  function(err, data) {
            if(err)
                return reject(err)
            resolve(data)

        }); 
    });
    
}

// return updateActivityImpl as Promise
const updateActivity =   (id,body ) =>
{
     return new Promise((resolve, reject) => {
        updateActivityImpl(id,body).then( result =>{
            //console.log("result",result)
            resolve(result)
        }).catch( e =>{
            reject({error:e.message} )
        })
    })
}

// Update Activity function to do Validation  and update employee
//The function is async . All AWS DynamoDB methods are awaited to synchronize 
const  updateActivityImpl =   async (id, body ) =>
{
    // if(!isNumeric(id))
    //      throw( new Error('Not a Valid Input For API'));          
    // if(body.firstName === undefined || body.surName === undefined|| body.dateOfBirth  === undefined 
    //     || body.email === undefined || body.gender === undefined)           
    //     throw( new Error('All Attributes need to be updated'));         
    // if(!body.FirstName && !body.SurName && !body.email && !body.dateOfBirth && !body.Gender)
    //     throw( new Error('No Data to Update'));
    // const itemData = await getActivity (id);
    // if(!itemData.Item)
    //     throw( new Error("Activity Details not found for update. Refresh Activity Details")); 
    // const matchFound = await checkActivity (body,id);
    // //console.log("matchFound"+matchFound)
    // if(matchFound)
    //     throw( new Error("Activity found with same First Name, SurName, Email ID and DateOfBirth")); 
    // await updateActivityAws(id,body);
     addActivityAws(body)
}

// Actual Activity Updation function to DynamoDB
const updateActivityAws = (id,body ) =>
{
    return new Promise((resolve, reject) => {
        var params = {
            TableName:table,
            Key: {
                "ActivityNumber": parseInt(id, 10)
                },
            AttributeUpdates: {  
                'firstName': {Value :body.firstName},
                'surName': {Value :body.surName},
                'dateOfBirth': {Value : body.dateOfBirth},
                'email': {Value : body.email},
                'gender': {Value :body.gender}
            }
        }

        params.Item = {...body}
        //console.log("Updating the item...");       
        docClient.update(params,  function(err, data) {
            if(err)
                return reject(err)
            resolve(data)
        });
    });
}



// return deleteActivityImpl as Promise
const deleteActivity =   (id ) =>
{
     return new Promise((resolve, reject) => {
        deleteActivityImpl(id).then( result =>{
            //console.log("result",result)
            resolve(result)
        }).catch( e =>{            
            reject({error:e.message} )
        })
    })
}

// Delete Activity function to do Validation  and update Activity
//The function is async . All AWS DynamoDB methods are awaited to synchronize 
const  deleteActivityImpl =   async (id, ) =>
{
    if(!isNumeric(id))
        throw( new Error("Not a Valid Input For API")); 
    const itemData = await getActivity (id);
    //console.log("item"+itemData.Item)
    if(!itemData.Item)
        throw( new Error("Activity Details not found for Delete. Refresh Activity Details")); 
     await deleteActivityAws(id);
}

// Actual Activity Deletion function to DynamoDB
const deleteActivityAws = (id ) =>
{
    return new Promise((resolve, reject) => {
  
        var params = {
            TableName:table,
            Key: {
                "ActivityNumber": parseInt(id, 10)
                }
        };
        //console.log("Deleting item...");      
        docClient.delete(params,  function(err, data) {
            if(err)
                return reject(err)
            resolve(data)
        });
    });
}


function isNumeric(n) 
{
    return !isNaN(parseFloat(n)) && isFinite(n);
}


module.exports = {
    addActivity: addActivity,
    getActivities: getActivities,
    getActivity:getActivity,
    updateActivity:updateActivity,
    deleteActivity:deleteActivity
}

