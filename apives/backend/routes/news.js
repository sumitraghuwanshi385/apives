const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req,res)=>{

try{

const response = await axios.get(
`https://gnews.io/api/v4/search?q=AI OR API OR developer tools&lang=en&max=10&token=${process.env.GNEWS_KEY}`
)

res.json({
success:true,
data:response.data.articles
})

}catch(err){

res.json({
success:false,
error:err.message
})

}

})

module.exports = router;