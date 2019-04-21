import React from 'react';
import axios from 'axios';
import { Card, Row, Col, List, message, Avatar, Icon, Rate } from "antd";
import reqwest from 'reqwest';
import InfiniteScroll from 'react-infinite-scroller';
import QAnswer from '../components/QAnswer';
import ReviewForm from '../forms/ReviewForm';

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

class BookDetail extends React.Component {

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
            reviews: [],
            loading: false,
            hasMore: true,
            following: false,
            iconTheme: "outlined"
        };
    }  

    componentDidMount = () => {
        
        const bookID = this.props.match.params.bookID;
        this._isMounted=true;
        const profID = localStorage.getItem("profID");
        
        axios.get(`http://127.0.0.1:8000/profile/favorites/${profID}`).then(res => {
            if(res.data.favorites.some(e => e.pk == bookID)) {
                this.setState({
                    iconTheme: !this.state.following ? "filled" : "outlined" ,
                    following: !this.state.following
        
                });
            }
        })
        .catch(err => { console.log(err) });

        axios.get(`http://127.0.0.1:8000/library/booklist/${bookID}`).then(res => {
          this.setState({
            // book: res.data
            title: res.data.title,
            author_name: res.data.author_name,
            publication_date: res.data.publication_date,
            image_url: res.data.image_url,
            genre: this.state[res.data.genre],
            rating: res.data.rating,
            number_of_reviews: res.data.number_of_reviews,
            synopsis: res.data.synopsis
          });

          axios.get(`http://127.0.0.1:8000/authors/view/${this.state.author_name}`)
          .then(res => {
              this.setState({
                  authID: res.data.pk,
              });
          })
          .catch(error => console.log(error));

        })
        .catch(error => console.log(error));

        this.fetchReviews();
    }

    fetchReviews = () => {
        const bookID = this.props.match.params.bookID;
        axios.get(`http://127.0.0.1:8000/bookreview/${bookID}`).then(res => {
            this.setState({
                reviews: res.data,
                max_length: res.data.length,
                current_length: Math.min(3, res.data.length)
            })
            for(var i=0; i<this.state.reviews.length; ++i){
                this.state.reviews[i].isLiked = false
                this.state.reviews[i].isDisliked = false
            }

        })
        .catch(error => console.log(error));
    }

    handleInfiniteOnLoad = () => {
        let data = this.state.data;
        this.setState({
          loading: true,
          current_length: Math.min(this.state.current_length+3, this.state.max_length)
        });
        console.log(this.state)

        if (this.state.current_length >= this.state.max_length) {
          message.warning('Infinite List loaded all');
          this.setState({
            hasMore: false,
            loading: false,
          });
          return;
        }
    }
    
    handleFollow = () => {
        const profID = localStorage.getItem("profID");
        const bookID = this.props.match.params.bookID;
        axios.put(`http://127.0.0.1:8000/profile/addfavorite/${profID}`, {
            favorites: [bookID]
        })
        .then(res => {
            this.setState({
                iconTheme: !this.state.following ? "filled" : "outlined" ,
                following: !this.state.following
    
            })
            console.log(this.state)
        })
        .catch(error => console.log(error));


    }

    handleLike = (revID, inp) => {
        var review = this.state.reviews.filter(review => review.pk === revID)[0];
        if (review.isDisliked || review.isLiked)
            return;

        axios.put(`http://127.0.0.1:8000/bookreview/like/${revID}`, {
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

    componentWillUnmount(){
        this._isMounted = false;
        console.log("Unmounting");
    }

    render() {
        return (
                <div>
                    <Row gutter={20} style={{ marginBottom: 8 }} type="flex" justify="center">
                        <Col span={4}>
                            <Card bodyStyle={{
                                padding: 0
                            }}>
                                <img src={this.state.image_url} style={{
                                    width: 194, height: 285
                                }}
                                width="100%" height="100%" >
                                </img>
                            </Card>
                        </Col>
                        
                        <Col span={18}>
                            <Card 
                            title={
                                <div>
                                    {this.state.title} 
                                    <Icon style={{marginLeft: 10, color:'#fb928e'}} type="heart" theme={this.state.iconTheme} 
                                        twoToneColor="#eb2f96" onClick={this.handleFollow} />
                                </div>
                            } 
                            headStyle={{
                                fontSize: 20,
                                color: 'white',
                                fontStyle: 'italic',
                                fontFamily: 'Georgia', 
                                background: '#020037'
                            }}
                            >
                                <p>
                                    <b><i>Author: </i></b> 
                                    <a href={'/authors/'+this.state.authID} > {this.state.author_name} </a>
                                </p>
                                
                                <p>
                                    <b><i>Date of publication: </i></b> 
                                    {this.state.publication_date}
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

                    <Row gutter={20} style={{ marginBottom: 8 }} type="flex" justify="center">
                        <Col span={22}>
                            <Card style={toLeft} title="Synopsis/blurb"
                            headStyle={{
                                fontSize: 20,
                                color: 'white',
                                textAlign: 'left',
                                fontStyle: 'italic',
                                fontFamily: 'Georgia', 
                                background: '#020037'
                            }}
                            >
                                <p>
                                    {this.state.synopsis}
                                </p>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={20} style={{ marginBottom: 8 }} type="flex" justify="center">
                        <Col span={22}>
                            <Card title={<div style={{display:'flex', alignItems: 'stretch'}}>Reviews</div>}
                            headStyle={{
                                fontSize: 20,
                                color: 'white',
                                fontStyle: 'italic',
                                fontFamily: 'Georgia', 
                                background: '#020037'
                            }}
                            >

                                <List
                                    itemLayout="vertical"
                                    size="large"
                                    dataSource={this.state.reviews}
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
                            }}
                            >
                                <ReviewForm bookID={this.props.match.params.bookID} fetchReviews={this.fetchReviews} />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={20} type="flex" justify="center">
                        <Col span={22}>
                            <QAnswer bookID={this.props.match.params.bookID} />
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

export default BookDetail;