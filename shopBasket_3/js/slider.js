
// // список для маленьких картинок делаем глобальным, для того чтобы его могли видеть 2 функции
// // так как каждый раз инициализировать массив при каждом вызове кнопки, ресурсо затратно, на мой взгляд
// var listOfSmallImages;
// // индексы элементов из списка listOfSmallImages, индекс тоже глобальный
// var index = 0;

// function init() сработает только после полной загрузки страницы
window.onload = init;

// function init() регистрирует обработчиков, данная функция сработает сразу
// после полной загрузки страницы (т.е. сначала будет полностью построена DOM model)
function init() {
    // =================== Блок инициализации обработчиков слайдера =================
    // список для маленьких картинок делаем глобальным, для того чтобы его могли видеть 2 функции
    // так как каждый раз инициализировать массив при каждом вызове кнопки, ресурсо затратно, на мой взгляд
    var listOfSmallImages;
    // индексы элементов из списка listOfSmallImages, индекс тоже глобальный
    var index = 0;


    // получаем массив из маленьких картинок
    listOfSmallImages = document.getElementsByClassName("b-catalog__smallImage");
    // получеам кнопки для работы с ними
    var prevBtn = document.querySelector(".b-catalog__prevBtn");
    var nextBtn = document.querySelector(".b-catalog__nextBtn");
    // присваиваем кнопкам обработчика события нажатия, один для двух
    prevBtn.onclick = turnImage;
    nextBtn.onclick =turnImage;
    // ==============================================================================

    // =================== Блок инициализации обработчиков корзины =================
    var listOfBuyButtons = document.getElementsByClassName("b-catalog__buttonBuy");
    // for(var btn in listOfBuyButtons) {
    //     btn.onclick = addToBasket;
    // }
    for (var i = 0; i < listOfBuyButtons.length; i++) {
        listOfBuyButtons[i].onclick = addToBasket;
    }
}

function addToBasket(eventObj) {
    // // Определяем родителя кнопки которая вызвала событие
    // // для дальнейшего чтения данных из этого блока родителя  (.b-catalog__prodUnit)
    // var eventParent = eventObj.target.parentNode;
    // // данные извлекаем в свой объект, для дальнейшей его отправки в корзину
    // var objForBasket = createObjForBasket(eventParent);
    // // добавляем объект в корзину, для этого
    // // находим елемент  в DOM документа

    var basketTBody = document.querySelector(".b-basket__tbody");
    var objForBasket = createObjForBasket(eventObj);
    if (matchCheck(objForBasket, basketTBody)) {
        // увелич кол-во вместе с итогом по товару + увелич общий итог по корзине
    } else {
        var newTrForBasket = createNewTrForBasket(objForBasket);
        basketTBody.appendChild(newTrForBasket);
    }

    for(var i = 0; i < basketTBody.childNodes.length; i++) {
        console.log("basketTBody.childNodes[i] = " + basketTBody.childNodes[i]);
    }

}

function matchCheck(objForBasket, basketTBody) {
    if (document.getElementById(objForBasket.prodTitle)) {
        console.log("СОВПАДЕНИЕ !!!!")
    }
    return false;//заглушка
}

