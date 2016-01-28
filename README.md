## rethinkdb-fixtures

Easily load fixtures into Rethinkdb. Useful for testing.

### Usage:
```
const Prepare = require('rethinkdb-fixtures').Prepare;
const prep = Prepare({ db: 'test' });
const fixture = {
    people: {
        name: 'John Doe',
        age: 23
    }
};

prep.connect()
.then(console.log, console.error)
.then(prep.fill.bind(prep, fixture)) // returns array of promises
.then( (promises) => {

    return Promise.all(promises); // resolve all of them
})
.then( (result) => {

    console.log(result[0].people); // newly created people
    prep.close();
});
```
