import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import CustomHeader from './Header';
import { Button, Modal } from 'react-bootstrap';

const { Header, Content, Footer } = Layout;

class CustomLayout extends React.Component {

  LoginRoute = () => {
    this.props.history.push('/login');
  }

  render() {
    console.log(this.props);
      return (
        <Layout className="layout">
        
        <CustomHeader history={this.props.history} isAuthenticated={this.props.isAuthenticated}/>
{/*
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >

          {
              this.props.isAuthenticated ?

              <Menu.Item key="2" onClick={this.props.logout}>
                Logout
              </Menu.Item>

              :
            
              <Menu.Item key="2">
                <Link to="/login">Login</Link>
              </Menu.Item>
          }
            <Menu.Item key="1">
                <Link to="/">Home</Link>
            </Menu.Item>
          </Menu>
        </Header>
*/}
        
        <Content style={{ padding: '0 50px', background: '#020037'}}>

          { this.props.isAuthenticated ? 
    
            <div>
              <Breadcrumb style={{ margin: '50px 0' }}>
              </Breadcrumb>
              <div style={{ background: '#F6C564' , padding: 24, minHeight: 280 }}>
                {this.props.children}
              </div>
            </div>

            :

            <Modal show={true}>
                <Modal.Header closeButton>
                  <Modal.Title>Not Logged In!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Please Login, in order to access the contents of our site</Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={this.LoginRoute}>
                    Login
                  </Button>
                </Modal.Footer>
            </Modal>

          }
          
        </Content>
        
        <Footer style={{ textAlign: 'center', background: '#020037', color: 'white'}}>
          PickaBook: a CS 307 Project | Created by Myeongsu Kim, Logesh Roshan, Piyush Juneja, Shobhit Makhija.
        </Footer>
      
      </Layout>
    );
  }
    
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.logout())
  }
}

export default withRouter(connect(null, mapDispatchToProps)( CustomLayout));
