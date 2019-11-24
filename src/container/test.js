 function getActivityTimeObj() {

  console.log('getActivityTimeObj')
  let strTime = 14;
  let strMin = '00';
  let strMinVal = 0
  var data = [];
  for(var i=0; i<3; i++)  {
    data[i] = {};              // creates a new object
    var time = {}
    time.id = 'time'+strTime+strMin;
    time.name = 'time'+strTime+strMin;  
    time.value = setHours(setMinutes(setSeconds(new Date(),0),strMinVal),strTime);
    var type = {}
    type.id = 'type'+strTime+strMin;
    type.name = 'type'+strTime+strMin;  
    type.errors = '';
   // if(i===0)
    type.valid = false;
    
    var act = {}
    act.id = 'act'+strTime+strMin;
    act.name = 'act'+strTime+strMin;  
    act.errors = '';
    act.value = '';
    act.valid = true;
    data[i].time  = time;
    data[i].type  = type;
    data[i].act  = act;

    if(strMin === '00') 
    {
      strMin = '30'
      strMinVal = 30
    }
    else if(strMin === '30')  
    {
      strTime++;
      strMin = '00'
      strMinVal = 0
    }      
      
  }
  //console.log('data'+data)
  return data;
}

const setHours = function(dt,hour)  {
    return new Date(dt.setHours(hour));      
  }

const setMinutes = function(dt,minutes)  {
    return new Date(dt.setMinutes(minutes));      
  }

const setSeconds = function(dt,seconds)  {
    return new Date(dt.setSeconds(seconds));      
  }
console.log('test')
console.log(JSON.stringify(getActivityTimeObj()));

const actTimes = getActivityTimeObj();

const check  = (actTime) => 
{
    // let check = true;
    // if( actTime.type.valid === false || actTime.act.valid === false)
    // {
    //     check = false;
    // }
    // console.log('check'+check)
    return actTime.type.valid === false || actTime.act.valid === false;
}

let resultt = actTimes.some( check);

// if(resultt === undefined)
// {
//     resultt = true;
// }
console.log('resultt'+!resultt)
let field = ''
if(undefined && field)
    console.log('check')