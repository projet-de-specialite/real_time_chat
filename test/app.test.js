const { app, firestore } = require('../index');



const port = process.env.TEST_PORT || 3002;

app.listen(port, () => {
    console.log(`Test server listening on port ${port}`);
});

module.exports = app;