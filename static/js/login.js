function loginUser() {
    var login = document.getElementById('userLogin').value
    var passwd1 = document.getElementById('userPassword1').value
    // var passwd2 = document.getElementById('userPassword2').value
    var flag1 = false
    var flag2 = false
    // var flag3 = false
    // var flag4 = false
    if (login == '') {
        flag1 = true
    }
    if (passwd1 == '') {
        flag2 = true
    }
    // if (passwd2 == '') {
    //     flag3 = true
    // }
    // if (passwd1 != '' && passwd2 != '' && passwd1 != passwd2) {
    //     flag4 = true
    // }
    // console.log(login, passwd1, passwd2)
    // console.log(flag1, flag2, flag3, flag4)
    if (flag1 || flag2) {
        var item = document.getElementById('userLogin')
        if (flag1) {
            item.classList.replace('border-gray-300', 'border-red-600')
            if (item.parentElement.lastChild.nodeName != 'P') {
                var error = document.createElement('p')
                error.innerHTML = `<p id="outlined_error_help" class="mt-2 text-sm text-red-600"><span class="font-medium">Ошибка!</span> Поле не заполнено.</p> `
                item.parentElement.appendChild(error)
            }
        }
        else if (item.parentElement.lastChild.nodeName == 'P') {
            item.classList.replace('border-red-600', 'border-gray-300')
            item.parentElement.lastChild.remove()
        }
        var item = document.getElementById('userPassword1')
        if (flag2) {
            item.classList.replace('border-gray-300', 'border-red-600')
            if (item.parentElement.lastChild.nodeName != 'P') {
                var error = document.createElement('p')
                error.innerHTML = `<p id="outlined_error_help" class="mt-2 text-sm text-red-600"><span class="font-medium">Ошибка!</span> Поле не заполнено.</p> `
                item.parentElement.appendChild(error)
            }
        }
        else if (item.parentElement.lastChild.nodeName == 'P') {
            item.classList.replace('border-red-600', 'border-gray-300')
            item.parentElement.lastChild.remove()
        }
        // var item = document.getElementById('userPassword2')
        // if (flag3) {
        //     item.classList.replace('border-gray-300', 'border-red-600')
        //     if (item.parentElement.lastChild.nodeName != 'P') {
        //         var error = document.createElement('p')
        //         error.innerHTML = `<p id="outlined_error_help" class="mt-2 text-sm text-red-600"><span class="font-medium">Ошибка!</span> Поле не заполнено.</p> `
        //         item.parentElement.appendChild(error)
        //     }
        // }
        // else if (item.parentElement.lastChild.nodeName == 'P') {
        //     item.classList.replace('border-red-600', 'border-gray-300')
        //     item.parentElement.lastChild.remove()
        // }
        // var item = document.getElementById('userPassword2')
        // if (flag4 && (!flag2 || !flag3)) {
        //     item.classList.replace('border-gray-300', 'border-red-600')
        //     if (item.parentElement.lastChild.nodeName != 'P') {
        //         var error = document.createElement('p')
        //         error.innerHTML = `<p id="outlined_error_help" class="mt-2 text-sm text-red-600"><span class="font-medium">Ошибка!</span> Папроли не совпадают.</p> `
        //         item.parentElement.appendChild(error)
        //     }
        // }
        // else if (item.parentElement.lastChild.nodeName == 'P' && (!flag2 || !flag3)) {
        //     item.classList.replace('border-red-600', 'border-gray-300')
        //     item.parentElement.lastChild.remove()
        // }
    } else {
        if (document.getElementById('userLogin').parentElement.lastChild.nodeName == 'P') {
            document.getElementById('userLogin').classList.replace('border-red-600', 'border-gray-300')
            document.getElementById('userLogin').parentElement.lastChild.remove()
        }
        if (document.getElementById('userPassword1').parentElement.lastChild.nodeName == 'P') {
            document.getElementById('userPassword1').classList.replace('border-red-600', 'border-gray-300')
            document.getElementById('userPassword1').parentElement.lastChild.remove()
        }
        // if (document.getElementById('userPassword2').parentElement.lastChild.nodeName == 'P') {
        //     document.getElementById('userPassword2').classList.replace('border-red-600', 'border-gray-300')
        //     document.getElementById('userPassword2').parentElement.lastChild.remove()
        // }
        var formData = new FormData()
        formData.append('username', $('#userLogin').val())
        formData.append('password', $('#userPassword1').val())
        $.ajax({
            type: 'POST',
            url: '/loginUser',
            processData: false,
            contentType: false,
            data: formData,
            success: function (response) {
                if (response['status'] == 'success') {
                    window.location.href = response['url']
                }
                else if (response['status'] == 'fail') {
                    var err = document.getElementById('errorUser')
                    err.innerHTML = `<div class="bg-red-400  max-w-fit justify-self-center text-center border-2 border-red-400 hover:bg-red-500 hover:border-red-600 rounded-lg text-white font-semibold p-2">` +
                        `<span>`+ response['message'] +`</span>` +
                        `</div>`
                }
                console.log(response);

            },
            error: function (error) {
                location.reload();
                console.log(error);
            }
        });
    }

}

function logoutUser() {
    $.ajax({
        url: '/logout',
        type: 'GET',
        contentType: false,
        success: function (response) {
            if (response['status'] == 'success') {
                window.location.href = response['url']
            }
            console.log(response)

        },
        error: function (response) {
            location.reload()
            console.log(response)
        }
    })
}