const express = require('express');
const app = express();
const morgan = require('morgan');
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './mydb.sqlite3',
    },
});
const processFeed = require('./feed-manager');

app.set('view engine', 'pug');
app.set('views', './views');
app.use(morgan());

app.get('/', (req, res) => {
    knex.select('name', 'url').from('feedlist')
        .then(rows => {
            return res.status(200).render('index', { feeds: rows });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error');
        });
});

app.get('/feed-form', (req, res) => {
    return res.status(200).render('add-feed-form');
});

app.get('/test-feed', (req, res) => {
    const feedStream = processFeed(req, 'https://www.npr.org/rss/podcast.php?id=510307');

    feedStream.pipe(res);

    /*
    feedStream.pipe(res);

    feedStream.on('data', function(data) {
        res.write(data);
    });

    feedStream.on('readable', function() {
        const stream = this;
        let item;
        while(item = stream.read()) {
            console.log('here');
            res.write(item);
        }
        res.end();
    });

    feedStream.on('end', function() {
        res.end();
    });

    req.pipe(feedStream).pipe(res);
    */
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is live...');
});
