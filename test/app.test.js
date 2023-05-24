const { app } = require('../index');


const port = process.env.TEST_PORT;

app.listen(port, () => {
    console.log(`Test server listening on port ${port}`);
});

module.exports = app;