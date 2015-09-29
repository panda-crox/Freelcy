var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    fs = require('fs'),
    i18n = require('i18n'),
    moment = require('moment'),
    io = require('socket.io')(http),
    favicon = require('serve-favicon'),
    twig = require('twig'),
    helpersPath = './server/helpers/';


// App configure
app
    .set('isDev', app.get('env') == 'development')
    .set('config', require('./config'))
    .set('port', process.env.PORT || 3000)
    .set('views', __dirname + '/client')
    .set('view options', {layout: 'layouts/default'})
    .set('view engine', 'twig')
    .use(express.static('build'))
    //.use(favicon(__dirname + '/favicon.ico'))
    .locals.App = {};


// i18n configure
i18n.configure({
    locales: app.get('config').locales,
    updateFiles: false,
    directory: './locales'
});


app.all('*', function  (req, res, next) {

    var render = res.render,
        langs = req.get('accept-language') || '',
        lang = langs.replace(/(-|,)(.*)/, '');

    if (app.get('config').locales.indexOf(lang) != -1) {
        i18n.setLocale(lang);
        moment.locale(lang);
    }

    app.locals.App.config = app.get('config');
    app.locals.App.request = req;
    app.locals.App.lang = lang;

    // Helpers
    fs.readdirSync(helpersPath).forEach(function(file) {
        var _file = file.split('.'),
            filePath = helpersPath + file;

        app.locals.App[_file[0]] = require(filePath);
    });

    res.render = function (view, data) {

        res.render = render;

        res.render('layouts/common/common', {view: view, data: data});
    };

    next();
});


app.get(/\.(json)$/, function (req, res) {
    var pathname = req._parsedUrl.pathname,
        filePath = process.cwd() + pathname;

    res.type(mime.lookup(filePath));
    res.end(fs.readFileSync(filePath));
});


app.get('/', function (req, res) {
    res.render('main');
});


// Socet.IO
io.on('connection', function (socket) {
    console.log('a user connected');
});


// Start server
http.listen(process.env.PORT || 3000, function () {
    console.log('\x1b[36m%s\x1b[0m', 'App server started');
});
