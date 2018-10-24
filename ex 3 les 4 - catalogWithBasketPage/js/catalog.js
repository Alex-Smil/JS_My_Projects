
// console.log();

// ************ объект товар для добавления в корзину *************
let prod_1 = {
    // front-end propirties
    image: "images/catalog/1986 Macintosh Plus.jpg",
    name: "prod_1",
    cost: 1000,
    descript: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.iente expedita impedit earum libero, veritatis fugit ipsam,abore, porro blanditiis laborum architecto cumque consequuntur ut dolor!",
    spec: {
        proc: "intel i5",
        ram: 16,
        gpu: "geforce 1070"
    },
    
    // back-end propirties
    id: 123,
    category: "homePC"
}


// **************     testing    **************
// 1. извлекаем <main class="b-main">
let main = document.querySelector("main");

// 2. создаем обертку для карточек товаров
// let unitsWrap = document.createElement("div").setAttribute("class", "b-catalog__unitsWrap");// так не работает // тогда пробуем через className
let unitsWrap = document.createElement("div");
unitsWrap.className = "b-catalog__unitsWrap";
main.appendChild(unitsWrap);



// 3. Создаем карточку товара
console.log("результат работы createCatalogUnit(prod_1)");
let unit = createCatalogUnit(prod_1);
console.log(unit);

// 4. Добавляем товар в main
addUnitToCatalog(unit);


// ********************************************
function addUnitToCatalog(unit) {
    // извлекаем <main class="b-main">
    let unitsWrap = document.querySelector(".b-catalog__unitsWrap");
    unitsWrap.appendChild(unit);
}


// создаем карточку товара
function createCatalogUnit(prod) {
    // console.log("***** отображение товара из createCatalogUnit *****")
    let unit = document.createElement("div");
    unit.className = "b-catalog__unit";
    // console.log(unit);

    let img = document.createElement("img");
    img.className = "b-catalog__image";
    img.src = prod.image;
    // console.log(img);
    unit.appendChild(img);

    let unitTitle = document.createElement("h3");
    unitTitle.className = "b-catalog__unitTitle";
    unitTitle.innerHTML = prod.name;
    // console.log(unitTitle);
    unit.appendChild(unitTitle);

    let descript = document.createElement("p");
    descript.className = "b-catalog__descript";
    descript.innerHTML = prod.descript;
    // console.log(descript);
    unit.appendChild(descript);

    let cost = document.createElement("div");
    cost.className = "b-catalog__price";
    cost.innerHTML = prod.cost;
    // console.log(cost);
    unit.appendChild(cost);

    let buttonsWrap = document.createElement("div");
    buttonsWrap.className = "b-catalog__buttonsWrap";
    // console.log(buttonsWrap);
    
    let toBasketButton = document.createElement("a");
    toBasketButton.innerHTML = "в корзину";
    toBasketButton.href = "#";
    // console.log(toBasketButton);
    buttonsWrap.appendChild(toBasketButton);
    

    let detailsButton = document.createElement("a");
    detailsButton.innerHTML = "подробности";
    detailsButton.href = "#"
    // console.log(detailsButton);
    buttonsWrap.appendChild(detailsButton);

    unit.appendChild(buttonsWrap);

    return unit;
}





