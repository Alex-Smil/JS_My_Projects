


// function init() сработает только после полной загрузки страницы
window.onload = init;

// ========== Глобальные переменные ==========
// список для маленьких картинок делаем глобальным, для того чтобы его могли видеть 2 функции
// так как каждый раз инициализировать массив при каждом вызове кнопки, ресурсо затратно, на мой взгляд
var listOfSmallImages;
// индексы элементов из списка listOfSmallImages, индекс тоже глобальный
var index = 0;
// ============================================

// function init() регистрирует обработчиков, данная функция сработает сразу
// после полной загрузки страницы (т.е. сначала будет полностью построена DOM model)
function init() {
    // =================== Блок инициализации обработчиков слайдера =================
    // получаем массив из маленьких картинок
    listOfSmallImages = document.getElementsByClassName("b-catalog__smallImage");
    // получеам кнопки для работы с ними
    var prevBtn = document.querySelector(".b-catalog__prevBtn");
    var nextBtn = document.querySelector(".b-catalog__nextBtn");
    // присваиваем кнопкам обработчика события нажатия, один обработчик для двух кнопок
    prevBtn.onclick = turnImage;
    nextBtn.onclick =turnImage;
    // ==============================================================================

    // =================== Блок инициализации обработчиков корзины =================
    // инициализируем коллекцию с объектами (кнопки buy в каталоге)
    var listOfBuyButtons = document.getElementsByClassName("b-catalog__buttonBuy");
    
    // в цикле назначаем каждой кнопке buy обработчика события нажатия - addToBasket.
    for (var i = 0; i < listOfBuyButtons.length; i++) {
        listOfBuyButtons[i].onclick = addToBasket;
    }
}

// ==================== Блок функций для обработки добавления товаров из каталога в корзину =====================
// function addToBasket(eventObj) является верхней фнкцией из рядя функций по добавлению объекта/товара в корзину
// она управляет порядком вызовов остальных функций 
function addToBasket(eventObj) {
    // инициализирием объект корзину для дальнейший манипуляции с ней
    var basketTBody = document.querySelector(".b-basket__tbody");
    // создаем объект по нажатию на кнопку buy, данный объект хранит информацию об объетке/покупке
    // в дальнейшем информация из этого объекта будет перенесена в поля таблицы/корзины  
    var objForBasket = createObjForBasket(eventObj);// +++++++++

    // текущий блок проверок необходим для обработки дубликатов в корзине, т.е. если встретится 
    // уже выбранный товар в корзине мы не будем создавать и добавлять новую строку в таблицу/корзину
    // а просто увеличим значения в уже существующей строке  
    if (checkDuplicateInBasket(objForBasket)) {
        duplicateExistingProduct(objForBasket);
    } else {
        // если текущего товара еще нет в корзине
        // то создаем новую строку с инфой из объекта objForBasket
        var newTrForBasket = createNewTrForBasket(objForBasket);
        // добавляем строку/товар в таблицу/корзину
        basketTBody.appendChild(newTrForBasket);
    }
}

// function createObjForBasket(eventObj) - создает объект в ответ на click по кнопке buy
// объект хранит информацию о выбранной покупке 
function createObjForBasket(eventObj) {
    console.log("========  test modes for createObjForBasket() function ========");
    // Определяем родителя кнопки которая вызвала событие
    // для дальнейшего чтения данных из этого блока родителя  (.b-catalog__prodUnit)
    var eventParent = eventObj.target.parentNode;
    
    // берем src картинки, из блока в котором возникло событие * (см. подробное описание внизу)
    var imageFullSrc = eventParent.querySelector(".b-catalog__smallImage").src;
    // test mode
    console.log("imageFullSrc = " + imageFullSrc);
    // адаптируем полный src(url) картинки, просто обрезав его до нужного места
    imageFullSrc = imageFullSrc.split("shopBasket_3/");
    // Берем образанную часть
    var imageAdaptSrc = imageFullSrc[1];
    // test mode
    console.log("imageAdaptSrc = " + imageAdaptSrc);

    // формируем имя для объекта который будет хранить инфу о выбранном товаре,
    var prodTitle = eventParent.querySelector(".b-catalog__prodTitle").innerText;
    // test mode
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
    console.log("======== end of test modes for createObjForBasket() function ========\n");

    // констркутор объектов для корзины, названия говорят сами за себя
    function ObjForBasket(imageAdaptSrc, prodTitle, prodCost) {
        this.imageSrc = imageAdaptSrc;
        this.prodTitle =  prodTitle;
        this.prodCost = prodCost;
    }
    // Возвращаем подготовленный объект с инфой о покупке
    return objForBasket;
}

