'use strict';

var expect  = require('chai').expect,
    request = require('superagent');

describe('/articles', function(){
  function url(path){ return 'http://localhost:5000'+path; }
  var params;

  describe('POST', function(){
    beforeEach(function(){
      params = {article: {title: "myTitle", text: "my text"}};
    });

    it('creates an article', function(done){
      request.post(url('/articles'))
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(params))
        .end(function(err, res){
          expect(res.status).to.eql(200);
          done();
        });
    });

    it('returns all articles params',function(done){
      request.post(url('/articles'))
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(params))
        .end(function(err, res){
          expect(res.body).to.have.all.keys('uuid','title','text');
          expect(res.body.title).to.eql(params.article.title);
          expect(res.body.text).to.eql(params.article.text);
          done();
        });
    });

    it('does nothing on bad input', function(done){
      params = {article:{}};
      request.post(url('/articles'))
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(params))
        .end(function(err, res){
          expect(res.status).to.eql(200);
          expect(res.body).to.eql('');
          done();
        });      
    });
  });

});
