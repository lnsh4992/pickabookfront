import React from 'react';

import { Form, Input, Icon, Button } from 'antd';
import * as actions from '../store/actions/auth';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Logo from '../images/logo.png';
  
const prefixIcon = {
  color: 'rgba(0,0,0,0.8)'
};

  class RegistrationForm extends React.Component {
    state = {
      confirmDirty: false,
      autoCompleteResult: [],
    };
  
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.props.onAuth(
              values.userName, 
              values.email,
              values.password,
              values.confirm
            );

            setTimeout(
              function() {
                this.props.history.push('/newprof/');
              }
              .bind(this),
              1000
            );
        }
//        this.props.history.push('/');
      });
    }
  
    handleConfirmBlur = (e) => {
      const value = e.target.value;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
  
    compareToFirstPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    }
  
    validateToNextPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
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
            <Form.Item className='signForm' >
                {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Please input your username!' }],
                })(
                <Input prefix={<Icon type="user" style={prefixIcon} />} placeholder="Username" />
                )}
            </Form.Item>

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
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: 'Please input your password!',
              }, {
                validator: this.validateToNextPassword,
              }],
            })(
              <Input prefix={<Icon type="lock" style={prefixIcon} />} type="password" placeholder="Password" />            )}
          </Form.Item>
        
        <Form.Item className='signForm' >
        {getFieldDecorator('confirm', {
            rules: [{
            required: true, message: 'Please confirm your password!',
            }, {
            validator: this.compareToFirstPassword,
            }],
        })(
            <Input prefix={<Icon type="lock" style={prefixIcon} />} type="password" placeholder="Password" onBlur={this.handleConfirmBlur} />
        )}
        </Form.Item>

        <Form.Item className='signForm' >
                <Button type="primary" htmlType="submit" style={{marginRight: '10px'}} >
                    Signup
                </Button>
                <NavLink style={{marginLeft: 110, fontSize: 16}} to='/login/'> Login
                </NavLink>
        </Form.Item>

       </Form>
       
       </div>
      );
    }
  }
  
  const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);

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

export default connect(mapStateToProps, mapDispatchToProps)(WrappedRegistrationForm);