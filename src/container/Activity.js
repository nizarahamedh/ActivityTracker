import React, { Component } from 'react'; 
import { Form, FormGroup,FormFeedback, Label, Input ,Button,Col} from 'reactstrap';
import '../index.css';
import axios from '../axios-dynamo';
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";
//  import 'bootstrap/dist/css/bootstrap.min.css';
import {header,button,fieldDesc} from './constants';
// import ActivityTime from './ActivityTime';
import queryString from 'query-string'

import util from './util';

class Activity extends Component {

  constructor(props) {
    super(props);

    this.state = {
      action:'',
      readForm:false,
      readOnlyField:false,
      hidPerson:'',
      formRead: { person: '',  activityDate:util.getDate()},
      formErrorsRead: { person: '' ,activityDate:''},  
      formReadValid: { person: false ,activityDate:false},   
      formField: { person: '', dayDesc: '', activityDate:util.getDate(),momRemark:'',reminders:''},
      formErrors: { person: '', dayDesc: '',activityDate:'',momRemark:'',reminders:''},
      formFieldValid : { person: true, dayDesc: false,activityDate:true,momRemark:false,reminders:false},
      activityTimes:  this.getActivityTimeObj(),
      formValid: false,
      frValid: false,
      formResult:''
    };
  }



  getActivityTimeObj()
  {
    console.log('getActivityTimeObj')
    let strTime = 14;
    let strMin = '00';
    let strMinVal = 0
    var data = [];
    for(var i=0; i<17; i++)  {
      data[i] = {};              // creates a new object
      var time = {}
      time.id = 'time'+strTime+strMin;
      time.name = 'time'+strTime+strMin;  
      time.value = util.setHours(util.setMinutes(util.setSeconds(new Date(),0),strMinVal),strTime);
      var type = {}
      type.id = 'type'+strTime+strMin;
      type.name = 'type'+strTime+strMin;  
      type.errors = '';
      type.valid = true;
      type.value = '';
      
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
    //console.log(data)
    return data;
  }

  componentDidMount () {       
    this.loadData();
    //this.getActivityTimeObj();
    console.log("componentDidMount ", this.state)
  }

  componentDidUpdate () {
    this.loadData();
    console.log("componentDidUpdate ", this.state)
  }  

  loadData () {
    const values = queryString.parse(this.props.location.search)
    const action = values.action;
    let {readForm,readOnlyField} = false;
    //console.log(action)
    if('create' !== action)
    {
        readForm = true;
    }
    if('read' === action || 'delete' === action)
    {
        readOnlyField = true;
    }

    // to avoid infinite loop
    if(action)
    {
      if(!this.state.action || this.state.action !== action)
      {
        this.defaultAllStateValues();
        this.setState({action,readForm,readOnlyField})
      }
    }
} 

//state mangement functions
//default All State other than Action
defaultAllStateValues()    {
  this.setState(
    {        
      readForm:false,
      readOnlyField:false,
      hidPerson:'',
      formRead: { person: '',  activityDate:util.getDate()},
      formErrorsRead: { person: '' ,activityDate:''},  
      formReadValid: { person: false ,activityDate:false},   
      formField: { person: '', dayDesc: '', activityDate:util.getDate(),momRemark:'',reminders:''},
      formErrors: { person: '', dayDesc: '',activityDate:'',momRemark:'',reminders:''},
      formFieldValid : { person: true, dayDesc: false,activityDate:true,momRemark:false,reminders:false},
      activityTimes:  this.getActivityTimeObj(),
      formValid: false,
      frValid: false,
      formResult:''
    })
}

//defaulting formField State Values
defaultFormFieldStates()    {
  this.setState({hidPerson:'',//employeeId:'', 
  formField: { person: '', dayDesc: '', activityDate:util.getDate(),momRemark:'',reminders:''},
  formErrors: { person: '', dayDesc: '',activityDate:'',momRemark:'',reminders:''},
  formFieldValid : { person: true, dayDesc: false,activityDate:true,momRemark:false,reminders:false},
  activityTimes:  this.getActivityTimeObj()})
}

//utility function
checkPersonInput(value)
{ 
  let isValid= true;
  let msg = '';
  let formErrorsRead = {...this.state.formErrorsRead};
  let formReadValid = {...this.state.formReadValid};
  if(!value)
  {      
    msg =  'Select the Person to check the Habit';
    isValid = false 
  }      
  formReadValid.person = isValid;
  formErrorsRead.person = msg;
  this.setState( { formErrorsRead } );
  this.setState( { formReadValid } );
  return isValid;
}

handleReadInput(e) {
  console.log('handleReadInput',e.target.name)
  const name = e.target.name;
  const value = e.target.value;
  let formRead = {...this.state.formRead};
  formRead[name] = value;
  this.setState({formRead }
      // ,
      // () => { this.validateField(name, value) }
      );
 
  this.setState( { frValid: false } );
  this.setState( { formResult: '' } );
}

handleUserInput(e) {
  console.log('handleUserInput',e.target.name)
  const name = e.target.name;
  const value = e.target.value;
  let formField = {...this.state.formField};
  formField[name] = value;
  this.setState({formField },
      () => { this.validateField(name, value) }
      );
  
  this.setState( { frValid: false } );
  this.setState( { formResult: '' } );
}
  //utility function to call validation of all form field to be called in submit
validateNonCheckedFields = () => {
  this.validateField('person', this.state.formField.person)
  this.validateField('dayDesc', this.state.formField.dayDesc)
  this.validateField('activityDate', this.state.formField.activityDate)
  this.validateField('momRemark', this.state.formField.momRemark)
  this.validateField('reminders', this.state.formField.reminders)
}

validateField(fieldName, value) {
  let fieldValidationErrors = this.state.formErrors;
  let formFieldValid = this.state.formFieldValid;
  console.log("validationfiled ", fieldName,value)
  switch (fieldName) {
      case 'dayDesc':
      case 'momRemark':
          // console.log("validationfiled ", fieldName,value)
          util.validateLength(fieldName, value, formFieldValid, fieldValidationErrors ,  fieldDesc[fieldName])
          break;      
      case 'person':
      case 'reminders':
          util.validateSelect(fieldName, value, formFieldValid, fieldValidationErrors ,  fieldDesc[fieldName])
          break;   
        
      case 'activityDate':
          console.log("activityDate ", fieldName, value!== null)
          util.validateDate(fieldName, value, formFieldValid, fieldValidationErrors , fieldDesc[fieldName])
          break;    
     
      default:
          break;
      
  }   

  
  //console.log("fieldValidationErrors ", fieldValidationErrors)
  this.setState({
      formErrors: fieldValidationErrors,
      formFieldValid: formFieldValid}, this.validateForm);
 }

  async handleUserActInput(e,index,type) {
  console.log('handleUserActInput',e.target.name,index,type)
  let name = e.target.name
  const value = e.target.value;
  let formField = [...this.state.activityTimes];
  console.log(formField)
  let formFieldObj = {...formField[index]};
  console.log(formFieldObj)
  formFieldObj[type].value = value
  //formField[index]=formFieldObj;
  console.log(formField)
  this.setState({activityTimes:formField }
      // ,
      // () => { this.validateActField(name, value,index,type) }
      );
      if( name.includes('act') )
      {
        let formTypeObjj = {...formFieldObj['type']}
        console.log('formTypeObjj', formTypeObjj)
        let typeVal = formTypeObjj.value;
        let typeField = 'type'+name.substring(3)
        console.log('typeVal', typeVal)
        console.log('typeField', typeField)
       
        await this.validateActField(typeField, typeVal,  value, index,'type')
        await this.validateActField(name, value, value, index,type)
      }
      if( name.includes('type') )
      {
        let formTypeObjj = {...formFieldObj['act']}
        let actVal = formTypeObjj.value;
        this.validateActField(name, value,actVal, index,type)
      }
    

  this.setState( { frValid: false } );
  this.setState( { formResult: '' } );
  console.log(this.state)
}

 validateActField(fieldName, value,actValue, index,type) {
  console.log("validateActField ", fieldName,value,actValue, index,type)
  let formField = [...this.state.activityTimes];
  console.log(formField)
  let formFieldObjIdx = {...formField[index]};
  let formFieldObj = {...formFieldObjIdx[type]}
  console.log("validationfiled  formFieldObjIdx", formFieldObjIdx)
  console.log("validationfiled  formFieldObj", formFieldObj)

  // let fieldValidationErrors = formFieldObj.errors;
  // let formFieldValid = formFieldObj.valid;

  let fieldValidationErrors = '';
  let formFieldValid = true;
 

  
  if( fieldName.includes('act') )
  {
    formFieldValid =  value.length === 0 || value.length >= 5;
    fieldValidationErrors = formFieldValid ? '' :
    'Activity  is too short';
   
  }
  if( fieldName.includes('type') )
  {
    console.log(actValue.length, !value )
    if(actValue.length >= 1 && !value)
        formFieldValid = false;
          //formFieldValid = value.length >= 1;
    fieldValidationErrors = formFieldValid ? '' : 'Type is Mandatory when entering Activity';
  }
  console.log("formFieldValid ", formFieldValid)
  formFieldObj.errors = fieldValidationErrors;
  formFieldObj.valid = formFieldValid;
  formFieldObjIdx[type]=formFieldObj
  formField[index]=formFieldObjIdx;
  console.log("formFieldObj ", formFieldObj)
  console.log("formFieldObjIdx ", formFieldObjIdx)
  console.log("formField ", formField)

  console.log(" this.setState ({activityTimes:formField}  ")
  this.setState({activityTimes:formField});
  this.validateForm();
 }

 checkType(fieldName,index)
 {
    let typeField = 'type'+fieldName.substring(3)
    let obj = this.state.activityTimes[index].type
    let typeValue = obj[typeField].value ;
    console.log('typeValue'+typeValue)
    this.validateActField(typeField, typeValue) 
 }

 validateForm() {
  let formValid = this.state.formFieldValid.person &&  this.state.formFieldValid.activityDate && this.state.formFieldValid.dayDesc
  && this.state.formFieldValid.momRemark && this.state.formFieldValid.reminders;
  let formActValid = this.validateFormAct()
  console.log('formValid'+formValid)
  console.log('formActValid'+formActValid)
  formValid = formValid && formActValid;
  this.setState({ formValid});
}
foundInvalid  = (actTime) => 
{
    // console.log('actTime.type.valid'+actTime.type.valid)
    // console.log('actTime.act.valid'+actTime.act.valid)
    return actTime.type.valid === false || actTime.act.valid === false;
}

validateFormAct() {
  let activityTimes = [...this.state.activityTimes];
  // console.log('activityTimes'+JSON.stringify(activityTimes))
  // console.log('activityTimes'+activityTimes.length)
  let  activityTimesValid = !activityTimes.some(this.foundInvalid)
  return activityTimesValid;
}


  //validate date and set state
  handleDateRead =  activityDate => {
    let formRead = {...this.state.formRead}
    formRead.activityDate = activityDate;
    this.setState({formRead})
    this.setState({
      formRead} //,  this.validateField('activityDate', activityDate)
      );
    this.setState( { frValid: false } );
    this.setState( { formResult: '' } );
   }

  handleDate =  activityDate => {
    let formField = {...this.state.formField}
    formField.activityDate = activityDate;
    this.setState({formField})
    this.setState({
      formField} ,  this.validateField('activityDate', activityDate)
      );
    this.setState( { frValid: false } );
    this.setState( { formResult: '' } );
   }

  

  copyActivityTimes()
  {
    let activityTimes = [...this.state.activityTimes]
    let actTimes = []
    activityTimes.forEach( 
      (activityTime) => {
        let activityTimeObj = {...activityTime}
        util.cleanTop(activityTimeObj);
        actTimes.push(activityTimeObj)

      }
    )
    return actTimes
  }

  formHandler = async ( event ) => {
    event.preventDefault();
    this.setState( { loading: true } );
    const formRead = this.state.formRead;
    const person = formRead.person;
    const activityDate = formRead.activityDate;
    this.defaultFormFieldStates();
    if(!this.checkPersonInput(person))
    {
      return;
    }
    // if(!this.checkEmployeeIdInput(this.state.employeeId))
    // {
    //   this.defaultFormFieldStates();
    //   this.setState({employeeId:employeeId});
    //   return;
    // }
    const readData = { ...this.state.formRead};
    console.log(person)
    console.log(readData)

    let paramData = {};
    paramData.params = {activityDate}
   // activityData.activityTimes =  this.copyActivityTimes();
    axios.get( '/activities/'+ person ,{params:{activityDate}})
    .then( response => {
        this.setState( { loading: false } );
        //console.log("response",response)
        const item = response.data.Item;
        if(!item)
        {
            this.defaultFormFieldStates();
            this.setState( { frValid: true } );
            this.setState( { formResult: 'Person is not valid' } );
           // this.setState({employeeId:employeeId});
            return;
        }
        let formField = {...item}
        let activityTimes =  [...item.activityTimes]

        activityTimes.map(activityTimeInd =>  {
          let activityTime =  {...activityTimeInd}
          let time = activityTime.time;
          time.value = new Date(time.value)
          let act = activityTime.act;
          if(!act.value )
            act.value = '';
          let type = activityTime.type;
          if(!type.value )
           type.value = '';
          // activityTime.time = time;
          // activityTime.act = act;
          return {...activityTime}
        });
        // console.log(result);
        console.log('formField'+formField.activityTimes)
        console.log('formField'+formField.activityTimes[1].type.value)
        console.log('formField'+formField.activityTimes[1].act.value)
        console.log('item'+item)
        console.log('formField'+JSON.stringify(formField))
        formField.activityDate = new Date(item.activityDate)
      //  this.setState({hidPerson:employeeId, formField})

        //this.handleGenderState(item.gender)     
        this.setState({ formField,hidPerson:person})
        this.setState({ activityTimes})
        this.setState( { frValid: false,formResult:'' } );   
        this.setState({formValid:true})
    } )
    .catch( error => {
          console.log("error",error)
        this.setState( { loading: false } );
        this.setState( { frValid: true } );
        this.setState( { formResult: error.message } );
    } );
  }  

   //handling form Field validation  state and API Calls for CREATE,POST,DELETE
   submitHandler = async ( event ) => {
    event.preventDefault();
    this.setState( { loading: true } );
    console.log('this.state.submitHandler'+this.state.formValid)
    const personRead = this.state.formRead.person;
    //check if the data exists for update and delete
    if('update' === this.state.action || 'delete' === this.state.action)
    {
      if( !personRead || (personRead !== this.state.hidPerson) )
      {
              this.setState( { frValid: true } );
              this.setState( { formResult: ' Please retrieve Habit Details before Action ' } );
              return;
      }  
    } 

    //validate all fields for create and update
    if('create' === this.state.action || 'update' === this.state.action)
    {
    
      await this.validateNonCheckedFields();
    }
    console.log('this.state.formValid'+this.state.formValid)
    if(!this.state.formValid)
    {
      this.setState( { frValid: true } );
      this.setState( { formResult: 'Please Fix the Data Entry Errors' } );
      return;
    }
    const activityData = { ...this.state.formField};
    activityData.activityTimes =  this.copyActivityTimes();
    if('create' ===this.state.action)
    {
        axios.post( '/activities', activityData )
        .then( response => {
            this.setState( { loading: false } );
            //console.log("response",response)
            this.setState( { frValid: true } );
            this.setState( { formResult: 'Activity Succesfully Created ' } );
        } )
        .catch( error => {
            let formResult = util.getErrorMessage(error);
            this.setState( { loading: false } );
            this.setState( { frValid: true } );
            this.setState( { formResult: formResult } );
        } );
    }
    else  if('update' ===this.state.action)
    {
        axios.patch( '/activities/'+ personRead , activityData )
            .then( response => {
                this.setState( { loading: false } );
                //console.log("response",response)  
                this.setState( { frValid: true } );
                this.setState( { formResult: 'Habit of  ' +personRead + ' Succesfully Updated'} );
        } )
        .catch( error => {
            let formResult = util.getErrorMessage(error);
            this.setState( { loading: false } );
            this.setState( { frValid: true } );
            this.setState( { formResult: formResult} );
        } );
    }
    else  if('delete' ===this.state.action)
    {
        axios.delete( '/activities/'+ personRead )
            .then( response => {
                this.setState( { loading: false } );
                //console.log("response",response)                
                this.setState( { frValid: true } );
                this.setState( { formResult: 'Habit of  ' +personRead + ' Succesfully Deleted'} );
        } )
        .catch( error => {
            console.log("error",error)
            let formResult = util.getErrorMessage(error);
            this.setState( { loading: false } );
            this.setState( { frValid: true } );
            this.setState( { formResult: formResult} );
        } );
    }
}  

//utility function to customize error


  render()   {
    let actionForm = '';
    let buttonForm = '';
    let formHeader = '';
    let timeForm = null;
    let readForm = null;
    if(this.state.readForm)
    {
        readForm = 
        <Form className='form-outer' onSubmit={this.formHandler}>
        <FormGroup row>
            <Label for="personRead" className='label2'  sm={2}  >Person</Label>
            <Col sm={4}>
            <Input type="select" name="person" id="personRead"
            onChange ={(event) => this.handleReadInput(event)} value={this.state.formRead.person}
            invalid={!this.state.formReadValid.person}  sm={2} >
              <option></option>
              <option>Zaara</option>
              <option>Isra</option>
            </Input>
            </Col>
            <FormFeedback  className="feedback" valid={this.state.formReadValid.person}  >
            {this.state.formErrorsRead.person}   </FormFeedback>
            <Label for="activityDate" sm={2}>Activity Date </Label>
            <Col sm={4}>
            <DatePicker
              selected={this.state.formRead.activityDate}
              onChange={this.handleDateRead}
              maxDate={new Date()}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dateFormat="dd/MM/yyyy"  
              dropdownMode="select"    
            />
            </Col>
            <FormFeedback  className="feedback" valid={this.state.formReadValid.activityDate}  >
            {this.state.formErrorsRead.activityDate}   </FormFeedback>             
            </FormGroup>  
      <FormGroup row>
            <Label sm={2}></Label>
            <Col sm={4}>
            <Button className="button button2">Read</Button>
            </Col>
      </FormGroup>
      </Form> 
      ;
    }
    if('read' !== this.state.action)
    {
      buttonForm =
      <FormGroup>
      <Label ></Label>     
      <button className="button button2">{button[this.state.action]}</button>
      </FormGroup>;
    }
    let lengthArr = this.state.activityTimes.length;
    // console.log( 'this.state',this.state)
     console.log( 'this.state.activityTimes',this.state.activityTimes[0].type)
    console.log( 'this.state.activityTimes',this.state.activityTimes[0].type.value)
    console.log( 'this.state.activityTimes',this.state.activityTimes[0].act.value)
    //  console.log('lengthArr', lengthArr)
    // console.log( JSON.stringify(this.state.activityTimes))
    if ( lengthArr > 0 ) {
    timeForm = (
          <div>
    {this.state.activityTimes.map((activityTime, index) => {
    return <FormGroup row key={index}>            
          <Label for="activityTime"  sm={2}>Activity Time </Label>
          <Col sm={4}>
          <DatePicker
          selected={activityTime.time.value}
          dateFormat="h:mm aa"  
          readOnly={true}         
          />
          </Col>
          <Col sm={2}>
          <Input type="select" 
            name={activityTime.type.name} id={activityTime.type.id}
            onChange={(event) => this.handleUserActInput(event,index,'type')}
            value={activityTime.type.value} disabled={this.state.readOnlyField}
            invalid={!activityTime.type.valid} >
            <option></option> 
            <option>TV</option> 
            <option>Books,Art and Craft</option> 
            <option>Study</option> 
            <option>Prayer</option>
            <option>Food</option> 
            <option>Babysit</option> 
            <option>Sleep</option> 
            <option>Workout</option> 
            <option>Chores</option> 
            <option>others</option> 
            </Input>  
            <FormFeedback  className="feedback" valid={activityTime.type.valid}  >
            {activityTime.type.errors}   </FormFeedback>       
            </Col>   
            <Col sm={4}>   
            <Input type="text" name={activityTime.act.name} id={activityTime.act.id} placeholder="Hour Activity " 
              maxLength={40} onChange={(event) => this.handleUserActInput(event,index,'act')}   bsSize="lg"
              value={activityTime.act.value}  readOnly={this.state.readOnlyField}
              invalid={!activityTime.act.valid} />
              </Col>   
            <FormFeedback  className="feedback" valid={activityTime.act.valid}  >
            {activityTime.act.errors}   </FormFeedback>       
      </FormGroup>  
      })}
     </div>
    );
    }

    if(true)
    {
      formHeader = 
      <div>
      <br/><br/>
      <p  className="var3"> {header[this.state.action]}</p>
      <hr className="new2" ></hr></div>
    
      actionForm =
      <Form className='form-wrapper' onSubmit={this.submitHandler}> 
            <FormGroup row>
              <Label for="person"  sm={2}>{fieldDesc['person']}</Label>
              <Col sm={2}>   
              <Input type="select" name="person" id="person"
              onChange ={(event) => this.handleUserInput(event)} 
              value={this.state.formField.person}  disabled={this.state.readOnlyField}
              invalid={!this.state.formFieldValid.person} >  
                <option></option>         
                <option>Zaara</option>
                <option>Isra</option>
              </Input>
              <FormFeedback  className="feedback" valid={this.state.formFieldValid.person}  >{this.state.formErrors.person}   </FormFeedback>
              </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="dayDesc" sm={2}>{fieldDesc['dayDesc']}</Label>
            <Col sm={4}>   
            <Input type="text" name="dayDesc" id="dayDesc" placeholder="How Was the Day" 
            maxLength={50} onChange={(event) => this.handleUserInput(event)}   bsSize="lg"
            value={this.state.formField.dayDesc}  readOnly={this.state.readOnlyField}
            invalid={!this.state.formFieldValid.dayDesc} />
            <FormFeedback  className="feedback" valid={this.state.formFieldValid.dayDesc}  >{this.state.formErrors.dayDesc}   </FormFeedback>
            </Col>
            </FormGroup>
            <FormGroup row>            
                  <Label for="activityDate" sm={2}>{fieldDesc['activityDate']}</Label>
                  <Col sm={4}>  
                  <DatePicker
                    selected={this.state.formField.activityDate}
                    onChange={this.handleDate}
                    maxDate={new Date()}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dateFormat="dd/MM/yyyy"  
                    dropdownMode="select" 
                    readOnly={this.state.readOnlyField}         
                  />
                  </Col>
                  <FormFeedback  className="feedback" valid={this.state.formFieldValid.activityDate}  >{this.state.formErrors.activityDate}   </FormFeedback>  
            </FormGroup>  
            <FormGroup row>
              <Label for="momRemark" sm={2}>{fieldDesc['momRemark']}</Label>
              <Col sm={4}>   
              <Input type="text" name="momRemark" id="momRemark" placeholder="Mother Remark" 
              maxLength={50} onChange={(event) => this.handleUserInput(event)}   bsSize="lg"
              value={this.state.formField.momRemark}  readOnly={this.state.readOnlyField}
              invalid={!this.state.formFieldValid.momRemark} />
            <FormFeedback  className="feedback" valid={this.state.formFieldValid.momRemark}  >{this.state.formErrors.momRemark}   </FormFeedback>
            </Col>
            </FormGroup>
            <FormGroup row>  
            <Label for="reminders" sm={2}>{fieldDesc['reminders']}</Label>
                  <Col sm={4}>  
                  <Input type="select" 
                    name="reminders" id="reminders"
                    onChange ={(event) => this.handleUserInput(event)} 
                    value={this.state.formField.reminders}  disabled={this.state.readOnlyField}
                    invalid={!this.state.formFieldValid.reminders} >
                    <option></option> 
                    <option>0</option> 
                    <option>1</option> 
                    <option>2</option>
                    <option>3</option> 
                    </Input>
                    <FormFeedback  className="feedback" valid={this.state.formFieldValid.reminders}  >{this.state.formErrors.reminders}   </FormFeedback>
                  </Col>
            </FormGroup>      
                  
        {timeForm}
        {/* <ActivityTime  activityTimes={this.state.activityTimes} readOnlyField={this.state.readOnlyField}/> */}
        <FormGroup>
        <FormFeedback  className="feedback" valid={this.state.frValid}  >{this.state.formResult}   </FormFeedback>  
        </FormGroup>
        {buttonForm}
      </Form>    
    }   
    return (
      <div>
      {formHeader}
      {readForm}
      {actionForm}
      </div>
    );
  }
}

export default Activity;