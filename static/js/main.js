window.onload = getContractFromStorage();
window.onload = getProdivers();
// window.onload = getProductList(false)
// window.onload = getContracts();

function getContractFromStorage() {
    getPermission()
    if (localStorage.getItem("settings")) {
        var settings = JSON.parse(localStorage.getItem("settings"))
        // console.log(Number(settings[0].status))
        document.getElementById('setting1').checked = Number(settings[0].status)
        document.getElementById('setting2').checked = Number(settings[1].status)
    } else {
        localStorage.setItem("settings", JSON.stringify([{'id': 'setting1', 'status': false}, {'id': 'setting2', 'status': false}]))
    }

    var contractInfo = JSON.parse(localStorage.getItem("currentContract"))
    // console.log(contractInfo)
    // console.log(check_cotract_in_list(contractInfo['id']))
    if (contractInfo && contractInfo['id'] != -1 && check_cotract_in_list(contractInfo['id']) == true) {
        getContractInfo(contractInfo['id'], contractInfo['number'], contractInfo['innerNumber'], contractInfo['city'], contractInfo['startDate'], contractInfo['endDate'], contractInfo['type'], contractInfo['status'], true)
    } else {
        // if (check_cotract_in_list(contractInfo['id'])[0] == true) {
        getContractInfo(-1, '', '', '', '', '', '', '', true)
        // }
    }

}


