const express= require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var dialog = require('dialog');
const urlencodedParser = bodyParser.urlencoded({ extended : false });
const mongoose=require('mongoose');
const { check , validationResult} = require('express-validator/check');
mongoose.connect('mongodb://127.0.0.1:27017/fitness', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("Connected to Database");
});

router.get('/', function (req, res) {
  res.render('index',{signIn:req.session.theUser});
});

router.post('/', urlencodedParser,  function (req, response) {
  let itemDB = require('../Utility/userDB');
  let userProfile = require('../models/UserProfile');
  let usersList= itemDB.getUsers();
  let useritems= userProfile.getItems();
  req.session.theUser= usersList[0];
  req.session.userProfile= useritems;
  //console.log(req.session.theUser);
  response.redirect('/');

});

router.get('/about', function (req, res) {
  res.render('about', {signIn:req.session.theUser});

});

router.get('/login', function (req, res) {
  res.render('login', {signIn:req.session.theUser});

});

router.get('/contact', function (req, res) {
  res.render('contact', {signIn:req.session.theUser});
});

router.get('/categories', async function (req, res) {
  let itemListModel= require('../models/ItemsList');
  let list = require('../Utility/itemDB');
  let itemModel = require('../models/Item');
  let itemDataSchema= itemModel.itemDataSchema;
  let categoryDataSchema= itemModel.categoriesDataSchema;
  let itemList1 = await list.getItems(itemDataSchema);
  let itemList=itemListModel.getItemList(itemList1);
  let categoryList = await itemListModel.getCategoryList(categoryDataSchema);
  res.render('categories', {data:itemList , category:categoryList, signIn:req.session.theUser});
});

router.get('/categories/item/:itemCode',
check('itemCode').not().isEmpty().optional().isNumeric(),

async function (req, res) {
  if(!validationResult(req).isEmpty())
{
  console.log("RESULT" , validationResult(req).mapped());
  //dialog.info('Enter proper inputs','Error');
  var path = process.cwd();
  //response.sendFile(path + '/views/index.html');
  res.redirect('/categories');
  return;

}
  let itemModel= require('../models/Item');
  let list = require('../Utility/itemDB');
  let itemcode = req.params.itemCode;
  let itemDataSchema= itemModel.itemDataSchema;
  let item = await list.getItem(itemDataSchema, itemcode);

  if(item != null)
  {

    itemModel=itemModel.item(item.itemCode , item.itemName , item.itemCategory, item.itemDescription, item.itemRating , item.itemURL);
    res.render('item', {item:itemModel, signIn:req.session.theUser} );
  }
  else {
    res.redirect('/categories');
  }

});

router.get('/categories/item', function (req, res) {
    res.redirect('/categories');
});

router.get('/categories/item/feedback/:itemCode',
check('itemCode').not().isEmpty().optional().isNumeric(),
async function (req, res) {

  if(!validationResult(req).isEmpty())
{
  console.log("RESULT" , validationResult(req).mapped());
  //dialog.info('Enter proper inputs','Error');
  var path = process.cwd();
  //response.sendFile(path + '/views/index.html');
  res.redirect('/categories');
  return;

}
  let itemModel= require('../models/Item');
  let itemDB = require('../Utility/itemDB');
  let itemcode = req.params.itemCode;
  let itemDataSchema= itemModel.itemDataSchema;
  let item = await itemDB.getItem(itemDataSchema, itemcode);
  if(item != null)
  {
    //let imageUrl = itemModel.getImageUrl(item.itemURL);
    itemModel=itemModel.item(item.itemCode , item.itemName , item.itemCategory, item.itemDescription, item.itemRating , item.itemURL);
    if(req.session.theUser)
    {
      //console.log("INDEX_______22");
      let userItems = req.session.userProfile;
      console.log(userItems);
      flag=true;
      for(let i=0;i<userItems.length;i++)
      {
        if(itemcode == userItems[i].item.itemCode)
        {
          flag=false;
          let rating = userItems[i].rating;
          let madeIt = userItems[i].madeIt;
          res.render('feedback', {item:itemModel, rating:rating, madeIt:madeIt,signIn:req.session.theUser, userItems:userItems});
        }
      }
      if(flag)
      {
      dialog.info('Kindly Save item before rating');
      //console.log("Please save item");
      res.redirect('/categories');
       }
    }
    else {
      dialog.info('Kindly sign in to proceed');
      //console.log("Please login");
      res.redirect('/');
    }

  }
  else{

    res.redirect('/categories');
  }
});


router.get('/*', function (req, res) {
    res.redirect('/');
});



module.exports = router;