function createObjForBasket(eventObj) {
    // Определяем родителя кнопки которая вызвала событие
    // для дальнейшего чтения данных из этого блока родителя  (.b-catalog__prodUnit)
    var eventParent = eventObj.target.parentNode;
    // данные извлекаем в свой объект, для дальнейшей его отправки в корзину

    // добавляем объект в корзину, для этого
    // находим елемент  в DOM документа

    // берем src картинки, из блока в котором возникло событие
    var imageFullSrc = eventParent.querySelector(".b-catalog__smallImage").src;
    console.log("imageFullSrc = " + imageFullSrc);
    // адаптирем полный src(url) картинки, просто обрезав его до нужного места
    imageFullSrc = imageFullSrc.split("shopBasket_3/");
    // Берем образанную часть
    var imageAdaptSrc = imageFullSrc[1];
    // test mode
    console.log("imageAdaptSrc = " + imageAdaptSrc);

    // формируем имя для объекта который будет хранить инфу о выбранном товаре,
    // в дальнейшем данный объект будет отправлен в корзину
    var prodTitle = eventParent.querySelector(".b-catalog__prodTitle").innerText;
    console.log("prodTitle = " + prodTitle);

    // определяем цену товара
    var prodCost = eventParent.querySelector(".b-catalog__prodCost").innerText;
    // убираем лишние символы для дальнейших арифмитических операций с этим свойством
    prodCost = prodCost.replace("$", "");
    //test mode
    console.log("prodCost = " + prodCost);

    // собираем объект при помощи конструктора ObjForBasket, для текущего объекта передачи в корзину
    var objForBasket = new ObjForBasket(imageAdaptSrc, prodTitle, prodCost);
    console.log(objForBasket);
    console.log("=============================");

    // констркутор объектов для корзины
    function ObjForBasket(imageAdaptSrc, prodTitle, prodCost) {
        this.imageSrc = imageAdaptSrc;
        this.prodTitle =  prodTitle;
        this.prodCost = prodCost;
        // this.quantityOfGoods =
    }
    // Возвращаем подготовленный объект
    return objForBasket;
}



// createNewContentTr(objForBasket);
function createNewTrForBasket(objForBasket) {
    var tr = document.createElement("tr");
    tr.id = objForBasket.prodTitle;
    console.log("tr.className = " + tr.className);
    for(var prop in objForBasket) {
        var td = document.createElement("td");
        if(prop === "imageSrc") {
            var img = document.createElement("img");
            console.log("objForBasket.prop: " + objForBasket[prop]);
            img.src = objForBasket[prop];
            td.className = "b-basket__prodImage";
            td.appendChild(img);
            console.log(td);
        } else {
            console.log("objForBasket.prop: " + objForBasket[prop]);
            td.innerText = objForBasket[prop];
            console.log(td);
        }
        tr.appendChild(td);
    }
    // Создание строки кол-во единиц текущего товара
    var quantityTd = document.createElement("td");
    quantityTd.innerText = "1";
    tr.appendChild(quantityTd);

    // Создаем строку с общей строимостью по текущей позиции
    var totalCost = document.createElement("td");
    totalCost.innerText = objForBasket.prodCost;
    tr.appendChild(totalCost);
    return tr;
}







// ============================ Обработчик слайдера ====================================
// function turnImage(eventObj)
// обработчик кнопок, при наступлении события обработчик получает объект-событие,
// объект-событие (eventObj) содержит общую инфу о событии, т.е. инфу о кнопке вызвавшей его
function turnImage(eventObj) {
    // получаем элемент с большой картинкой, для дальнейшей подмены его src
    var bigImage = document.querySelector(".b-catalog__bigImage");
    // определяем кнопку вызвавшую событие
    var eventButton = eventObj.target;

    var smallImageSrc;
    var splitedSmallImageSrc;

    // данный switch определяет какая кнопка была нажата и
    // в зависимости от этого листает назад или вперед
    switch(eventButton.className) {
        // данный кейс двигает назад
        case "b-catalog__prevBtn":
            // переходим на 1 картинку назад в списке картинок listOfSmallImages
            index--;
            // проверка на выход за пределы списка
            if (index < 0) {
                // переход к последней картинке
                index = listOfSmallImages.length - 1;
            }
            // излекаем полный url картинки
            smallImageSrc = listOfSmallImages[index].src;
            // модифицирем полный url под наши нужды, просто обрезав его
            splitedSmallImageSrc = smallImageSrc.split("shopBasket_3/");
            // делаем подмену src (url)
            bigImage.src = splitedSmallImageSrc[1].replace("small/", "");
            break;

        // данный кейс двигает вперед
        case "b-catalog__nextBtn":
            index++;
            if (index >= listOfSmallImages.length) {
                // переход к первой картинке
                index = 0;
            }
            smallImageSrc = listOfSmallImages[index].src;
            splitedSmallImageSrc = smallImageSrc.split("shopBasket_3/");
            bigImage.src = splitedSmallImageSrc[1].replace("small/", "");
            break;

        default:
            // console.log();
    }
}
