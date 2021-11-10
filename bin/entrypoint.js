#!/usr/bin/env node

require = require('esm')(module /*, options*/);
require('../src/dialect.js').dialup(process.argv);