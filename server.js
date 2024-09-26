const express = require('express');
const geohash = require('ngeohash');  
const haversine = require('haversine');  
const cors = require('cors');  

const app = express();
const port = 8000;

app.use(cors({
    origin: 'http://localhost:3000'  
}));

app.use(express.json());

const facilities = {
    'AC Lounge': { lat: 17.7214519, lng: 83.2904527 },
    'Entry 1': { lat: 17.7224525, lng: 83.2899168 },
    'Entry 2': { lat: 17.7213924, lng: 83.2904539 },
    'Entry 3': { lat: 17.7208815, lng: 83.2906619 },
    'General Waiting Hall': { lat: 17.7220981, lng: 83.2900289 },
    'Pay & Use Toilets': { lat: 17.7204036, lng: 83.2906732 },
    'Rail Dhaba Station': { lat: 17.7218275, lng: 83.2901662 },
    'Reserved Lounge': { lat: 17.7224788, lng: 83.2898775 }
};

app.post('/calculate-distance', (req, res) => {
    const { userLat, userLng, facilityName } = req.body;

    const facility = facilities[facilityName];
    if (!facility) {
        return res.status(400).json({ message: 'Facility not found' });
    }
    const userGeohash = geohash.encode(userLat, userLng);
    const facilityGeohash = geohash.encode(facility.lat, facility.lng);

    console.log(`User Geohash: ${userGeohash}, Facility Geohash: ${facilityGeohash}`);

    const userCoordinates = { latitude: userLat, longitude: userLng };
    const facilityCoordinates = { latitude: facility.lat, longitude: facility.lng };

    const distance = haversine(userCoordinates, facilityCoordinates, { unit: 'meter' });

    res.json({
        facilityName: facilityName,
        distance: distance,
        message: `Distance to ${facilityName} calculated successfully`
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
