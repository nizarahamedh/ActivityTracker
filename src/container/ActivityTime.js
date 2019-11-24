import React from 'react'; 
import { Form, FormGroup,FormFeedback, Label, Input ,Button,Row,Col} from 'reactstrap';
import DatePicker from "react-datepicker"; 
import 'bootstrap/dist/css/bootstrap.min.css';

const activityTime = (props) => {
    let timeForm = null;
    let timeForm2 = null;
    let lengthArr = props.activityTimes.length;
    console.log( 'props',props)
    console.log( 'props.activityTimes',props.activityTimes)
    console.log('lengthArr', lengthArr)
    if ( lengthArr >0 ) {
      timeForm = 
            <div>
      {props.activityTimes.map((activityTime, index) => {
      return <FormGroup row key={index}>   
             <FormGroup row >            
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
              value={activityTime.type.value}
              invalid={!activityTime.type.valid} >
              <option></option> 
              <option>Fun</option> 
              <option>Study</option> 
              <option>Prayer</option>
              <option>Food</option> 
              <option>Babysit</option> 
              <option>sleep</option> 
              <option>others</option> 
              </Input>  
              </Col>   
              <Col sm={4}>   
              <Input type="text" name={activityTime.act.name} id={activityTime.act.id} placeholder="Hour Activity " 
                maxLength={40} onChange={(event) => this.handleUserActInput(event,index,'act')}   bsSize="lg"
                value={activityTime.act.value}  readOnly={props.readOnlyField}
                invalid={!activityTime.act.valid} />
                </Col>   
              </FormGroup>   
              <FormGroup row > 
              <FormFeedback  className="feedback" valid={activityTime.act.valid}  >
              {activityTime.act.error}   </FormFeedback>  
              </FormGroup>      
        </FormGroup>  
        })}
       </div>
      ;
      }
    console.log('timeForm', timeForm)

          
    return ({timeForm})
   
}

export default activityTime;