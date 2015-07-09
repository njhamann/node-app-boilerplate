var sequelize_fixtures = require('sequelize-fixtures');
var models  = require('../models');
var models = {
    ServiceType: models.ServiceType,
    Service: models.Service
};

sequelize_fixtures.loadFile('fixtures/*.json', models).then(function(){
    //doStuffAfterLoad();
});

