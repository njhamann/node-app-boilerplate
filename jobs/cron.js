var kue = require('kue')
  , queue = kue.createQueue();
var cronJob = require('cron').CronJob;

function start(){
    new cronJob('* * * * * *', function(){
        console.log('adding job');
        var job = queue.create('email', {
            title: 'welcome email for tj'
          , to: 'tj@learnboost.com'
          , template: 'welcome-email'
        }).save( function(err){
           if( !err ) console.log( job.id );
        });
    }, null, true);
}

module.exports = start;
