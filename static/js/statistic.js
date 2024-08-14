window.onload = getContractFromStorage();
window.onload = getChartData(0)


function getContractFromStorage() {
    getPermission()
    var contractInfo = JSON.parse(localStorage.getItem("currentContract"))
    if (contractInfo && contractInfo['id'] != -1) {
        getContractInfo(contractInfo['id'], contractInfo['number'], contractInfo['innerNumber'], contractInfo['city'], contractInfo['startDate'], contractInfo['endDate'], contractInfo['type'], contractInfo['status'], false)
    } else {
        getContractInfo(-1, '', '', '', '', '', '', '', false)
    }

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
        $("#cInnerNumber").html('<span class="font-medium">Внутренний номер: </span>' + innerNumber)
        $("#cCity").html('<span class="font-medium">Город: </span>' + city)
        $("#cStart").html('<span class="font-medium">Дата подписания: </span>' + startDate)
        $("#cEnd").html('<span class="font-medium">Дата сдачи: </span>' + endDate)
        $("#cType").html('<span class="font-medium">Тип контракта: </span>' + type)
        $("#cStatus").val(Number(status))

    }
    if (option) {
        getChartData(2)
    }
};


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
            getChartData(1)
            getContractInfo(contractInfo['id'], contractInfo['number'], contractInfo['innerNumber'], contractInfo['city'], contractInfo['startDate'], contractInfo['endDate'], contractInfo['type'], inp.value, false)
            updateContractList(response['contracts'])
            console.log(response);
        },
        error: function (error) {
            location.reload();
            console.log(error);
        }
    });
}


function updateContractList(contracts) {
    var list = document.getElementById('contractList')
    list.innerHTML = ''
    contracts.forEach((contract) => {
        var listElem = document.createElement('li')
        listElem.className = 'flex grid-cols-2 gap-2 mx-2 rounded-lg'
        listElem.innerHTML = `<button class="w-full text-left bg-transparent ml-2 py-2 text-lg font-normal rounded-sm text-white hover:text-gray-400 active:no-underline"` +
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
                getContractInfo(contracts[0][0], contracts[0][1], contracts[0][2], contracts[0][3], contracts[0][4], contracts[0][5], contracts[0][7], contracts[0][8], false)
            }
            else {
                getContractInfo(-1, '', '', '', '', '', '', '', false)
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


function getChartData(option) {
    var contractInfo = JSON.parse(localStorage.getItem("currentContract"))
    $.ajax({
        type: 'GET',
        url: '/getChartData',
        async: false,
        contentType: false,
        data: { 'contractId': contractInfo['id'] },
        success: function (response) {
            result = response
            // console.log(response)
            if (option == 0) {
                contractsChart1(response['contracts'])
                contractsChart2(response['products'])
                contractsChart3(response['products_for_timechart'], response['companies'])
            }
            else if (option == 1) {
                contractsChart1(response['contracts'])

            } else if (option == 2) {
                contractsChart2(response['products'])
                contractsChart3(response['products_for_timechart'], response['companies'])
            }
        },
        error: function (error) {
            location.reload();
            console.log(error);
        }
    });
}


function contractsChart1(contracts) {
    var all = [0, 0, 0]
    var series = [0, 0, 0]
    var services = [0, 0, 0]
    contracts.forEach((contract) => {
        if (contract[8] == 1) {
            all[0] += 1
            if (contract[7] == 'Сервис') {
                services[0] += 1
            } else {
                series[0] += 1
            }
        }
        if (contract[8] == 2) {
            all[1] += 1
            if (contract[7] == 'Сервис') {
                services[1] += 1
            } else {
                series[1] += 1
            }
        }
        if (contract[8] == 3) {
            all[2] += 1
            if (contract[7] == 'Сервис') {
                services[2] += 1
            } else {
                series[2] += 1
            }
        }
    })
    option1 = {
        series: all,
        colors: ["#1C64F2", "#16BDCA", "#E74694"],
        chart: {
            height: 420,
            width: 420,
            type: "donut",
        },
        stroke: {
            colors: ["transparent"],
            lineCap: "",
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontFamily: "Inter, sans-serif",
                            offsetY: 20,
                        },
                        total: {
                            showAlways: true,
                            show: true,
                            label: "Количество ГК",
                            fontSize: '25px',
                            fontFamily: "Inter, sans-serif",
                            formatter: function (w) {
                                const sum = w.globals.seriesTotals.reduce((a, b) => {
                                    return a + b
                                }, 0)
                                return sum
                            },
                        },
                        value: {
                            show: true,
                            fontFamily: "Inter, sans-serif",
                            offsetY: -20,
                            formatter: function (value) {
                                return value
                            },
                        },
                    },
                    size: "80%",
                },
            },
        },
        grid: {
            padding: {
                top: -2,
            },
        },
        labels: ["Новых", "В работе", "Завершенных"],
        dataLabels: {
            enabled: false,
        },
        legend: {
            position: "bottom",
            fontFamily: "Inter, sans-serif",
            fontSize: '15px',
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return value
                },
            },
        },
        xaxis: {
            labels: {
                formatter: function (value) {
                    return value
                },
            },
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
    }
    if (document.getElementById("donut-chart") && typeof ApexCharts !== 'undefined') {
        document.getElementById("donut-chart").innerHTML = ''
        const chart = new ApexCharts(document.getElementById("donut-chart"), option1)
        chart.render();
        // Get all the checkboxes by their class name
        const checkboxes = document.querySelectorAll('#contrTypes input[type="checkbox"]');

        // Function to handle the checkbox change event
        function handleCheckboxChange(event, chart) {
            const checkbox = event.target;
            if (checkbox.checked) {
                switch (checkbox.value) {
                    case 'series':
                        chart.updateSeries([series[0], series[1], series[2]]);
                        break;
                    case 'service':
                        chart.updateSeries([services[0], services[1], services[2]]);
                        break;
                    default:
                        chart.updateSeries([all[0], all[1], all[2]]);
                }

            } else {
                chart.updateSeries([all[0], all[1], all[2]]);
            }
        }

        // Attach the event listener to each checkbox
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', (event) => handleCheckboxChange(event, chart));
        });
    }
}