function updateContractList(contracts) {
    var list = document.getElementById('contractList')
    list.innerHTML = ''
    contracts.forEach((contract) => {
        var listElem = document.createElement('li')
        listElem.className = 'flex grid-cols-2 gap-2 mx-2 rounded-lg'
        listElem.innerHTML = `<button id="contract_` + contract[0] + `" class="w-full text-left bg-transparent ml-2 py-2 text-lg font-normal rounded-sm text-white hover:text-gray-400 active:no-underline"` +
            `data-te-dropdown-item-ref ` +
            `onclick="getContractInfo('` + contract[0] + `', '` + contract[1] + `', '` + contract[2] + `', '` + contract[3] + `', '` + contract[4] + `', '` + contract[5] + `', '` + contract[7] + `', ` + contract[8] + `, ` + true + `)">Контракт` +
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
    fetch(`/contacts/${ tmp.value }`)
        .then(response => response.json())
        .then(data => {
            contacts = data
            // console.log(contacts)
            var block = document.getElementById('contacts')
            block.innerHTML = ""
            for (var i = 0; i < contacts.length; i++) {
                var d = document.createElement('div')
                d.className = "pb-2"
                d.innerHTML =
                    `<p class="font-semibold"><span>ФИО:  </span>` + contacts[i][1] + `</p>` +
                    `<p class="font-semibold"><span>Должность:  </span>` + contacts[i][3] + `</p>` +
                    `<p class="font-semibold"><span>Телефон:  </span>` + contacts[i][2] + `</p>` +
                    `<p class="font-semibold"><span>Почта:  </span>` + contacts[i][4] + `</p>`
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
                getContractInfo(contracts[0][0], contracts[0][1], contracts[0][2], contracts[0][3], contracts[0][4], contracts[0][5], contracts[0][7], contracts[0][8], true)
            }
            else {
                getContractInfo(-1, '', '', '', '', '', '', '', true)
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

function getContractInfo(id, number, innerNumber, city, startDate, endDate, type, status, option) {
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
        $("#cNumber").text('Контракт не выбран')
    } else {
        var currentContract = {
            'id': id,
            'number': number,
            'innerNumber': innerNumber,
            'city': city,
            'startDate': startDate,
            'endDate': endDate,
            'type': type,
            'status': Number(status)
        }
        localStorage.setItem("currentContract", JSON.stringify(currentContract));
        $("#cNumber").text("Выбран контракт № " + number)
        $("#cInnerNumber").html('<span class="font-medium">Номер заказа: </span>' + innerNumber)
        $("#cCity").html('<span class="font-medium">Город: </span>' + city)
        $("#cStart").html('<span class="font-medium">Дата подписания: </span>' + startDate)
        $("#cEnd").html('<span class="font-medium">Дата сдачи: </span>' + endDate)
        $("#cType").html('<span class="font-medium">Тип контракта: </span>' + type)
        $("#cStatus").val(Number(status))
        if (option) {
            startCreation(id)
        }
    }
};

var products = []
function setDeafults() {
    $('#newProductCode').val('б/ш')
    $('#newProductCount').val('1')
    $('#newProductState').val(1)
    $('#newProductType').val(1)
    $('#newProductNumber').val('б/н')
    // console.log()
    if (document.getElementById('currentProduct').value == null) {
        document.getElementById('addInDB').checked = true
        document.getElementById('addInDB').setAttribute('disabled', '')

    }
    saveInDB()
    // getProductList(false)
}


function changeContractStatus(inp) {
    var formData = new FormData()
    var contractInfo = JSON.parse(localStorage.getItem("currentContract"))
    formData.append('contractId', contractInfo['id'])
    formData.append('status', inp.value)
    $.ajax({
        type: 'POST',
        url: '/changeContractStatus',
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            getContractInfo(contractInfo['id'], contractInfo['number'], contractInfo['innerNumber'], contractInfo['city'], contractInfo['startDate'], contractInfo['endDate'], contractInfo['type'], inp.value, false)
            updateContractList(response['contracts'])
            // addProductSelect()
            console.log(response);
        },
        error: function (error) {
            location.reload();
            console.log(error);
        }
    });
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


function changeProvider() {
    var contacts = []
    var my_items = document.getElementById('providerContactsList').getElementsByTagName('li')
    if (my_items.length > 0) {
        for (var i = 0; i < my_items.length; i++) {
            var tmp = {
                'id': my_items[i].id.slice(9),
                'name': my_items[i].getAttribute('name'),
                'number': my_items[i].getAttribute('phone'),
                'post': my_items[i].getAttribute('post'),
                'email': my_items[i].getAttribute('email')
            }
            contacts[i] = tmp
        }
    }

    var formData = {
        'id': document.getElementById('currentProvider').value,
        'name': $('#companyName').val(),
        'address': $('#companyAddress').val(),
        'contacts': contacts
    }
    $.ajax({
        type: 'POST',
        url: '/changeProvider',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(formData),
        success: function (response) {
            // document.getElementById('providerContactsList').innerHTML = ''
            // $('#contactName').val('')
            // $('#contactPost').val('')
            // $('#contactPhone').val('')
            // $('#contactEmail').val('')
            getProdivers()
            document.getElementById('productEdit' + document.getElementById('currentProvider').value).click()
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
        if (item[1].length > 22) {
            opt.textContent = item[1].slice(0, 22) + '...'
        } else {
            opt.textContent = item[1]
        }

        providerSelect.appendChild(opt)
    })
}


function createProviderModal(providers) {
    // console.log(providers)
    var prodviders_ul = document.getElementById('providersList')
    prodviders_ul.innerHTML = ""
    for (var i = 0; i < providers.length; i++) {
        var elem = document.createElement('li')
        elem.id = 'providerLI' + providers[i][0]
        elem.className = 'grid grid-cols-3 py-1 border-b hover:bg-gray-200 hover:text-gray-900 rounded-lg'
        elem.innerHTML = `<button id="productEdit` + providers[i][0] + `" onclick='showProdviderInfo(` + providers[i][0] + `, "` + providers[i][1] + `", "` + providers[i][2] + `")' ` +
            `class="text-sm max-w-32 col-span-2 truncate text-left justify-self-start ml-2 text-gray-600 font-semibold border-gray-300 rounded">` + providers[i][1] + `</button>` +
            `<button type="button" class=" justify-self-end justify-end text-end" onclick="deleteProvider('` + providers[i][0] + `')">` +
            `<svg class="w-4 h-4  mr-2 text-red-500 hover:text-red-800" aria-hidden="true"` +
            `xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"` +
            `viewBox="0 0 22 22">` +
            `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"` +
            `stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />` +
            `</svg>` +
            `</button>`
        prodviders_ul.append(elem)
    }
}


function deleteProvider(id) {
    $.ajax({
        type: 'GET',
        url: '/deleteProvider',
        contentType: false,
        data: { 'providerId': id },
        success: function (response) {
            getProdivers()
            $('#contactName').val('')
            $('#contactPost').val('')
            $('#contactPhone').val('')
            $('#contactEmail').val('')
            document.getElementById('providerContactsList').innerHTML = ""
            console.log(response);
        },
        error: function (error) {
            // location.reload();
            console.log(error);
        }
    });
}


function deleteProviderWeb(id) {
    var to_del = document.getElementById('providerLI' + id)
    to_del.remove()
}


function deleteContact(idProvider, idContact, name, addr) {
    $.ajax({
        type: 'GET',
        url: '/deleteContact',
        contentType: false,
        data: { 'providerId': idProvider, 'contactId': idContact },
        success: function (response) {
            // getProdivers()
            showProdviderInfo(idProvider, name, addr)
            console.log(response);
        },
        error: function (error) {
            // location.reload();
            console.log(error);
        }
    });
}


function deleteContactWeb(id) {
    var to_del = document.getElementById('contactLI' + id)
    to_del.remove()
    $('#contactName').val('')
    $('#contactPost').val('')
    $('#contactPhone').val('')
    $('#contactEmail').val('')
}


function updateCurrentContact() {
    var cur_contact = document.getElementById('currentContact').value
    // console.log(cur_contact)
    var my_li = document.getElementById('contactLI' + cur_contact)
    if (my_li.getAttribute('is-new') == 'true') {

    } else {
        my_li.innerHTML = `<button id="contactEdit` + cur_contact + `" onclick='showContactInfo(` + cur_contact + `)' ` +
            `class="text-sm truncate max-w-32 text-left justify-self-start ml-2 text-gray-600 font-semibold border-gray-300 rounded">` + $('#contactName').val() + `</button>` +
            `<button type="button" class=" justify-self-end justify-end text-end" onclick='deleteContactWeb(` + cur_contact + `)'>` +
            `<svg class="w-4 h-4  mr-2 text-red-500 hover:text-red-800" aria-hidden="true"` +
            `xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"` +
            `viewBox="0 0 22 22">` +
            `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"` +
            `stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>` +
            `</svg>` +
            `</button>`
    }

    my_li.setAttribute('name', $('#contactName').val())
    my_li.setAttribute('post', $('#contactPost').val())
    my_li.setAttribute('phone', $('#contactPhone').val())
    my_li.setAttribute('email', $('#contactEmail').val())
}


function addNewProvider() {
    $('#contactName').val('')
    $('#contactPost').val('')
    $('#contactPhone').val('')
    $('#contactEmail').val('')
    $('#companyName').val('')
    $('#companyAddress').val('')
    document.getElementById('providerContactsList').innerHTML = ''
    var prodviders_ul = document.getElementById('providersList')
    var tt = prodviders_ul.getElementsByTagName('li').length
    if (tt != 0) {
        var new_prod_id = Number(prodviders_ul.getElementsByTagName('li')[tt - 1].id.slice(10)) + 1
    } else {
        var new_prod_id = 0
    }
    var new_prod_elem = document.createElement('li')
    new_prod_elem.id = 'providerLI' + new_prod_id
    document.getElementById('currentProvider').value = new_prod_id
    new_prod_elem.className = 'grid grid-cols-3 py-1 border-b hover:bg-gray-200 hover:text-gray-900 rounded-lg'
    new_prod_elem.setAttribute('is-new', 'true')
    new_prod_elem.innerHTML = `<button id="productEdit` + new_prod_id + `" onclick='showProdviderInfo(` + new_prod_id + `, "` + $('#companyName').val() + `", "` + $('#companyAddress').val() + `")' ` +
        `class="text-sm max-w-32 col-span-2 truncate text-left justify-self-start ml-2 text-gray-600 font-semibold border-gray-300 rounded"></button>` +
        `<button type="button" class=" justify-self-end justify-end text-end" onclick="deleteProviderWeb(` + new_prod_id + `)">` +
        `<svg class="w-4 h-4  mr-2 text-red-500 hover:text-red-800" aria-hidden="true"` +
        `xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"` +
        `viewBox="0 0 22 22">` +
        `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"` +
        `stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />` +
        `</svg>` +
        `</button>`
    prodviders_ul.append(new_prod_elem)
    document.getElementById('providerEditSave').setAttribute('onclick', 'saveNewProvider()')
}


function addNewContact() {
    $('#contactName').val('')
    $('#contactPost').val('')
    $('#contactPhone').val('')
    $('#contactEmail').val('')
    // document.getElementById('providerContactsList').innerHTML = ''
    var contacts_ul = document.getElementById('providerContactsList')
    var tt = contacts_ul.getElementsByTagName('li').length
    if (tt != 0) {
        var new_contact_id = Number(contacts_ul.getElementsByTagName('li')[tt - 1].id.slice(9)) + 1
    } else {
        var new_contact_id = 0
    }
    var new_contact_elem = document.createElement('li')
    new_contact_elem.id = 'contactLI' + new_contact_id
    document.getElementById('currentContact').value = new_contact_id
    new_contact_elem.className = 'grid grid-cols-2 py-1 items-center border-b hover:bg-gray-200 hover:text-gray-900 rounded-lg'
    new_contact_elem.innerHTML = `<button id="contactEdit` + new_contact_id + `" onclick='showContactInfo(` + new_contact_id + `)' ` +
        `class="truncate max-w-32 text-sm text-left justify-self-start ml-2 text-gray-600 font-semibold border-gray-300 rounded"></button>` +
        `<button type="button" class="justify-self-end text-end" onclick='deleteContactWeb(` + new_contact_id + `)'>` +
        `<svg class="w-4 h-4  mr-2 text-red-500 hover:text-red-800" aria-hidden="true"` +
        `xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"` +
        `viewBox="0 0 22 22">` +
        `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"` +
        `stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>` +
        `</svg>` +
        `</button>`
    contacts_ul.append(new_contact_elem)
}


function saveNewProvider() {
    var contacts = []
    var my_items = document.getElementById('providerContactsList').getElementsByTagName('li')
    if (my_items.length > 0) {
        for (var i = 0; i < my_items.length; i++) {
            var tmp = {
                'name': my_items[i].getAttribute('name'),
                'number': my_items[i].getAttribute('phone'),
                'post': my_items[i].getAttribute('post'),
                'email': my_items[i].getAttribute('email')
            }
            contacts[i] = tmp
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
            // document.getElementById('providerContactsList').innerHTML = ''
            // $('#contactName').val('')
            // $('#contactPost').val('')
            // $('#contactPhone').val('')
            // $('#contactEmail').val('')
            getProdivers()
            console.log(response);
        },
        error: function (error) {
            location.reload();
            console.log(error);
        }
    });
}


function updateCurrentProvider() {
    var cur_provider = document.getElementById('currentProvider').value
    var my_li = document.getElementById('providerLI' + cur_provider)
    my_li.innerHTML = `<button id="productEdit` + cur_provider + `" onclick='showProdviderInfo(` + cur_provider + `, "` + $('#companyName').val() + `", "` + $('#companyAddress').val() + `")' ` +
        `class="text-sm max-w-32 col-span-2 truncate text-left justify-self-start ml-2 text-gray-600 font-semibold border-gray-300 rounded">` + $('#companyName').val() + `</button>` +
        `<button type="button" class=" justify-self-end justify-end text-end" onclick="deleteProvider('` + cur_provider + `')">` +
        `<svg class="w-4 h-4  mr-2 text-red-500 hover:text-red-800" aria-hidden="true"` +
        `xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"` +
        `viewBox="0 0 22 22">` +
        `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"` +
        `stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />` +
        `</svg>` +
        `</button>`
}


function showProdviderInfo(id, name, addr) {
    $('#companyName').val(name)
    $('#companyAddress').val(addr)
    document.getElementById('currentProvider').value = id
    fetch(`/contacts/${ id }`)
        .then(response => response.json())
        .then(data => {
            contacts = data
            console.log(contacts)
            var contacts_ul = document.getElementById('providerContactsList')
            contacts_ul.innerHTML = ""
            for (var i = 0; i < contacts.length; i++) {
                var elem = document.createElement('li')
                elem.id = 'contactLI' + contacts[i][0]
                elem.setAttribute('name', contacts[i][1])
                elem.setAttribute('post', contacts[i][3])
                elem.setAttribute('phone', contacts[i][2])
                elem.setAttribute('email', contacts[i][4])
                elem.className = 'grid grid-cols-2 py-1 items-center border-b hover:bg-gray-200 hover:text-gray-900 rounded-lg'
                elem.innerHTML = `<button id="contactEdit` + contacts[i][0] + `" onclick='showContactInfo(` + contacts[i][0] + `)' ` +
                    `class="truncate max-w-32 text-sm text-left justify-self-start ml-2 text-gray-600 font-semibold border-gray-300 rounded">` + contacts[i][1] + `</button>` +
                    `<button type="button" class="justify-self-end text-end" onclick='deleteContact(` + id + `, ` + contacts[i][0] + `, "` + $('#companyName').val() + `", "` + $('#companyAddress').val() + `")'>` +
                    `<svg class="w-4 h-4  mr-2 text-red-500 hover:text-red-800" aria-hidden="true"` +
                    `xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"` +
                    `viewBox="0 0 22 22">` +
                    `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"` +
                    `stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>` +
                    `</svg>` +
                    `</button>`
                contacts_ul.append(elem)
            }
            $('#contactName').val('')
            $('#contactPost').val('')
            $('#contactPhone').val('')
            $('#contactEmail').val('')
        })
        .then(function () {
            if (document.getElementById('providerContactsList').getElementsByTagName('li').length != 0) {
                document.getElementById('providerContactsList').getElementsByTagName('li')[0].getElementsByTagName('button')[0].click()
            }
            document.getElementById('providerEditSave').setAttribute('onclick', 'changeProvider()')
        });
}


function showContactInfo(id) {
    document.getElementById('currentContact').value = id
    $('#contactName').val(document.getElementById('contactLI' + id).getAttribute('name'))
    $('#contactPost').val(document.getElementById('contactLI' + id).getAttribute('post'))
    $('#contactPhone').val(document.getElementById('contactLI' + id).getAttribute('phone'))
    $('#contactEmail').val(document.getElementById('contactLI' + id).getAttribute('email'))
}


function getProdivers() {
    $.ajax({
        type: 'GET',
        url: '/getProdivers',
        success: function (response) {
            providers = response['data']
            document.getElementById('providerEditSave').setAttribute('onclick', 'changeProvider()')
            createProviderOptionList(providers, 'productProvider')
            createProviderOptionList(providers, 'newProductProvider')
            createProviderModal(providers)
        },
        error: function (error) {
            location.reload();
            console.log(error);
        }
    });
}


function validateContractInput() {
    var flag = false
    var modal = document.getElementById('contract-modal')
    var inputs = modal.getElementsByTagName('input')
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type == 'text' || inputs[i].type == 'number' || inputs[i].type == 'date') {
            if (inputs[i].value == '') {
                inputs[i].classList.replace('border-gray-300', 'border-red-600')
                if (inputs[i].parentElement.lastChild.nodeName != 'P') {
                    var error = document.createElement('p')
                    error.innerHTML = `<p id="outlined_error_help_` + i + `" class="mt-2 text-sm text-red-600"><span class="font-medium">Ошибка!</span> Поле не заполнено.</p> `
                    inputs[i].parentElement.appendChild(error)
                }
                flag = true
            } else {
                // inputs[i].classList.replace('border-gray-300', 'border-green-600')
                inputs[i].classList.replace('border-red-600', 'border-gray-300')
                if (inputs[i].parentElement.lastChild.nodeName == 'P') {
                    inputs[i].parentElement.lastChild.remove()
                }
            }
        }
    }
    return flag
}


function saveContract() {
    var products = document.getElementById('productsSelector').getElementsByTagName('input')
    var pr = []
    var j = 0
    var product_flag = true
    for (var i = 0; i < products.length; i++) {
        if (products[i].checked) {
            pr[j] = products[i].id
            j += 1
            product_flag = false
        }
    }
    var types = document.getElementById('contractType').getElementsByTagName('input')
    var type = 0
    var type_flag = true
    for (var i = 0; i < types.length; i++) {
        if (types[i].checked) {
            type = types[i].id
            type_flag = false
        }
    }
    var date_flag = false
    if ($('#contractStartDate').val() != '' && $('#contractEndDate').val() != '') {
        if (new Date($('#contractStartDate').val()) > new Date($('#contractEndDate').val())) {
            date_flag = true
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
    console.log(formData)
    if (validateContractInput(type, pr) || product_flag || type_flag || date_flag) {
        if (type_flag) {
            types[0].classList.replace('border-gray-300', 'border-red-600')
            types[1].classList.replace('border-gray-300', 'border-red-600')
            if (types[0].parentElement.lastChild.nodeName != 'P') {
                var error = document.createElement('p')
                error.innerHTML = `<p id="outlined_error_help" class="mt-2 text-sm text-red-600"><span class="font-medium">Ошибка!</span> Не выбран тип контракта.</p> `
                types[0].parentElement.appendChild(error)
            }
        } else if (types[0].parentElement.lastChild.nodeName == 'P') {
            types[0].classList.replace('border-red-600', 'border-gray-300')
            types[1].classList.replace('border-red-600', 'border-gray-300')
            types[0].parentElement.lastChild.remove()
        }
        var p = document.getElementById('prodValid')
        if (product_flag) {
            if (p.lastChild.nodeName != 'P') {
                var error = document.createElement('p')
                error.innerHTML = `<p id="outlined_error_help" class="mt-2 text-sm text-red-600"><span class="font-medium">Ошибка!</span> Не выбрано изделие.</p> `
                p.appendChild(error)
            }
        } else if (p.lastChild.nodeName == 'P') {
            p.lastChild.remove()
        }
        var dt = document.getElementById('contractStartDate')
        if (date_flag) {
            dt.classList.replace('border-gray-300', 'border-red-600')
            if (dt.parentElement.lastChild.nodeName != 'P') {
                var error = document.createElement('p')
                error.innerHTML = `<p id="outlined_error_help" class="mt-2 text-sm text-red-600"><span class="font-medium">Ошибка!</span> Дата введена некорректно.</p> `
                dt.parentElement.appendChild(error)
            }
        }
        else if (dt.parentElement.lastChild.nodeName == 'P' && $('#contractStartDate').val() != '') {
            dt.classList.replace('border-red-600', 'border-gray-300')
            dt.parentElement.lastChild.remove()
        }

    }
    else {
        document.getElementById('closeContractModal').click()
        $.ajax({
            type: 'POST',
            url: '/saveContract',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(formData),
            // headers: {
            //     'X-CSRFToken': getCookie('csrftoken') // Установка CSRF-токена в заголовок
            // },
            success: function (response) {
                getContractInfo(response['contractId'], response['data'][0], response['data'][1], response['data'][2],
                    response['data'][3], response['data'][4], response['data'][5], response['data'][6], true)
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

}


var counter = 0;
function addContactBlock() {
    counter += 1
    var itemBlock = document.getElementById('companyContacts')
    var contactBlock = document.createElement('div')
    contactBlock.className = 'w-full max-w-xl p-2 bg-white border border-black rounded-lg shadow m-auto sm:p-4'
    contactBlock.setAttribute('id', 'contactBlock' + counter)
    contactBlock.innerHTML =
        `<div class="flex items-start justify-between">` +
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
        `class="bg-gray-50 text-lg border border-gray-300 text-black rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5">` +
        `</div>` +
        `</div>` +

        `<div class="grid grid-cols-2 gap-4 my-3">` +
        `<div class="grid grid-rows-1 py-2 text-center">` +
        `<h2 class="text-left font-medium text-black">Должность: </h2>` +
        `</div>` +
        `<div class="grid grid-rows-1">` +
        `<input type="text" id="contactPost` + counter + `"` +
        `class="bg-gray-50 text-lg border border-gray-300 text-black rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5">` +
        `</div>` +
        `</div>` +

        `<div class="grid grid-cols-2 gap-4">` +
        `<div class="grid grid-rows-1 py-2 text-center">` +
        `<h2 class="text-left font-medium text-black">Телефон: </h2>` +
        `</div>` +
        `<div class="grid grid-rows-1">` +
        `<input type="text" id="contactNumber` + counter + `"` +
        `class="bg-gray-50 text-lg border border-gray-300 text-black rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5" maxlength="16" placeholder="+7(999)999-99-99" required>` +
        `</div>` +
        `</div>` +

        `<div class="grid grid-cols-2 gap-4 my-3">` +
        `<div class="grid grid-rows-1 py-2 text-center">` +
        `<h2 class="text-left font-medium text-black">Почта: </h2>` +
        `</div>` +
        `<div class="grid grid-rows-1">` +
        `<input type="text" id="contactEmail` + counter + `"` +
        `class="bg-gray-50 text-lg border border-gray-300 text-black rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5">` +
        `</div>` +
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
            // getProductList(false)
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

function getPermission() {
    var roles = document.getElementById('userRoles').getElementsByTagName('span')
    var flag = false
    for (var i = 0; i < roles.length; i++) {
        if (roles[i].innerText == 'Администратор') {
            flag = true
        }
    }
    if (!flag) {
        document.getElementById('addContractButton').setAttribute('disabled', '')
        var lst = document.getElementById('contractList').getElementsByTagName('button')
        for (var i = 0; i < lst.length; i++) {
            if (lst[i].id == 'deleteContractButton') {
                lst[i].setAttribute('disabled', '')
            }
        }
        document.getElementById('cStatus').setAttribute('disabled', '')

    }
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
            `class="font-semibold">Нажмите чтобы загрузить файл.</span></p>`
    }
}


function getProductParents() {
    var contractInfo = JSON.parse(localStorage.getItem("currentContract"))
    $.ajax({
        url: '/getProductParents',
        type: 'GET',
        contentType: false,
        data: { 'productCode': document.getElementById('productCode').innerText.slice(13), 'contractId': contractInfo['id'] },
        success: function (response) {
            const selector = document.getElementById('parentsSelector')
            selector.classList.remove('h-20')
            selector.classList.add('min-h-fit')
            selector.classList.add('max-h-52')
            selector.innerHTML = ''
            if (response['parents'].length != 0) {
                response['parents'].forEach((item) => {
                    const opt = document.createElement('li')
                    opt.innerHTML = `<div class="flex-col py-1 items-center" >` +
                        `<span class=" text-sm texl-left font-medium text-black ">` + item[0] + `</span>` +
                        `<span class="ms-2 text-sm texl-left font-bold text-black">` + item[1] + `</span>` +
                        `<hr class="mx-auto h-px bg-black"></div>`
                    selector.append(opt)
                });
            } else {
                const opt = document.createElement('li')
                selector.classList.remove('min-h-fit')
                selector.classList.remove('max-h-52')
                selector.classList.add('h-20')
                opt.innerHTML = `<div class="flex items-center border-b" >` +
                    `<span` +
                    `class="ms-2 text-sm texl-left font-medium text-black ">Никуда не входит...</span></div>`
                selector.append(opt)
            }
            console.log(response);
        },
        error: function (error) {
            location.reload();
            console.log(error);
        }
    });
}

var s = 0
function changeArrow(id) {
    var my_elem = document.getElementById('element' + id)
    if (my_elem.className.indexOf('text-lg') != -1) {
        var d = my_elem.childNodes
        s = d[0].getAttribute('d-num')
        if (s == 0) {
            d[0].innerHTML = `<svg class="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">` +
                `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m19 9-7 7-7-7"/></svg>`
            s = 1
        } else {
            d[0].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4">` +
                `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>`
            s = 0
        }
        d[0].setAttribute('d-num', s)
    }
}

var previousElem
var curProdStyle = document.getElementById('currentProduct').className
function showProduct(id, dbID, name, code, number, type, count, state, isContract, provider, start, end, note_list, files) {
    var contractInfo = JSON.parse(localStorage.getItem("currentContract"))
    var fflag = false
    if (localStorage.getItem("elemsInfo")) {
        var elemsInfo = JSON.parse(localStorage.getItem("elemsInfo"))
        for (var i = 0; i < elemsInfo.length; i++) {
            if (elemsInfo[i]['id'] == 'element' + id) {
                elemsInfo[i]['clicked'] = !elemsInfo[i]['clicked']
                fflag = true
            }
        }
        if (!fflag) {
            elemsInfo.push({ 'id': 'element' + id, 'clicked': true })
        }
        localStorage.setItem("elemsInfo", JSON.stringify(elemsInfo))
    } else {
        var elemsInfo = []
        elemsInfo.push({ 'id': 'element' + id, 'clicked': true })
        localStorage.setItem("elemsInfo", JSON.stringify(elemsInfo))
    }

    $.ajax({
        type: 'GET',
        url: '/checkProduct',
        contentType: false,
        data: { 'contractId': contractInfo['id'], 'productId': id, 'productCode': code },
        success: function (response) {
            if (response['status'] == 'fail') {
                // document.getElementById('addInDB').setAttribute('disabled')
                document.getElementById('addButton').setAttribute('disabled', '')
                document.getElementById('changeInDB').setAttribute('disabled', '')
                document.getElementById('deleteButton').setAttribute('disabled', '')
                document.getElementById('chButton').setAttribute('disabled', '')
                document.getElementById('productNote').setAttribute('disabled', '')
                document.getElementById('dropdownProductsParents').setAttribute('disabled', '')
                var all_inps = document.getElementById('product-change-modal').getElementsByTagName('input')
                var all_select = document.getElementById('product-change-modal').getElementsByTagName('select')
                for (var i = 0; i < all_inps.length; i++) {
                    all_inps[i].setAttribute('disabled', '')
                }
                for (var i = 0; i < all_select.length; i++) {
                    all_select[i].setAttribute('disabled', '')
                }
            }
            else {
                document.getElementById('dropdownProductsParents').removeAttribute('disabled')
                document.getElementById('addButton').removeAttribute('disabled')
                document.getElementById('changeInDB').removeAttribute('disabled')
                document.getElementById('deleteButton').removeAttribute('disabled')
                document.getElementById('chButton').removeAttribute('disabled')
                document.getElementById('productNote').removeAttribute('disabled')
                var all_inps = document.getElementById('product-change-modal').getElementsByTagName('input')
                var all_select = document.getElementById('product-change-modal').getElementsByTagName('select')
                for (var i = 0; i < all_inps.length; i++) {
                    all_inps[i].removeAttribute('disabled')
                }
                for (var i = 0; i < all_select.length; i++) {
                    all_select[i].removeAttribute('disabled')
                }
            }
            console.log(response);
        },
        error: function (error) {
            location.reload();
            console.log(error);
        }
    });
    $("#dbID").val("dbID" + dbID)
    cleanInputWindow('product-add-modal')
    my_files = []
    updateDragAndDrop("productFilesList", true)
    updateDragAndDrop("newProductFilesList", true)
    document.getElementById('hideen4').style.display = 'none'
    // document.getElementById('addInDB').removeAttribute('disabled')
    if (document.getElementById('changeInDB').checked == true) {
        document.getElementById('currentProduct').className = 'w-full max-w-2xl border border-red-800 rounded-lg shadow-xl shadow-red-400 sm:p-6 md:p-8'
    } else {
        document.getElementById('currentProduct').className = 'w-full max-w-2xl border duration-500 border-teal-800 shadow-xl hover:shadow-teal-800 rounded-lg shadow-teal-600 sm:p-6 md:p-8'
    }
    // document.getElementById('currentProduct').className = 'w-full max-w-2xl border duration-500 border-teal-800 shadow-xl hover:shadow-teal-800 rounded-lg shadow-teal-600 sm:p-6 md:p-8'
    var currentElem = document.getElementById('element' + id)
    changeArrow(id)

    if (currentElem != previousElem && previousElem) {
        if (previousElem.className.indexOf('text-lg') != -1) {
            previousElem.className = "flex col-span-3 font-serif p-0.5 text-lg text-black italic items-center hover:bg-teal-400 duration-300 rounded-lg"
            var mxm = document.getElementById(previousElem.getAttribute('aria-controls'))
            mxm.classList.remove('rounded-lg')
            mxm.classList.remove('bg-teal-100')
        } else {
            previousElem.className = "flex col-span-3 font-serif p-0.5 text-sm text-black items-center hover:bg-teal-300 duration-200 rounded-lg ml-2"
        }
        if (currentElem.className.indexOf('text-lg') != -1) {
            currentElem.className = "flex col-span-3 font-serif p-0.5 text-lg text-black italic items-center bg-teal-400 rounded-lg"
            var mxm = document.getElementById(currentElem.getAttribute('aria-controls'))
            mxm.classList.add('rounded-lg')
            mxm.classList.add('bg-teal-100')
        } else {
            currentElem.className = "flex col-span-3 font-serif p-0.5 text-sm text-black items-center bg-teal-300 rounded-lg ml-2"
        }
    } else {
        if (currentElem.className.indexOf('text-lg') != -1) {
            currentElem.className = "flex col-span-3 font-serif p-0.5 text-lg text-black italic items-center bg-teal-400 rounded-lg"
            var mxm = document.getElementById(currentElem.getAttribute('aria-controls'))
            mxm.classList.add('rounded-lg')
            mxm.classList.add('bg-teal-100')
        } else {
            currentElem.className = "flex col-span-3 font-serif p-0.5 text-sm text-black items-center bg-teal-300 rounded-lg ml-2"
        }
    }
    previousElem = currentElem
    document.getElementById('addInDB').checked = false
    document.getElementById('addDiv1').innerHTML = inner_div1
    document.getElementById('addDiv2').innerHTML = inner_div2
    document.getElementById('addDiv2').className = div2_class
    // console.log(document.getElementById('changeInDB').checked)
    $("#productNameforDB").val(name)
    $("#productCodeforDB").val(code)
    $("#currentProduct").val("currentProduct" + id)
    $("#productName").text("Изделие: " + name)
    $('#mainProduct').text($('#productName').text().slice(9))
    $("#mainProduct").val("mainProduct" + id)
    if (code != 'null') {
        document.getElementById('productCode').style.display = 'block'
        $("#productCode").text("Обозначение: " + code)
    } else {
        document.getElementById('productCode').style.display = 'none'
    }
    $("#productNumber").val(number)
    $("#productType").val(type)
    $("#productCount").val(count)
    $("#productState").val(state)
    if (note_list != 'null') {
        $("#productNote").val(note_list)

    } else {
        $("#productNote").val('')
    }
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
    $('#productToDelete').text('Вы действительно хотите удалить изделие - ' + $('#productName').text().slice(9))
    createFileList(id, files, 'fileList')
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
    // console.log($("#newProductStartDate").val() == '')
    var name_flag = false
    var date_flag1 = false
    var date_flag2 = false
    var date_flag3 = false
    var provider_flag = false
    var checkName = document.getElementById('newProductName')
    if (checkName.value == '') {
        name_flag = true
    }
    if (document.getElementById('newProductisLocalContract').checked) {
        data['isContract'] = 1
        data['idProvider'] = $("#newProductProvider").val()
        data['start'] = $("#newProductStartDate").val()
        data['end'] = $("#newProductEndDate").val()
        if ($("#newProductStartDate").val() != '' && $("#newProductEndDate").val() != '' && new Date($("#newProductStartDate").val()) > new Date($("#newProductEndDate").val())) {
            date_flag1 = true
        }
        if ($("#newProductProvider").val() == null) {
            provider_flag = true
        }
        if ($("#newProductStartDate").val() == '') {
            date_flag2 = true
        }
        if ($("#newProductEndDate").val() == '') {
            date_flag3 = true
        }
    }
    if (document.getElementById('addInDB').checked) {
        data['mainProductId'] = document.getElementById('productInput').getAttribute('m-prod-id')
        if (document.getElementById('newProductIsMain').checked) {
            data['isMain'] = 1

        }
        formData.append('to_db', 1)
    } else {
        if (document.getElementById('addProductChildren').checked) {
            formData.append('add_children_type', document.getElementById('productInput').getAttribute('data-type'))
            formData.append('add_children', document.getElementById('productInput').getAttribute('ch-prod-id'))
        } else {
            formData.append('add_children', -1)
            formData.append('add_children_type', -1)
        }
        data['mainProductId'] = $("#mainProduct").val().slice(11)
        formData.append('to_db', 0)
    }
    formData.append('data', JSON.stringify(data))
    for (var i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }
    if (static_files) {
        formData.append('static_files', JSON.stringify(static_files))
    }
    if (name_flag || date_flag1 || date_flag2 || date_flag3 || provider_flag) {
        var checkName = document.getElementById('newProductName')
        if (name_flag) {
            checkName.classList.replace('border-gray-300', 'border-red-600')
            if (checkName.parentElement.lastChild.nodeName != 'P') {
                var error = document.createElement('p')
                error.innerHTML = `<p id="outlined_error_help" class="mt-2 text-sm text-red-600"><span class="font-medium">Ошибка!</span> Поле не заполнено.</p> `
                checkName.parentElement.appendChild(error)
            }
        } else if (checkName.parentElement.lastChild.nodeName == 'P') {
            checkName.classList.replace('border-red-600', 'border-gray-300')
            checkName.parentElement.lastChild.remove()
        }
        var dt1 = document.getElementById('newProductStartDate')
        if (date_flag1) {
            console.log('ddddddddd')
            dt1.classList.replace('border-gray-300', 'border-red-600')
            if (dt1.parentElement.lastChild.nodeName != 'P') {
                var error = document.createElement('p')
                error.innerHTML = `<p id="outlined_error_help_111" class="mt-2 text-sm text-red-600"><span class="font-medium">Ошибка!</span> Дата введена некорректно.</p> `
                dt1.parentElement.appendChild(error)
            }
        } else if (dt1.parentElement.lastChild.nodeName == 'P') {
            dt1.classList.replace('border-red-600', 'border-gray-300')
            dt1.parentElement.lastChild.remove()
        }
        var dt2 = document.getElementById('newProductEndDate')
        if (date_flag2 && !date_flag1) {
            dt1.classList.replace('border-gray-300', 'border-red-600')
            if (dt1.parentElement.lastChild.nodeName != 'P') {
                var error = document.createElement('p')
                error.innerHTML = `<p id="outlined_error_help_2" class="mt-2 text-sm text-red-600"><span class="font-medium">Ошибка!</span> Поле не заполнено.</p> `
                dt1.parentElement.appendChild(error)
            }

        } else if (dt1.parentElement.lastChild.nodeName == 'P' && !date_flag1) {
            dt1.classList.replace('border-red-600', 'border-gray-300')
            dt1.parentElement.lastChild.remove()
        }
        if (date_flag3) {
            dt2.classList.replace('border-gray-300', 'border-red-600')
            if (dt2.parentElement.lastChild.nodeName != 'P') {
                var error = document.createElement('p')
                error.innerHTML = `<p id="outlined_error_help_3" class="mt-2 text-sm text-red-600"><span class="font-medium">Ошибка!</span> Поле не заполнено.</p> `
                dt2.parentElement.appendChild(error)
            }

        } else if (dt2.parentElement.lastChild.nodeName == 'P') {
            dt2.classList.replace('border-red-600', 'border-gray-300')
            dt2.parentElement.lastChild.remove()
        }
        var checkProvider = document.getElementById('newProductProvider')
        if (provider_flag) {
            if (checkProvider.parentElement.lastChild.nodeName != 'P') {
                var error = document.createElement('p')
                error.innerHTML = `<p id="outlined_error_help" class="mt-2 text-sm text-red-600"><span class="font-medium">Ошибка!</span> Не выбран поставщик.</p> `
                checkProvider.parentElement.appendChild(error)
            }
        } else if (checkProvider.parentElement.lastChild.nodeName == 'P') {
            checkProvider.parentElement.lastChild.remove()
        }
    } else {
        document.getElementById('closeProductModal').click()
        $.ajax({
            type: 'POST',
            url: '/addNewProduct',
            processData: false,
            contentType: false,
            data: formData,
            success: function (response) {
                startCreation(contractInfo['id'])
                cleanInputWindow('product-add-modal')
                // addProductSelect()
                console.log(response);
            },
            error: function (error) {
                location.reload();
                console.log(error);
            }
        });
    }
}


function createFileList(id, files, fileList) {
    var contractInfo = JSON.parse(localStorage.getItem("currentContract"))
    var fileListDiv = document.getElementById(fileList)

    if (files && files.length != 0) {
        var ul = document.createElement('ul')
        ul.className = 'inline-grid  mt-2 space-y-1 list-none list-inside text-sm'
        fileListDiv.innerHTML = ''
        for (var i = 0; i < files.length; i++) {
            var a = document.createElement('li')
            a.className = 'inline-flex items-center'
            var tmp = files[i].file.split('\\')
            var popover = 'popover-' + tmp[tmp.length - 1]
            if (files[i].type == 'json') {
                a.innerHTML = `<a class="text-gray-500 hover:text-gray-800 " role="button" ` +
                    `onclick='downloadFile(` + JSON.stringify(files[i].file) + `, "` + tmp[tmp.length - 1] + `")'> ` + tmp[tmp.length - 1] + ` ` +
                    `</a>` +
                    `<button file-type="` + files[i].type + `" onclick='deleteFile(` + JSON.stringify(files[i].file) + `, ` + id + `, "` + contractInfo['id'] + `", "` + files[i].type + `")'>` +
                    `<svg class="w-4 h-4 ml-1 text-red-500 hover:text-red-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">` +
                    `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>` +
                    `</svg>` +
                    `</button>`
            } else {
                if (document.getElementById('changeInDB').checked == true) {
                    a.innerHTML = `<a class="text-gray-500 hover:text-gray-800 " role="button" ` +
                        `onclick='downloadFile(` + JSON.stringify(files[i].file) + `, "` + tmp[tmp.length - 1] + `")'> ` + tmp[tmp.length - 1] + ` ` +
                        `</a>` +
                        `<button style="display: block" file-type="` + files[i].type + `" onclick='deleteFile(` + JSON.stringify(files[i].file) + `, ` + id + `, "` + contractInfo['id'] + `", "` + files[i].type + `")'>` +
                        `<svg class="w-4 h-4 ml-1 text-red-500 hover:text-red-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">` +
                        `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>` +
                        `</svg>` +
                        `</button>`
                } else {
                    a.innerHTML = `<a class="text-gray-500 hover:text-gray-800 " role="button" ` +
                        `onclick='downloadFile(` + JSON.stringify(files[i].file) + `, "` + tmp[tmp.length - 1] + `")'> ` + tmp[tmp.length - 1] + ` ` +
                        `</a>` +
                        `<button style="display: none" file-type="` + files[i].type + `" onclick='deleteFile(` + JSON.stringify(files[i].file) + `, ` + id + `, "` + contractInfo['id'] + `", "` + files[i].type + `")'>` +
                        `<svg class="w-4 h-4 ml-1 text-red-500 hover:text-red-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">` +
                        `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>` +
                        `</svg>` +
                        `</button>`
                }

            }

            ul.appendChild(a)
        }
        fileListDiv.appendChild(ul)
    } else {
        fileListDiv.innerHTML = 'Файлы не найдены'
    }
}


function deleteFile(filePath, product_id, contract_id, fileType) {
    $.ajax({
        url: '/deleteFile',
        type: 'GET',
        contentType: false,
        data: { 'filePath': filePath, 'productId': product_id, 'contractId': contract_id, 'fileType': fileType, 'productDBId': document.getElementById('dbID').value.slice(4) },
        success: function (response) {
            console.log(response)
            createFileList(product_id, response['files'], 'fileList')
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

function openTreeElems(condition) {
    if (localStorage.getItem("elemsInfo")) {
        var elemsInfo = JSON.parse(localStorage.getItem("elemsInfo"))
        for (var i = 0; i < elemsInfo.length; i++) {
            if (elemsInfo[i]['clicked']) {
                document.getElementById(elemsInfo[i]['id']).click()
                if (condition) {
                    // console.log(condition)
                    elemsInfo[i]['clicked'] = true
                }
            }
        }
        localStorage.setItem("elemsInfo", JSON.stringify(elemsInfo));
    } else {
        document.getElementById('element0').click()
    }
}


function updateProduct(id, data) {
    console.log(data)
    $("#productNameforDB").val(data.name)
    $("#productCodeforDB").val(data.code)
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
    if (data.files) {
        createFileList(id, data.files, 'fileList')
    }
    var command = "showProduct(" + id + ", " + data.dbID + ", '" + data.name + "', '" + data.code + "', '" + data.number + "'" +
        ", " + data.idType + ", " + data.count + ", " + data.idState + ", " + data.isContract + "" +
        ", " + data.idProvider + ", '" + data.start + "', '" + data.end + "', " + JSON.stringify(data.note) + ", " + JSON.stringify(data.files) + ")"
    var my_elem = document.getElementById('element' + id)
    my_elem.setAttribute('onclick', command)
    // openTreeElems(false)
    updateDragAndDrop("productFilesList", true)
    my_files = []
}


function changeProduct() {
    var contractInfo = JSON.parse(localStorage.getItem("currentContract"))
    var files = my_files
    // console.log(files)
    var formData = new FormData()
    var data = {
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
        'note': $("#productNote").val(),
        'toDB': document.getElementById('changeInDB').checked
    }
    var provider_flag = false
    var start_flag = false
    var end_flag = false
    var date_flag = false
    if (document.getElementById('isLocalContract').checked) {
        data['isContract'] = 1
        data['idProvider'] = $("#productProvider").val()
        data['start'] = $("#startDate").val()
        data['end'] = $("#endDate").val()
        if ($("#startDate").val() != '' && $("#endDate").val() != '' && new Date($("#startDate").val()) > new Date($("#endDate").val())) {
            date_flag = true
        }
        if ($("#productProvider").val() == null) {
            provider_flag = true
        }
        if ($("#startDate").val() == '') {
            start_flag = true
        }
        if ($("#endDate").val() == '') {
            end_flag = true
        }
    }
    formData.append('data', JSON.stringify(data))
    if (document.getElementById('changeInDB').checked == true) {
        var dataToDB = {
            'dbID': $("#dbID").val().slice(4),
            'name': $("#productNameforDB").val(),
            'code': $("#productCodeforDB").val()
        }
        formData.append('dataToDB', JSON.stringify(dataToDB))
    }
    for (var i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }
    if ((provider_flag || date_flag || start_flag || end_flag) && $("#productState").val() == 4) {
        var my_provider = document.getElementById('productProvider')
        if (provider_flag) {
            if (my_provider.parentElement.lastChild.nodeName != 'P') {
                var error = document.createElement('p')
                error.innerHTML = `<p id="outlined_error_help" class="mt-2 text-sm text-red-600"><span class="font-medium">Ошибка!</span> Не выбран поставщик.</p> `
                my_provider.parentElement.appendChild(error)
            }
        } else if (my_provider.parentElement.lastChild.nodeName == 'P') {
            my_provider.parentElement.lastChild.remove()
        }
        var dt1 = document.getElementById('startDate')
        if (date_flag) {
            dt1.classList.replace('border-gray-300', 'border-red-600')
            if (dt1.parentElement.lastChild.nodeName != 'P') {
                var error = document.createElement('p')
                error.innerHTML = `<p id="outlined_error_help_111" class="mt-2 text-sm text-red-600"><span class="font-medium">Ошибка!</span> Дата введена некорректно.</p> `
                dt1.parentElement.appendChild(error)
            }
        } else if (dt1.parentElement.lastChild.nodeName == 'P') {
            dt1.classList.replace('border-red-600', 'border-gray-300')
            dt1.parentElement.lastChild.remove()
        }
        var dt2 = document.getElementById('endDate')
        if (start_flag && !date_flag) {
            dt1.classList.replace('border-gray-300', 'border-red-600')
            if (dt1.parentElement.lastChild.nodeName != 'P') {
                var error = document.createElement('p')
                error.innerHTML = `<p id="outlined_error_help_2" class="mt-2 text-sm text-red-600"><span class="font-medium">Ошибка!</span> Поле не заполнено.</p> `
                dt1.parentElement.appendChild(error)
            }

        } else if (dt1.parentElement.lastChild.nodeName == 'P' && !date_flag) {
            dt1.classList.replace('border-red-600', 'border-gray-300')
            dt1.parentElement.lastChild.remove()
        }
        if (end_flag) {
            dt2.classList.replace('border-gray-300', 'border-red-600')
            if (dt2.parentElement.lastChild.nodeName != 'P') {
                var error = document.createElement('p')
                error.innerHTML = `<p id="outlined_error_help_3" class="mt-2 text-sm text-red-600"><span class="font-medium">Ошибка!</span> Поле не заполнено.</p> `
                dt2.parentElement.appendChild(error)
            }

        } else if (dt2.parentElement.lastChild.nodeName == 'P') {
            dt2.classList.replace('border-red-600', 'border-gray-300')
            dt2.parentElement.lastChild.remove()
        }
    } else {
        if (document.getElementById('productProvider').parentElement.lastChild.nodeName == 'P') {
            document.getElementById('productProvider').parentElement.lastChild.remove()
        }
        if (document.getElementById('startDate').parentElement.lastChild.nodeName == 'P') {
            document.getElementById('startDate').classList.replace('border-red-600', 'border-gray-300')
            document.getElementById('startDate').parentElement.lastChild.remove()
        }
        if (document.getElementById('endDate').parentElement.lastChild.nodeName == 'P') {
            document.getElementById('endDate').classList.replace('border-red-600', 'border-gray-300')
            document.getElementById('endDate').parentElement.lastChild.remove()
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
                document.getElementById('element' + data['id']).setAttribute('id-state', data['idState'])
                var my_ul = document.getElementById(document.getElementById('element' + data['id']).getAttribute('aria-controls'))
                console.log(typeof (my_ul))
                updateCurrentBranch(my_ul, data['idState'])
                updateProduct(data['id'], response['product'])
                console.log(response);
            },
            error: function (error) {
                // location.reload();
                console.log(error);
            }
        });
    }

}

function changeSettings(elem) {
    var fflag = false
    if (localStorage.getItem("settings")) {
        var settings = JSON.parse(localStorage.getItem("settings"))
        for (var i = 0; i < settings.length; i++) {
            if (settings[i]['id'] == elem.id) {
                settings[i]['status'] = elem.checked
                fflag = true
            }
        }
        if (!fflag) {
            settings.push({ 'id': elem.id, 'status': elem.checked })
        }
        localStorage.setItem("settings", JSON.stringify(settings))
    } else {
        var settings = []
        settings.push({ 'id': elem.id, 'status': elem.checked })
        localStorage.setItem("settings", JSON.stringify(settings))
    }
    makeColorByType()
}

function updateCurrentBranch(my_ul, newType) {
    console.log(my_ul)
    // document.getElementsB
    var elems = my_ul.getElementsByTagName('a')
    // console.log(elems)
    for (var i = 0; i < elems.length; i++) {
        if (elems[i].name == 'elementOfTree') {
            elems[i].setAttribute('id-state', newType)
        }
    }
    makeColorByType()
}


function addProductSelect() {
    if (document.getElementById('dropdownProducts')) {
        // document.getElementById('dropdownProducts').innerHTML = 'dropdownProductsFilled'
        fetch('/getSelector')
            .then(response => response.json())
            .then(data => {
                const selector = document.getElementById('productsSelector')
                selector.innerHTML = ''
                data.forEach((item) => {
                    // console.log(item)
                    const opt = document.createElement('li')
                    opt.innerHTML = `<div class="flex py-1 items-center border-b" >` +
                        `<input id="` + item.id + `" type="checkbox" value=""` +
                        `class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2">` +
                        `<label for="` + item.id + `"` +
                        `class="ms-2 text-sm texl-left font-medium text-black ">` + item.name + `</label></div>`
                    selector.append(opt)
                });
            });
    }
};

function changeGroupArrow(name, id) {
    var my_elem = document.getElementById(String(name) + String(id))
    var d = my_elem.childNodes
    s = d[0].getAttribute('d-num')
    if (s == 0) {
        d[0].innerHTML = `<svg class="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">` +
            `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m19 9-7 7-7-7"/></svg>`
        s = 1
    } else {
        d[0].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4">` +
            `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>`
        s = 0
    }
    d[0].setAttribute('d-num', s)
}

function createTree(element, data, idd, i) {
    const treeElement = document.createElement('ul');
    treeElement.className = 'ps-2 min-w-fit max-w-4xl mt-2 ml-4 space-y-1 list-none list-inside';
    if (idd != null && idd != 'root') {
        var tmp = idd + i - 1
        treeElement.id = 'collapse' + tmp;
        treeElement.className = '!visible hidden ' + treeElement.className
        treeElement.setAttribute('data-te-collapse-item', '')
    }
    //-------------------Документы
    const docTreeElement = document.createElement('ul');
    docTreeElement.className = 'ps-2 min-w-fit max-w-4xl mt-2 ml-4 space-y-1 list-none list-inside';

    var doc_tmp = idd + i - 1
    docTreeElement.id = 'collapseDoc' + doc_tmp;
    docTreeElement.className = '!visible hidden ' + docTreeElement.className
    docTreeElement.setAttribute('data-te-collapse-item', '')
    var docTreeLength = 0
    var doc_flag = true
    var doc_fflag = true
    //-------------------
    //-------------------Материалы
    const materialTreeElement = document.createElement('ul');
    materialTreeElement.className = 'ps-2 min-w-fit max-w-4xl mt-2 ml-4 space-y-1 list-none list-inside';
    var material_tmp = idd + i - 1
    materialTreeElement.id = 'collapseMaterial' + material_tmp;
    materialTreeElement.className = '!visible hidden ' + materialTreeElement.className
    materialTreeElement.setAttribute('data-te-collapse-item', '')
    var materialTreeLength = 0
    var material_flag = true
    var material_fflag = true
    //-------------------
    //-------------------Детали
    const detailTreeElement = document.createElement('ul');
    detailTreeElement.className = 'ps-2 min-w-fit max-w-4xl mt-2 ml-4 space-y-1 list-none list-inside';
    var detail_tmp = idd + i - 1
    detailTreeElement.id = 'collapseDetail' + detail_tmp;
    detailTreeElement.className = '!visible hidden ' + detailTreeElement.className
    detailTreeElement.setAttribute('data-te-collapse-item', '')
    var detailTreeLength = 0
    var detail_flag = true
    var detail_fflag = true
    //-------------------
    //-------------------Стандартные изделия
    const standartTreeElement = document.createElement('ul');
    standartTreeElement.className = 'ps-2 min-w-fit max-w-4xl mt-2 ml-4 space-y-1 list-none list-inside';
    var standart_tmp = idd + i - 1
    standartTreeElement.id = 'collapseStandart' + standart_tmp;
    standartTreeElement.className = '!visible hidden ' + standartTreeElement.className
    standartTreeElement.setAttribute('data-te-collapse-item', '')
    var standartTreeLength = 0
    var standart_flag = true
    var standart_fflag = true
    //-------------------
    //-------------------Прочие изделия
    const otherTreeElement = document.createElement('ul');
    otherTreeElement.className = 'ps-2 min-w-fit max-w-4xl mt-2 ml-4 space-y-1 list-none list-inside';
    var other_tmp = idd + i - 1
    otherTreeElement.id = 'collapseOther' + standart_tmp;
    otherTreeElement.className = '!visible hidden ' + otherTreeElement.className
    otherTreeElement.setAttribute('data-te-collapse-item', '')
    var otherTreeLength = 0
    var other_flag = true
    var other_fflag = true
    //-------------------
    //-------------------Комплекты
    const kitTreeElement = document.createElement('ul');
    kitTreeElement.className = 'ps-2 min-w-fit max-w-4xl mt-2 ml-4 space-y-1 list-none list-inside';
    var kit_tmp = idd + i - 1
    kitTreeElement.id = 'collapseKit' + standart_tmp;
    kitTreeElement.className = '!visible hidden ' + kitTreeElement.className
    kitTreeElement.setAttribute('data-te-collapse-item', '')
    var kitTreeLength = 0
    var kit_flag = true
    var kit_fflag = true
    //-------------------
    data.forEach((item) => {
        if (item.idType == 9) {
            const doclistItem = document.createElement('li')
            const listItem = document.createElement('li')
            if (doc_flag == true) {
                doclistItem.innerHTML = `<div id="elementDiv` + item.id + `" class="inline-flex items-center "><a id="elementDoc` + item.id + `" data-te-collapse-init href="#` + docTreeElement.id + `"` +
                    `role="button" aria-expanded="false" aria-controls="collapseDoc` + doc_tmp + `"` +
                    `class="inline-flex font-serif text-lg p-0.5 text-black italic items-center hover:bg-teal-400 duration-300 rounded-lg" onclick='changeGroupArrow("elementDoc", ` + item.id + `)'>` +
                    `<div d-num="0">` +
                    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4">` +
                    `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></div>` +
                    `Документация` + `</a></div>`
                doc_flag = false
                treeElement.append(doclistItem)
            }
            listItem.innerHTML = `<div class="grid grid-cols-4 items-center"><a dbId id="element` + item.id + `" name="elementOfTree" id-state="` + item.idState + `" role="button" aria-expanded="false"` +
                `class="flex col-span-3 font-serif p-0.5 text-sm text-black items-center hover:bg-teal-300 duration-300 rounded-lg ml-2"  oncontextmenu="customContextMenu(this)"` +
                `onclick='showProduct(` + item.id + `, ` + item.dbID + `, "` + item.name + `", "` + item.code + `", "` + item.number + `"` +
                `, ` + item.idType + `, ` + item.count + `, ` + item.idState + `, ` +
                item.isContract + `, ` + item.idProvider + `, "` + item.start + `", "` + item.end + `", ` + JSON.stringify(item.note) + `, ` + JSON.stringify(item.files) + `)'>` +
                `<span>` + item.name + `</span></a><span class="text-xs justify-items-end px-2 text-black font-bold">` + item.code + `</span></div>`
            docTreeLength += 1
            docTreeElement.append(listItem)
        }
        if (item.idType == 2) {
            const materialistItem = document.createElement('li')
            const listItem = document.createElement('li')
            if (material_flag == true) {
                materialistItem.innerHTML = `<div id="elementDiv` + item.id + `" class="inline-flex items-center "><a id="elementMaterial` + item.id + `"  data-te-collapse-init href="#` + materialTreeElement.id + `" role="button" aria-expanded="false" aria-controls="collapseMaterial` + material_tmp + `"` +
                    `class="inline-flex font-serif text-lg p-0.5 text-black italic items-center hover:bg-teal-400 duration-300 rounded-lg" onclick='changeGroupArrow("elementMaterial", ` + item.id + `)'>` +
                    `<div d-num="0">` +
                    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4">` +
                    `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></div>` +
                    `Материалы` + `</a></div>`
                material_flag = false
                treeElement.append(materialistItem)
            }
            listItem.innerHTML = `<div class="grid grid-cols-4 items-center"><a dbId id="element` + item.id + `" name="elementOfTree" id-state="` + item.idState + `" role="button" aria-expanded="false"` +
                `class="flex col-span-3 font-serif p-0.5 text-sm text-black items-center hover:bg-teal-300 duration-300 rounded-lg ml-2"  oncontextmenu="customContextMenu(this)"` +
                `onclick='showProduct(` + item.id + `, ` + item.dbID + `, "` + item.name + `", "` + item.code + `", "` + item.number + `"` +
                `, ` + item.idType + `, ` + item.count + `, ` + item.idState + `, ` +
                item.isContract + `, ` + item.idProvider + `, "` + item.start + `", "` + item.end + `", ` + JSON.stringify(item.note) + `, ` + JSON.stringify(item.files) + `)'>` +
                `<span>` + item.name + `</span></a><span class="text-xs justify-items-end px-2 text-black font-bold">` + item.code + `</span></div>`
            materialTreeLength += 1
            materialTreeElement.append(listItem)
        }
        if (item.idType == 3) {
            const detaillistItem = document.createElement('li')
            const listItem = document.createElement('li')
            if (detail_flag == true) {
                detaillistItem.innerHTML = `<div id="elementDiv` + item.id + `" class="inline-flex items-center "><a id="elementDetail` + item.id + `" data-te-collapse-init href="#` + detailTreeElement.id + `" role="button" aria-expanded="false" aria-controls="collapseDetail` + detail_tmp + `"` +
                    `class="inline-flex font-serif text-lg p-0.5 text-black italic items-center hover:bg-teal-400 duration-300 rounded-lg" onclick='changeGroupArrow("elementDetail", ` + item.id + `)'>` +
                    `<div d-num="0">` +
                    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4">` +
                    `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></div>` +
                    `Детали` + `</a></div>`
                detail_flag = false
                treeElement.append(detaillistItem)
            }
            listItem.innerHTML = `<div class="grid grid-cols-4 items-center"><a dbId id="element` + item.id + `" name="elementOfTree" id-state="` + item.idState + `" role="button" aria-expanded="false"` +
                `class="flex col-span-3 font-serif p-0.5 text-sm text-black items-center hover:bg-teal-300 duration-300 rounded-lg ml-2"  oncontextmenu="customContextMenu(this)"` +
                `onclick='showProduct(` + item.id + `, ` + item.dbID + `, "` + item.name + `", "` + item.code + `", "` + item.number + `"` +
                `, ` + item.idType + `, ` + item.count + `, ` + item.idState + `, ` +
                item.isContract + `, ` + item.idProvider + `, "` + item.start + `", "` + item.end + `", ` + JSON.stringify(item.note) + `, ` + JSON.stringify(item.files) + `)'>` +
                `<span>` + item.name + `</span></a><span class="text-xs justify-items-end px-2 text-black font-bold">` + item.code + `</span></div>`
            detailTreeLength += 1
            detailTreeElement.append(listItem)
        }
        if (item.idType == 10) {
            const standartlistItem = document.createElement('li')
            const listItem = document.createElement('li')
            if (standart_flag == true) {
                standartlistItem.innerHTML = `<div id="elementDiv` + item.id + `" class="inline-flex items-center "><a id="elementStandart` + item.id + `" data-te-collapse-init href="#` + standartTreeElement.id + `" role="button" aria-expanded="false" aria-controls="collapseStandart` + standart_tmp + `"` +
                    `class="inline-flex font-serif text-lg p-0.5 text-black italic items-center hover:bg-teal-400 duration-300 rounded-lg" onclick='changeGroupArrow("elementStandart", ` + item.id + `)'>` +
                    `<div d-num="0">` +
                    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4">` +
                    `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></div>` +
                    `Стандартные изделия` + `</a></div>`
                standart_flag = false
                treeElement.append(standartlistItem)
            }
            listItem.innerHTML = `<div class="grid grid-cols-4 items-center"><a dbId id="element` + item.id + `" name="elementOfTree" id-state="` + item.idState + `" role="button" aria-expanded="false"` +
                `class="flex col-span-3 font-serif p-0.5 text-sm text-black items-center hover:bg-teal-300 duration-300 rounded-lg ml-2"  oncontextmenu="customContextMenu(this)"` +
                `onclick='showProduct(` + item.id + `, ` + item.dbID + `, "` + item.name + `", "` + item.code + `", "` + item.number + `"` +
                `, ` + item.idType + `, ` + item.count + `, ` + item.idState + `, ` +
                item.isContract + `, ` + item.idProvider + `, "` + item.start + `", "` + item.end + `", ` + JSON.stringify(item.note) + `, ` + JSON.stringify(item.files) + `)'>` +
                `<span>` + item.name + `</span></a><span class="text-xs justify-items-end px-2 text-black font-bold">` + item.code + `</span></div>`
            standartTreeLength += 1
            standartTreeElement.append(listItem)
        }
        if (item.idType == 7) {
            const otherlistItem = document.createElement('li')
            const listItem = document.createElement('li')
            if (other_flag == true) {
                otherlistItem.innerHTML = `<div id="elementDiv` + item.id + `" class="inline-flex items-center "><a id="elementOther` + item.id + `" data-te-collapse-init href="#` + otherTreeElement.id + `" role="button" aria-expanded="false" aria-controls="collapseOther` + other_tmp + `"` +
                    `class="inline-flex font-serif text-lg p-0.5 text-black italic items-center hover:bg-teal-400 duration-300 rounded-lg" onclick='changeGroupArrow("elementOther", ` + item.id + `)'>` +
                    `<div d-num="0">` +
                    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4">` +
                    `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></div>` +
                    `Прочие изделия` + `</a></div>`
                other_flag = false
                treeElement.append(otherlistItem)
            }
            listItem.innerHTML = `<div class="grid grid-cols-4 items-center"><a dbId id="element` + item.id + `" name="elementOfTree" id-state="` + item.idState + `" role="button" aria-expanded="false"` +
                `class="flex col-span-3 font-serif p-0.5 text-sm text-black items-center hover:bg-teal-300 duration-300 rounded-lg ml-2"  oncontextmenu="customContextMenu(this)"` +
                `onclick='showProduct(` + item.id + `, ` + item.dbID + `, "` + item.name + `", "` + item.code + `", "` + item.number + `"` +
                `, ` + item.idType + `, ` + item.count + `, ` + item.idState + `, ` +
                item.isContract + `, ` + item.idProvider + `, "` + item.start + `", "` + item.end + `", ` + JSON.stringify(item.note) + `, ` + JSON.stringify(item.files) + `)'>` +
                `<span>` + item.name + `</span></a><span class="text-xs justify-items-end px-2 text-black font-bold">` + item.code + `</span></div>`
            otherTreeLength += 1
            otherTreeElement.append(listItem)
        }
        if (item.idType == 5) {
            const kitlistItem = document.createElement('li')
            const listItem = document.createElement('li')
            if (kit_flag == true) {
                kitlistItem.innerHTML = `<div id="elementDiv` + item.id + `" class="inline-flex items-center "><a id="elementKit` + item.id + `" data-te-collapse-init href="#` + kitTreeElement.id + `" role="button" aria-expanded="false" aria-controls="collapseKit` + kit_tmp + `"` +
                    `class="inline-flex font-serif text-lg p-0.5 text-black italic items-center hover:bg-teal-400 duration-300 rounded-lg" onclick='changeGroupArrow("elementKit", ` + item.id + `)'>` +
                    `<div d-num="0">` +
                    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4">` +
                    `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></div>` +
                    `Комплекты` + `</a></div>`
                kit_flag = false
                treeElement.append(kitlistItem)
            }
            listItem.innerHTML = `<div class="grid grid-cols-4 items-center"><a dbId id="element` + item.id + `" name="elementOfTree" id-state="` + item.idState + `" role="button" aria-expanded="false"` +
                `class="flex col-span-3 font-serif p-0.5 text-sm text-black items-center hover:bg-teal-300 duration-300 rounded-lg ml-2"  oncontextmenu="customContextMenu(this)"` +
                `onclick='showProduct(` + item.id + `, ` + item.dbID + `, "` + item.name + `", "` + item.code + `", "` + item.number + `"` +
                `, ` + item.idType + `, ` + item.count + `, ` + item.idState + `, ` +
                item.isContract + `, ` + item.idProvider + `, "` + item.start + `", "` + item.end + `", ` + JSON.stringify(item.note) + `, ` + JSON.stringify(item.files) + `)'>` +
                `<span>` + item.name + `</span></a><span class="text-xs justify-items-end px-2 text-black font-bold">` + item.code + `</span></div>`
            kitTreeLength += 1
            kitTreeElement.append(listItem)
        }
        if (doc_fflag == true && docTreeLength != 0) {
            treeElement.append(docTreeElement)
            doc_fflag = false
            docTreeLength = 0
        }
        else if (material_fflag == true && materialTreeLength != 0) {
            treeElement.append(materialTreeElement)
            material_fflag = false
            materialTreeLength = 0
        }
        else if (detail_fflag == true && detailTreeLength != 0) {
            treeElement.append(detailTreeElement)
            detail_fflag = false
            detailTreeLength = 0
        }
        else if (standart_fflag == true && standartTreeLength != 0) {
            treeElement.append(standartTreeElement)
            standart_fflag = false
            standartTreeLength = 0
        }
        else if (other_fflag == true && otherTreeLength != 0) {
            treeElement.append(otherTreeElement)
            other_fflag = false
            otherTreeLength = 0
        }
        else if (kit_fflag == true && kitTreeLength != 0) {
            treeElement.append(kitTreeElement)
            kit_fflag = false
            kitTreeLength = 0
        }
        if (item.idType != 2 && item.idType != 3 && item.idType != 5 && item.idType != 7 && item.idType != 9 && item.idType != 10) {
            const listItem = document.createElement('li')
            if (item.children.length != 0) {
                var tmp = item.id + i
                listItem.innerHTML = `<div id="elementDiv` + item.id + `" z-20 class="grid grid-cols-4 items-center">` +
                    `<a id="element` + item.id + `" name="elementOfTree" id-state="` + item.idState + `" data-te-collapse-init href="#collapse` + tmp + `"` +
                    `role="button" aria-expanded="false" aria-controls="collapse` + tmp + `"` +
                    `class="flex col-span-3 font-serif text-lg p-0.5 text-black italic items-center hover:bg-teal-400 duration-300 rounded-lg"  oncontextmenu='customContextMenu("` + item.id + `", "` + item.name + `")'` +
                    `onclick='showProduct(` + item.id + `, ` + item.dbID + `, "` + item.name + `", "` + item.code + `", "` + item.number + `" ` +
                    `, ` + item.idType + `, ` + item.count + `, ` + item.idState + `, ` +
                    item.isContract + `, ` + item.idProvider + `, "` + item.start + `", "` + item.end + `", ` + JSON.stringify(item.note) + `, ` + JSON.stringify(item.files) + `)'>` +
                    `<div d-num="0">` +
                    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4">` +
                    `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></div>` +
                    `<span>` + item.name + `</span></a><span class="text-xs px-2 font-serif justify-items-end text-black font-bold"> ` + item.code + `</span>`  +
                    `</div>`
                i += 1
                // `<div state="0" id="custom-menu" z-100 class="text-xs" style="display: none">` +
                // `<div class="inline-grid grid-cols-1 grid-rows-3 space-y-1 items-center rounded-lg bg-gray-300 p-1 border-1 border-gray-600">` +
                // `<button type="button"` +
                // `class="text-white bg-teal-700 hover:bg-teal-800 focus:ring-2 focus:outline-none focus:ring-teal-300 font-medium rounded-lg px-5 py-2.5 text-center">` +
                // `Аналитика</button>` +
                // `<button  type="button"` +
                // `class="text-white bg-teal-700 hover:bg-teal-800 focus:ring-2 focus:outline-none focus:ring-teal-300 font-medium rounded-lg px-5 py-2.5 text-center">` +
                // `Выгрузить в exel</button>` +
                // `<button  type="button"` +
                // `class="text-white bg-teal-700 hover:bg-teal-800 focus:ring-2 focus:outline-none focus:ring-teal-300  rounded-lg px-5 py-2.5 text-center">` +
                // `Сделать харакири</button>` +
                // `</div>` +
                // `</div>` +
            } else {
                listItem.innerHTML = `<div id="elementDiv` + item.id + `"z-20 class="grid grid-cols-4 items-center">` +
                    `<a id="element` + item.id + `" name="elementOfTree" id-state="` + item.idState + `" role="button" aria-expanded="false" ` +
                    `class="flex col-span-3 font-serif p-0.5 text-sm text-black items-center hover:bg-teal-300 duration-300 rounded-lg ml-2" oncontextmenu='customContextMenu("` + item.id + `", "` + item.name + `")'` +
                    `onclick='showProduct(` + item.id + `, ` + item.dbID + `, "` + item.name + `", "` + item.code + `", "` + item.number + `" ` +
                    `, ` + item.idType + `, ` + item.count + `, ` + item.idState + `, ` +
                    item.isContract + `, ` + item.idProvider + `, "` + item.start + `", "` + item.end + `", ` + JSON.stringify(item.note) + `, ` + JSON.stringify(item.files) + `)'>` +
                    `<span>` + item.name + `</span></a>` +
                    `<span class="text-xs px-2 justify-items-end text-black font-bold">` + item.code + `</span></div>`

                i += 1
                    // `<div state="0" id="custom-menu"  z-100 class="border bg-white rounded-sm border-black text-xs" style="display: none">` +
                    // `<div class="inline-grid grid-cols-1 grid-rows-3 items-center border-t p-1 border-gray-200 rounded-b ">` +
                    // `<button type="button"` +
                    // `class="text-white bg-teal-700 hover:bg-teal-800 focus:ring-2 focus:outline-none focus:ring-teal-300  rounded-lg px-5 py-2.5 text-center ">` +
                    // `Аналитика</button>` +
                    // `<button  type="button"` +
                    // `class="text-white bg-teal-700 hover:bg-teal-800 focus:ring-2 focus:outline-none focus:ring-teal-300  rounded-lg px-5 py-2.5 text-center ">` +
                    // `Выгрузить в exel</button>` +
                    // `<button  type="button"` +
                    // `class="text-white bg-teal-700 hover:bg-teal-800 focus:ring-2 focus:outline-none focus:ring-teal-300  rounded-lg px-5 py-2.5 text-center ">` +
                    // `Сделать харакири</button>` +
                    // `</div>` +
                    // `</div>` +
            }
            if (item.children.length != 0) {
                createTree(listItem, item.children, item.id, i)
            }
            treeElement.append(listItem)
        }
    });
    element.append(treeElement)
};


document.addEventListener('contextmenu', event => event.preventDefault());
function customContextMenu(id, name) {
    var elems = document.getElementById('elementDiv' + id).getElementsByTagName('div')
    var my_menu
    for (var i = 0; i < elems.length; i++) {
        if (elems[i].id == 'custom-menu') {
            my_menu = elems[i]
        }
    }
    if (my_menu.getAttribute('state') == '0') {
        my_menu.style.display = 'block'
        my_menu.style.position = 'absolute'
        my_menu.setAttribute('state', '1')
    } else {
        my_menu.style.display = 'none'
        my_menu.style.position = 'relative'
        my_menu.setAttribute('state', '0')
    }
    // my_elem.setAttribute('data-popover-target', 'popover-product' + id)
    // my_elem.setAttribute('data-popover-trigger', 'click')
    // my_elem.setAttribute('data-popover-placement', 'bottom-end')
    // var my_menu = document.createElement('div')
    // my_menu.id = 'context-menu'
    // my_menu.innerHTML = 
    //     `<div data-popover id="popover-product`+ id +`" role="tooltip"` +
    //     `class="absolute z-10 invisible inline-block w-72  duration-500 rounded-lg bg-gray-500 border-gray-700">` +
    //     `<div id="info" class="p-2 space-y-1 text-lg text-white bg-gray-500 border-gray-700 rounded-lg">` +
    //     `<h2>Изделие!</h2>` +
    //     `</div>` +
    //     `<div data-popper-arrow></div>` +
    //     `</div>`
    // document.getElementById('elementDiv' + id).appendChild(my_menu)
    // console.log(my_menu)
    // my_div.click()
}


function startCreation(id) {
    fetch(`/products/${ id }`)
        .then(
            response => response.json(),
            document.getElementById('mainTree').innerHTML = `<div class="px-3 py-2 text-lg font-medium leading-none text-center text-teal-800 bg-teal-200 rounded-full animate-pulse ">Загрузка данных...</div>`
        )
        .then(data => {
            const rootElement = document.getElementById('mainTree')
            rootElement.innerHTML = ""
            var i = 1
            createTree(rootElement, data['data'], null, i)
            openTreeElems(true)
            makeColorByType()
        })
}

function makeColorByType() {
    var my_elems = document.getElementsByName('elementOfTree')
    var settings = JSON.parse(localStorage.getItem("settings"))
    if (settings[1]['status'] == true) {
        for (var i = 0; i < my_elems.length; i++) {
            if (my_elems[i].getAttribute('id-state') == '1') {
                my_elems[i].getElementsByTagName('span')[0].className = 'rounded-lg'
                my_elems[i].getElementsByTagName('span')[0].setAttribute('style', 'background-color: #ff44447d')
            }
            else if (my_elems[i].getAttribute('id-state') == '2' || my_elems[i].getAttribute('id-state') == '3' || my_elems[i].getAttribute('id-state') == '4') {
                my_elems[i].getElementsByTagName('span')[0].className = 'rounded-lg'
                my_elems[i].getElementsByTagName('span')[0].setAttribute('style', 'background-color: #f975167d')
            }
        }
    } else {
        for (var i = 0; i < my_elems.length; i++) {
            if (my_elems[i].getAttribute('id-state') == '1') {
                my_elems[i].getElementsByTagName('span')[0].className = ''
                my_elems[i].getElementsByTagName('span')[0].setAttribute('style', '')
            }
            else if (my_elems[i].getAttribute('id-state') == '2' || my_elems[i].getAttribute('id-state') == '3' || my_elems[i].getAttribute('id-state') == '4') {
                my_elems[i].getElementsByTagName('span')[0].className = ''
                my_elems[i].getElementsByTagName('span')[0].setAttribute('style', '')
            }
        }
    }

}


function check_cotract_in_list(contr_id) {
    var a = document.getElementById('contractList')
    var elems = a.getElementsByTagName('button')
    var flag = false
    for (var i = 0; i < elems.length; i++) {
        if (i % 2 == 0) {
            var j = elems[i].getAttribute('id').slice(8)
            // console.log(j)
            if (j == contr_id) {
                flag = true
            }
        }
    }
    return flag
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
            console.log(only_db)
            db_productList = []
            var j = 0
            if (only_db) {
                for (var i = 0; i < productList.length; i++) {
                    if (productList[i]['type'] == 'db') {
                        // console.log()
                        db_productList[j] = productList[i]
                        j += 1
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

var static_files = []
document.getElementById('hideen4').style.display = 'none'
function autocomplete(id, type) {
    var contractInfo = JSON.parse(localStorage.getItem("currentContract"))
    $.ajax({
        type: 'GET',
        url: '/getProductInfo',
        contentType: false,
        data: { 'contractId': contractInfo['id'], 'productId': id.slice(13), 'productType': type },
        success: function (response) {
            product = response['product']
            $('#newProductName').val(product.name)
            $('#newProductCode').val(product.code)
            $('#newProductType').val(product.idType)
            $('#newProductState').val(product.idState)
            $('#newProductNumber').val(product.number)
            $('#newProductCount').val(product.count)
            // document.getElementById('newProductFiles').files = FileList(product.files)
            createFileList(id.slice(13), product.files, 'newFileList')
            if (product.files) {
                static_files = product.files
            }
            showFileList('newProductFiles', 'newProductFilesList')
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
            var elem = document.getElementById('hideen4')
            elem.style.display = 'flex'
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
    inp.addEventListener('input', function (e) {
        var a, b, i, val = this.value
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
                        inp.setAttribute('data-type', this.getElementsByTagName("input")[0].getAttribute('data-type'))
                        inp.setAttribute('ch-prod-id', this.getElementsByTagName("input")[0].id.slice(13))
                    } else {
                        inp.setAttribute('m-prod-id', this.getElementsByTagName("input")[0].id.slice(13))
                        inp.setAttribute('ch-prod-id', -1)
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
    console.log(option)
    if (option || document.getElementById('addInDB').hasAttribute('disabled')) {
        document.getElementById('productInput').setAttribute('m-prod-id', '-1')
        div1.innerHTML = document.getElementById('autocompleteDiv').innerHTML
        div2.innerHTML = ''
        div2.className = ''
        getProductList(true)
        elem.style.display = 'block'
        document.getElementById('hideen4').style.display = 'none'
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
    $('#newProductCode').val('н/ш')
    $('#newProductCount').val('1')
    $('#newProductState').val(1)
    $('#newProductType').val(1)
    $('#newProductNumber').val('н/б')
    // setDeafults()
}

var buttonStyle = document.getElementById('chButton').className
function changeInDB() {
    var option = document.getElementById('changeInDB').checked
    // console.log($('#dbID').val())
    if (option) {
        var filelst = document.getElementById('fileList').getElementsByTagName('button')
        for (var i = 0; i < filelst.length; i++) {
            if (filelst[i].getAttribute('file-type') == 'db') {
                filelst[i].style.display = 'block'
            } else {
                filelst[i].style.display = 'none'
            }

        }

    } else {
        var filelst = document.getElementById('fileList').getElementsByTagName('button')
        for (var i = 0; i < filelst.length; i++) {
            if (filelst[i].getAttribute('file-type') == 'json') {
                filelst[i].style.display = 'block'
            } else {
                filelst[i].style.display = 'none'
            }
        }
        document.getElementById('close-changeDB-modal').click()
        // document.getElementById('currentProduct').className = curProdStyle
        document.getElementById('chButton').className = buttonStyle
    }
}

document.getElementById('hideen6').style.display = 'none'
function checkAnswer(answ) {
    if (answ == 0) {
        document.getElementById('hideen5').style.display = 'block'
        document.getElementById('hideen6').style.display = 'none'

        document.getElementById('changeInDB').checked = false
        document.getElementById('currentProduct').className = curProdStyle
        document.getElementById('chButton').className = buttonStyle
    } else {
        document.getElementById('hideen5').style.display = 'none'
        document.getElementById('hideen6').style.display = 'block'
        document.getElementById('currentProduct').className = 'w-full max-w-2xl border border-red-800 rounded-lg shadow-xl shadow-red-400 sm:p-6 md:p-8'
        document.getElementById('chButton').className = 'text-white bg-red-700 hover:bg-red-800 focus:ring-2 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center'
    }
}

