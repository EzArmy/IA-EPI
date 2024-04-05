const express = require('express');
const router = express.Router();

router.get("/", (req, res)=>{
    res.render('editColab.ejs');
});

router.post('/addEdit', (req,res)=>{
    
});

module.exports = router;