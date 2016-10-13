var router = require('express').Router();
var pg = require('pg');

var config = {
  database: 'rho',
};

// initialize the database connection pool
var pool = new pg.Pool(config);

//gets books for the page from the db

router.get('/', function (req, res) {

  // err - an error object, will be not-null if there was an error connecting
  //       possible errors, db not running, config is wrong

  // client - object that is used to make queries against the db

  // done - function to call when you're done (returns connection back to the pool)
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
      return;
    }

    // 1. SQL string
    // 2. (optional)  input parameters
    // 3. callback function to execute once the query is finished
    //      takes an error object and a result object as args
    client.query('SELECT * FROM books;', function (err, result) {
      done();
      if (err) {
        console.log('Error querying the DB', err);
        res.sendStatus(500);
        return;
      }

      console.log('Got rows from the DB:', result.rows);
      res.send(result.rows);
    });
  });
});

router.get('/:id', function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
      return;
    }

    client.query('SELECT * FROM books WHERE id = $1;', [req.params.id], function (err, result) {
      done();
      if (err) {
        console.log('Error querying the DB', err);
        res.sendStatus(500);
        return;
      }

      console.log('Got rows from the DB:', result.rows);
      res.send(result.rows);
    });
  });
});

//update existing row of db

router.put('/update', function (req, res) {
      var author;
      var title;
      var published;
      var edition;
      var publisher;
      var id = req.body.id;
      pool.connect(function (err, client, done) {
          try {
            if (err) {
              console.log('Error connecting the DB', err);
              res.sendStatus(500);
              done();
              return;
            }

            client.query('SELECT * FROM books WHERE id = $1;', [id], function (err, result) {
                if (err) {
                  console.log('Error querying the DB', err);
                  res.sendStatus(500);
                  return;
                }

                if (req.body.author == '') {
                  author = result.rows[0].author;
                } else {
                  author = req.body.author;
                }

                if (req.body.title == '') {
                  title = result.rows[0].title;
                } else {
                  title = req.body.title;
                }

                if (req.body.edition == '') {
                  edition = result.rows[0].edition;
                } else {
                  edition = req.body.edition;
                }

                if (req.body.published == '') {
                  published = result.rows[0].published;
                } else {
                  published = req.body.published;
                }

                if (req.body.publisher == '') {
                  publisher = result.rows[0].publisher;
                } else {
                  publisher = req.body.publisher;
                }

                console.log('ID: ', id);
                client.query('UPDATE books SET author=$1, title=$2, published=$3, edition=$4, publisher=$5 WHERE id=$6 returning *;', [author, title, published, edition, publisher, id],
                                 function (err, result) {
                                  if (err) {
                                    console.log('Error querying the DB', err);
                                    res.sendStatus(500);
                                    return;
                                  }

                                  console.log('Got rows from the DB:', result.rows);
                                  res.send(result.rows);
                                });
              });
          }
          finally {
            done();
          }
        });
    });

//adds new rows to db

router.post('/add', function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('Error connecting the DB', err);
      res.sendStatus(500);
      done();
      return;
    }

    client.query('INSERT INTO books (author, title, published, edition, publisher) VALUES ($1, $2, $3, $4, $5) returning *;',
                 [req.body.author, req.body.title, req.body.published, req.body.edition, req.body.publisher],
                 function (err, result) {
                  done();
                  if (err) {
                    console.log('Error querying the DB', err);
                    res.sendStatus(500);
                    return;
                  }

                  console.log('Got rows from the DB:', result.rows);
                  res.send(result.rows);
                });
  });
});

//deletes rows from db
router.delete('/', function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('Error connecting the DB', err);
      res.sendStatus(500);
      done();
      return;
    }

    client.query('DELETE FROM books WHERE id=$1;', [req.body.id],
                 function (err, result) {
                  done();
                  if (err) {
                    console.log('Error querying the DB', err);
                    res.sendStatus(500);
                    return;
                  }

                  console.log('Got rows from the DB:', result.rows);
                  res.send(result.rows);
                  res.sendStatus(204);
                  done();
                });
  });
});

module.exports = router;
