var chai      = require("chai"),
    sinon     = require("sinon"),
    sinonChai = require("sinon-chai"),
    rewire    = require("rewire"),
    expect    = chai.expect;

chai.use(sinonChai);

var createArticle = rewire('../../handlers/create_article/index');

describe('Handler createArticle', function(){
  var event, context, dbClient, fakeAWS, error;

  beforeEach(function(){
    context  = { succeed: sinon.spy(), fail: sinon.spy() };
    dbClient = { put: sinon.spy() };
    event    = {
      db: {
        tableNamespace: 'test_',
        config: {
          region: 'us-west-1',
          endpoint: 'http://localhost:8000'
        }
      },
      article: {
        title: "myTitle",
        text: "myText"
      }
    };

    error = {error: 'bad input'};

    var fakeUuid = {v4: function(){ return 'uuid'; }};
    fakeAWS  = {
      dbClient: function(){ return dbClient; },
      noError:  function(){ 
        return { put: function(p,cb){ cb(); }};
      },
      error:  function(){ 
        return {put: function(p,cb){ cb(error); }};
      }
    };

    createArticle.__set__('uuid', fakeUuid);
  });

  describe('.prepareParams()', function(){
    beforeEach(function(){
      createArticle.__set__('dynamoDB', fakeAWS.dbClient);
      createArticle.handler(event, context);
    });

    it('creates object to persist', function(){
      var expectedParams = {
        TableName: 'test_Articles',
        Item: {
          uuid: 'uuid',
          title: event.article.title,
          text: event.article.text
        }
      };

      expect(dbClient.put).to.have.been.calledWith(expectedParams);
    });
  });

  
  describe('.successFn()', function(){
    beforeEach(function(){
      createArticle.__set__('dynamoDB', fakeAWS.noError);
      createArticle.handler(event, context);
    });

    it('returns full created item', function(){
      var expectedParams = {
        uuid: 'uuid',
        title: event.article.title,
        text: event.article.text
      };

      expect(context.succeed).to.have.been.calledWith(expectedParams);
    });
  });

  describe('.failureFn()', function(){
    beforeEach(function(){
      createArticle.__set__('dynamoDB', fakeAWS.error);
      createArticle.handler(event, context);
    });

    it('returns full created item', function(){
      expect(context.fail).to.have.been.calledWith(error);
    });    
  });
});