function contractsChart2(products) {
    // var products = my_data['products']
    var types = [0, 0, 0, 0, 0, 0, 0, 0]
    var states = [0, 0, 0, 0, 0]
    products.forEach((product) => {
        switch (product['type']) {
            case 1:
                types[2] += 1
                break
            case 2:
                types[6] += 1
                break
            case 3:
                types[3] += 1
                break
            case 5:
                types[7] += 1
                break
            case 7:
                types[5] += 1
                break
            case 9:
                types[0] += 1
                break
            case 10:
                types[4] += 1
                break
            case 14:
                types[1] += 1
                break
        }
        if (product['type'] == 1 || product['type'] == 7 || product['type'] == 14) {
            switch (product['state']) {
                case 1:
                    states[0] += 1
                    break
                case 2:
                    states[1] += 1
                    break
                case 3:
                    states[2] += 1
                    break
                case 4:
                    states[3] += 1
                    break
                case 5:
                    states[4] += 1
                    break
            }
        }

    })
    option_types = {
        series: types,
        colors: ["#1C64F2", "#16BDCA", "#9061F9", "#6AA84F", "#F1C232", "#E06666", "#C90076", "#134F5C"],
        chart: {
            height: 620,
            width: "100%",
            type: "pie",
        },
        stroke: {
            colors: ["white"],
            lineCap: "",
        },
        plotOptions: {
            pie: {
                labels: {
                    show: true,
                },
                size: "100%",
                dataLabels: {
                    offset: -25
                }
            },
        },
        labels: ["Документация", "Комплекс", "Сборочная единица", "Деталь", "Стандартное изделие", "Прочее изделие", "Материал", "Комплект"],
        dataLabels: {
            enabled: true,
            style: {
                fontFamily: "Inter, sans-serif",
            },
        },
        legend: {
            position: "bottom",
            fontFamily: "Inter, sans-serif",
            fontSize: '15px',
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return value
                },
            },
        },
        xaxis: {
            labels: {
                formatter: function (value) {
                    return value
                },
            },
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
    }
    option_state = {
        series: states,
        colors: ["#93c5fd", "#16BDCA", "#9061F9", "#6AA84F", "#F1C232"],
        chart: {
            height: 620,
            width: "100%",
            type: "pie",
        },
        stroke: {
            colors: ["white"],
            lineCap: "",
        },
        plotOptions: {
            pie: {
                labels: {
                    show: true,
                },
                size: "100%",
                dataLabels: {
                    offset: -25
                }
            },
        },
        labels: ["Комплектование", "Закупка - Служба УСИС", "Закупка - Согласование договора", "Закупка - Исполнение договора", "Укомплектован"],
        dataLabels: {
            enabled: true,
            style: {
                fontFamily: "Inter, sans-serif",
                fontSize: '15px',
            },
        },
        legend: {
            position: "bottom",
            fontFamily: "Inter, sans-serif",
            fontSize: '15px',
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return value
                },
            },
        },
        xaxis: {
            labels: {
                formatter: function (value) {
                    return value
                },
            },
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
    }
    if (document.getElementById("types-chart") && typeof ApexCharts !== 'undefined') {
        document.getElementById("types-chart").innerHTML = ''
        const chart1 = new ApexCharts(document.getElementById("types-chart"), option_types);
        chart1.render();
    }
    if (document.getElementById("states-chart") && typeof ApexCharts !== 'undefined') {
        document.getElementById("states-chart").innerHTML = ''
        const chart2 = new ApexCharts(document.getElementById("states-chart"), option_state);
        chart2.render();
    }
}


