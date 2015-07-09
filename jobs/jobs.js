var kue = require('kue');
var cron = require('./cron')();
var queue = kue.createQueue();

queue.process('email', function(job, done){
    console.log('processing job');
    email(job.data.to, done);
});

function email(address, done) {
  // email send stuff...
    done();
    console.log('job complete');
}
