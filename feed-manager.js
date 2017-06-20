const FeedParser = require('feedparser');
const request = require('request');

function processFeed(req, res, url) {
    const feedRequest = request(url);
    const feedparser = new FeedParser();

    req.pipe(feedRequest);

    feedRequest.on('error', function(err) {
        console.log('request error:', err);
        res.status(500).send('error');
    });

    feedRequest.on('response', function(res) {
        const stream = this;
        
        if (res.statusCode !== 200) {
            this.emit('error', new Error('Bad status code'));
        }
        else {
            stream.pipe(feedparser);
        }
    });

    let count = 0;
    let enclosures = [];
    feedparser.on('data', function(chunk) {
        count += 1;
        console.log(`count = ${count}`, "\n", Object.keys(chunk), chunk.enclosures);
        enclosures.push(chunk.enclosures);
    });

    feedparser.on('end', function() {
        console.log('enclosures = ', enclosures);
    });

    feedparser.on('error', function(err) {
        console.log('feedparser error:', err);
        res.status(500).send('error');
    });

    feedparser.on('readable', function() {
        const stream = this;
        const meta = stream.meta;
        let item;
        let itemString;

        while(item = stream.read()) {
            itemString = JSON.stringify(item);
            res.write(itemString);
        }
    });

    feedparser.on('end', function() {
        res.end();
    });
}


module.exports = processFeed;
