import React, {Component} from 'react';
import './bg.css';
import Background from '../images/books.jpg';


class BackgroundImage extends Component {
    componentWillMount() {
      var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight|| e.clientHeight|| g.clientHeight;
      
      this.setState({x:x,y:y});
    }

    render() {
        return (
            <div>
              <img className='bg' src={Background} />
            </div>
            
            );
    }
}

export default BackgroundImage;

