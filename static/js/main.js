window.onload = getContractFromStorage();
window.onload = getProdivers();
// window.onload = getProductList(false)
// window.onload = getContracts();

function getContractFromStorage() {
    // console.log(localStorage)
    var contractInfo = JSON.parse(localStorage.getItem("currentContract"))
    if (contractInfo && contractInfo['id'] != -1) {
        getContractInfo(contractInfo['id'], contractInfo['number'], contractInfo['innerNumber'], contractInfo['city'], contractInfo['startDate'], contractInfo['endDate'], contractInfo['type'], contractInfo['status'])
    } else {
        getContractInfo(-1, '', '', '', '', '', '', '')
    }
}


function updateContractList(contracts) {
    var list = document.getElementById('contractList')
    list.innerHTML = ''
    contracts.forEach((contract) => {
        var listElem = document.createElement('li')
        listElem.className = 'flex grid-cols-2 gap-2 mx-2 rounded-lg'
        listElem.innerHTML = `<button class="w-full text-left bg-transparent ml-2 py-2 text-lg font-normal rounded-sm text-white hover:text-gray-400 active:no-underline"` +
            `data-te-dropdown-item-ref ` +
            `onclick="getContractInfo('` + contract[0] + `', '` + contract[1] + `', '` + contract[2] + `', '` + contract[3] + `', '` + contract[4] + `', '` + contract[5] + `', '` + contract[7] + `', '` + contract[8] + `')">Контракт` +
            ` № ` + contract[1] + `</button>` +
            `<button type="button" onclick="deleteContract('` + contract[0] + `')">` +
            `<svg class="w-5 h-5 mr-2 text-red-500 hover:text-red-800" aria-hidden="true"` +
            `xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"` +
            `viewBox="0 0 22 22">` +
            `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"` +
            `stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />` +
            `</svg>` +
            `</button>`
        list.appendChild(listElem)
    })
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


function deleteContract(id) {
    $.ajax({
        type: 'GET',
        url: '/deleteContract',
        contentType: false,
        data: { 'contractId': id },
        success: function (response) {
            contracts = response['contracts']
            console.log(response);
            if (contracts.length != 0) {
                updateContractList(contracts)
                getContractInfo(contracts[0][0], contracts[0][1], contracts[0][2], contracts[0][3], contracts[0][4], contracts[0][5], contracts[0][7], contracts[0][8])
            }
            else {
                getContractInfo(-1, '', '', '', '', '', '', '')
                document.getElementById('mainTree').innerHTML = ""
                document.getElementById('contractList').innerHTML = ""
            }

        },
        error: function (error) {
            location.reload();
            console.log(error);
        }
    });
}

function getContractInfo(id, number, innerNumber, city, startDate, endDate, type, status) {
    if (id == -1) {
        var currentContract = {
            'id': id,
            'number': '',
            'innerNumber': '',
            'city': '',
            'startDate': '',
            'endDate': '',
            'type': '',
            'status': ''
        }
        localStorage.setItem("currentContract", JSON.stringify(currentContract));
        document.getElementById('info').innerHTML = ""
    } else {
        var currentContract = {
            'id': id,
            'number': number,
            'innerNumber': innerNumber,
            'city': city,
            'startDate': startDate,
            'endDate': endDate,
            'type': type,
            'status': status
        }
        localStorage.setItem("currentContract", JSON.stringify(currentContract));
        $("#cNumber").text("Выбран контракт № " + number)
        $("#cInnerNumber").text("Внутренний номер: " + innerNumber)
        $("#cCity").text("Город: " + city)
        $("#cStart").text("Дата подписания: " + startDate)
        $("#cEnd").text("Дата сдачи: " + endDate)
        $("#cType").text("Тип контракта: " + type)
        $("#cStatus").text("Статус: " + status)
        startCreation(id)
    }
};

var products = []
function setDeafults() {
    $('#newProductCode').val('н/б')
    $('#newProductCount').val('1')
    $('#newProductState').val(1)
    $('#newProductType').val(1)
    getProductList(false)
}


function cleanInputWindow(id_modal) {
    var modal = document.getElementById(id_modal)
    var inputs = modal.getElementsByTagName('input')
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type == 'text' || inputs[i].type == 'number' || inputs[i].type == 'date' || inputs[i].type == 'file') {
            inputs[i].value = ''
        } else if (inputs[i].type == 'radio' || inputs[i].type == 'checkbox' && inputs[i].id != 'addInDB') {
            inputs[i].checked = false
        }
    }
    document.getElementById('hideen2').style.display = 'none'
}

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
    $.ajax({
        type: 'POST',
        url: '/saveProvider',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(formData),
        success: function (response) {
            getProdivers()
            console.log(response);
        },
        error: function (error) {
            location.reload();
            console.log(error);
        }
    });
}


