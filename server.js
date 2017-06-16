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
    knex.select('name', 'id').from('feedlist')
        .then(rows => {
            const context = rows.map(row => {
                return { href: `/show-feed/${row.id}`, name: row.name };
            });
            return res.status(200).render('index', { context });
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
    const feedStream = processFeed(req, res, 'https://www.npr.org/rss/podcast.php?id=510307');
});

app.get('/show-feed/:feedId', (req, res) => {
    knex.select('url').from('feedlist').where({ id: req.params.feedId })
        .then(([ row ]) => {
            if (row === null || row === undefined) {
                return res.status(500).send('missing feed data');
            }
            else {
                processFeed(req, res, row.url);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error');
        });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is live...');
});
