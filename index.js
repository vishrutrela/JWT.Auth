const express = require('express')
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4001;

app.use(express.json());

require('./config/database').connect();

const user = require('./routes/user')
app.use('/api/v1/',user);

app.get ('/',(req,res)=>{
    return res.json("hello world")
})

app.listen(PORT,()=>{
    console.log(`Server has started successfully at ${PORT}`)
})