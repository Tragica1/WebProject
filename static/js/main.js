window.onload = function () {
    // console.log(localStorage)
    var contractInfo = JSON.parse(localStorage.getItem("currentConract"))
    getContractInfo(contractInfo['id'], contractInfo['number'], contractInfo['innerNumber'], contractInfo['city'], contractInfo['startDate'], contractInfo['endDate'], contractInfo['type'], contractInfo['status'])
}


document.getElementById('hideen1').style.display = 'none'
$('#isLocalContract').click(function () {
    var elem = document.getElementById('hideen1')
    if (elem.style.display == 'none') {
        elem.style.display = 'block'
    } else {
        elem.style.display = 'none'
    }
});


document.getElementById('hideen2').style.display = 'none'
$('#newProductisLocalContract').click(function () {
    var elem = document.getElementById('hideen2')
    if (elem.style.display == 'none') {
        elem.style.display = 'block'
    } else {
        elem.style.display = 'none'
    }
});


var currentProvider = -1;
function showContacts(tmp) {
    var addr = $('#company' + tmp.value).data('address')
    $("#providerAddress").text(addr)
    fetch(`/contacts/${tmp.value}`)
        .then(response => response.json())
        .then(data => {
            contacts = data
            // console.log(contacts)
            var block = document.getElementById('contacts')
            block.innerHTML = ""
            for (var i = 0; i < contacts.length; i++) {
                var d = document.createElement('div')
                d.className = "pb-2"
                d.innerHTML = `<p class="font-semibold">` + contacts[i][1] + `</p>` +
                    `<p class="font-semibold">` + contacts[i][2] + `</p>`
                block.appendChild(d)
            }
        });
}



function getContractInfo(id, number, innerNumber, city, startDate, endDate, type, status) {
    var currentConract = {
        'id': id,
        'number': number,
        'innerNumber': innerNumber,
        'city': city,
        'startDate': startDate,
        'endDate': endDate,
        'type': type,
        'status': status
    }
    localStorage.setItem("currentConract", JSON.stringify(currentConract));
    $("#cNumber").text("Выбран контракт № " + number)
    $("#cInnerNumber").text("Внутренний номер: " + innerNumber)
    $("#cCity").text("Город: " + city)
    $("#cStart").text("Дата подписания: " + startDate)
    $("#cEnd").text("Дата сдачи: " + endDate)
    $("#cType").text("Тип контракта: " + type)
    $("#cStatus").text("Статус: " + status)
    startCreation(id)
};


function saveProvider() {
    var contacts = []
    if (counter > 0) {
        for (var i = 1; i <= counter; i++) {
            var tmp = {
                'name': $("#contactName" + i).val(),
                'number': $("#contactNumber" + i).val()
            }
            contacts[i - 1] = tmp
        }
    }

    var formData = {
        'name': $('#companyName').val(),
        'address': $('#companyAddress').val(),
        'contacts': contacts
    }
    // console.log(formData)
    $.ajax({
        type: 'POST',
        url: '/saveProvider',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(formData),
        success: function (response) {
            location.reload();
            console.log(response);
        },
        error: function (error) {
            location.reload();
            console.log(error);
        }
    });
}


function saveContract() {
    var products = document.getElementById('productsSelector').getElementsByTagName('input')
    var pr = []
    var j = 0
    for (var i = 0; i < products.length; i++) {
        if (products[i].checked) {
            pr[j] = products[i].id
            j += 1
        }
    }
    var types = document.getElementById('contractType').getElementsByTagName('input')
    var type = 0
    for (var i = 0; i < types.length; i++) {
        if (types[i].checked) {
            type = types[i].id
        }
    }
    // const fff = document.getElementById("contractNumber");
    // fff.addEventListener("input", (event) => {
    //     // console.log($('#contractNumber'))
    //     if (fff.validity.tooShort) {
    //         fff.setCustomValidity("ОЧЕНЬ КОРОТКИЙ");
    //     } else {
    //         fff.setCustomValidity("");
    //     }
    // });  
    var formData = {
        'number': $('#contractNumber').val(),
        'innerNumber': $('#contractInnerNumber').val(),
        'city': $('#contractCity').val(),
        'startDate': $('#contractStartDate').val(),
        'endDate': $('#contractEndDate').val(),
        'contractType': type,
        'contractStatus': 1,
        'products': pr
    };
    // console.log(formData)
    $.ajax({
        type: 'POST',
        url: '/saveContract',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(formData),
        success: function (response) {
            location.reload();
            console.log(response);
        },
        error: function (error) {
            location.reload();
            console.log(error);
        }
    });
}


