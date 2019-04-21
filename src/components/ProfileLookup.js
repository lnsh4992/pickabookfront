import React from 'react';
import axios from 'axios';
import { Card, Row, Col, List, Icon, Avatar, Rate } from "antd";
import { MDBMask, MDBView, MDBContainer } from "mdbreact";

const gridStyle = {
    textAlign: 'center',
  };

const LikeStyle = {
    marginRight : 8,
    color: '#378695'
};

const DislikeStyle = {
    marginRight : 8,
    color: '#900e01'
};


const IconText = ({ type, text, onClick, theme, style }) => (
    <span>
        <Icon type={type} style={style} onClick={onClick} theme={theme}/>
        {text}
    </span>
);


class ProfileLookup extends React.Component {
    
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
            SF: "Science Fiction"
        };
    }  


    componentDidMount() {
        const profileID = this.props.match.params.profileID;
        this.fetchBookReviews();
        this.fetchAuthReviews();
        axios.get(`http://127.0.0.1:8000/profile/user/${profileID}`).then(res => {
            this.setState({
                first_name: res.data.first_name,
                last_name: res.data.last_name,
                private: res.data.isPrivate,
                review_count: res.data.review_count,
                creation_date: res.data.creation_date,
                bio: res.data.bio,
                genre: res.data.genre,
                avatar: res.data.avatar,
                books: res.data.favorites,
                authors: res.data.following
            });
            console.log(this.state);
        })
        .catch(error => console.log(error));
    }

    fetchBookReviews = () => {
        const pr_ID = this.props.match.params.profileID;
        axios.get(`http://127.0.0.1:8000/bookreview/user/${pr_ID}`).then(res => {
            this.setState({
                reviews: res.data
            })


        })
        .catch(error => console.log(error));
    }

    fetchAuthReviews = () => {
        const pr_ID = this.props.match.params.profileID;
        axios.get(`http://127.0.0.1:8000/authreview/user/${pr_ID}`).then(res => {
            
            this.setState({
                authReviews: res.data
            })


        })
        .catch(error => console.log(error));
    }


    render() {
        return (
                <div>
                    <Row gutter={20} style={{ marginBottom: 16 }} type="flex" justify="center">
                        <Col span={4}>
                            <Card bodyStyle={{
                                padding: 0
                            }}
                            style={{
                                marginLeft: 30
                            }}
                            >
                                <img src={this.state.avatar} style={{
                                    width: 179, height: 216
                                }}
                                width="100%" height="100%" >
                                </img>
                            </Card>
                        </Col>
                        
                        <Col span={18}>
                        <MDBContainer>
                        <MDBView>
                            <Card style={{
                                marginRight: 0
                            }}
                                title={
                                <div style={{display:'flex', alignItems: 'stretch'}}>
                                    <Col span={22}>
                                        {this.state.first_name + " " + this.state.last_name}
                                        {
                                            this.state.review_count > 10 &&
                                                <Icon style={{marginLeft: 10, color: '#DAA520'}} type="crown" theme="filled" />
                                        }
                                    </Col>
                                </div>
                                }
                                headStyle={{
                                    fontSize: 20,
                                    fontStyle: 'italic',
                                    fontFamily: 'Georgia', 
                                    background: '#020037',
                                    color: 'white'
                                }}
                            >
                                <p>
                                    <b><i>User Since: </i></b> 
                                    {   !this.state.private &&
                                        this.state.creation_date
                                    }
                                </p>
                                
                                <p>
                                    <b><i>Review Count: </i></b> 
                                    {   !this.state.private &&
                                        this.state.review_count
                                    }
                                </p>
                                
                                <p>
                                    <b><i>Favorite Genre: </i></b>
                                    {   !this.state.private &&
                                        this.state[this.state.genre]
                                    }
                                </p>


                            </Card>

                            {
                                this.state.private &&
                                <MDBMask className="flex-center" overlay="black-strong" >
                                <p className="black-text" style={{fontSize: 20,
                                    fontStyle: 'italic',
                                    fontFamily: 'Georgia'}}>Private</p>
                                </MDBMask>
                            }
                            

                        </MDBView>
                        </MDBContainer>

                        </Col>

                    </Row>

                    <Row gutter={20} style={{ marginBottom: 16 }} type="flex" justify="center">
                        <Col span={22}>
                        <MDBContainer>
                        <MDBView>

                            <Card style={gridStyle} title="About Me"
                            headStyle={{
                                fontSize: 20,
                                fontStyle: 'italic',
                                fontFamily: 'Georgia', 
                                background: '#020037',
                                color: 'white',
                                textAlign: 'left'
                                }}
                            >
                                <p>
                                    { !this.state.private &&
                                        this.state.bio
                                    }
                                </p>
                            </Card>
                            {
                                this.state.private &&
                                <MDBMask className="flex-center" overlay="black-strong" >
                                <p className="black-text" style={{fontSize: 20,
                                    fontStyle: 'italic',
                                    fontFamily: 'Georgia'}}>Private</p>
                                </MDBMask>
                            }
                            

                        </MDBView>
                        </MDBContainer>
                        </Col>
                    </Row>

                    <Row gutter={20} style={{ marginBottom: 16 }} type="flex" justify="center">
                        <Col span={11}>
                        <MDBContainer>
                        <MDBView >

                        <Card style={{height: 522, marginLeft: 0}} 
                        headStyle={{
                                fontSize: 20,
                                fontStyle: 'italic',
                                fontFamily: 'Georgia', 
                                background: '#020037',
                                color: 'white',
                                textAlign: 'left'
                        }}
                        title="Favorites">
                            {
                            !this.state.private &&
                                <List
                                pagination={{
                                    onChange: (page) => {
                                        console.log(page);
                                    },
                                    pageSize: 2,
                                }}
                                grid={{ gutter: 0, column: 2 }}
                                dataSource={this.state.books}
                                renderItem={item => (
                                    <List.Item>
                                        <Card
                                            hoverable
                                            style={{ width: 180, background: '#F6C564', color: 'white'}}
                                            cover={<img alt={item.title} src={item.image_url} style={{width:178, height: 250}} />}
                                        >
                                            <Card.Meta
                                            title={<a href={'/booklist/'+item.pk}><b>{item.title}</b></a>}
                                            
                                            />
                                        </Card>
                                    </List.Item>
                                )}
                                />
                            }
                            
                        </Card>
                        {
                            this.state.private &&
                            <MDBMask className="flex-center" overlay="black-strong" >
                            <p className="black-text" style={{fontSize: 20,
                                fontStyle: 'italic',
                                fontFamily: 'Georgia'}}>Private</p>
                            </MDBMask>
                        }
                            
                        </MDBView>
                        </MDBContainer>
                        </Col>

                        <Col span={11}>
                        <MDBContainer>
                        <MDBView >

                        <Card style={{height: 522, marginRight: 0}} 
                        headStyle={{
                            fontSize: 20,
                            fontStyle: 'italic',
                            fontFamily: 'Georgia', 
                            background: '#020037',
                            color: 'white',
                            textAlign: 'left'
                        }}
                        title="Following">
                        {
                            !this.state.private &&
                                <List
                                pagination={{
                                    onChange: (page) => {
                                        console.log(page);
                                    },
                                    pageSize: 2,
                                }}
                                grid={{ gutter: 0, column: 2 }}
                                dataSource={this.state.authors}
                                renderItem={item => (
                                    <List.Item>
                                        <Card
                                            hoverable
                                            style={{ width: 180, background: '#F6C564', color: 'white'}}
                                            cover={<img alt={item.name} src={item.image_url} style={{width:178, height: 250}} />}
                                        >
                                            <Card.Meta
                                            title={<a href={'/authors/'+item.pk}><b>{item.name}</b></a>}
                                            />
                                        </Card>
                                    </List.Item>
                                )}
                                />
                        }
                        
                        </Card>
                        {
                            this.state.private &&
                            <MDBMask className="flex-center" overlay="black-strong" >
                            <p className="black-text" style={{fontSize: 20,
                                fontStyle: 'italic',
                                fontFamily: 'Georgia'}}>Private</p>
                            </MDBMask>
                        }
                            
                        </MDBView>
                        </MDBContainer>
                        </Col>
                    </Row>


                    <Row gutter={20} style={{ marginBottom: 16 }} type="flex" justify="center">
                        <Col span={22}>
                        <MDBContainer>
                        <MDBView >

                            <Card 
                                style={{textAlign: 'left', minHeight:500}} 
                                title="User's Reviews"
                                headStyle={{
                                fontSize: 20,
                                fontStyle: 'italic',
                                fontFamily: 'Georgia', 
                                background: '#020037',
                                color: 'white',
                                textAlign: 'left'
                                }}
                            >


                                {
                                    !this.state.private &&
                                    
                                <div>
                                <Row gutter={20} style={{ marginBottom: 16 }} type="flex" justify="center">
                                    <Card 
                                    style={{textAlign: 'left', width: 1100}} 
                                    title="Books"
                                    headStyle={{
                                    fontSize: 20,
                                    fontStyle: 'italic',
                                    fontFamily: 'Georgia', 
                                    background: '#020037',
                                    color: 'white',
                                    textAlign: 'left'
                                    }}
                                    >

                                        <List
                                            pagination={{
                                                onChange: (page) => {
                                                    console.log(page);
                                                },
                                                pageSize: 2,
                                            }}
                                            itemLayout="vertical"
                                            size="large"
                                            dataSource={this.state.reviews}
                                            renderItem={item => (
                                            <List.Item key={item.id}
                                                    actions={[<IconText type="like-o" 
                                                                        text={item.likes} 
                                                                        theme = {'outlined'}
                                                                        style = {LikeStyle}/>, 
                                                            <IconText type="dislike-o" 
                                                                        text={item.dislikes}
                                                                        theme = {'outlined'}
                                                                        style = {DislikeStyle} />]}
                                                    extra={<div><Rate disabled allowHalf defaultValue={item.rating} /> {item.creation_date} </div>}
                                            >
                                                <List.Item.Meta
                                                    avatar={<Avatar src={item.book.image_url} />}
                                                    title={item.title}
                                                    description={<a href={'/booklist/'+item.book.pk}>{item.book.title}</a>}
                                                    
                                                />
                                                <div>{item.content}</div>
                                            </List.Item>
                                            )}
                                        >

                                        </List>

                                    </Card>
                                </Row>

                                <Row gutter={20} style={{ marginBottom: 16 }} type="flex" justify="center">
                                    <Card 
                                    style={{textAlign: 'left', width: 1100}} 
                                    title="Authors"
                                    headStyle={{
                                    fontSize: 20,
                                    fontStyle: 'italic',
                                    fontFamily: 'Georgia', 
                                    background: '#020037',
                                    color: 'white',
                                    textAlign: 'left'
                                    }}
                                    >

                                        <List
                                            pagination={{
                                                onChange: (page) => {
                                                    console.log(page);
                                                },
                                                pageSize: 2,
                                            }}
                                            itemLayout="vertical"
                                            size="large"
                                            dataSource={this.state.authReviews}
                                            renderItem={item => (
                                            <List.Item key={item.id}
                                                    actions={[<IconText type="like-o" 
                                                                        text={item.likes} 
                                                                        theme = {'outlined'}
                                                                        style = {LikeStyle}/>, 
                                                            <IconText type="dislike-o" 
                                                                        text={item.dislikes}
                                                                        theme = {'outlined'}
                                                                        style = {DislikeStyle} />]}
                                                    extra={<div><Rate disabled allowHalf defaultValue={item.rating} /> {item.creation_date} </div>}
                                            >
                                                <List.Item.Meta
                                                    avatar={<Avatar src={item.author.image_url} />}
                                                    title={item.title}
                                                    description={<a href={'/authors/'+item.author.pk}>{item.author.name}</a>}
                                                    
                                                />
                                                <div>{item.content}</div>
                                            </List.Item>
                                            )}
                                        >

                                        </List>

                                    </Card>
                                </Row>
                                </div>
                                    
                                }
                                
                                
                            </Card>

                        {
                            this.state.private &&
                            <MDBMask className="flex-center" overlay="black-strong" >
                            <p className="black-text" style={{fontSize: 20,
                                fontStyle: 'italic',
                                fontFamily: 'Georgia'}}>Private</p>
                            </MDBMask>
                        }
                        </MDBView>
                        </MDBContainer>
                        </Col>
                    </Row>


                </div>
        )
    }
}


export default ProfileLookup;