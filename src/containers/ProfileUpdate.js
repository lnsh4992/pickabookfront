import React from 'react';
import {Form, Input, Button, Select, Switch } from 'antd';
import { connect } from "react-redux";
import 'antd/dist/antd.css';

import axios from 'axios';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;


class ProfileUpdateForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            FA: "Fantasy",
            NF: "Non Fiction",
            RO: "Romance",
            TR: "Thriller",
            MY: "Mystery",
            BI: "Biography",
            FI: "Fiction",
            SF: "Science Fiction",
            selectedFile: null,
            isSelected: false

        };
      }

    handleFileSelect = event => {
        this.setState({
            selectedFile: event.target.files[0],
            isSelected: true
        })
    }

    handleFormSubmit = (event, userID) => {
        event.preventDefault();
        console.log(this.state)

        if( this.state.isSelected ){
            let img_data = new FormData()
            img_data.append('avatar', this.state.selectedFile)
        fetch(`http://127.0.0.1:8000/profile/updatepicprof/${this.state.profID}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json, text/plain, */*',
            },
            body: img_data
        }).then(res => res.json())
        .then((data) => {
            console.log(data);
            axios.put(`http://127.0.0.1:8000/profile/update/${userID}`, {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                bio: this.state.bio,
                genre: this.state.genre,
                isPrivate: this.state.private
            })
            .then(res => {
                this.props.history.push('/profile');
            })
            .catch(error => console.log(error));
        })
        .catch(err => console.log(err))
        }

        else {
            axios.put(`http://127.0.0.1:8000/profile/update/${userID}`, {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                bio: this.state.bio,
                genre: this.state.genre,
                isPrivate: this.state.private
            })
            .then(res => {
                this.props.history.push('/profile');
            })
            .catch(error => console.log(error));
        }

        
        
    }

    handleGenreChange = (value) => {
        this.setState({genre: value});
    }

    handleTextChange = (keyName, value) => {
        this.setState({[keyName]: value.target.value});

    }

    handlePrivacyChange = () => {
        this.setState({private: !this.state.private});
    }

    componentDidMount() {
        axios.get(`http://127.0.0.1:8000/profile/${this.props.userid}`).then(res => {
            this.setState({
                first_name: res.data.first_name,
                last_name: res.data.last_name,
                private: res.data.isPrivate,
                bio: res.data.bio,
                genre: res.data.genre,
                avatar: res.data.avatar,
                profID: res.data.pk,
            });
        })
    }

    render() {
        return (
            <div>
                <Form onSubmit={(event) => this.handleFormSubmit(
                    event,
                    this.props.userid
                )}>
                    <FormItem label="First Name" >
                        <Input name="firstname" placeholder={this.state.first_name} 
                        onChange={(value => this.handleTextChange('first_name', value))} />
                    </FormItem>

                    <FormItem label="Last Name" >
                        <Input name="lastname" placeholder={this.state.last_name} 
                        onChange={(value => this.handleTextChange('last_name', value))}/>
                    </FormItem>
                    
                    <FormItem label = "Bio" >
                        <TextArea name="bio" placeholder={this.state.bio} autosize={{minRows: 2}}
                        onChange={(value => this.handleTextChange('bio', value))} />
                    </FormItem>

                    <FormItem label = "Genre" >
                        <Select name="genre" placeholder={this.state[this.state.genre]} defaultValue={this.state.genre} 
                        onChange={(value) => this.handleGenreChange(value)}>
                            <Option value="FA">Fantasy</Option>
                            <Option value="RO">Romance</Option>
                            <Option value="TR">Thriller</Option>
                            <Option value="MY">Mystery</Option>
                            <Option value="BI">Biography</Option>
                            <Option value="FI">Fiction</Option>
                            <Option value="NF">Non Fiction</Option>
                            <Option value="SF">Science Fiction</Option>
                        </Select>    
                    </FormItem>

                    <Form.Item label="Privacy">
                        <Switch name='switch' checked={this.state.private} onClick={this.handlePrivacyChange}/>
                    </Form.Item>


                    <FormItem label = "Avatar">
                        <input 
                         type="file" 
                         name="" 
                         id=""
                         onChange={this.handleFileSelect} />
                    </FormItem>

                    <FormItem>
                        <Button type="primary" htmlType="submit">
                            Submit!
                        </Button>
                    </FormItem>

                </Form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userid: state.userId
    };
};

export default connect(mapStateToProps)(ProfileUpdateForm);