// function checkDuplicateInBasket(objForBasket) проверяет был ли текущий товар ранее добавлен в корзину, да - нет
function checkDuplicateInBasket(objForBasket) {
    if (document.getElementById(objForBasket.prodTitle)) {
        // test mode
        console.log("======= test mode for checkDuplicateInBasket() function ========\n" +
        "СОВПАДЕНИЕ !!!!\n" +
        "======= end of test mode for checkDuplicateInBasket() function) =========\n");
        return true;
    } 
    return false;
}

// Данная функция срабоает в случай если выбранный объект уже добавлен в корзину,
// она считает и отоброжает в корзине кол-во шт и общую стоимость по каждому отдельно взятому товару  
function duplicateExistingProduct(objForBasket) {
    // определяем имя вызвашего события товара
    var existingTr = document.getElementById(objForBasket.prodTitle);

    // test mode
    console.log("=========== test mode for duplicateExistingProduct() function ==================");
    console.log("existingTr.lastChild.previousSibling.innerText = " + existingTr.lastChild.previousSibling.innerText);
    console.log("existingTr.lastChild.innerText = " + existingTr.lastChild.innerText);
    console.log("=========== end of test mode for duplicateExistingProduct() function ==================\n");

    // определяем поле строки товара в котором отображается кол-во шт товара
    var quantityTd = existingTr.lastChild.previousSibling.innerText;
    // прибавляем единицу
    existingTr.lastChild.previousSibling.innerText = ++quantityTd;
    
    // определяем поле строки товара в котором отображается общая стоимость по текущей позиции товара
    var totalCost = parseInt(existingTr.lastChild.innerText);
    // увеличиваем общую стоимость по текущей позиции товара
    existingTr.lastChild.innerText = totalCost + parseInt(objForBasket.prodCost);
}

// createNewContentTr(objForBasket); - создает новую строку с инфой из объекта objForBasket,
// эта строка потом будет помещена и отображена в корзине
function createNewTrForBasket(objForBasket) {
    // создаем новую строку
    var tr = document.createElement("tr");
    // присваиваем ей id
    tr.id = objForBasket.prodTitle;

    // проходим по св-вам объекта и переносим значения его св-в в поля строки
    for(var prop in objForBasket) {
        // создаем новое поле в строке корзины
        var td = document.createElement("td");

        // поле с картинкой в корзине требует доп. обработки
        if(prop === "imageSrc") {
            var img = document.createElement("img");
            img.src = objForBasket[prop];
            td.className = "b-basket__prodImage";
            td.appendChild(img);
        } else {
            // или же просто вставляем инфу из поля св-ва объекта в поле строки в корзине
            td.innerText = objForBasket[prop];
        }
        tr.appendChild(td);
    }
    // отдельно создаем:
    // строку с кол-вом единиц текущего товара
    var quantityTd = document.createElement("td");
    quantityTd.innerText = "1";
    tr.appendChild(quantityTd);
    // строку с общей строимостью по текущей позиции
    var totalCost = document.createElement("td");
    totalCost.innerText = objForBasket.prodCost;
    tr.appendChild(totalCost);
    return tr;
}
// ==================== Конец блока функций для обработки добавления товаров из каталога в корзину =====================

// ============================ Обработчик слайдера ====================================
// function turnImage(eventObj)
// обработчик кнопок, при наступлении события обработчик получает объект-событие,
// объект-событие (eventObj) содержит общую инфу о событии, т.е. инфу о кнопке вызвавшей его
function turnImage(eventObj) {
    // получаем элемент с большой картинкой, для дальнейшей подмены его src
    var bigImage = document.querySelector(".b-catalog__bigImage");
    // определяем кнопку вызвавшую событие
    var eventButton = eventObj.target;

    // эти две переменные объявил здесь для расширения области их видимости,
    // в целях экономии ресурсов RAM
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
    }
}
