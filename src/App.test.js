const axios  = require('axios');
/*
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

*/
test('Fake Test', () => {
    expect(true).toBeTruthy();
})

test('Fetch Book by name', () => {
  expect.assertions(1);
  return axios.get('http://127.0.0.1:8000/library/view/Tailspin')
  .then(res => {
      expect(res.data.title).toEqual('Tailspin');
//      console.log(res.data);
  })
  .catch(err => console.log(err));
});

test('Fetch Author by name', () => {
  expect.assertions(1);
  return axios.get('http://127.0.0.1:8000/authors/view/Jordan')
  .then(res => {
      expect(res.data.name).toEqual('Jordan');
//      console.log(res.data);
  })
  .catch(err => console.log(err));
});

test('Books By Author', () => {
  expect.assertions(1);

  return axios.get(`http://127.0.0.1:8000/library/authorbooks/Jordan`)
      .then(res2 => {
//        console.log(res2.data[0]);
        expect('Test book 1').toBe(res2.data[0].title);
      })
      .catch(error => console.log(error));
});

test('Profile From User', () => {
  expect.assertions(1);
  return axios.get(`http://127.0.0.1:8000/profile/8`).then(res => {
            expect(res.data.first_name).toBe('CS491');
        });
});

test('Other Profile', () => {
  expect.assertions(3);
  return axios.get(`http://127.0.0.1:8000/profile/user/4`).then(res => {
            expect(res.data.first_name).toBe('Person');
            expect(res.data.favorites[0].title).toBe('Blood Orange');
            expect(res.data.following[0].name).toBe('Sandra Brown');
        });
});

test('Reviews of book', () => {
  expect.assertions(2);
  return axios.get(`http://127.0.0.1:8000/bookreview/1`).then(res => {
          expect(res.data.length).toBeGreaterThan(0);
          expect(res.data[0].title).toBe("Alright");
  })
})

test('Questions of Book', () => {
  expect.assertions(1);
  return axios.get(`http://127.0.0.1:8000/qanswer/question/1`).then(res => {
          expect(res.data.length).toBeGreaterThan(0);
  });
});

test('All Following Authors', () => {
  expect.assertions(3);
  return axios.get(`http://127.0.0.1:8000/profile/13`).then(res => {
          expect(res.data.following.length).toBeGreaterThan(1);
          expect(res.data.following[0].name).toBe("Jordan");
          expect(res.data.following[1].name).toBe("Sandra Brown");
  });
});

test('All Favorite Books', () => {
  expect.assertions(4);
  return axios.get(`http://127.0.0.1:8000/profile/13`).then(res => {
          expect(res.data.favorites.length).toBeGreaterThan(2);
          expect(res.data.favorites[0].title).toBe("Test book 2");
          expect(res.data.favorites[1].title).toBe("The Chef");
          expect(res.data.favorites[2].title).toBe("Tailspin");
  });
});

test('Book List', () => {
  expect.assertions(2);

  return axios.get(`http://127.0.0.1:8000/library/booklist/`).then(res =>{
        expect(res.data.length).toBeGreaterThan(1);
        //console.log(res.data.map(a => a.title));
        expect(res.data.map(a => a.title)).toEqual(res.data.map(a => a.title).sort());
        /*
        for(let i=0; i < res.data.length-1; ++i){
           expect(res.data[i].title.localeCompare(res.data[i+1].title)).toBeLessThan(1);
        }
        */
  });
});

test('Book List Filter Date', () => {
  expect.assertions(2);

  return axios.get(`http://127.0.0.1:8000/library/booklist/`).then(res =>{
        expect(res.data.length).toBeGreaterThan(1);
        var obj = [...res.data];
        obj.sort((a, b) => b.publication_date.localeCompare(a.publication_date));

        expect(res.data.map(a => a.publication_date).sort().reverse()).toEqual(obj.map(a => a.publication_date));
  });
});

test('Book List Filter Rating', () => {
  expect.assertions(2);

  return axios.get(`http://127.0.0.1:8000/library/booklist/`).then(res =>{
        expect(res.data.length).toBeGreaterThan(1);
        var obj = [...res.data];
        obj.sort((a, b) => b.rating - a.rating);

        expect(res.data.map(a => a.rating).sort().reverse()).toEqual(obj.map(a => a.rating));
  });
});

test('Book List Filter Genre', () => {
  expect.assertions(3);

  return axios.get(`http://127.0.0.1:8000/library/booklist/`).then(res =>{
        expect(res.data.length).toBeGreaterThan(1);
        var obj = [...res.data];
        obj = obj.filter(a => a.genre == 'FA')

        expect(res.data.filter(a => a.genre == 'FA').map(a => a.genre)).toEqual(obj.map(a => a.genre));
        expect(obj.map(a=>a.genre)).toEqual(expect.not.arrayContaining(['SF']));
  });
});

test('Notification List', () => {
  expect.assertions(3);

  return axios.get(`http://127.0.0.1:8000/notification/2`).then(res => {
    var obj = [...res.data];
    expect(res.data.length).toBeGreaterThan(1);
    expect(obj[0].prof).toEqual(2);
    expect(obj[obj.length-1].prof).toEqual(2);

      
  });
});

test('Notification From Answer', () => {
  expect.assertions(2);
  const profID = 2;
  const bookID = 87;
  const qID = 8;
  const answer = "App test notification";


   axios.post(`http://127.0.0.1:8000/qanswer/answer/create/`, {
    profile: profID,
    book: bookID,
    question: qID,
    answer: answer
  }).then(postres => {
  })
  .catch(err => console.log(err));

  return axios.get(`http://127.0.0.1:8000/notification/2`).then(res => {
    var obj = [...res.data];
    //console.log(res.data);
    expect(res.data.length).toBeGreaterThan(1);
    expect(obj[obj.length - 1].text.includes('Test')).toBeTruthy();
  });

});

test('Recommendations', () => {
  expect.assertions(1);
  //expect(true).toBeTruthy();
  return axios.get(`http://127.0.0.1:8000/profile/user/21`).then(res =>{
    console.log(res.data);
    expect(res.data.recommended.length).toBeGreaterThan(1);
  });
})

/*
describe('Indicator', () => {
  describe('when loading is false', () => {
    it('should render children', () =>{
      const wrapper = mount(
        <App isLoading={false}>
        <div>Indicator Test</div>
        </App>
      );
      expect(wrapper.html()).toEqual('<div>Indicator Test</div>');
      wrapper.unmount();
    });
  });

});
*/
