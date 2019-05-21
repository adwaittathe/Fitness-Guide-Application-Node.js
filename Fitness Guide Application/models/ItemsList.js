
let getItemList = function(list)
{
  let itemList= [];
  for(let i=0; i< list.length ; i++)
  {
    let itemModel= require('../models/Item');
    let item = list[i];
    itemModel=itemModel.item(item.itemCode , item.itemName , item.itemCategory, item.itemDescription, item.itemRating , item.itemURL);
    itemList.push(itemModel);
  }
  return itemList;
}

let getCategoryList = function(db)
{
  return new Promise((resolve, reject) => {
      db.find({}).then(data => {
        console.log("Get CAT");
        let itemList=[];
        for(let i=0; i< data.length ; i++)
          {
                   let itemModel= require('../models/Item');
                   let item = data[i];
                   itemModel=itemModel.category(item.categoryName , item.categoryImage);
                   itemList.push(itemModel);
          }
        resolve(itemList);
      }).catch(err => { return reject(err); })
    })
}

module.exports.getItemList= getItemList;
module.exports.getCategoryList= getCategoryList;
