const { Client } = require("@googlemaps/google-maps-services-js");

const client = new Client({});

const getClosestWorkers = async (cus, nearbyLocs) => {
  try {
    let originCusLoc;
    let destinations = [];
    let nearbyDistanceValues = [];

    // console.log("nearbyLocs before", nearbyLocs);

    nearbyLocs = nearbyLocs.filter((loc) => {
      if (String(loc._id) == cus.jobOwner) {
        originCusLoc = loc;
        return false;
      } else {
        destinations.push({
          lat: loc.location.coordinates[1],
          lng: loc.location.coordinates[0],
        });
        return true;
      }
    });

    // console.log("nearbyLocs after", nearbyLocs);
    // console.log("originCusLoc", originCusLoc);

    const origin = [
      {
        lat: cus.cusLocation.lat,
        lng: cus.cusLocation.lng,
      },
    ];

    // console.log("origin", origin);
    // console.log("destinations", destinations);

    const elems = await getDistanceValues(origin, destinations);
    // console.log("elems", elems);

    for (let i = 0; i < nearbyLocs.length && i < elems.length; i++) {
      nearbyDistanceValues.push({
        workerDetails: nearbyLocs[i],
        distanceValues: elems[i],
      });
    }

    nearbyDistanceValues.sort(
      (a, b) =>
        a.distanceValues.distance.value - b.distanceValues.distance.value
    );

    // console.log("nearbyLocs after after", nearbyDistanceValues);
    return nearbyDistanceValues;
  } catch (e) {
    console.log(e.message);
  }
};

const getDistanceValues = async (origin, destinations) => {
  try {
    const response = await client.distancematrix({
      params: {
        origins: origin,
        destinations: destinations,
        travelMode: "DRIVING",
        key: "AIzaSyB9jM4BanCgPocT6KcrCcEsuYvE_yfdyYU",
      },
    });

    return response.data.rows[0].elements;
  } catch (e) {
    console.log(e);
  }
};

module.exports = { getClosestWorkers };
