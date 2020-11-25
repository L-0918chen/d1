
var {bookList,shoppingList} = require("./bookList.js")
module.exports = (function(){
    return {
        getBookList(res){
            res.write(JSON.stringify(bookList));
            res.end();
        },
        getShoppingList(res){
            res.write(JSON.stringify(shoppingList));
            res.end();
        },
        addBooks(res,data){
            // 判断是否有相同书
            var price = Number(data.price.split("￥")[1]);
            var o = this.getSameBooks(shoppingList,data.id);
            if(o){
                o.num=Number(data.num) + Number(o.num);
                o.total = "￥"+(o.num*price);
            }else{
                var g={
                    id:Number(data.id),
                    checked:false,
                    img:data.img[0],
                    title:data.title,
                    price:data.price,
                    num:Number(data.num),
                    total:("￥" + (price*Number(data.num))),
                    checked:true,
                    delete:false
                };
                shoppingList.push(g);
            } 
            res.write(JSON.stringify(shoppingList));
            res.end();
        },
        getSameBooks(list,id){
            return list.reduce(function(value,item){
                if(Number(item.id)===Number(id)) value=item;
                return value;
            },null)
        },
        changeBooksNum(res,data){
            var o = this.getSameBooks(shoppingList,data.id);
            o.num=data.num;
            var price = Number(o.price.split("￥")[1]);
            o.total="￥"+price*o.num;
            res.write(JSON.stringify(shoppingList));
            res.end();
        },
        deleteBooks(res,data){
            var list = shoppingList.filter(item=>!data.includes(Number(item.id)));
            shoppingList.length=0;
            shoppingList.push(...list);
            res.write(JSON.stringify(shoppingList));
            res.end();
        },
        selectBooks(res,data){
            
            shoppingList.forEach(item=>{
                if(data.id.includes(Number(item.id))) item.checked=data.checked;
            });

            res.write(JSON.stringify(shoppingList));
            res.end();
        }
    }
})()