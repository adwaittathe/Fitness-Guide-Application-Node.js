const express= require('express');
var dialog = require('dialog');

const mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/fitness', { useNewUrlParser: true });
const router = express.Router();
const bodyParser = require('body-parser');
const { check , validationResult} = require('express-validator/check')
const urlencodedParser = bodyParser.urlencoded({ extended : false });
let db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("Connected to Database");
    });



// router post method to handel all the post requests
router.post('/myItems',urlencodedParser,
check('username').not().isEmpty().isEmail().optional(),
check('password').not().isEmpty().optional(),
check('action').isAlpha().not().isEmpty().optional(),
check('select').isNumeric().not().isEmpty().optional(),
check('madeIt').not().isEmpty().isAlpha().optional().isBoolean(),
check('currentRating').not().isEmpty().optional().isNumeric(),
check('currentFlag').not().isEmpty().isAlpha().optional().isBoolean(),
async function (req, res)
{
  if(!validationResult(req).isEmpty())
{
  console.log("RESULT" , validationResult(req).mapped());
  dialog.info('Enter proper inputs','Error');
  var path = process.cwd();
  //response.sendFile(path + '/views/index.html');
  res.redirect('/login');
  return;

}

  let session;
  let userModel=require('../models/User');
  let userProfile = require('../models/UserProfile');
  let useritemDB = require('../Utility/userDB');
//  let usersList= useritemDB.getUsers();
  if(req.body.action == 'signIn')
    {

    // SIGN IN method to add user to session
    //console.log(req.body)
    var userDataSchema = userModel.userDataSchema;
    //let userList = await useritemDB.getUsers(userDataSchema);
    let user = await useritemDB.getUser(userDataSchema,req.body.username,req.body.password);

    if(user !=null)
    {
    //console.log("GOT USER");
    req.session.theUser= user;
    var userProfileSchema = userProfile.userProfileSchema;
    let userProf= await userProfile.getItems(userProfileSchema,user.userId);
    req.session.userProfile= userProf;
    res.render('myItems',{userItems:userProf, signIn:req.session.theUser});
    return;
  }
  else {
    //console.log("GOT USER ELSE");
    dialog.info('Either username or password are incorrect. Please try again');
    res.redirect('/login')
    return;
  }

  }
  if(req.body.action =='myWorkouts')
  {

    //When MyWorkouts add new session to data and redirect to myWorkouts page
    if(req.session.theUser!=null)
    {
    useritems= req.session.userProfile;
    res.render('myItems',{userItems:useritems, signIn:req.session.theUser});
    }
    else {
      var userDataSchema = userModel.userDataSchema;
      let userList = await useritemDB.getUsers(userDataSchema);
      req.session.theUser= userList[0];
      var userProfileSchema = userProfile.userProfileSchema;
      let userProf= await userProfile.getItems(userProfileSchema,userList[0].userId);
      req.session.userProfile= userProf;
      res.render('myItems',{userItems:userProf , signIn:req.session.theUser});
      return;
    }

  }


  if(req.session.theUser!=null)
  {
    // checks request parameter to perform function on object
    switch(req.body.action)
    {

      case "save":
      // add new object
      save(req,res);
      break;

      case "updateProfile":
      // update object and send to feedback page to change rating/madeIt
      updateProfile(req,res);
      break;

      case "deleteItem":
      // delete item from list
      deleteItem(req,res);
      break;

      case "updateRating":
      // update Rating of item
      updateRating(req,res);
      break;

      case "updateFlag":
      // update madeIt flag of item
      updateFlag(req,res);
      break;

      case "signOut":
      // signOut user
      signOut(req,res);
      break;

      default:
    }
  }
  else {
    // If user not signed In
    dialog.info('Kindly sign In to proceed');
    res.redirect("/");
  }



});
//signOut the user
function signOut(req,res)
{
  //let useritemDB = require('../Utility/userDB');
  //let usersList= useritemDB.getUsers();

  session=req.session;
  req.session.destroy();
  res.redirect("/");
}

// add new object
async function save(req,res)
{
  let itemDB = require('../Utility/itemDB');
  let userProfile = require('../models/UserProfile');
  let itemModel= require('../models/Item');
  let itemDataSchema= itemModel.itemDataSchema;
  let item = await itemDB.getItem(itemDataSchema, req.body.itemCode);
  let user= req.session.theUser;
  var userProfileSchema = userProfile.userProfileSchema;
  let x= await userProfile.getItem(userProfileSchema, user.userId,req.body.itemCode);
  if(x==null)
  {
  await userProfile.addItem(userProfileSchema,user.userId,item , 0, false);
  }
  else {
  dialog.info('The item is already saved in your workout');
  }
  var userProfileSchema = userProfile.userProfileSchema;
  let useritems= await userProfile.getItems(userProfileSchema,req.session.theUser.userId);
  req.session.userProfile=useritems;
  res.render('myItems',{userItems:useritems, signIn:req.session.theUser});
}

