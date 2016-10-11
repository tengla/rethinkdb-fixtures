## rethinkdb-fixtures

Easily load fixtures into Rethinkdb. Useful for testing.

### Insert
```javascript

const options = {
    db: 'test',
    clear: true // This will make sure tables are cleared before inserting.
};
const rdbFix = require('rethinkdb-fixtures')(options);
const Insert = rdbFix.Insert;

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

Insert(fixture).then( (createdObjects) => {

    console.log(createdObjects.items, createdObjects.people);
}, console.error);
```

### Delete
```javascript
const options = {
    db: 'test'
};

const Delete = rdbFix.Delete;
Delete(['items', 'people']).then( (result) => {

    console.log(result); // standard rethinkdb change objects
},console.error);

// close
rdbFix.base.close().then( () => {

   console.log(`I've closed the connection`);
});
```

### To test: 
make sure you have an instance of rethinkdb running somewhere
```
npm test
```

### Command line usage

#### To insert:
```sh
export RETHINKDB=test
export FIXTURE=./fixtures.json
node ./bin/insert.js
```
#### To delete tables
```sh
export RETHINKDB=test
export TABLES='table1,table2,table3'
node ./bin/delete.js
```