function createProviderOptionList(providers, elemId) {
    var providerSelect = document.getElementById(elemId)
    providerSelect.innerHTML = `<option value="" selected disabled hidden></option>`
    providers.forEach((item) => {
        var opt = document.createElement('option')
        opt.id = 'company' + item[0]
        opt.value = item[0]
        opt.setAttribute('data-address', item[2])
        opt.textContent = item[1]
        providerSelect.appendChild(opt)
    })
}


function getProdivers() {
    $.ajax({
        type: 'GET',
        url: '/getProdivers',
        success: function (response) {
            providers = response['data']
            createProviderOptionList(providers, 'productProvider')
            createProviderOptionList(providers, 'newProductProvider')
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
    $.ajax({
        type: 'POST',
        url: '/saveContract',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(formData),
        success: function (response) {
            getContractInfo(response['contractId'], response['data'][0], response['data'][1], response['data'][2],
                response['data'][3], response['data'][4], response['data'][5], response['data'][6],)
            updateContractList(response['contracts'])
            cleanInputWindow('contract-modal')
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
    var contractInfo = JSON.parse(localStorage.getItem("currentContract"))
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
            // startCreation(contractInfo['id'])
            document.getElementById('element' + $("#currentProduct").val().slice(14)).remove()
            cleanInputWindow('product-change-modal')
            getProductList(false)
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


var my_files = []
function showFileList(inpName, fileList) {
    var files = document.getElementById(inpName).files
    // console.log(files)
    for (var i = 0; i < files.length; i++) {
        my_files.push(files[i])
    }
    // console.log(my_files)
    // console.log('##################################################')
    var list = document.getElementById(fileList)
    list.innerHTML = `<svg class="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true"` +
        `xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">` +
        `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"` +
        `d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />` +
        `</svg>`
    for (var i = 0; i < my_files.length; i++) {
        list.innerHTML += `<div id="file-list-` + i + `" class="inline-flex items-center p-2">` +
            `<p class="text-gray-800 text-sm" >` + my_files[i].name +
            `</p>` +
            `<button onclick='deleteFileFromList(` + i + `, "` + fileList + `")'>` +
            `<svg class="w-4 h-4 ml-1 text-red-500 hover:text-red-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">` +
            `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>` +
            `</svg>` +
            `</button>` +
            `</div>`
    }
    updateDragAndDrop(fileList, false)
}


function deleteFileFromList(index, fileList) {
    my_files.splice(index, 1)
    var t = document.getElementById('file-list-' + index)
    t.remove()
    updateDragAndDrop(fileList, false)
}


function updateDragAndDrop(fileList, option) {
    if (my_files.length == 0 || option) {
        var list = document.getElementById(fileList)
        list.innerHTML = `<svg class="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true"` +
            `xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">` +
            `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"` +
            `d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />` +
            `</svg>` +
            `<p class="mb-2 text-sm text-gray-500 "><span` +
            `class="font-semibold">Click to upload</span> or drag and ` +
            `drop</p>` +
            `<p class="text-xs text-gray-500 ">DOC, DOCX, ` +
            `PDF</p>`
    }
}


var previousElem
function showProduct(id, name, code, number, type, count, state, isContract, provider, start, end, note_list, files) {
    cleanInputWindow('product-add-modal')
    my_files = []
    updateDragAndDrop("productFilesList", true)
    updateDragAndDrop("newProductFilesList", true)
    // document.getElementById('editButton').removeAttribute('disabled')
    document.getElementById('addButton').removeAttribute('disabled')
    document.getElementById('deleteButton').removeAttribute('disabled')
    document.getElementById('currentProduct').className = 'w-full max-w-2xl border border-black rounded-lg shadow sm:p-6 md:p-8'
    var currentElem = document.getElementById('element' + id)
    if (currentElem != previousElem && previousElem) {
        if (previousElem.className.indexOf('text-xl') != -1) {
            previousElem.className = "flex text-xl text-black font-semibold items-center hover:bg-purple-500 duration-300 rounded-lg"
        } else {
            previousElem.className = "flex text-lg text-black items-center hover:bg-purple-300 duration-300 rounded-lg ml-4"
        }

        if (currentElem.className.indexOf('text-xl') != -1) {
            currentElem.className = "flex text-xl text-black font-semibold items-center bg-purple-500 rounded-lg"
        } else {
            currentElem.className = "flex text-lg text-black items-center bg-purple-300 rounded-lg ml-4"
        }
    } else {
        if (currentElem.className.indexOf('text-xl') != -1) {
            currentElem.className = "flex text-xl text-black font-semibold items-center bg-purple-500 rounded-lg"
        } else {
            currentElem.className = "flex text-lg text-black items-center bg-purple-300 rounded-lg ml-4"
        }
    }
    previousElem = currentElem
    document.getElementById('addInDB').checked = false
    document.getElementById('addDiv1').innerHTML = inner_div1
    document.getElementById('addDiv2').innerHTML = inner_div2
    document.getElementById('addDiv2').className = div2_class
    // document.getElementById('changeButton').innerHTML = ''
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
    //document.getElementById('productNumber').setAttribute('disabled', '')
    $("#productType").val(type)
    // document.getElementById('productType').setAttribute('disabled', '')
    $("#productCount").val(count)
    // document.getElementById('productCount').setAttribute('disabled', '')
    $("#productState").val(state)
    // document.getElementById('productState').setAttribute('disabled', '')
    if (note_list != 'null') {
        // $("#productNote").val(note_list.replaceAll("!@!", "\n"))
        $("#productNote").val(note_list)

    } else {
        $("#productNote").val('')
    }
    // document.getElementById('productNote').setAttribute('disabled', '')
    // document.getElementById('isLocalContract').setAttribute('disabled', '')
    // document.getElementById('productFile').setAttribute('disabled', '')
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

    // document.getElementById('productProvider').setAttribute('disabled', '')
    // document.getElementById('startDate').setAttribute('disabled', '')
    // document.getElementById('endDate').setAttribute('disabled', '')

    $('#productToDelete').text('Вы действительно хотите удалить изделие - ' + $('#productName').text().slice(9))
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
    var contractInfo = JSON.parse(localStorage.getItem("currentContract"))
    var files = document.getElementById('newProductFiles').files
    var formData = new FormData()
    var data = {
        'contractId': contractInfo['id'],
        'mainProductId': -1,
        'name': $('#newProductName').val(),
        'code': $('#newProductCode').val(),
        'idType': $("#newProductType").val(),
        'idState': $("#newProductState").val(),
        'isMain': 0,
        'number': $("#newProductNumber").val(),
        'count': $("#newProductCount").val(),
        'note': $("#newProductNote").val(),
        'isContract': 0,
        'idProvider': 0,
        'start': '',
        'end': ''
        
    }
    if (document.getElementById('newProductisLocalContract').checked) {
        data['isContract'] = 1
        data['idProvider'] = $("#newProductProvider").val()
        data['start'] = $("#newProductStartDate").val()
        data['end'] = $("#newProductEndDate").val()
    }
    if (document.getElementById('addInDB').checked == true){
        data['mainProductId'] = document.getElementById('productInput').getAttribute('m-prod-id')
        if(document.getElementById('newProductIsMain').checked){
            data['isMain'] = 1
        }
        formData.append('to_db', 1)
    } else {
        data['mainProductId'] = $("#mainProduct").val().slice(11)
        formData.append('to_db', 0)
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
            startCreation(contractInfo['id'])
            cleanInputWindow('product-add-modal')
            getProductList(false)
            console.log(response);
        },
        error: function (error) {
            location.reload();
            console.log(error);
        }
    });
}


function createFileList(id, files) {
    var contractInfo = JSON.parse(localStorage.getItem("currentContract"))
    var fileListDiv = document.getElementById('fileList')
    if (files && files.length != 0) {
        var ul = document.createElement('ul')
        ul.className = 'inline-grid ps-2 mt-2 space-y-1 list-none list-inside text-sm'
        fileListDiv.innerHTML = ''
        for (var i = 0; i < files.length; i++) {
            var a = document.createElement('li')
            a.className = 'inline-flex items-center'
            var tmp = files[i].split('\\')
            a.innerHTML = `<a class="text-gray-500 hover:text-gray-800 " role="button" ` +
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
            // startCreation(contract_id)

        },
        error: function (response) {
            location.reload()
            console.log(response)
        }
    })
}


function downloadFile(filePath, filename) {
    $.ajax({
        url: '/downloadFile',
        type: 'GET',
        contentType: false,
        data: { 'filePath': filePath },
        xhrFields: {
            responseType: 'blob'
        },
        success: function (response) {
            // const main = document.getElementById('file-' + filename);
            const elem = document.createElement('a')
            elem.href = URL.createObjectURL(response);
            elem.download = filename;
            elem.style.display = 'none';
            document.body.appendChild(elem)
            elem.click()
            document.body.removeChild(elem)

            // const url = URL.createObjectURL(response)
            // window.open(url)
        },
        error: function (response) {
            console.log(response)
        }
    })
}


function updateProduct(id, data, files) {
    // console.log(data, files)
    $("#productNumber").val(data.number)
    $("#productType").val(data.idType)
    $("#productCount").val(data.count)
    $("#productState").val(data.idState)
    $("#productNote").val(data.note)

    if (data.isContract == 1) {
        document.getElementById('isLocalContract').checked = true
        $("#productProvider").val(data.idProvider)
        showContacts(document.getElementById('productProvider'))
        $("#startDate").val(data.start)
        $("#endDate").val(data.end)
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
    if (files) {
        createFileList(id, files)
    }
    var command = "showProduct(" + id + ", '" + data.name + "', '" + data.code + "', '" + data.number + "'" +
        ", " + data.idType + ", " + data.count + ", " + data.idState + ", " + data.isContract + "" +
        ", " + data.idProvider + ", '" + data.start + "', '" + data.end + "', " + JSON.stringify(data.note) + ", " + JSON.stringify(data.files) + ")"
    var my_elem = document.getElementById('element' + id)
    my_elem.setAttribute('onclick', command)
    updateDragAndDrop("productFilesList", true)
    my_files = []
}


function changeProduct() {
    var contractInfo = JSON.parse(localStorage.getItem("currentContract"))
    var files = my_files
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
        formData.append('files', files[i]);
    }
    $.ajax({
        type: 'POST',
        url: '/changeProduct',
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            // startCreation(contractInfo['id'])
            cleanInputWindow('product-change-modal')
            updateProduct(data['id'], response['product'], response['files'])
            getProductList(false)
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
                    // console.log(item)
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
        if (item.children.length != 0) {
            var tmp = item.id + i
            listItem.innerHTML = `<a id="element` + item.id + `" data-te-collapse-init href="#collapse` + tmp + `" role="button" aria-expanded="false" aria-controls="collapse` + tmp + `"` +
                `class="flex text-xl text-black font-semibold items-center hover:bg-purple-500 duration-300 rounded-lg"` +
                `onclick='showProduct(` + item.id + `, "` + item.name + `", "` + item.code + `", "` + item.number + `" ` +
                `, ` + item.idType + `, ` + item.count + `, ` + item.idState + `, ` +
                item.isContract + `, ` + item.idProvider + `, "` + item.start + `", "` + item.end + `", ` + JSON.stringify(item.note) + `, ` + JSON.stringify(item.files) + `)'>` +
                `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4">` +
                `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>` +
                item.name + `</a>`
            i += 1
        } else {
            listItem.innerHTML = `<a id="element` + item.id + `" role="button" aria-expanded="false"` +
                `class="flex text-lg text-black items-center hover:bg-purple-300 duration-300 rounded-lg ml-4"` +
                `onclick='showProduct(` + item.id + `, "` + item.name + `", "` + item.code + `", "` + item.number + `" ` +
                `, ` + item.idType + `, ` + item.count + `, ` + item.idState + `, ` +
                item.isContract + `, ` + item.idProvider + `, "` + item.start + `", "` + item.end + `", ` + JSON.stringify(item.note) + `, ` + JSON.stringify(item.files) + `)'>` +
                item.name + `</a>`
        }
        if (item.children.length != 0) {
            createTree(listItem, item.children, item.id, i)
        }
        treeElement.append(listItem)
    });
    element.append(treeElement)
};


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


function getProductList(only_db) {
    var productList = []
    var contractInfo = JSON.parse(localStorage.getItem("currentContract"))

    $.ajax({
        type: 'GET',
        url: '/getProductList',
        contentType: false,
        data: { 'contractId': contractInfo['id'] },
        success: function (response) {
            productList = response['products']
            // console.log(only_db)
            db_productList = []
            var j = 0
            if (only_db) {
                for (var i = 0; i < productList.length; i++){
                    if (productList[i]['type'] == 'db') {
                        // console.log()
                        db_productList[j] = productList[i]
                        j+=1
                    }
                }
                console.log(db_productList)
                productAutocomplete(db_productList, true)
            } else {
                console.log(productList)
                productAutocomplete(productList, false)
            }
        },
        error: function (error) {
            location.reload();
            console.log(error);
        }
    });
}


function autocomplete(id, type) {
    var contractInfo = JSON.parse(localStorage.getItem("currentContract"))

    $.ajax({
        type: 'GET',
        url: '/getProductInfo',
        contentType: false,
        data: { 'contractId': contractInfo['id'], 'productId': id.slice(13), 'productType': type },
        success: function (response) {
            product = response['product']
            console.log(product)
            $('#newProductName').val(product.name)
            $('#newProductCode').val(product.code)
            $('#newProductType').val(product.idType)
            $('#newProductState').val(product.idState)
            $('#newProductNumber').val(product.number)
            $('#newProductCount').val(product.count)
            if (product.isContract == 1) {
                document.getElementById('newProductisLocalContract').checked = true
                $("#newProductProvider").val(product.idProvider)
                showContacts(document.getElementById('productProvider'))
                $("#newProductStartDate").val(product.start)
                $("#newProductEndDate").val(product.end)
                document.getElementById('hideen2').style.display = 'block'
            } else {
                document.getElementById('newProductisLocalContract').checked = false
                $("#newProductProvider").val('')
                document.getElementById('hideen2').style.display = 'none'
            }
            if (product.note != "None") {
                $("#newProductNote").val(product.note)
            } else {
                $("#productNote").val('')
            }
        },
        error: function (error) {
            location.reload();
            console.log(error);
        }
    });

}


function productAutocomplete(productList, only_db) {
    var inp = document.getElementById("productInput")
    var currentFocus;
    const styleSheet = document.styleSheets[0]
    styleSheet.insertRule('.auto-list { position: absolute; border-radius: 0.5rem; border-width: 1px; --tw-bg-opacity: 1; background-color: rgb(255 255 255 / var(--tw-bg-opacity)); }', styleSheet.cssRules.length)
    // console.log(productList)
    inp.addEventListener('input', function (e) {
        var a, b, i, val = this.value
        console.log(val)
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("div");
        a.setAttribute("id", "product-autocomplete-list");
        a.setAttribute("class", "auto-list");
        this.parentNode.appendChild(a);
        for (i = 0; i < productList.length; i++) {
            if (productList[i]['name'].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("div");
                b.setAttribute('class', 'text-black text-sm border-b p-1 cursor-pointer hover:bg-gray-200')
                b.innerHTML = "<strong>" + productList[i]['name'].substr(0, val.length) + "</strong>";
                b.innerHTML += productList[i]['name'].substr(val.length);
                if (productList[i]['type'] == 'db') {
                    b.innerHTML += "<strong> (Из шаблона)</strong>"
                } else {
                    b.innerHTML += "<strong> (Из контракта)</strong>"
                }
                b.innerHTML += "<input type='hidden' id='product-item-" + productList[i]['id'] + "' value='" + productList[i]['name'] + "' data-type='" + productList[i]['type'] + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    if (!only_db) {
                        autocomplete(this.getElementsByTagName("input")[0].id, this.getElementsByTagName("input")[0].getAttribute('data-type'))
                        inp.setAttribute('m-prod-id', '-1')
                    } else {
                        inp.setAttribute('m-prod-id', this.getElementsByTagName("input")[0].id.slice(13))
                    }
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    })
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById("product-autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.remove('hover:bg-gray-200')
        x[currentFocus].classList.add("bg-blue-500", "text-white");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("bg-blue-500", "text-white");
            x[i].classList.add('hover:bg-gray-200')
        }
    }
    function closeAllLists(elmnt) {

        var x = document.getElementsByClassName("auto-list");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}


var inner_div1 = document.getElementById('addDiv1').innerHTML
var inner_div2 = document.getElementById('addDiv2').innerHTML
var div2_class = document.getElementById('addDiv2').className
document.getElementById('hideen3').style.display = 'none'
function saveInDB() {
    var option = document.getElementById('addInDB').checked
    var div1 = document.getElementById('addDiv1')
    var div2 = document.getElementById('addDiv2')
    var elem = document.getElementById('hideen3')
    if (option){
        document.getElementById('productInput').setAttribute('m-prod-id', '-1')
        div1.innerHTML = document.getElementById('autocompleteDiv').innerHTML
        div2.innerHTML = ''
        div2.className = ''
        getProductList(true)    
        elem.style.display = 'block'
    } else {
        elem.style.display = 'none'
        div1.innerHTML = inner_div1
        div2.innerHTML = inner_div2
        div2.className = div2_class
        $('#mainProduct').text($('#productName').text().slice(9))
        $("#mainProduct").val("mainProduct" + $("#currentProduct").val().slice(14))
        getProductList(false)
    }
    cleanInputWindow('product-add-modal')
    $('#newProductCode').val('н/б')
    $('#newProductCount').val('1')
    $('#newProductState').val(1)
    $('#newProductType').val(1)
    // setDeafults()
}