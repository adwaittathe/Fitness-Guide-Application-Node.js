
let userItem= function(item,rating,madeIt)
{
  let userItemModel = {
    item : item,
    rating : rating,
    madeIt : madeIt
  }
  return userItemModel;
};

module.exports.userItem=userItem;