var counter = 0;
function addContactBlock() {
    counter += 1
    var itemBlock = document.getElementById('companyContacts')
    var contactBlock = document.createElement('div')
    contactBlock.className = 'w-full max-w-xl p-2 bg-white border border-black rounded-lg shadow m-auto sm:p-4'
    contactBlock.setAttribute('id', 'contactBlock' + counter)
    contactBlock.innerHTML = `<div class="flex items-start justify-between">` +
        `<h2 id="contactBlockName` + counter + `" class="text-left font-medium text-black">Контакт № ` + counter + `</h2>` +
        `<button id="contactToDelete` + counter + `" type="button" onclick="deleteContactBlock(` + counter + `)">` +
        `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ms-2 text-gray-500 hover:text-gray-800">` +
        `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />` +
        `</svg>` +
        `</button>` +
        `</div>` +
        `<hr class="mx-auto my-1 h-px bg-black border-grey-300 border">` +
        `<div class="grid grid-cols-2 gap-4 my-3">` +
        `<div class="grid grid-rows-1 py-2 text-center">` +
        `<h2 class="text-left font-medium text-black">ФИО: </h2>` +
        `</div>` +
        `<div class="grid grid-rows-1">` +
        `<input type="text" id="contactName` + counter + `"` +
        `class="bg-gray-50 text-lg border border-gray-300 text-black rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">` +
        `</div>` +
        `</div>` +
        `<div class="grid grid-cols-2 gap-4">` +
        `<div class="grid grid-rows-1 py-2 text-center">` +
        `<h2 class="text-left font-medium text-black">Телефон: </h2>` +
        `</div>` +
        `<div class="grid grid-rows-1">` +
        `<input type="text" id="contactNumber` + counter + `"` + `data-inputmask="'mask': '+7(999)999-99-99', 'showMaskOnHover': false, 'placeholder': '#'"` +
        `class="bg-gray-50 text-lg border border-gray-300 text-black rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" maxlength="16" placeholder="+7(999)999-99-99" required>` +
        `</div>` +
        `</div>`

    itemBlock.appendChild(contactBlock)
    let allIns = document.querySelectorAll("input");
    Inputmask().mask(allIns);
};


function deleteContactBlock(block_id) {
    var block = document.getElementById('contactBlock' + block_id)
    block.remove()
    var new_counter = block_id
    for (var i = block_id + 1; i <= counter; i++) {
        document.getElementById("contactBlock" + i).id = "contactBlock" + new_counter
        $("#contactBlockName" + i).text('Контакт № ' + new_counter)
        document.getElementById("contactBlockName" + i).id = "contactBlockName" + new_counter
        document.getElementById("contactToDelete" + i).setAttribute("onclick", "deleteContactBlock(" + new_counter + ")")
        document.getElementById("contactToDelete" + i).id = "contactToDelete" + new_counter
        document.getElementById("contactName" + i).id = "contactName" + new_counter
        document.getElementById("contactNumber" + i).id = "contactNumber" + new_counter
        new_counter += 1
    }
    counter -= 1
}


function deleteProduct() {
    var contractInfo = JSON.parse(localStorage.getItem("currentConract"))
    var formData = {
        'contractId': contractInfo['id'],
        'productId': $("#currentProduct").val().slice(14),
    }
    $.ajax({
        type: 'POST',
        url: '/deleteProduct',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(formData),
        success: function (response) {
            location.reload();
            console.log(response);
        },
        error: function (error) {
            location.reload();
            console.log(error);
        }
    });
}


