
let getItems=function(db)
{

  return new Promise((resolve, reject) => {
      db.find({}).then(data => {
        resolve(data);
      }).catch(err => { return reject(err); })
    })

};

let getItem = function(db,itemId)
{
  return new Promise((resolve, reject) => {
      db.findOne({itemCode:itemId}).then(data => {
        resolve(data);
      }).catch(err => {
        return reject(err);
      })
    });
};


module.exports.getItems=getItems;
module.exports.getItem=getItem;
