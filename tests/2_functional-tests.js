/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', done => {
     chai.request(server)
      .get('/api/books')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', () => {

    const testBook = {
      _id: null,
      title: "Test",
      comments: []
    };

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', done => {

        const title = {
          "title": testBook.title
        };

        chai.request(server)
          .keepOpen()
          .post('/api/books')
          .send(title)
          .end((err, res) => {
            testBook._id = res.body._id;
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, '_id', 'object should contain _id');
            assert.property(res.body, 'title', 'object should contain title');
            done();
          });
      });
      
      test('Test POST /api/books with no title given', done => {

        const  noTitle = {
          "title": ""
        };

        chai.request(server)
          .keepOpen()
          .post('/api/books')
          .send(noTitle)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });

    });


    suite('GET /api/books => array of books', () => {
      
      test('Test GET /api/books', done => {
        chai.request(server)
          .keepOpen()
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.isArray(res.body, 'response should be an array of book objects');
            done();
          });
      });    

    });


    suite('GET /api/books/[id] => book object with [id]', () => {
      
      test('Test GET /api/books/[id] with id not in db', done => {

        const notInDB = "000000000000000000000000";

        chai.request(server)
          .keepOpen()
          .get(`/api/books/${notInDB}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db', done => {

        const validId = testBook._id;

        chai.request(server)
          .keepOpen()
          .get(`/api/books/${validId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, '_id', 'response should contain _id');
            assert.property(res.body, 'title', 'response should contain title');
            assert.property(res.body, 'comments', 'response should contain comments');
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      
      test('Test POST /api/books/[id] with comment', done => {

        const validId = testBook._id;
        const data = {
          "comment": "test comment"
        };

        chai.request(server)
          .keepOpen()
          .post(`/api/books/${validId}`)
          .send(data)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, '_id', 'response should contain _id');
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', done => {

        const validId = testBook._id;
        const data = {
          "comment": ""
        };

        chai.request(server)
          .keepOpen()
          .post(`/api/books/${validId}`)
          .send(data)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html')
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', done => {

        const notInDB = "000000000000000000000000";
        const data = {
          "comment": "test comment" 
        };

        chai.request(server)
          .keepOpen()
          .post(`/api/books/${notInDB}`)
          .send(data)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, 'no book exists');
            done();
          })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', () => {

      test('Test DELETE /api/books/[id] with valid id in db', done => {
        
        const validId = testBook._id;

        chai.request(server)
          .keepOpen()
          .delete(`/api/books/${validId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with id not in db', done => {

        const notInDB = "000000000000000000000000";

        chai.request(server)
          .keepOpen()
          .delete(`/api/books/${notInDB}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

  });

});
