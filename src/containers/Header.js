import React from 'react';
import { Nav, Navbar, NavDropdown, Form, FormControl, Button, Modal } from 'react-bootstrap';
import { Select } from 'antd';
import axios from 'axios';
import * as actions from '../store/actions/auth';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Img from '../images/logo.png';

const FormItem = Form.Item;
const Option = Select.Option;

class CustomHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filter: "book",
            show: false
        };
    }

    handleFilter = (value) => {
        this.setState({
            filter: value
        });
    }

    handleClose = () => {
        this.setState({
            show: false
        });
    }

    handleFormSubmit = (event) => {
        event.preventDefault();

        this.setState({
            target: event.target.elements.tgtname.value
        })
        console.log(this.state.filter)
        if ( this.state.filter === "book" ){
            console.log(event.target.elements.tgtname.value);
            axios.get(`http://127.0.0.1:8000/library/view/${event.target.elements.tgtname.value}`)
            .then(res => {
                this.props.history.push(`/booklist/${res.data.pk}/`);
            })
            .catch(err => {
                this.setState({
                    show: true
                });
            })
        }

        if (this.state.filter === "author"){
            axios.get(`http://127.0.0.1:8000/authors/view/${event.target.elements.tgtname.value}`)
            .then(res =>{
                console.log(res);
                this.props.history.push(`/authors/${res.data.pk}/`);
            })
            .catch(err => {
                this.setState({
                    show: true
                });
            })
        }

        if ( this.state.filter === "profile"){
            var name = event.target.elements.tgtname.value.split(" ")
            axios.get(`http://127.0.0.1:8000/profile/search/${name[0]}/${name[1]}/`)
            .then(res => {
                this.props.history.push(`/profile/${res.data.pk}/`);
            })
            .catch(err => {
                this.setState({
                    show: true
                });
            })
        }

    }

    render() {
        console.log(this.props.isAuthenticated)
        return (
            <div>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
                <Navbar bg="dark" expand="lg" variant="dark">
                    <Navbar.Brand href="#home"> <img src={Img} style={{width:120}} /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link href="/explore">Explore</Nav.Link>
                    <NavDropdown title="Profile" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/profile">My Profile</NavDropdown.Item>
                        <NavDropdown.Item href="/updateprof">Update Profile</NavDropdown.Item>
                    </NavDropdown>
                    
                    {
                        this.props.isAuthenticated ? 
                        <Nav.Link onClick={this.props.logout} href="/login">Logout</Nav.Link>
                        :
                        <Nav.Link href="/login">Login</Nav.Link>
                    }

                    </Nav>
                    <Form inline onSubmit={(event) => this.handleFormSubmit(event)}>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" name="tgtname" />
                    <Button variant="outline-success" type="primary">Search</Button>
                    </Form>
                    
                    <NavDropdown title="Filter" id="basic-nav-dropdown" 
                    onSelect={(value => this.handleFilter(value))}>
                    <NavDropdown.Item eventKey="book">Book</NavDropdown.Item>
                    <NavDropdown.Item eventKey="author">Author</NavDropdown.Item> 
                    <NavDropdown.Item eventKey="profile">Profile</NavDropdown.Item>       
                    </NavDropdown>
                    

                    </Navbar.Collapse>
                </Navbar>

                <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title><i>Error:</i> Not Found!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Unfortunately, we can't find the <b>{this.state.filter}</b> {this.state.target}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                    Close
                    </Button>

                </Modal.Footer>
                </Modal>
            
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())
    }
}

export default withRouter(connect(null, mapDispatchToProps)(CustomHeader));