function sortSeriesByCompany(series, companies) {
    var result = []
    for (var i = 0; i < companies.length; i++) {
        for (var j = 0; j < series.length; j++) {
            if (series[j]['data'][0]['x'] == companies[i][1]) {
                result.push(series[j])
            }
        }
    }

    return result
}


function getColor(state, start, end) {
    var color = ['#77DD77', '#FF7514', '#E4717A']
    console.log(state)
    if (state == 'Укомплектован') {
        return color[0]
    } else if (Date.now() < end) {
        return color[1]
    } else if (Date.now() > end) {
        return color[2]
    }
}


function contractsChart3(products, companies) {
    var my_series = [{ 'data': [] }]
    console.log(products)
    for (var i = 0; i < products.length; i++) {
        if (products[i]['start'] && products[i]['end']) {
            var d1 = products[i]['start'].split('-')
            var d2 = products[i]['end'].split('-')
            // my_series.push({'name': String(products[i]['name']) + ' ' + String(products[i]['code']), 'data': [{ 'x': String(products[i]['provider'][0]), 
            //     'y': [new Date(Number(d1[0]), Number(d1[1]), Number(d1[2])).getTime(), new Date(Number(d2[0]), Number(d2[1]), Number(d2[2])).getTime()]}]})
            my_series[0]['data'].push({
                'x': String(products[i]['provider'][0]),
                'y': [new Date(Number(d1[0]), Number(d1[1] - 1), Number(d1[2])).getTime(), new Date(Number(d2[0]), Number(d2[1] - 1), Number(d2[2])).getTime()],
                'fillColor': getColor(products[i]['state'], new Date(Number(d1[0]), Number(d1[1] - 1), Number(d1[2])).getTime(), new Date(Number(d2[0]), Number(d2[1] - 1), Number(d2[2])).getTime())
            })
        }
    }
    console.log(my_series)
    var contractInfo = JSON.parse(localStorage.getItem("currentContract"))
    var options = {
        series: my_series,
        chart: {
            height: 400,
            type: 'rangeBar',
            zoom: {
                autoScaleYaxis: true
            },
            locales: [{
                "name": "ru",
                "options": {
                    "months": [
                        "Январь",
                        "Февраль",
                        "Март",
                        "Апрель",
                        "Май",
                        "Июнь",
                        "Июль",
                        "Август",
                        "Сентябрь",
                        "Октябрь",
                        "Ноябрь",
                        "Декабрь"
                    ],
                    "shortMonths": [
                        "Янв",
                        "Фев",
                        "Мар",
                        "Апр",
                        "Май",
                        "Июн",
                        "Июл",
                        "Авг",
                        "Сен",
                        "Окт",
                        "Ноя",
                        "Дек"
                    ],
                    "days": [
                        "Воскресенье",
                        "Понедельник",
                        "Вторник",
                        "Среда",
                        "Четверг",
                        "Пятница",
                        "Суббота"
                    ],
                    "shortDays": ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                    "toolbar": {
                        "exportToSVG": "Сохранить SVG",
                        "exportToPNG": "Сохранить PNG",
                        "exportToCSV": "Сохранить CSV",
                        "menu": "Меню",
                        "selection": "Выбор",
                        "selectionZoom": "Выбор с увеличением",
                        "zoomIn": "Увеличить",
                        "zoomOut": "Уменьшить",
                        "pan": "Перемещение",
                        "reset": "Сбросить увеличение"
                    }
                }
            }],
            defaultLocale: "ru"
        },

        plotOptions: {
            bar: {
                borderRadius: 10,
                horizontal: true,
                barHeight: '90%'
            }
        },
        annotations: {
            xaxis: [{
                x: Date.now(),
                borderColor: '#999',
                yAxisIndex: 0,
            }]
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                var a = moment(val[0])
                var b = moment(val[1])
                var diff = b.diff(a, 'days')
                return diff + (diff > 1 ? ' дней' : ' день')
            }
        },
        fill: {
            type: 'solid',
            opacity: 0.9
        },
        xaxis: {
            type: 'datetime',
            min: new Date(contractInfo['startDate']).getTime(),
            max: new Date(contractInfo['endDate']).getTime(),
        },
        legend: {
            show: false,
        },
        tooltip: {
            custom: function (opts) {
                const shortMonths = [
                    "Янв",
                    "Фев",
                    "Мар",
                    "Апр",
                    "Май",
                    "Июн",
                    "Июл",
                    "Авг",
                    "Сен",
                    "Окт",
                    "Ноя",
                    "Дек"]
                const fromYear = String(new Date(opts.y1).getDate()) + ' ' + shortMonths[Number(new Date(opts.y1).getMonth())] + ' ' + String(new Date(opts.y1).getFullYear())
                const toYear = String(new Date(opts.y2).getDate()) + ' ' + shortMonths[Number(new Date(opts.y2).getMonth())] + ' ' + String(new Date(opts.y2).getFullYear())

                const w = opts.ctx.w
                let ylabel = w.globals.labels[opts.dataPointIndex]
                let seriesName = w.config.series[opts.seriesIndex].name
                    ? w.config.series[opts.seriesIndex].name
                    : ''
                const color = w.globals.colors[opts.seriesIndex]

                return (
                    '<div class="apexcharts-tooltip-rangebar">' +
                    '<div> <span class="series-name" style="color: ' +
                    color +
                    '">' +
                    (seriesName ? seriesName : '') +
                    '</span></div>' +
                    '<div><span class="value start-value">' +
                    fromYear +
                    '</span> <span class="separator">-</span> <span class="value end-value">' +
                    toYear +
                    '</span></div>' +
                    '</div>'
                )
            }
        }
    };
    if (document.getElementById("prods-chart") && typeof ApexCharts !== 'undefined') {
        document.getElementById("prods-chart").innerHTML = ''
        const chart = new ApexCharts(document.getElementById("prods-chart"), options);
        chart.render();
    }
}