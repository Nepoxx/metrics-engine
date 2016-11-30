'use strict';

// Boot server
import * as debug from 'debug';
import app from './app';

const port = process.env.PORT || 3000;
app.set('port', port);

app.listen(app.get('port'), () => {
  debug('Express server listening on port ' + port);
  console.log('Express server listening on port ' + port);
}).on('error', err => {
  console.log('Cannot start server, port most likely in use');
  console.log(err);
});
