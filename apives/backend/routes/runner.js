const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/run", async (req, res) => {

  let { url, method, headers, body } = req.body;

  if (!url) {
    return res.status(400).json({
      success:false,
      error:"URL required"
    });
  }

  try {

    // convert headers string → JSON
    if(headers && typeof headers === "string"){
      try{
        headers = JSON.parse(headers);
      }catch{
        headers = {};
      }
    }

    const start = Date.now();

    const response = await axios({
      url,
      method,
      headers,
      data: body
    });

    const end = Date.now();

    res.json({
      success:true,
      status:response.status,
      time:end-start,
      data:response.data
    });

  } catch(err){

    res.json({
      success:false,
      error:err.message
    });

  }

});

module.exports = router;