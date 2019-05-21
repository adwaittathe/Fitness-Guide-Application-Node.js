const mongoose=require('mongoose');
var schema= mongoose.Schema;

var itemDataSchema = new schema({
  userId : Number,
  itemCode : {type:Number, required:true},
  itemName : {type:String, required:true},
  itemCategory : {type:String, required:true},
  itemDescription : String,
  itemRating : {type:String, required:true},
  itemURL : {type:String, required:true}
}, {collection:'Item'});

let categoriesDataSchema = new schema({
  categoryName : {type:String, required:true},
  categoryImage : {type:String, required:true}
}, {collection:'categories'});


let item=function(code,name,category,desc,rating,url){
  let itemModel=
  {
  userId : 0,
  itemCode : code,
  itemName : name,
  itemCategory : category,
  itemDescription : desc,
  itemRating : rating,
  itemURL : getImageUrl(url)
}
return itemModel;
};




let category=function(name, img){
let categoryModel=
{
  categoryName : name,
  categoryImage:  getCategoryUrl(img)
  //categoryImage : img
}
return categoryModel;
};

let getImageUrl = function (url) {
  return "/assets/images/workouts/" + url;
  //return "/assets/images/topbar/fit.jpg";
};

let getCategoryUrl = function (url) {
  return "/assets/images/" + url;
//  return "/assets/images/topbar/fit.jpg";
};

module.exports.item=item;
module.exports.category=category;
module.exports.getImageUrl=getImageUrl;
module.exports.getCategoryUrl=getCategoryUrl;
module.exports.itemDataSchema=mongoose.model('Item',itemDataSchema,'Item');
module.exports.categoriesDataSchema=mongoose.model('categories',categoriesDataSchema,'categories');
