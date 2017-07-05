const fetch = require('node-fetch');


fetch('http://apilayer.net/api/live?access_key=8ea879f982738c10836f08773b1907da&currencies=USD,AUD,CAD,JPY,HKD,CNY,%20TWD&format=1')
.then((res) => {
    return res.json();
})
.then((result)=>{
    console.log(result);
})