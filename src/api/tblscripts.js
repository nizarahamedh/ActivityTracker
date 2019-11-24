var AWS = require("aws-sdk");
require('../config/awsconfig.js')
var tableEmp = "Activity";
var tableEmpId = "ActivitiyId";

const createActivitiy = () =>
{

    var dynamodb = new AWS.DynamoDB();

    var params = {
        TableName : tableEmp
        ,
        KeySchema: [       
            { AttributeName: "person", KeyType: "HASH"},
            { AttributeName: "activityDate", KeyType: "RANGE"}
        ],
        AttributeDefinitions: [       
            { AttributeName: "person", AttributeType: "S" },
            { AttributeName: "activityDate", AttributeType: "S" },
        ]
        ,
        ProvisionedThroughput: {       
            ReadCapacityUnits: 10, 
            WriteCapacityUnits: 10
        }
    }
    dynamodb.createTable(params, function(err, data) {
        if (err) {
            console.error("Unable to find table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Found table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
}
const createActivitiyId = () =>
{

    var dynamodb = new AWS.DynamoDB();

    var params = {
        TableName : tableEmpId
        ,
        KeySchema: [       
            { AttributeName: "Id", KeyType: "HASH"}
        ],
        AttributeDefinitions: [       
            { AttributeName: "Id", AttributeType: "N" }
        ]
        ,
        ProvisionedThroughput: {       
            ReadCapacityUnits: 10, 
            WriteCapacityUnits: 10
        }
    }
    dynamodb.createTable(params, function(err, data) {
        if (err) {
            console.error("Unable to find table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Found table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
}
createActivitiy();
//createActivitiyId();