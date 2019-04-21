import React from 'react';
import {
  Form, Spin, Icon, Input, Button,
} from 'antd';
import * as actions from '../store/actions/auth';
import {connect} from 'react-redux';
import { NavLink } from 'react-router-dom';
import Logo from '../images/logo.png';
import './temp.css';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
  
  class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.onAuth(values.userName, values.password);
        }
      });
      this.props.history.push("/profile/");
    }
  
    render() {
      console.log(this.props.isAuthenticated)
      let errorMessage = null;
      if(this.props.error) {
        errorMessage = (
          <p>{this.props.error.message}</p>
        );
      }
      const { getFieldDecorator } = this.props.form;
      return (
        <div className="parent" style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: 10,
          backgroundColor: 'rgba(241, 101, 86, 0.6)', 
          
      }} >

          <img src={Logo} alt="logo" style={{
            width: 250,
            height: 93
          }} />
          {errorMessage}
          {
            this.props.loading ? 
            <Spin indicator={antIcon} />
            
            :

            <Form onSubmit={this.handleSubmit} className="login-form">

              <Form.Item className='signForm' style={{
                  width: 250,
                  
              }}>
                {getFieldDecorator('userName', {
                  rules: [{ required: true, message: 'Please input your username!' }],
                })(
                  <Input 
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.8)' }} />} placeholder="Username"
                   />
                )}
              </Form.Item>
              <Form.Item className='signForm' style={{
                  width: 250
              }}>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.8)' }} />} type="password" placeholder="Password" />
                )}
              </Form.Item>
              <Form.Item>
                
                <Button type="primary" htmlType="submit" className="signForm"
                 style={{
                  marginLeft: 31,
                  width: '75%'
                }}>
                  Log in
                </Button>
                
                <br></br>
                <NavLink style={{marginLeft: 68, fontSize: 16}} to='/forgot/'>
                  Forgot password
                </NavLink>
                <br></br>

                <NavLink to="/signup/" style={{marginLeft: 78, color: '#25507d', fontSize: 16}} >
                Register Now!
                </NavLink>
              </Form.Item>
            </Form>
          }
        </div>
      );
    }
  }
 


const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (username, password) => dispatch(actions.authLogin(username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WrappedNormalLoginForm);