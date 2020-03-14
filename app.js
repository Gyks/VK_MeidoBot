const express = require("express");
const app = express();
const port = 3030;
const handler = require("./handler/handler");

app.use(express.json());
app.post("/", (req, res) => {
  //console.log(req.body);
  if (req.body.secret == "meidoarisuburack1") {
    res.send("ok");
    handler.handle(req.body);
  }
});

app.listen(port, () => console.log(`App running on ${port}!`));
