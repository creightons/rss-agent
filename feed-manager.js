const FeedParser = require('feedparser');
const request = require('request');

function processFeed(req, url) {
    const feedRequest = request(url);
    const feedparser = new FeedParser();

    req.pipe(feedRequest);

    feedRequest.on('error', function(err) {
        console.log('request error:', err);
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

    feedparser.on('error', function(err) {
        console.log('feedparser error:', err);
    });

    /*
    feedparser.on('readable', function() {
        const stream = this;
        const meta = stream.meta;
        let item;

        while(item = stream.read()) {
            console.log(item);
        }
    });
    */

    return feedparser;
}


module.exports = processFeed;
