import React from 'react';
import Books from '../components/Book';
import axios from 'axios';



class BookList extends React.Component {
    
    state = {
        books: []
    }

    fetchBooks = () => {
        axios.get("http://127.0.0.1:8000/library/booklist/").then(res => {
          this.setState({
            books: res.data
          });
        });
      }

    componentDidMount() {
        this.fetchBooks();
    }
    
    render() {
        return (
            <Books data={this.state.books} />
        )
    }
}

export default BookList;