// update Rating for item received from feedback page
async function updateRating(req,res)
{
  // check if data is came from valid view file
  if(validateSecurity(req,res))
  {
    // check if rating value is between 0 to 5
  if(req.body.select<=5 && req.body.select>=0)
  {
  let itemDB = require('../Utility/itemDB');
  let useritemDB = require('../Utility/UserItemDB');
  let userProfile = require('../models/UserProfile');
  let itemModel= require('../models/Item');
  let itemDataSchema= itemModel.itemDataSchema;
  let item = await itemDB.getItem(itemDataSchema, req.body.itemCode);
  var userProfileSchema = userProfile.userProfileSchema;
  let user_item= await userProfile.getItem(userProfileSchema, req.session.theUser.userId,req.body.itemCode);
  await useritemDB.addItemRating(userProfileSchema, req.session.theUser.userId, item, req.body.select ,user_item.madeIt);
  let useritems= await userProfile.getItems(userProfileSchema,req.session.theUser.userId);
  req.session.userProfile=useritems;
  res.render('myItems',{userItems:useritems, signIn:req.session.theUser});
   }
   else {
     // if wrong rating value send to myItems page
     useritems= req.session.userProfile;
     res.render('myItems',{userItems:useritems, signIn:req.session.theUser});
   }
  }
  else
  {
    // redirect to index page if data is not from valid ejs file
    res.redirect("/");
  }
}


// update madeit flag for item received from feedback page
async function updateFlag(req,res)
{
  // check if data is came from valid view file
  if(validateSecurity(req,res))
  {
  // check if madeIt value is true or false
  if(req.body.madeit == 'true' | req.body.madeit == 'false')
  {
    let itemDB = require('../Utility/itemDB');
    let userProfile = require('../models/UserProfile');
    let itemModel= require('../models/Item');
    let useritemDB = require('../Utility/UserItemDB');
    let itemDataSchema= itemModel.itemDataSchema;
    let item = await itemDB.getItem(itemDataSchema, req.body.itemCode);
    var userProfileSchema = userProfile.userProfileSchema;
    let user_item= await userProfile.getItem(userProfileSchema, req.session.theUser.userId,req.body.itemCode);
    //await userProfile.updateItem( userProfileSchema, req.session.theUser.userId, item, user_item.rating ,req.body.madeit);
    await useritemDB.addMadeIt(userProfileSchema, req.session.theUser.userId, item, user_item.rating ,req.body.madeit);
    let useritems= await userProfile.getItems(userProfileSchema,req.session.theUser.userId);
    console.log("USERITEM");
    console.log(useritems);
    req.session.userProfile=useritems;
    res.render('myItems',{userItems:useritems, signIn:req.session.theUser});
   }
   else {
     // if wrong rating value send to myItems page
    useritems = req.session.userProfile;
     //console.log(useritems);
     res.render('myItems',{userItems:useritems, signIn:req.session.theUser});
   }
  }
else {
    // redirect to index page if data is not from valid ejs file
  res.redirect("/");
 }
}


// delete item from userlist
async function deleteItem(req,res)
{
    // check if data is came from valid view file
  if(validateSecurity(req,res))
  {
  let userProfile = require('../models/UserProfile');
  var userProfileSchema = userProfile.userProfileSchema;
  //let item = itemDB.getItem(req.query.itemCode);
  await userProfile.removeItem(userProfileSchema, req.session.theUser.userId, req.body.itemCode);
  let useritems= await userProfile.getItems(userProfileSchema,req.session.theUser.userId);
  req.session.userProfile=useritems;
  res.render('myItems',{userItems:useritems, signIn:req.session.theUser});
  }
  else{
      // redirect to myItems(same) page if data is not from valid ejs file
    useritems= req.session.userProfile;
    res.render('myItems',{userItems:useritems, signIn:req.session.theUser});
  }

}


// returns true if item is present in itemList
function validateSecurity(req,res)
{
  let itemList= req.body.itemList;
  let itemCode = req.body.itemCode;
  return itemList.includes(itemCode);
}

// send item to feedback page for updating rating/madeIt
async function updateProfile(req,res)
{
  let itemModel= require('../models/Item');
  let list = require('../Utility/itemDB');
  let itemcode = req.body.itemCode;
  // check if data is came from valid view file
  if(validateSecurity(req,res))
  {

    let userItemList = req.session.userProfile;
    let flag=false;
    for(let i=0; i<userItemList.length; i++)
    {
        if(parseInt(userItemList[i].item.itemCode) == itemcode)
        {
          flag=true;
        }
    }
    if(flag)
    {
      let itemDB = require('../Utility/itemDB');
      let itemDataSchema= itemModel.itemDataSchema;
      let item = await itemDB.getItem(itemDataSchema, itemcode);

      //let item = list.getItem(itemcode);
      if(item != null)
      {
        //let imageUrl = itemModel.getImageUrl(item.itemURL);
        itemModel=itemModel.item(item.itemCode , item.itemName , item.itemCategory, item.itemDescription, item.itemRating , item.itemURL);
        res.render('feedback', {item:itemModel ,   rating:req.body.currentRating,    madeIt:req.body.currentFlag,  signIn:req.session.theUser,  userItems:userItemList});
      }
    }
  }
  else{
    // redirect to myItems(same) page if data is not from valid ejs file
    useritems= req.session.userProfile;
    res.render('myItems',{userItems:useritems, signIn:req.session.theUser});
  }

}

module.exports = router;
