const express = require("express");
const router = express.Router();

const cusCreateCon = require("../controllers/chamath/cusCreate");
const cusUpdateCon = require("../controllers/chamath/cusUpdate");
const cusReadCon = require("../controllers/chamath/cusRead");
const cusDeleteCon = require("../controllers/chamath/cusDelete");
const cusUpdateRating = require('../controllers/chamath/ratingUpdate');

router.post("/cusCreate", cusCreateCon);
router.put("/cusUpdate/:email", cusUpdateCon);
router.get("/cusRead/:email", cusReadCon);
router.delete("/cusDelete/:email", cusDeleteCon);
router.put('/rating/:email', cusUpdateRating);


module.exports = router;
