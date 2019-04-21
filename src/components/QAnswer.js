import React from 'react';
import { Drawer, Button, Form, Input, List, Icon, Comment, Avatar, Tooltip, Card, Alert, message } from 'antd';
import axios from 'axios';

const { TextArea } = Input;
const buttonStyle = {
    position: 'absolute',
    right: 20,
    background: '#DDA72F'
}

class QAnswer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            likes: 0,
            dislikes: 0,
            action: null,
            img: null,
            drawVisible: false,
            drawQuestion: false,
            error: false
        };
    }  

    fetchData = () => {
        const bookID = this.props.bookID; //match.params.bookID;
        axios.get(`http://127.0.0.1:8000/qanswer/question/${bookID}`).then(res => {
            this.setState({
                questions: res.data,
                drawVisible: false,
                drawQuestion: false,
            });
        })
        .catch(error => console.log(error));
    }

    componentDidMount = () => {
        this.fetchData();
    }

    handleAnswerSubmit = () => {
        const bookID = this.props.bookID;
        const qID = this.state.qID;
        const profID = localStorage.getItem("profID");
        if ( !this.state.answer ){
            this.setState({error: true});
            return
        }

        axios.post(`http://127.0.0.1:8000/qanswer/answer/create/`, {
            profile: profID,
            book: bookID,
            question: qID,
            answer: this.state.answer
        })
        .then(res => {
            console.log(res)
            this.fetchData();
        })
        .catch(err => console.log(err));
    };

    showDrawer = (qID) => {
        this.setState({
            drawVisible: true,
            qID: qID,
        });
        console.log(this.state);
    };

    closeDrawer = () => {
        this.setState({
            drawVisible: false,
        });
    };

    showQuestionDrawer = () => {
        this.setState({
            drawQuestion: true,
        });
        console.log(this.state);
    };

    closeQuestionDrawer = () => {
        this.setState({
            drawQuestion: false,
        });
    };

    handleQuestionChange = (e) => {
        this.setState({
            question: e.target.value,
        });
    };

    handleQuestionSubmit = () => {
        const bookID = this.props.bookID;
        const profID = localStorage.getItem("profID");
        if ( !this.state.question ){
            this.setState({error: true});
            return
        }

        axios.post(`http://127.0.0.1:8000/qanswer/question/create/`, {
            profile: profID,
            book: bookID,
            question: this.state.question
        })
        .then(res => {
            console.log(res)
            this.fetchData();
        }).catch(err => console.log(err));
    }

    handleAnswerChange = (e) => {
        this.setState({
            answer: e.target.value,
        });
    }

    ErrorMessage = () =>  {
        message.error('Please Fill The Form Before Submitting!');
        this.setState({
            error: false
        })
    }

    like = () => {
        this.setState({
          likes: 1,
          dislikes: 0,
          action: 'liked',
        });
      }
    
      dislike = () => {
        this.setState({
          likes: 0,
          dislikes: 1,
          action: 'disliked',
        });
      }

    render() {

        const { likes, dislikes, action } = this.state;
        const actions = [
            <span>
              <Tooltip title="Like">
                <Icon
                  type="like"
                  theme={action === 'liked' ? 'filled' : 'outlined'}
                  onClick={this.like}
                />
              </Tooltip>
              <span style={{ paddingLeft: 8, cursor: 'auto' }}>
                {likes}
              </span>
            </span>,
            <span>
              <Tooltip title="Dislike">
                <Icon
                  type="dislike"
                  theme={action === 'disliked' ? 'filled' : 'outlined'}
                  onClick={this.dislike}
                />
              </Tooltip>
              <span style={{ paddingLeft: 8, cursor: 'auto' }}>
                {dislikes}
              </span>
            </span>,
            <span onClick={() => this.showDrawer()}>Reply to</span>,
        ];

        return (
            <div>
                {this.state.error ?
                    this.ErrorMessage()
                    :
                    <b></b>
                }
                <Drawer
                    title="Answer"
                    placement="bottom"
                    onClose={this.closeDrawer}
                    visible={this.state.drawVisible}
                    style={{
                        overflow: 'auto',
                        height: 'calc(100% - 108px)',
                        paddingBottom: '108px',
                    }}
                >
                    <Form layout="vertical" hideRequiredMark>
                        <Form.Item label="Answer">
                            <TextArea onChange={this.handleAnswerChange} name="answer" placeholder="Answer The Question" autosize={{minRows: 2}} />
                        </Form.Item>
                    </Form>
                    <div style={{
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            width: '100%',
                            borderTop: '1px solid #e9e9e9',
                            padding: '10px 16px',
                            background: '#fff',
                            textAlign: 'right',
                    }}
                    >
                        <Button onClick={this.closeDrawer} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button onClick={this.handleAnswerSubmit} type="primary">
                            Submit
                        </Button>
                    </div>
                </Drawer>

                <Drawer
                    title="Question"
                    placement="bottom"
                    onClose={this.closeQuestionDrawer}
                    visible={this.state.drawQuestion}
                    style={{
                        overflow: 'auto',
                        height: 'calc(100% - 108px)',
                        paddingBottom: '108px',
                    }}
                >
                    <Form layout="vertical" hideRequiredMark>
                        <Form.Item label="Question">
                            <TextArea onChange={this.handleQuestionChange} name="question" placeholder="Ask a Question" autosize={{minRows: 2}} />
                        </Form.Item>
                    </Form>
                    <div style={{
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            width: '100%',
                            borderTop: '1px solid #e9e9e9',
                            padding: '10px 16px',
                            background: '#fff',
                            textAlign: 'right',
                    }}
                    >
                        <Button onClick={this.closeQuestionDrawer} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button onClick={this.handleQuestionSubmit} type="primary">
                            Submit
                        </Button>
                    </div>
                </Drawer>


                <Card title={<div>Questions
                    <Button type="primary" onClick={this.showQuestionDrawer} style={buttonStyle}>New Question</Button>
                </div>}
                headStyle={{
                    fontSize: 20,
                    fontStyle: 'italic',
                    fontFamily: 'Georgia', 
                    background: '#020037',
                    color: 'white'
                }}
                >
                <List
                    className="comment-list"
                    itemLayout="horizontal"
                    dataSource={this.state.questions}
                    renderItem={item => (
                        <Comment
                            actions={[<span onClick={() => this.showDrawer(item.pk)}>Reply to</span>]}
                            author={
                                <div>
                                    <a href={'/profile/'+item.profile.pk}>{item.profile.first_name + " " + item.profile.last_name}
                                    </a>
                                {
                                    item.profile.review_count > 10 &&
                                    <Icon style={{marginLeft: 10, color: '#DAA520'}} type="crown" theme="filled" twoToneColor="#DAA520" />
                                }
                                </div>    
                            }
                            avatar={<Avatar src={item.profile.avatar}/>}
                            content={item.question}
                            datetime={item.creation_date}
                        >
                            {
                                item.answers.length > 0 ?
                                
                                <List
                                className="comment-list"
                                itemLayout="horizontal"
                                dataSource={item.answers}
                                renderItem={answer => (
                                    <Comment
                                        author={
                                            <div>
                                                <a href={'/profile/'+answer.profile.pk}>{answer.profile.first_name + " " + answer.profile.last_name}
                                                </a>
                                            {
                                                answer.profile.review_count > 10 &&
                                                <Icon style={{marginLeft: 10, color: '#DAA520'}} type="crown" theme="filled" twoToneColor="#DAA520" />
                                            }
                                            </div>    
                                        }
                                        avatar={<Avatar src={answer.profile.avatar}/>}
                                        content={answer.answer}
                                        datetime={answer.creation_date}
                                    />
                                )}
                                />
                                :
                                <b syle={{marginLeft: 200}}>No replies</b>
                            }
                            </Comment>
                        
                    )}
                />
                </Card>
            </div>
        )
    }
}

export default QAnswer;