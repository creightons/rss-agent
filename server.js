const express = require('express');
const app = express();
const morgan = require('morgan');

app.set('view engine', 'pug');
app.set('views', './views');
app.use(morgan());

app.get('/', (req, res) => {
    res.status(200).render('index');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is live...');
});
