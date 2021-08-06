const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const app = express();
const apiRoutes = require("./src/modules/routes/routes");

app.use(cors());
const uri = "mongodb+srv://user:1234@cluster0.n7uwr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.json());
app.use("/", apiRoutes);

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});