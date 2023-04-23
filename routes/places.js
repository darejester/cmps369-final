//router

const express = require('express');
const router = express.Router();
const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });

router.get('/', async (req, res) => {
    console.log("router.get");
    const places = await req.db.findPlaces();
    
    //returns a json object with a list of places
    res.json({ places: places });
});

router.put('/', async (req, res) => {
    console.log("router.put");

    //geocode the input address
    // const result = await geocoder.geocode("505 Ramapo Valley Road, Mahwah NJ");
    const result = await geocoder.geocode(req.body.address);

    console.log(req.body.address);
    console.log(result.length);
    if (result.length > 0) {
        console.log(`The location of Ramapo is ${result[0].latitude}/${result[0].longitude}`);
        console.log(`The location of Ramapo is ${result[0].formattedAddress}`);

        const id = await req.db.createPlace(req.body.label, result[0].formattedAddress,result[0].latitude, result[0].longitude);

        res.json({ id: id, label:req.body.label, address: result[0].formattedAddress, lat:result[0].latitude, lng:result[0].longitude });
    } else {
        
    }
});

router.delete('/:id', async (req, res) => {
    console.log("router.delete");
    await req.db.deletePlace(req.params.id);

    res.status(200).send();
})

module.exports = router;