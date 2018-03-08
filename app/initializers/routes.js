'use strict';

const util = require('util');
const fs = require('fs');
const path = require('path');
const express = require('express');
const readDir = util.promisify(fs.readdir);
const logger = require('../../lib/logger');
const yaml = require('node-yaml').readSync;

const generic = require('../../lib/routes/generic');

module.exports = async (app) => {
    logger.info('[ROUTES] Initializing');

    const array = yaml('../../config/routes.yml').generic;

    for (let i in array) {
        try {
            logger.info('[ROUTES] Setting up router path for /' + array[i]);

            const router = express.Router();

            generic(router, array[i]);

            app.use('/' + array[i], router);
        } catch(e) { throw e; }
    }

    const folder = appRoot + '/app/routes';
    const files = await readDir(folder);

    for (let i in files) {
        try {
            let name = path.parse(files[i]).name,
                ext = path.parse(files[i]).ext;

            if (ext !== '.js') continue;

            logger.info('[ROUTES] Setting up router path for /' + name);

            const router = express.Router();

            require(path.join(folder, name))(router, name);

            app.use('/' + name, router);
        } catch(e) { throw e; }
    }
};
