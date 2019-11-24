const validateLength = function(fieldName, value, formFieldValid, fieldValidationErrors, fieldDescr )
{
formFieldValid[fieldName] =  value.length >= 5;
fieldValidationErrors[fieldName] = formFieldValid[fieldName] ? '' :
value.length  === 0 ?  fieldDescr+' is Mandatory':
fieldDescr+'  is too short';
}

const validateSelect = function(fieldName, value, formFieldValid, fieldValidationErrors, fieldDescr )
{
formFieldValid[fieldName] = value.length >= 1;
fieldValidationErrors[fieldName] = formFieldValid[fieldName] ? '' : fieldDescr+' is Mandatory';
}

const validateDate = function(fieldName, value, formFieldValid, fieldValidationErrors, fieldDescr )
{
formFieldValid[fieldName] =   value!== null ;
fieldValidationErrors[fieldName] = formFieldValid[fieldName] ? '' : fieldDescr+' is Mandatory';
}
const clean = function(obj)
{
  delete obj['errors'];
  delete obj['valid'];
  if (obj['value'] === null || obj['value'] === undefined 
    || obj['value'] === ''  ) {
    delete obj['value'];
  }
}
const cleanTop = function(obj)
{
this.clean(obj.time)
this.clean(obj.type)
this.clean(obj.act)
}

const getErrorMessage = function(error)
{
      console.log("error",error)
      let formResult = '';
      if(error.response)
      {
      formResult = error.response.data.error;
      }
      else
      {
      formResult = error.message;
      }
      return formResult
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

const getDate = function()
{
return new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate());
}


module.exports = {
    validateLength:validateLength,
    validateSelect: validateSelect,
    validateDate: validateDate,
    clean: clean,
    cleanTop: cleanTop,
    getErrorMessage: getErrorMessage,
    setHours: setHours,
    setMinutes: setMinutes,
    setSeconds:setSeconds ,
    getDate:getDate}
