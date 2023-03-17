require('dotenv').config()
const axios = require('axios')

module.exports = {
    nearby: async function(lat, lng) {
        const locations = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lng}&radius=4828&&keyword=public%20toilet&key=${process.env.APIKEY}`)
        return locations.data
    },
    locate: async function(q) {
        const latLng = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${q}&key=${process.env.APIKEY}`)
        return latLng.data
    },
    reverseLocate: async function(lat, lng) {
        const latLng = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.APIKEY}`)
        return latLng.data
    },
    placeId: async function(str) {
        const info = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${str}&key=${process.env.APIKEY}`)
        return info.data
    }
}