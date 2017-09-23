var fs          = require('fs');
var path        = require('path');
var express     = require('express');
var bodyParser  = require('body-parser');
var sql = require('mssql');
var app         = express();

app.set('port', (process.env.PORT || 8000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.setHeader('Access-Control', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.listen(app.get('port'), function() {
  console.log('Server Started: http://localhost:' + app.get('port') + '/');
});

app.get('/api/comments', function(request, response) {

// Connection string parameters.
var sqlConfig = {
      user: 'USERNAME',
      password: 'PASSWORD',
      server: 'DB_SERVER',
      database: 'DATABASE',
      port: DEFAULT_PORT_1433,
}


  sql.connect(sqlConfig, function() {
    var request = new sql.Request();
    var stringRequest = 'select * id,author,body,avatarUrl from TABLENAME';
    request.query(stringRequest, function(err, recordset) {
          if(err) console.log(err);
    sql.close();  //this line must be executed before res.end() otherwise it will not be executed
    var result = '';
    result = recordset['recordset'];
    console.log(result);
    response.end(JSON.stringify(result));
    });
  });

});
