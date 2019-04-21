import React from 'react';

import { Form, Input, Icon, Button } from 'antd';
import * as actions from '../store/actions/auth';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Logo from '../images/logo.png';
import axios from 'axios';
  
const prefixIcon = {
  color: 'rgba(0,0,0,0.8)'
};

  class ForgotPW extends React.Component {
    state = {
      confirmDirty: false,
      autoCompleteResult: [],
    };
  
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {

        }
        axios.get('http://127.0.0.1:8000/profile/resetpw/').then(res=> { 
        axios.post('http://127.0.0.1:8000/profile/resetpw/', {
            email: 'user9@gmail.com'
        })
        .then(res => {console.log(res)});
//        this.props.history.push('/');
        });
      });
    }
  
  
  
    render() {
      const { getFieldDecorator } = this.props.form;
  
      return (
        <div className="parent" style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: 10,
          backgroundColor: 'rgba(241, 101, 86, 0.6)', 
          
      }}>

          <img src={Logo} alt="logo" style={{
            width: 250,
            height: 93
          }} />
        <Form onSubmit={this.handleSubmit}>
            
          <Form.Item className='signForm'  >
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: 'The input is not valid E-mail!',
              }, {
                required: true, message: 'Please input your E-mail!',
              }],
            })(
              <Input prefix={<Icon type="mail" style={prefixIcon} />} placeholder="Email" />
            )}
          </Form.Item>

          <Form.Item className='signForm' >
                <Button type="primary" htmlType="submit" style={{marginRight: '10px'}} >
                    Signup
                </Button>
                <NavLink style={{marginLeft: 110, fontSize: 16}} to='/login/'> Login
                </NavLink>
        </Form.Item>

          <p> An email will be sent!</p>
       </Form>
       
       </div>
      );
    }
  }
  
  const WrappedForgotPW = Form.create({ name: 'forgotpw' })(ForgotPW);

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (userName, email, password1, password2) => dispatch(actions.authSignup(userName, email, password1, password2))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WrappedForgotPW);