function editProduct() {
    document.getElementById('currentProduct').className = 'w-full max-w-xl border-2 border-green-700/25 rounded-lg shadow-xl sm:p-6 md:p-8 hover:shadow-green-800 duration-500'
    document.getElementById('productType').removeAttribute('disabled')
    document.getElementById('productState').removeAttribute('disabled')
    document.getElementById('productNumber').removeAttribute('disabled')
    document.getElementById('productCount').removeAttribute('disabled')
    document.getElementById('productNote').removeAttribute('disabled')
    document.getElementById('isLocalContract').removeAttribute('disabled')
    document.getElementById('productProvider').removeAttribute('disabled')
    document.getElementById('startDate').removeAttribute('disabled')
    document.getElementById('endDate').removeAttribute('disabled')
    document.getElementById('productFile').removeAttribute('disabled')
    document.getElementById('changeButton').innerHTML = `<div class="grid grid-rows-1 py-2 text-center">` +
        `<button data-modal-hide="company-modal" type="button" onclick="changeProduct()"` +
        `class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center ">` +
        `Сохранить</button>` +
        `</div>`
}


var previousElem
function showProduct(id, name, code, number, type, count, state, isContract, provider, start, end, note_list, files) {
    // document.getElementById('editButton').removeAttribute('disabled')
    document.getElementById('addButton').removeAttribute('disabled')
    document.getElementById('deleteButton').removeAttribute('disabled')
    document.getElementById('currentProduct').className = 'w-full max-w-xl border border-black rounded-lg shadow sm:p-6 md:p-8'
    var currentElem = document.getElementById('element' + id)
    if (currentElem != previousElem && previousElem) {
        if (previousElem.className.indexOf('text-xl') != -1) {
            previousElem.className = "flex text-xl text-black font-semibold items-center hover:bg-purple-500 duration-300 rounded-lg"
        } else {
            previousElem.className = "flex text-lg text-black items-center hover:bg-purple-300 duration-300 rounded-lg ml-2"
        }

        if (currentElem.className.indexOf('text-xl') != -1) {
            currentElem.className = "flex text-xl text-black font-semibold items-center bg-purple-500 rounded-lg"
        } else {
            currentElem.className = "flex text-lg text-black items-center bg-purple-300 rounded-lg ml-2"
        }
    }
    previousElem = currentElem
    document.getElementById('changeButton').innerHTML = ''
    $("#currentProduct").val("currentProduct" + id)
    $("#productName").text("Изделие: " + name)
    $('#mainProduct').text($('#productName').text().slice(9))
    $("#mainProduct").val("mainProduct" + id)
    if (code != 'null') {
        document.getElementById('productCode').style.display = 'block'
        $("#productCode").text("Шифр: " + code)
    } else {
        document.getElementById('productCode').style.display = 'none'
    }
    $("#productNumber").val(number)
    document.getElementById('productNumber').setAttribute('disabled', '')
    $("#productType").val(type)
    document.getElementById('productType').setAttribute('disabled', '')
    $("#productCount").val(count)
    document.getElementById('productCount').setAttribute('disabled', '')
    $("#productState").val(state)
    document.getElementById('productState').setAttribute('disabled', '')
    if (note_list != 'null') {
        $("#productNote").val(note_list.replaceAll("!@!", "\n"))
    } else {
        $("#productNote").val('')
    }
    document.getElementById('productNote').setAttribute('disabled', '')
    document.getElementById('isLocalContract').setAttribute('disabled', '')
    document.getElementById('productFile').setAttribute('disabled', '')
    if (isContract == 1) {
        document.getElementById('isLocalContract').checked = true
        $("#productProvider").val(provider)
        showContacts(document.getElementById('productProvider'))
        $("#startDate").val(start)
        $("#endDate").val(end)
        document.getElementById('hideen1').style.display = 'block'
    } else {
        document.getElementById('isLocalContract').checked = false
        $("#productProvider").val('')
        var block = document.getElementById('contacts')
        block.innerHTML = ""
        $("#providerAddress").text('')
        $("#startDate").val('')
        $("#endDate").val('')
        document.getElementById('hideen1').style.display = 'none'
    }
    document.getElementById('productProvider').setAttribute('disabled', '')
    document.getElementById('startDate').setAttribute('disabled', '')
    document.getElementById('endDate').setAttribute('disabled', '')
    createFileList(id, files)

    $('#newProductName').val('')
    $('#newProductCode').val('')
    $('#newProductType').val('')
    $('#newProductState').val('')
    $('#newProductNumber').val('')
    $('#newProductCount').val('')
    document.getElementById('newProductisLocalContract').checked = false
    document.getElementById('hideen2').style.display = 'none'
    $('#newProductProvider').val('')
    $('#newProductStartDate').val('')
    $('#newProductEndDate').val('')
    $("#newProductNote").val('')

};


