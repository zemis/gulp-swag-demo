'use strict';

var AWS  = require('aws-sdk'),
    uuid = require('uuid');

exports.handler = handler;

/////////////////////////////////////////////////////////////////

function handler(event, context) {
  console.log('createArticle received event: ', JSON.stringify(event, null, 2));

  if (typeof event.article === 'undefined' || Object.keys(event.article).length === 0){
    return context.done();
  }

  var params = prepareParams(event);
  dynamoDB(event.db.config).put(params, function(err){
    if (err) failureFn(err,  context);
    else     successFn(params.Item, context);
  });
}

function dynamoDB(config){
  return new AWS.DynamoDB.DocumentClient(config);
}

function prepareParams(event){
  return {
    TableName : event.db.tableNamespace + 'Articles',
    Item      : {
      uuid : uuid.v4(),
      title: event.article.title,
      text : event.article.text
    } 
  };
}

function successFn(data, context){
  console.log('createArticle responded with: ', JSON.stringify(data, null, 2));
  context.succeed(data);
}

function failureFn(err, context){
  console.log("createArticle error :", err);
  context.fail(err);
}
