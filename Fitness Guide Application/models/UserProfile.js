//let userItemList=[];
//let itemDB = require('../Utility/itemDB');
//let item = itemDB.getItem(100);
const mongoose=require('mongoose');
let schema= mongoose.Schema;

//userProfile model that takes userId and attach its list to userId
let userProfile= function(userId)
{
  //userItemList=[];
let userProfileModel = {
userId : userId,
userItems : userItemList
}

  return userProfileModel;
};

let userProfileSchema = new schema
({
  userId:{type:String, required:true},
  item:{itemCode : Number,itemName : String,itemCategory : String,itemDescription : String,itemRating : String, itemURL : String},
  rating: {type:Number, required:true},
  madeIt: {type:Boolean, required:true}
},{collection:'UserItems'});

let userProfileDb= mongoose.model('UserItems',userProfileSchema,'UserItems');
// add new item to list
let addItem = function(db,userId, item, rating , madeIt)
{

  return new Promise((resolve, reject) => {
  db.findOneAndUpdate({ $and: [{ 'userId':userId}, { 'item.itemCode': item.itemCode }] },
       { $set: {userId: userId, item:item, rating:rating, madeIt:madeIt }  },
       { upsert: true , new:true}, function (err, data) {
         console.log(data);
         resolve(data);
       }).catch(err => {
          console.log(err);
          return reject(err); });

  });
}



// remove item from list
let removeItem = function(db,userId,itemCode)
{
  return new Promise((resolve, reject) => {
      db.find({ $and: [{ 'userId':userId}, { 'item.itemCode': itemCode }] }).remove().exec().then(function () {
        resolve()
      }).catch(err => { return reject(err); })

    });
}


// update rating/madeIt flag of user
/*
let updateItem = function(db,userId,item , rating, madeIt)
{
  return new Promise((resolve, reject) => {
  db.findOneAndUpdate({ $and: [{ userId:userId}, { 'item.itemCode': item.itemCode }] },
       { $set: {userId: userId, item:item, rating:rating, madeIt:madeIt }},
       { }, function (err, data) {
         console.log(data);
         resolve(data);
       }).catch(err => {
          console.log(err);
          return reject(err); });
  });

}
*/
// get item from list using itemCode
let getItem = function(db,userId, itemCode)
{
  return new Promise((resolve, reject) => {
      db.findOne({userId:userId, 'item.itemCode':itemCode}).then(data => {
        resolve(data);
      }).catch(err => { return reject(err); })
  })

}

// get all items in listt
let getItems = function(db,userId)
{
  return new Promise((resolve, reject) => {
      db.find({userId:userId}).then(data => {
        resolve(data);
      }).catch(err => { return reject(err); })
  })
}


module.exports.addItem=addItem;
module.exports.removeItem=removeItem;
//module.exports.updateItem=updateItem;
module.exports.getItems=getItems;
module.exports.getItem=getItem;
module.exports.userProfile=userProfile;
module.exports.userProfileSchema=mongoose.model('UserItems',userProfileSchema,'UserItems');
