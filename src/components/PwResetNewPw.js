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

  class ResetPWForm extends React.Component {
    state = {
      confirmDirty: false,
      autoCompleteResult: [],
    };
  
    handleSubmit = (e) => {
      const uid = this.props.match.params.uid;
      const token = this.props.match.params.token;
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const postval = {
            'new_password1': values.password, 
            'new_password2': values.confirm,
            'uidb64': uid,
            'token': token
          };
          console.log(postval);
          axios.get(`http://127.0.0.1:8000/profile/resetpw/confirm/${uid}-${token}/`).then(res =>{
            axios.post(`http://127.0.0.1:8000/profile/resetpw/confirm/${uid}-set-password/`, postval)
          .then(res =>{
              //this.props.history.push('/login');
              console.log(res);
            })
            .catch(error => console.log(error))
          });
          
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
        <div>

        <Form onSubmit={this.handleSubmit}>
          <Form.Item className='signForm' >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: 'Please input a new password!',
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
  
  const WrappedNewPWForm = Form.create({ name: 'newPW' })(ResetPWForm);

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

export default connect(mapStateToProps, mapDispatchToProps)(WrappedNewPWForm);