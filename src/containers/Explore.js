import React from 'react';
import Books from '../components/Book';
import axios from 'axios';
import {List, Card, Rate, Layout, Menu, Input, Row, message} from 'antd';
import {Form, FormControl, Button } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import { MDBView } from "mdbreact";
import ArrowImg from '../images/arrow.png';
import Logo from '../images/logo.png';
// import Text from 'react-native';

import ReactCardFlip from 'react-card-flip';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

// const goldenStyle = {
//     color: 'green',
//   };

class Explore extends React.Component {
    
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
            booksFiltered: [],
            isFlipped: false,
            error: false,
        };
    }

    handleClick = (item) => {
        item.isFlipped = !item.isFlipped;
        this.setState(prevState => ({ isFlipped: !prevState.isFlipped}));
    }

    handleSortChange = (event) => {
        var obj = [...this.state.books];

        switch(event){
            case 'title': 
                obj.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'rating':
                obj.sort((a, b) => b.rating - a.rating);
                break;
            case 'publication_date':
                obj.sort((a, b) => b.publication_date.localeCompare(a.publication_date));
                break;
        }

        this.setState({booksFiltered: obj});
    }

    handleGenreChange = (event) => {
        this.setState({booksFiltered: this.state.books.filter(obj => obj.genre == event)});
    }

    errorMessage = () => {
        message.error('Please do not use special characters Before Submitting!');
        this.setState({error: false});
    }

    handleSearch = (event) => {
        event.preventDefault();
        console.log(event.target.elements.tgtname.value);
        const title = event.target.elements.tgtname.value;
        
        if( !title.match("^[0-9A-Za-z\s]+$") )
        {
            this.setState({error: false});
            return;
        }


        axios.get(`http://127.0.0.1:8000/library/search/${title}`).then(res => {
            this.setState({
                books: res.data
            });
            for(var i=0; i<this.state.books.length; ++i){
                this.state.books[i].isFlipped = false
            }

            this.setState({
                booksFiltered: this.state.books
            })
        })
        .catch(error => console.log(error));
    }

    componentDidMount = () => {
        axios.get("http://127.0.0.1:8000/library/booklist/").then(res => {
            this.setState({
                books: res.data
            });
            for(var i=0; i<this.state.books.length; ++i){
                this.state.books[i].isFlipped = false
            }
            this.setState({
                booksFiltered: this.state.books
            })
        })
        .catch(error => console.log(error));
    }
    
    render() {
        return (
            <Layout style={{ padding: '0 0', background: '#020037'}}>
                {this.state.error ?
                    this.errorMessage()
                    :
                    <b></b>
                }
                <Sider width={220}>
                    <img src={Logo} style={{width:175, marginLeft: 22, marginTop: 25}} />
                    <Menu
                        mode="inline"
                        theme="dark"
                        defaultSelectedKeys={[3]}
                        style={{paddingLeft: 0, paddingTop: 10 }}
                    >
                        <Menu.Item key="1" onClick={()=> this.handleSortChange('publication_date')}>
                        Newest Collection
                        </Menu.Item>
                        <Menu.Item key="2" onClick={() => this.handleSortChange('rating')}>Top Rated</Menu.Item>
                        <Menu.Item key="3" onClick={() => this.handleSortChange('title')}>Title</Menu.Item>
                        <SubMenu key="genre" title='Genre'>
                        <Menu.Item key="FA" onClick={() => this.handleGenreChange('FA')}>Fantasy</Menu.Item>
                        <Menu.Item key="NF" onClick={() => this.handleGenreChange('NF')}>Non Fiction</Menu.Item>
                        <Menu.Item key="RO" onClick={() => this.handleGenreChange('RO')}>Romance</Menu.Item>
                        <Menu.Item key="TH" onClick={() => this.handleGenreChange('TH')}>Thriller</Menu.Item>
                        <Menu.Item key="MY" onClick={() => this.handleGenreChange('MY')}>Mystery</Menu.Item>
                        <Menu.Item key="BI" onClick={() => this.handleGenreChange('BI')}>Biography</Menu.Item>
                        <Menu.Item key="FI" onClick={() => this.handleGenreChange('FI')}>Fiction</Menu.Item>
                        <Menu.Item key="SF" onClick={() => this.handleGenreChange('SF')}>Science Fiction</Menu.Item>
                        </SubMenu>

                        <div style={{marginTop: 50, marginLeft: 22}}>{`Unsure of the title of the`}</div>
                        <div style={{marginTop: 22, marginLeft: 22}}>{`book? Search by substring`}</div>
                        <div style={{marginTop: 22, marginLeft: 22}}>{`below!`}</div>
                        <div> <img src ={ArrowImg} style={{width: 40, marginTop: 10, marginLeft: 90}}></img> </div>

                        <Form inline onSubmit={(event) => this.handleSearch(event)}>
                            <FormControl style={{marginTop: 40, marginLeft: 22, width: 180}}
                            type="text" placeholder="Search" className="mr-sm-2" name="tgtname"
                            />
                            <Button style={{marginTop: 15, marginLeft: 22}}
                                    variant="outline-success" 
                                    type="primary">
                                    Search
                            </Button>
                        </Form>
                    </Menu>
                </Sider>

                <Content>
                    
                <List
                grid={{
                    gutter: 16, column: 3
                }}
                style={{
                  paddingTop: 50, paddingLeft: 80, paddingRight: 10, paddingBottom: 10
                }}
                pagination={{
                onChange: (page) => {
                    console.log(page);
                },
                pageSize: 12,
                }}
                dataSource={this.state.booksFiltered}
                
                renderItem={item => (
                    <List.Item style={{height: 450}}>
                        <ReactCardFlip isFlipped={item.isFlipped} flipDirection="horizontal">
                        <Card
                            hoverable
                            style={{ width: 240, background: '#F6C564'}}
                            cover={
                                <MDBView hover zoom>
                                <img alt={item.title} src={item.image_url} style={{height: 350}} width="100%" height="100%" />
                                </MDBView>
                            }
                            onClick={() => this.handleClick(item)}
                            key="front"
                        >
                            <Card.Meta
                            title={<a style={{color: 'black'}} href={'/booklist/'+item.pk}>{item.title }</a>}
                            />
                        </Card>

                        <Card
                            title={<a href={'/booklist/'+item.pk}><b>{item.title }</b></a>}
                            style={{width: 240, height: 350, background: '#F6C564'}}
                            key="back"
                            onClick={() => this.handleClick(item)}
                        >
                            <p>Date: {item.publication_date}</p>
                            <p>Genre: {this.state[item.genre]}</p>
                            <p>Rating: <Rate disabled allowHalf value={item.rating} /></p>
                            <p>Reviews: {item.number_of_reviews}</p>
                        </Card>
                        </ReactCardFlip>
                    </List.Item>
                )}
            />

                </Content>
            </Layout>


        )
    }
}

export default Explore;