function addNewProduct() {
    var contractInfo = JSON.parse(localStorage.getItem("currentConract"))
    var files = document.getElementById('newProductFiles').files
    var formData = new FormData()
    var data = {}
    if (document.getElementById('newProductisLocalContract').checked) {
        data = {
            'contractId': contractInfo['id'],
            'mainProductId': $("#mainProduct").val().slice(11),
            'name': $('#newProductName').val(),
            'code': $('#newProductCode').val(),
            'idType': $("#newProductType").val(),
            'idState': $("#newProductState").val(),
            'number': $("#newProductNumber").val(),
            'count': $("#newProductCount").val(),
            'isContract': 1,
            'idProvider': $("#newProductProvider").val(),
            'start': $("#newProductStartDate").val(),
            'end': $("#newProductEndDate").val(),
            'note': $("#newProductNote").val()
        }
    } else {
        data = {
            'contractId': contractInfo['id'],
            'mainProductId': $("#mainProduct").val().slice(11),
            'name': $('#newProductName').val(),
            'code': $('#newProductCode').val(),
            'idType': $("#newProductType").val(),
            'idState': $("#newProductState").val(),
            'number': $("#newProductNumber").val(),
            'count': $("#newProductCount").val(),
            'isContract': 0,
            'idProvider': 0,
            'start': '',
            'end': '',
            'note': $("#newProductNote").val()
        }
    }
    formData.append('data', JSON.stringify(data))
    for (var i = 0; i < files.length; i++) {
        console.log(files[i])
        formData.append('files', files[i]);
    }
    $.ajax({
        type: 'POST',
        url: '/addNewProduct',
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            location.reload();
            console.log(response);
        },
        error: function (error) {
            location.reload();
            console.log(error);
        }
    });
}


function createFileList(id, files) {
    var contractInfo = JSON.parse(localStorage.getItem("currentConract"))
    var fileListDiv = document.getElementById('fileList')
    if (files.length != 0) {
        var ul = document.createElement('ul')
        ul.className = 'inline-grid ps-2 mt-2 space-y-1 list-none list-inside text-sm'
        fileListDiv.innerHTML = ''
        for (var i = 0; i < files.length; i++) {
            var a = document.createElement('li')
            a.className = 'inline-flex'
            var tmp = files[i].split('\\')

            a.innerHTML = `<a class="text-gray-500 hover:text-gray-800 items-center" role="button" ` +
                `onclick='downloadFile(` + JSON.stringify(files[i]) + `, "` + tmp[tmp.length - 1] + `")'> ` + tmp[tmp.length - 1] + ` ` +
                `</a>` +
                `<button onclick='deleteFile(` + JSON.stringify(files[i]) + `, ` + id + `, "` + contractInfo['id'] + `")'>` +
                `<svg class="w-4 h-4 ml-1 text-red-500 hover:text-red-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">` +
                `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>` +
                `</svg>` +
                `</button>`
            ul.appendChild(a)
        }
        fileListDiv.appendChild(ul)
    } else {
        fileListDiv.innerHTML = 'Файлы не найдены'
    }
}


function deleteFile(filePath, product_id, contract_id) {
    $.ajax({
        url: '/deleteFile',
        type: 'GET',
        contentType: false,
        data: { 'filePath': filePath, 'productId': product_id, 'contractId': contract_id },
        success: function (response) {
            console.log(response)
            createFileList(product_id, response['files'])
            
        },
        error: function (response) {
            location.reload()
            console.log(response)
        }
    })
}


function downloadFile(filePath) {
    $.ajax({
        url: '/downloadFile',
        type: 'GET',
        contentType: false,
        data: { 'filePath': filePath },
        xhrFields: {
            responseType: 'blob'
        },
        success: function (response) {
            const url = URL.createObjectURL(response)
            window.location = url
        },
        error: function (response) {
            console.log(response)
        }
    })
}


