#!/usr/bin/env node
/*
 * Bug description: after having parsed a bulk response (GET), if an uncaught
 * exception happens in the callback the parser is left in an inconsistent
 * state, and further calls to redis-client inside a global exception handler
 * result in the parser hanging and the callback not being called.
 *
 */

var sys = require('sys'),
    client = require('../lib/redis-client').createClient();

var TEST_DB_NUMBER = 15,
    PASS = 0,
    FAIL = 1;

var exit_status = function(status){
    sys.puts(status === PASS ? 'PASS' : 'FAIL');
    process.exit(status);
};

setTimeout(function(){
    exit_status(FAIL);
}, 2000);

process.addListener('uncaughtException', function(){
  client.get('1234', function(){
    exit_status(PASS)
  });
});

client.setnx('1234', 'abcd', function(e, resp){
    client.get('1234', function(e, resp){
        throw new Exception('blah');
    })
});


