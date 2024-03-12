window.onload = function () {
    // console.log(localStorage)
    var contractInfo = JSON.parse(localStorage.getItem("currentConract"))
    getContractInfo(contractInfo['id'], contractInfo['number'], contractInfo['innerNumber'], contractInfo['city'], contractInfo['startDate'], contractInfo['endDate'], contractInfo['type'], contractInfo['status'])
}
document.getElementById('hideen').style.display = 'none'
$('#isLocalContract').click(function () {
    var elem = document.getElementById('hideen')
    if (elem.style.display == 'none') {
        elem.style.display = 'block'
    } else {
        elem.style.display = 'none'
    }
});




var currentProvider = -1;
function showContacts(tmp) {
    if (currentProvider != tmp.value) {
        var addr = $('#company' + tmp.value).data('address')
        console.log(addr)
        $("#providerAddress").text(addr)
        fetch(`/contacts/${ tmp.value }`)
            .then(response => response.json())
            .then(data => {
                contacts = data
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
    currentProvider = tmp.value
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


function showProduct(id, name, code, number, type, count, state, isContract, provider, start, end, note_list) {
    $("#currentProduct").val("currentProduct" + id)
    $("#productName").text("Изделие: " + name)
    if (code != 'null') {
        document.getElementById('productCode').style.display = 'block'
        $("#productCode").text("Шифр: " + code)
    } else {
        document.getElementById('productCode').style.display = 'none'
    }
    $("#productNumber").val(number)
    $("#productType").val(type)
    $("#productCount").val(count)
    $("#productState").val(state)
    if (note_list != 'null') {
        $("#productNote").val(note_list.replaceAll("!@!", "\n"))
    } else {
        $("#productNote").val('')
    }

    if (isContract == 1) {
        document.getElementById('isLocalContract').checked = true
        $("#productProvider").val(provider)
        showContacts(document.getElementById('productProvider'))
        $("#startDate").val(start)
        $("#endDate").val(end)
        document.getElementById('hideen').style.display = 'block'
    } else {
        document.getElementById('isLocalContract').checked = false
        $("#productProvider").val('')
        var block = document.getElementById('contacts')
        block.innerHTML = ""
        $("#providerAddress").text('')
        $("#startDate").val('')
        $("#endDate").val('')
        document.getElementById('hideen').style.display = 'none'
    }
};


function changeProduct() {
    var contractInfo = JSON.parse(localStorage.getItem("currentConract"))
    var formData = {}
    if (document.getElementById('isLocalContract').checked) {
        formData = {
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
        formData = {
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

    $.ajax({
        type: 'POST',
        url: '/changeProduct',
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
        const listItem = document.createElement('li')
        var new_note = String(item.note)
        note_lines = new_note.replaceAll("\n", "!@!")
        if (item.children.length != 0) {
            var tmp = item.id + i
            listItem.innerHTML = `<a data-te-collapse-init href="#collapse` + tmp + `" role="button" aria-expanded="false" aria-controls="collapse` + tmp + `"` +
                `class="flex text-xl text-black font-semibold items-center hover:bg-purple-500  rounded-lg"` +
                `onclick="showProduct(` + item.id + `, '` + item.name + `', '` + item.code + `', ` +
                item.number + `, ` + item.idType + `, ` + item.count + `, ` + item.idState + `, ` +
                item.isContract + `, ` + item.idProvider + `, '` + item.start + `', '` + item.end + `', '` + note_lines + `')">` +
                `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="h-4 w-4">` +
                `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>` +
                item.name + `</a>`
            i += 1
        } else {
            listItem.innerHTML = `<div class="flex grid-cols-2 ">` +
                `<a role="button" aria-expanded="false"` +
                `class="flex text-lg text-black items-center hover:bg-purple-300 rounded-lg mr-2"` +
                `onclick="showProduct(` + item.id + `, '` + item.name + `', '` + item.code + `', ` +
                item.number + `, ` + item.idType + `, ` + item.count + `, ` + item.idState + `, ` +
                item.isContract + `, ` + item.idProvider + `, '` + item.start + `', '` + item.end + `', '` + note_lines + `')">` +
                item.name + `</a>` +
                `<div class="flex bg-white border border-gray-200 hover:bg-gray-200 hover:border-gray-300 rounded-lg shadow">` +
                `<button type="button" data-modal-target="product-modal" data-modal-toggle="product-modal"` +
                `onclick="test(` + item.id + `, '` + item.name + `')">` +
                `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22"` +
                `stroke-width="1.5" stroke="currentColor"` +
                `class="w-5 h-5 text-left text-green-500 hover:text-green-800">` +
                `<path stroke-linecap="round" stroke-linejoin="round"` +
                `d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />` +
                `</svg>` +
                `</button>` +
                `<button type="button" data-modal-target="product-modal"` +
                `data-modal-toggle="product-modal">` +
                `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22"` +
                `stroke-width="1.5" stroke="currentColor"` +
                `class="w-5 h-5 text-left text-red-500 hover:text-red-800">` +
                `<path stroke-linecap="round" stroke-linejoin="round"` +
                `d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />` +
                `</svg>` +
                `</button>` +
                `</div>` +
                `</div>`
        }
        if (item.children.length != 0) {
            createTree(listItem, item.children, item.id, i)
        }
        treeElement.append(listItem)
    });
    element.append(treeElement)
};
function test(a, b){
    console.log(a, b)
}


function startCreation(id) {
    fetch(`/products/${ id }`)
        .then(response => response.json())
        .then(data => {
            const rootElement = document.getElementById('mainTree')
            rootElement.innerHTML = ""
            var i = 1
            // console.log(data['data'])
            createTree(rootElement, data['data'], null, i)
        });
}
