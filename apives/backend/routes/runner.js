const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/run", async (req, res) => {

  const { url, method = "GET", headers = {}, body = null } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: "URL required"
    });
  }

  try {

    const start = Date.now();

    const response = await axios({
      url,
      method,
      headers,
      data: body,
      timeout: 15000
    });

    const time = Date.now() - start;

    res.json({
      success: true,
      status: response.status,
      time,
      data: response.data
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

});

module.exports = router;