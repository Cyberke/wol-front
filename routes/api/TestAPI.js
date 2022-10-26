const express = require('express');
const router = express.Router();

/**
 * @route GET testing/testrequest
 * @desc Teszt kérés
 * @access Publikus
 */

router.get('/testrequest', (req, res) => {
    try {
        return res.status(201).send({
            success: true,
            message: 'A Wolimby Account szerverei megfelőlen müködnek.'
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;