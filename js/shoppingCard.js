import Ajax from "./Ajax.js";
export default class shoppingCard {
    data; shoppingList_ele; selectAll;
    constructor(data) {
        this.data = data;
        this.init();
    }
    init() {
        this.shoppingList_ele = document.querySelector(".shoppingList");
        this.createList();
        this.change();
    }
    createList() {
        if (this.data.length === 0) this.shoppingList_ele.innerHTML = "";
        let shoppingList = ``
        for (let i = 0; i < this.data.length; i++) {
            let total = this.data[i].total;
            total = Number(total.split("￥")[1]).toFixed(2)
            shoppingList += `
            <div class="item" data-id="${this.data[i].id}">
            <div class="row1">
                <input type="checkbox" class="select">
            </div>
            <div class="row2">
                <a href="">
                    <img src="${this.data[i].img}" alt="">
                </a>
            </div>
            <div class="row3">
                <a href="">${this.data[i].title}</a>
            </div>
            <div class="row4">
                <span>${this.data[i].price}</span>
            </div>
            <div class="row5">
                <span>
                    <a href="javascript:void(0)" class="sub">-</a>
                    <input type="text" value="${this.data[i].num}" class="ipt">
                    <a href="javascript:void(0)" class="add">+</a>
                </span>
            </div>
            <div class="row6">
                <span>￥${total}</span>
            </div>
            <div class="row7">
                <span>
                    <a href="javascript:void(0)" class="del">删除</a>
                </span>
            </div>
        </div>
            `;
        }
        this.shoppingList_ele.innerHTML = shoppingList;
        let checkbox = document.querySelectorAll(".select");
        checkbox = Array.from(checkbox);
        for (let j = 0; j < checkbox.length; j++) {
            checkbox[j].checked = this.data[j].checked;
        }
    }
    change() {
        let divs = document.querySelectorAll(".item");
        divs = Array.from(divs);
        divs.forEach(item => {
            item.addEventListener("click", e => this.clickHandler(e))
        });
    }
    clickHandler(e) {

        let id = Number(e.currentTarget.getAttribute("data-id"));
        let ipt = e.currentTarget.querySelector(".ipt");
        let ipt_value = ipt.value;
        switch (e.target.className) {
            case "add":
                ipt_value++;
                ipt.value = ipt_value;
                Ajax.post("http://192.168.43.155:4001/changeBooksNum", { "id": id, "num": ipt_value })
                document.addEventListener("changeBooksNum", (e) => this.changeData(e));
                break;
            case "sub":
                ipt_value--;
                if (ipt_value === 0) {
                    console.log(1)
                    Ajax.post("http://192.168.43.155:4001/deleteBooks", [id])
                    document.addEventListener("deleteBooks", (e) => this.changeData(e));
                    break;
                }
                ipt.value = ipt_value;
                Ajax.post("http://192.168.43.155:4001/changeBooksNum", { "id": id, "num": ipt_value })
                document.addEventListener("changeBooksNum", (e) => this.changeData(e));
                break;
            case "del":
                Ajax.post("http://192.168.43.155:4001/deleteBooks", [id])
                document.addEventListener("deleteBooks", (e) => this.changeData(e));
                break;
            case "select":
                Ajax.post("http://192.168.43.155:4001/selectBooks", { "id": [id], "checked": e.currentTarget.querySelector(".select").checked });
                document.addEventListener("selectBooks", (e) => this.changeData(e));
                break;
        }
    }
    changeData(e) {
        new shoppingCard(e.data);
    }
}