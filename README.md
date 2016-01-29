## rethinkdb-fixtures

Easily load fixtures into Rethinkdb. Useful for testing.

### Insert
```
const Insert = require('rethinkdb-fixtures').Insert;

const options = {
    db: {
        db: 'test'
    },
    fixture: {
        items: [
            {
                name: 'Item 1'
            },
            {
                name: 'Item 2'
            }
        ]
    }
};

Insert(options).then( (result) => {

    console.log(result.items);
}, console.error);
```

### Delete
```
const Delete = require('rethinkdb-fixtures').Delete;
Delete(options.db, ['items', 'weirdos']).then( (result) => {

    console.log(result); // standard rethinkdb change objects
},console.error);

```

### To test: 
make sure you have an instance of rethinkdb running somewhere
```
npm test
```

### Command line usage

#### To insert:
```
export RETHINKDB=test
export FIXTURE=./fixtures.json
node ./bin/insert.js
```
#### To delete tables
```
export RETHINKDB=test
export TABLES='table1,table2,table3'
node ./bin/delete.js
```