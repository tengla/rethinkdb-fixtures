## rethinkdb-fixtures

Easily load fixtures into Rethinkdb. Useful for testing.

### Insert
```
const Insert = require('rethinkdb-fixtures').Insert;

const options = {
    db: 'test',
    clear: true // This will make sure tables are cleared before inserting.
};

const fixture = {
        items: [
            {
                name: 'Bike'
            },
            {
                name: 'Wrench'
            }
        ],
        people: [
            {
                name: 'Wild Man Fischer'
            },
            {
                name: 'Charles Ponzi'
            }
        ]
    }
};

Insert(options,fixture).then( (createdObjects) => {

    console.log(createdObjects.items, createdObjects.people);
}, console.error);
```

### Delete
```
const options = {
    db: 'test'
};

const Delete = require('rethinkdb-fixtures').Delete;
Delete(options, ['items', 'people']).then( (result) => {

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
