//wrapper function

require('dotenv').config();
const Database = require('dbcmps369');

class PlacesDB {
    //initialize database
    constructor() {
        //creates a database object
        this.db = new Database();
    }

    //structures the database
    async initialize() {
        await this.db.connect();
        await this.db.schema('Place', [
            { name: 'id', type: 'INTEGER' },
            { name: 'label', type: 'TEXT' },
            { name: 'address', type: 'TEXT' },
            { name: 'lat', type: 'NUMERIC' },
            { name: 'lng', type: 'NUMERIC' }
        ], 'id');
    }

    // return all places
    async findPlaces() {
        console.log("findPlaces function called");
        const places = await this.db.read('Place', []);
        return places;
    }

    //create place (given a label and address)
    async createPlace(label, address, lat, lng) {
        console.log("createPlace function called");
        const id = await this.db.create('Place', [
            { column: 'label', value: label },
            { column: 'address', value: address },
            { column: 'lat', value: lat },
            { column: 'lng', value: lng }
        ]);
        return id;
    }

    //delete place (given an ID)
    async deletePlace(id) {
        console.log("deletePlaces function called");
        await this.db.delete('Place', [{ column: 'id', value: id }]);
    }
}

module.exports = PlacesDB;