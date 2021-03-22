const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const layouts = require('express-ejs-layouts');
const path = require('path');
const { navRoutes, routes } = require('@contrast/test-bench-utils');
const express = require('express');

module.exports.setup = function(app) {
  require('./vulnerabilities/static');
  app.use('/assets', express.static(path.join(__dirname, 'public')));
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(bodyParser.json({ limit: '50mb', extended: true }));
  app.use(cookieParser('keyboard cat'));

  app.set('views', `${__dirname}/views`);
  app.set('view engine', 'ejs');
  app.use(layouts);
  app.use(
    cors({
      origin: /^https?:\/\/(localhost|127\.0\.0\.1):\d+/
    })
  );

  // dynamically register routes from shared config
  navRoutes.forEach(({ base }) => {
    app.use(base, require(`./vulnerabilities/${base.substring(1)}`));
  });
  app.use('/header-injection', require('./vulnerabilities/header-injection'));
  app.use('/typecheck', require('./vulnerabilities/typecheck'));
  app.use('/express-session', require('./vulnerabilities/express-session'));

  // adding current year for footer to be up to date
  app.locals.navRoutes = navRoutes;
  app.locals.currentYear = new Date().getFullYear();

  app.get('/', function(req, res) {
    res.render('pages/index');
  });
  app.get('/info', function(req, res) {
    res.json({
      framework: 'Express',
      routes: Object.values(routes).map((route) => ({
        ...route,
        sinks: route.sinks ? Object.keys(route.sinks) : []
      }))
    });
  });

  app.get('/quit', function(req, res) {
    res.send('adieu, cherie');
    process.exit(); // eslint-disable-line
  });
};
