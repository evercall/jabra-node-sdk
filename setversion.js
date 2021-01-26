const replace = require('replace-in-file');
const path = require('path');

console.log('bumping package version');
const packageFile = path.join(__dirname, '/', 'package.json');
const version = require(packageFile).version;
const from = `version": "${version}`;
const to = `version": "${process.env.BUILD_BUILDNUMBER}`;

const options = {
    files: [ 'package.json'],
    from,
    to,
  };

  try {
    const changes = replace.sync(options);
    // TODO: replace with loggingService
    console.log('Modified files:', changes.join(', '));
  }
  catch (error) {
    // TODO: replace with loggingService
    console.error('Error occurred:', error);
  }