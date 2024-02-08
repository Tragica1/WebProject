function getContractInfo(id, number, innerNumber, city, startDate, endDate) {
    $("#cNumber").text("Выбран контракт № " + number)
    $("#cInnerNumber").text("Внутренний номер: " + innerNumber)
    $("#cCity").text("Город: " + city)
    $("#cStart").text("Дата подписания: " + startDate)
    $("#cEnd").text("Дата сдачи: " + endDate)
    startCreation(id)
};
var counter = 0;
function addContactBlock() {
    counter += 1
    var itemBlock = document.getElementById('companyContacts')
    var contactBlock = document.createElement('div')
    contactBlock.className = 'w-full max-w-xl p-2 bg-white border border-black rounded-lg shadow sm:p-6'
    contactBlock.innerHTML = `<h2 class="text-left font-medium text-black">Контакт № `+ counter+`</h2>`+
                            `<hr class="mx-auto h-px bg-black border-blue-800 border-2">` +
                            `<div class="grid grid-cols-2 gap-4">` +
                            `<div class="grid grid-rows-1 py-2 text-center">` +
                            `<h2 class="text-left font-medium text-black">ФИО: </h2>` +
                            `</div>` +
                            `<div class="grid grid-rows-1">` +
                            `<input type="text" id="contactName`+ counter +`"`+
                            `class="bg-gray-50 text-lg border border-gray-300 text-black rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">` +
                            `</div>`+
                            `</div>` +
                            `<div class="grid grid-cols-2 gap-4">` +
                            `<div class="grid grid-rows-1 py-2 text-center">` +
                            `<h2 class="text-left font-medium text-black">Телефон: </h2>`+
                            `</div>` +
                            `<div class="grid grid-rows-1">` +
                            `<input type="text" id="contactNumber`+ counter +`"` +
                            `class="bg-gray-50 text-lg border border-gray-300 text-black rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">` +
                            `</div>` +
                            `</div>`
    itemBlock.appendChild(contactBlock)
    
};

function changeProduct(id, name, code, number, type, count, state, isContract, provider, start, end) {
    // var d1 = new Date(start)
    // var d2 = new Date(end)
    // console.log(d1, d2)
    $("#currentProduct").val("currentProduct" + id)
    $("#productName").text("Изделие: " + name)
    if (code != 'null') {
        document.getElementById('productCode').style.display = 'block'
        $("#productCode").text("Шифр: " + code)
    } else {
        document.getElementById('productCode').style.display = 'none'
        // $("#productCode").style.display = 'none'
    }
    $("#productNumber").val(number)
    $("#productType").val(type)
    $("#productCount").val(count)
    $("#productState").val(state)
    if (isContract == 1) {
        document.getElementById('isLocalContract').checked = true
        $("#productProvider").val(provider)
        $("#startDate").val(start)
        $("#endDate").val(end)
        document.getElementById('hideen').style.display = 'block'
    } else {
        document.getElementById('isLocalContract').checked = false
        $("#productProvider").val('')
        $("#startDate").val('')
        $("#endDate").val('')
        document.getElementById('hideen').style.display = 'none'
    }
    var formData = {
        'id': id,
        'name': name
    }
    $.ajax({
        type: 'POST',
        url: '/changeProduct',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(formData),
        success: function (response) {
            // location.reload();
            console.log(response);
        },
        error: function (error) {
            // location.reload();
            console.log(error);
        }
    });
};


function addProductSelect() {
    if (document.getElementById('unfilled')) {
        document.getElementById('unfilled').id = 'filled'
        fetch('/getSelector')
            .then(response => response.json())
            .then(data => {
                const selector = document.getElementById('productsSelector')
                data.forEach((item) => {
                    console.log(item)
                    const opt = document.createElement('li')
                    opt.innerHTML = `<div class="flex items-baseline" >` +
                        `<input id="` + item.id + `" type="checkbox" value=""` +
                        `class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2">` +
                        `<label for="` + item.id + `"` +
                        `class="ms-2 text-lg texl-left font-medium text-black ">` + item.name + `</label></div>`
                    selector.append(opt)
                });
            });
    }
};


function createTree(element, data, idd) {
    const treeElement = document.createElement('ul');
    treeElement.className = 'ps-5 mt-2 space-y-1 list-none list-inside';
    if (idd != null && idd != 'root') {
        treeElement.id = 'collapse' + idd;
        treeElement.className = '!visible hidden ' + treeElement.className
        treeElement.setAttribute('data-te-collapse-item', '')
    }
    data.forEach((item) => {
        const listItem = document.createElement('li')
        if (item.id != 'root') {
            if (item.children.length != 0) {
                listItem.innerHTML = `<a data-te-collapse-init href="#collapse` + item.id + `" role="button" aria-expanded="false" aria-controls="collapse` + item.id + `"` +
                    `class="flex text-2xl text-black font-semibold items-center px-2 hover:bg-purple-500 rounded-lg"` +
                    `onclick="changeProduct(` + item.id + `, '` + item.name + `', '` + item.code + `', ` +
                    item.number + `, ` + item.type + `, ` + item.count + `, ` + item.state + `, ` +
                    item.isContract + `, ` + item.provider + `, '` + item.start + `', '` + item.end + `')">` +
                    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4">` +
                    `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>` +
                    item.name + `</a>`
            } else {
                listItem.innerHTML = `<a role="button" aria-expanded="false"` +
                    `class="flex text-xl text-black items-center px-2 hover:bg-purple-300 rounded-lg"` +
                    `onclick="changeProduct(` + item.id + `, '` + item.name + `', '` + item.code + `', ` +
                    item.number + `, ` + item.type + `, ` + item.count + `, ` + item.state + `, ` +
                    item.isContract + `, ` + item.provider + `, '` + item.start + `', '` + item.end + `')">` +
                    item.name + `</a>`
            }
        }
        if (item.children.length != 0) {
            createTree(listItem, item.children, item.id)
        }
        treeElement.append(listItem)
    });
    element.append(treeElement)
};


function startCreation(id) {
    fetch(`/products/${ id }`)
        .then(response => response.json())
        .then(data => {
            data = Array(data)
            const rootElement = document.getElementById('mainTree')
            rootElement.innerHTML = ""
            createTree(rootElement, data, null)
        });
}