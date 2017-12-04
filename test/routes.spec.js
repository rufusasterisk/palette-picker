const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

before((done) => {
  database.migrate.latest()
    .then( () => done())
    .catch(error => {
      throw error;
    });
});

beforeEach((done) => {
  database.seed.run()
    .then(() => done())
    .catch(error => {
      throw error;
    });
});

describe('Client Routes', () => {
  // it('should return the homepage', (done) => {
  //   return chai.request(server)
  //     .get('/')
  //     .then(response => {
  //       response.should.have.status(200);
  //       response.should.be.html;
  //       done();
  //     })
  //     .catch(error => {
  //       // eslint-disable-next-line no-console
  //       console.log(error);
  //     });
  // });
  // 
  // it('should return a 404 for a route that does not exist', (done) => {
  //   return chai.request(server)
  //     .get('/sad')
  //     .then(response => {
  //       response.should.have.status(404);
  //       // done();
  //     })
  //     .catch(error => {
  //       // eslint-disable-next-line no-console
  //       console.log(error);
  //       // done();
  //     });
  // });
});

describe('API Routes', () => {

});
