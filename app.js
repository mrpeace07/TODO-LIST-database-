const express = require("express");
const bodyParser = require("body-parser");
const mongoose =  require ("mongoose");
const date = require( __dirname + "/date.js")

const app = express();

let items =[ "MORNNG WORKOUT", "DSA PRACTISE", "WEB DEVELOPMENT"] ;
let workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSChema =  {
  name: String

};

const Item = mongoose.model("Item", itemsSChema);

const item1 = new Item ({
  name: "Welcome to your To-Do List  "
});


const item2 = new Item ({
  name: "Hit the + button to add a new item"
});

const item3 = new Item ({
  name: "<-- Hit this to remove the item"
});

const defaultItems = [item1,item2,item3];

const listSchema = {
  names: String,
 items: [itemsSChema]
}

let today = date(); 

// Item.insertMany(defaultItems);

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find({})
    .then(foundItems => {
      if (foundItems.length === 0) {
        return Item.insertMany(defaultItems);
      }
      return Promise.resolve(foundItems);
    })
    .then(items => {
      res.render("list", { listTitle:today, newlistItems: items });
      
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });  

    
});



app.post("/", function(req, res){
  
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");

  
});



app.post("/delete", (req,res) => {
  const checkedItemId = (req.body.checkbox);
  Item.findByIdAndDelete(checkedItemId).exec();
      res.redirect("/");
    });


 
app.listen(3003, function() {
  console.log("Server started on port 3003");
}); 
     


