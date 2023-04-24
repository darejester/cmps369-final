//wrapper function

require('dotenv').config();
const Database = require('dbcmps369');

const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });

let markers = [];
// const L = require('leaflet');

class ContactDB {
    //initialize database
    constructor() {
        //creates a database object
        this.db = new Database();
    }

    //structures the database
    async initialize() {
        await this.db.connect();
        await this.db.schema('Contact', [
            { name: 'id', type: 'INTEGER' },
            { name: 'firstName', type: 'TEXT' },
            { name: 'lastName', type: 'TEXT' },
            { name: 'address', type: 'TEXT' },
            { name: 'phoneNumber', type: 'TEXT' },
            { name: 'emailAddress', type: 'TEXT' },
            { name: 'title', type: 'TEXT' },
            { name: 'contactByMail', type: 'INTEGER' },
            { name: 'contactByPhone', type: 'INTEGER' },
            { name: 'contactByEmail', type: 'INTEGER' },
            { name: 'latitude', type: 'REAL' },
            { name: 'longitude', type: 'REAL' }
        ], 'id');

        await this.db.schema('Users', [
            { name: 'id', type: 'INTEGER' },
            { name: 'firstName', type: 'TEXT' },
            { name: 'lastName', type: 'TEXT' },
            { name: 'username', type: 'TEXT' },
            { name: 'password', type: 'INTEGER' }
        ], 'id');

        const incomplete1 = await this.db.read('Contact', [{ column: 'firstName', value: "" }]);
        for (const c of incomplete1) {
            await this.db.delete('Contact', [{ column: 'id', value: c.id }]);
        }
        const incomplete2 = await this.db.read('Users', []);
        for (const c of incomplete2) {
            await this.db.delete('Users', [{ column: 'id', value: c.id }]);
        }
        
    }


    async createContact() {
        console.log("createContact");
        const id = await this.db.create('Contact', [
            //id is = to Users.length
            { column: 'firstName', value: "" },
            { column: 'lastName', value: "" },
            { column: 'address', value: "" },
            { column: 'phoneNumber',value: ""  },
            { column: 'emailAddress', value: ""  },
            { column: 'title', value: ""  },
            { column: 'contactByMail', value: 0 },
            { column: 'contactByPhone', value: 0 },
            { column: 'contactByEmail', value: 0 },
            { column: 'latitude', value: 0 },
            { column: 'longitude', value: 0 }
        ])
        return id;
    }

    async getAllContacts() {
        console.log("getAllContacts");
        const contacts = await this.db.read('Contact',[]);
        //delete empty contacts
        for(const contact of contacts)
        {
            if(contact.title == "")
            {
                this.deleteContact(contact.id);
            }
        }
        //delete all markers
        for (var i = 0; i < markers.length; i++) {
            map.removeLayer(markers[i]);
        }
        //add updated markers
        // for(const contact of contacts)
        // {
        //     marker = L.marker([newContact.latitude, newContact.longitude]).addTo(map).bindPopup(`<b>${newContact.lastName}</b><br/>${newContact.address}`);
        //     markers.push(marker);
        //     console.log(marker);
        // }
        
        
        //console.log(contacts);
        return contacts;
    }

     async recordContact(contact,newContact) {
        console.log("Record Contact");
        console.log(newContact);
       
        //get address of newContact
        const address = await geocoder.geocode(newContact.address);
        await this.db.update('Contact',
        [
            { column: 'firstName', value: newContact.firstName },
            { column: 'lastName', value: newContact.lastName },
            { column: 'address', value: address[0].formattedAddress },
            { column: 'phoneNumber', value: newContact.phoneNumber },
            { column: 'emailAddress', value: newContact.emailAddress },
            { column: 'title', value: newContact.title },
            { column: 'contactByMail', value: newContact.contactByMail },
            { column: 'contactByPhone', value: newContact.contactByPhone },
            { column: 'contactByEmail', value: newContact.contactByEmail },
            { column: 'latitude', value: address[0].latitude},
            { column: 'longitude', value: address[0].longitude }
        ],
        [
            { column: 'id', value: contact.id }
        ]
        );
    }

    async findContact(id) {
        const contact = await this.db.read('Contact', [{ column: 'id', value: id }]);
        console.log("findContact");
        console.log(contact[0]);
        if (contact.length > 0) 
        {
            return contact[0];
        }
        else {
            return undefined;
        }
    }


    async createUser() {
        console.log("createUser");
        const id = await this.db.create('Users', [
            //id is = to Users.length
            { column: 'firstName', value: "" },
            { column: 'lastName', value: "" },
            { column: 'username',value: ""  },
            { column: 'password', value: ""  }
        ])
        return id;
    }

    async getAllUsers() {
        console.log("getAllUsers");
        const users = await this.db.read('Users',[]);
        
        console.log(users);
        return users;
    }

    async findUser(id) {
        const user = await this.db.read('Users', [{ column: 'id', value: id }]);
        console.log("findUser");
        //console.log(contact[0]);
        if (user.length > 0) 
        {
            return user[0];
        }
        else {
            return undefined;
        }
    }

    async recordUser(user,newUser,password) {
        console.log("Record User");
        console.log(newUser);
        const id = await this.db.update('Users',
        [
            { column: 'firstName', value: newUser.firstName },
            { column: 'lastName', value: newUser.lastName },
            { column: 'username', value: newUser.username },
            { column: 'password', value: password },

        ],
        [
            { column: 'id', value: user.id }
        ]
        )
        return id;
    }

    async findUserByUsername(username) {
        const user = await this.db.read('Users', [{ column: 'username', value: username }]);
        //console.log(user.length);
        if (user.length > 0) 
        {
            return user[0];
        }
        else {
            return undefined;
        }
    }

    async findUserById(id) {
        const user = await this.db.read('Users', [{ column: 'id', value: id }]);
        if (user.length > 0) return user[0];
        else {
            return undefined;
        }
    }

    async deleteContact(id) {
        const user = await this.db.delete('Contact', [{ column: 'id', value: id }]);

        console.log("deleteContact");
        //console.log(contact[0]);
        if (user.length > 0) 
        {
            return user[0];
        }
        else 
        {
            return undefined;
        }
    }

}

module.exports = ContactDB;