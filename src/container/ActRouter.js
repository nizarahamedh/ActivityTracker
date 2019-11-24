import React, { Component } from 'react';
import { Route, NavLink, Switch } from 'react-router-dom';
import {  Button } from 'reactstrap';
import './ActRouter.css';
import Activity from './Activity';

class ActRouter extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            bgColor:{create:'#6922db',read:'#6922db',update:'#6922db',delete:'#6922db'},
            color:{create:'#fefefe',read:'#fefefe',update:'#fefefe',delete:'#fefefe'},
        }
    }

    handleUserInput(e) {
        //console.log(this.state);
        let button = e.target.name
        //console.log(e.target.name);
        let bgColorSt =  this.defBgColors();
        bgColorSt[button] = 'white';
        let colorSt =  this.defColors();
        colorSt[button] = 'blue';
        //console.log(  bgColorSt["create"]);
        this.setState({bgColor:bgColorSt,color:colorSt})
    }

    defBgColors()
    {
        return ({bgColor:{create:'#6922db',read:'#6922db',update:'#6922db',delete:'#6922db'}})
    }

    defColors()
    {
        return ({color:{create:'#fefefe',read:'#fefefe',update:'#fefefe',delete:'#fefefe'}})
    }


    render () {
        const styleC = {
            backgroundColor:this.state.bgColor.create,
            color:this.state.color.create
        }
        const styleR = {
            backgroundColor:this.state.bgColor.read,
            color:this.state.color.read
        }
        const styleU = {
            backgroundColor:this.state.bgColor.update,
            color:this.state.color.update
        }
        const styleD = {
            backgroundColor:this.state.bgColor.delete,
            color:this.state.color.delete
        }
        return (
            <div className="EmpRouter">
                <header>
                    <p className="var1">Activity Habit Tracker</p>
                    <nav>
                        <ul>
                            <li><NavLink
                                to={{  pathname:"/act" ,search: '?action=create'}}>
                                    <Button  name="create" onClick ={(event) => this.handleUserInput(event)}    className="button"
                                    style={styleC}>Enter</Button>
                                </NavLink></li>
                            <li><NavLink to={{
                                pathname: '/act',search: '?action=read'}}>
                                    <Button name="read" onClick ={(event) => this.handleUserInput(event)}  className="button"
                                   style={styleR}>View</Button>
                                </NavLink></li>
                            <li><NavLink to={{
                                pathname: '/act',search: '?action=update'}}>
                                    <Button name="update" className="button" onClick ={(event) => this.handleUserInput(event)} style={styleU}>Update</Button></NavLink></li>
                             <li><NavLink to={{
                                pathname: '/act',search: '?action=delete'}}>
                                    <Button name="delete" className="button" onClick ={(event) => this.handleUserInput(event)} style={styleD}>Delete</Button></NavLink></li>
                        </ul>
                        
                    </nav>
                    <hr  className="new1" ></hr>
                </header>
                <Switch>
                    <Route path="/act" component={Activity} />
                </Switch>
            </div>
        );
    }
}

export default ActRouter;