function changeProduct() {
    var contractInfo = JSON.parse(localStorage.getItem("currentConract"))
    var files = document.getElementById('productFile').files
    var formData = new FormData()
    var data = {}
    if (document.getElementById('isLocalContract').checked) {
        data = {
            'contractId': contractInfo['id'],
            'id': $("#currentProduct").val().slice(14),
            'idType': $("#productType").val(),
            'idState': $("#productState").val(),
            'number': $("#productNumber").val(),
            'count': $("#productCount").val(),
            'isContract': 1,
            'idProvider': $("#productProvider").val(),
            'start': $("#startDate").val(),
            'end': $("#endDate").val(),
            'note': $("#productNote").val()
        }
    } else {
        data = {
            'contractId': contractInfo['id'],
            'id': $("#currentProduct").val().slice(14),
            'idType': $("#productType").val(),
            'idState': $("#productState").val(),
            'number': $("#productNumber").val(),
            'count': $("#productCount").val(),
            'isContract': 0,
            'idProvider': 0,
            'start': '',
            'end': '',
            'note': $("#productNote").val()
        }
    }
    formData.append('data', JSON.stringify(data))
    for (var i = 0; i < files.length; i++) {
        console.log(files[i])
        formData.append('files', files[i]);
    }
    $.ajax({
        type: 'POST',
        url: '/changeProduct',
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            location.reload();
            console.log(response);
        },
        error: function (error) {
            location.reload();
            console.log(error);
        }
    });
}


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


function createTree(element, data, idd, i) {
    const treeElement = document.createElement('ul');
    treeElement.className = 'ps-2 mt-2 space-y-1 list-none list-inside';
    if (idd != null && idd != 'root') {
        var tmp = idd + i - 1
        treeElement.id = 'collapse' + tmp;
        treeElement.className = '!visible hidden ' + treeElement.className
        treeElement.setAttribute('data-te-collapse-item', '')
    }
    data.forEach((item) => {
        // console.log(item)
        const listItem = document.createElement('li')
        var new_note = String(item.note)
        note_lines = new_note.replaceAll("\n", "!@!")
        if (item.children.length != 0) {
            var tmp = item.id + i
            listItem.innerHTML = `<a id="element` + item.id + `" data-te-collapse-init href="#collapse` + tmp + `" role="button" aria-expanded="false" aria-controls="collapse` + tmp + `"` +
                `class="flex text-xl text-black font-semibold items-center hover:bg-purple-500 duration-300 rounded-lg"` +
                `onclick='showProduct(` + item.id + `, "` + item.name + `", "` + item.code + `", ` +
                item.number + `, ` + item.idType + `, ` + item.count + `, ` + item.idState + `, ` +
                item.isContract + `, ` + item.idProvider + `, "` + item.start + `", "` + item.end + `", "` + note_lines + `", ` + JSON.stringify(item.files) + `)'>` +
                `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4">` +
                `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>` +
                item.name + `</a>`
            i += 1
        } else {
            listItem.innerHTML = `<a id="element` + item.id + `" role="button" aria-expanded="false"` +
                `class="flex text-lg text-black items-center hover:bg-purple-300 duration-300 rounded-lg ml-2"` +
                `onclick='showProduct(` + item.id + `, "` + item.name + `", "` + item.code + `", ` +
                item.number + `, ` + item.idType + `, ` + item.count + `, ` + item.idState + `, ` +
                item.isContract + `, ` + item.idProvider + `, "` + item.start + `", "` + item.end + `", "` + note_lines + `", ` + JSON.stringify(item.files) + `)'>` +
                item.name + `</a>`
        }
        if (item.children.length != 0) {
            createTree(listItem, item.children, item.id, i)
        }
        treeElement.append(listItem)
    });
    element.append(treeElement)
};
function test(a, b) {
    console.log(a, b)
}


function startCreation(id) {
    fetch(`/products/${id}`)
        .then(response => response.json())
        .then(data => {
            const rootElement = document.getElementById('mainTree')
            rootElement.innerHTML = ""
            var i = 1
            createTree(rootElement, data['data'], null, i)
        });
}
