import React from 'react';
import axios from 'axios';
import { Card, Row, Col, List, Icon, Avatar, Spin, message, Rate } from "antd";
import AuthReviewForm from '../forms/AuthReviewForm';

const gridStyle = {
    textAlign: 'center',
  };

const toLeft = {
    textAlign: 'left',
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

class AuthorDetail extends React.Component {

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
            books: [],
            auth_reviews: [],
            following: false,
            iconType: "user-add"
        };

        this.style={marginLeft: 10, color: '#daa520'}
    }  

    componentDidMount = () => {
        const authID = this.props.match.params.authID;
        this._isMounted=true;
        const profID = localStorage.getItem("profID");
        
        axios.get(`http://127.0.0.1:8000/profile/following/${profID}`).then(res => {
            if(res.data.following.some(e => e.pk == authID)) {
                this.style = {
                    marginLeft: 10,
                    color: !this.state.following ? "#b22222": '#daa520'
                }
                this.setState({
                    iconType: !this.state.following ? "user-delete" : "user-add" ,
                    following: !this.state.following
                });
            }
        })
        .catch(err => { console.log(err) });

        axios.get(`http://127.0.0.1:8000/authors/${authID}`).then(res => {
          this.setState({
            // book: res.data
            title: res.data.name,
            birthdate: res.data.birthdate,
            numFollowers: res.data.numFollowers,
            image_url: res.data.image_url,
            genre: this.state[res.data.genre],
            rating: res.data.review,
            number_of_reviews: res.data.review_count,
            synopsis: res.data.bio
          });

          axios.get(`http://127.0.0.1:8000/library/authorbooks/${res.data.name}`).then(ares => {
              this.setState({
                  books: ares.data
              });
          })
          .catch(error => console.log(error));
        })
        .catch(error => console.log(error));

        this.fetchReviews();
    }

    fetchReviews = () => {
        const authID = this.props.match.params.authID;
        axios.get(`http://127.0.0.1:8000/authreview/${authID}`).then(res => {
            this.setState({
                auth_reviews: res.data,
                max_length: res.data.length,
                current_length: Math.min(3, res.data.length)
            })
            for(var i=0; i<this.state.auth_reviews.length; ++i){
                this.state.auth_reviews[i].isLiked = false
                this.state.auth_reviews[i].isDisliked = false
            }

        })
        .catch(error => console.log(error));
    }

    componentWillUnmount(){
        this._isMounted = false;
        console.log("Unmounting");
    }

    handleFollow = () => {
        const profID = localStorage.getItem("profID");
        const authID = this.props.match.params.authID;
        axios.put(`http://127.0.0.1:8000/profile/addfollow/${profID}`, {
            following: [authID]
        })
        .then(res => {
            this.style = {
                marginLeft: 10,
                color: !this.state.following ? "#b22222": '#daa520'
            }
            this.setState({
                iconType: !this.state.following ? "user-delete" : "user-add" ,
                following: !this.state.following
            });
            

        })
        .catch(error => console.log(error));
    }

    handleLike = (revID, inp) => {
        var review = this.state.auth_reviews.filter(review => review.pk === revID)[0];
        if (review.isDisliked || review.isLiked)
            return;

        axios.put(`http://127.0.0.1:8000/authreview/like/${revID}`, {
            likes: inp === 'like' ? 1 : 0
        }).then(res => {
                
                if (inp === 'like') {
                    review.isLiked = true;
                    review.likes += 1;
                }
                else {
                    review.isDisliked = true;
                    review.dislikes += 1;
                }
                this.setState(this.state);
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
                            }}>
                                <img src={this.state.image_url} 
                                style={{
                                    width: 194, height: 285
                                }}
                                width="100%" height="100%" >
                                </img>
                            </Card>
                        </Col>
                        
                        <Col span={18}>
                            <Card title={
                                    <div>
                                        {this.state.title} 
                                        <Icon style={this.style} type={this.state.iconType}
                                            onClick={this.handleFollow} />
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
                                    <b><i>Birthdate: </i></b> 
                                    {this.state.birthdate}
                                </p>
                                
                                <p>
                                    <b><i>Number of Followers: </i></b> 
                                    {this.state.numFollowers}
                                </p>
                                
                                <p>
                                    <b><i>Genre: </i></b>
                                    {this.state.genre}
                                </p>

                                <p>
                                    <b><i>Rating: </i></b>
                                    {this.state.rating}
                                </p>

                                <p>
                                    <b><i>Number of reviews: </i></b>
                                    {this.state.number_of_reviews}
                                </p>
                            </Card>
                        </Col>

                    </Row>

                    <Row gutter={20} style={{ marginBottom: 16 }} type="flex" justify="center">
                        <Col span={22}>
                            <Card style={toLeft} title={<div style={{display:'flex', alignItems: 'stretch'}}>About the Author</div>}
                            headStyle={{
                                fontSize: 20,
                                fontStyle: 'italic',
                                fontFamily: 'Georgia', 
                                background: '#020037',
                                color: 'white'
                            }}
                            >
                                <p>
                                    {this.state.synopsis}
                                </p>
                            </Card>
                        </Col>
                    </Row>

                    
                    <List
                        grid={{ gutter: 16, column: 4 }}
                        style={{
                            paddingTop: 20, paddingLeft: 55, paddingBottom: 20
                        }}
                        dataSource={this.state.books}
                        renderItem={item => (
                        <List.Item>


                            <Card
                                hoverable
                                style={{ width: 240 }}
                                cover={<img alt={item.title} 
                                            src={item.image_url} 
                                            style={{
                                                width: 238, height: 295
                                            }}
                                            width="100%" height="100%"
                                />}
                            >
                                <Card.Meta
                                title={<a href={'/booklist/'+item.pk}><b>{item.title}</b></a>}
                                
                                />
                            </Card>
                        </List.Item>
                        )}
                    />

                    <Row gutter={20} style={{ marginBottom: 16 }} type="flex" justify="center">
                        <Col span={22}>
                            <Card title={<div style={{display:'flex', alignItems: 'stretch'}}>Author Reviews</div>}
                            headStyle={{
                                fontSize: 20,
                                color: 'white',
                                fontStyle: 'italic',
                                fontFamily: 'Georgia', 
                                background: '#020037'
                            }}>
                            <List
                                    itemLayout="vertical"
                                    size="large"
                                    dataSource={this.state.auth_reviews}
                                    renderItem={item => (
                                    <List.Item key={item.id}
                                            actions={[<IconText type="like-o" 
                                                                text={item.likes} 
                                                                onClick={() => this.handleLike(item.pk, "like")} 
                                                                theme = {item.isLiked ? 'filled' : 'outlined'}
                                                                style = {LikeStyle}/>, 
                                                      <IconText type="dislike-o" 
                                                                text={item.dislikes} 
                                                                onClick={() => this.handleLike(item.pk, "dislike")}
                                                                theme = {item.isDisliked ? 'filled' : 'outlined'}
                                                                style = {DislikeStyle} />]}
                                            extra={<div><Rate disabled allowHalf defaultValue={item.rating} /> {item.creation_date} </div>}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.prof.avatar} />}
                                            title={item.title}
                                            description={
                                                <div>
                                                    <a href={'/profile/'+item.prof.pk}>{item.prof.first_name + " " + item.prof.last_name}
                                                    </a>
                                                {
                                                    item.prof.review_count > 10 &&
                                                    <Icon style={{marginLeft: 10, color: '#DAA520'}} type="crown" theme="filled" twoToneColor="#DAA520" />
                                                }
                                                </div>    
                                            }
                                        />
                                        <div>{item.content}</div>
                                    </List.Item>
                                    )}
                                >

                                </List>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={20} style={{ marginBottom: 8 }} type="flex" justify="center">
                        <Col span={22}>
                            <Card title="Add A Review"
                            headStyle={{
                                fontSize: 20,
                                color: 'white',
                                fontStyle: 'italic',
                                fontFamily: 'Georgia', 
                                background: '#020037'
                            }}>
                                <AuthReviewForm authID={this.props.match.params.authID} fetchReviews={this.fetchReviews} />
                            </Card>
                        </Col>
                    </Row>
                </div>
        )
    }
}

class Title extends React.Component {
    render() {
        return (
            <h2>
                Title
            </h2>
        );
    }
}

export default AuthorDetail;