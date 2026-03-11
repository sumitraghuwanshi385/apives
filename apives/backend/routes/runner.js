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

    // safe headers
    if(!headers || typeof headers !== "object"){
      headers = {};
    }

    // GET request me body remove
    if(method === "GET"){
      body = undefined;
    }

    const start = Date.now();

    const response = await axios({
      url: url,
      method: method || "GET",
      headers: headers,
      data: body,
      timeout: 20000,

      // large JSON allow
      maxContentLength: Infinity,
      maxBodyLength: Infinity,

      // 4xx 5xx ko bhi capture kare
      validateStatus: () => true
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