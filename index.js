const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

//MiddleWare
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
const apiRoutes = require('./routes/apiRoutes');
const viewRoutes = require('./routes/viewRoutes');
app.use('/api', apiRoutes);
app.use('/', viewRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = app;