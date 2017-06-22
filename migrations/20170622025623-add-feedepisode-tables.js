'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('feedepisodes', {
    columns: {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      feedid: 'int',
      title: 'string',
      description: 'text',
      summary: 'text',
      link: 'string',
      date: 'string',
      pubdate: 'string',
    },
    ifNotExists: true,
  }, function() {
    db.createTable('feedepisodelinks', {
      columns: {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        feedepisodeid: 'int',
        url: 'string',
      },
      ifNotExists: true,
    }, callback);
  });
};

exports.down = function(db, callback) {
  db.dropTable('feedepisodes', {
    ifExists: true,
  }, function() {
    db.dropTable('feedepisodelinks', {
      ifExists: true,
    }, callback);
  });
};

exports._meta = {
  "version": 1
};
