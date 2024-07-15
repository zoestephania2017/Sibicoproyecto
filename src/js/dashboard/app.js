/*import options from "./option-min.js";
import { validateVariable } from "../module/url-min.js";
import { alert } from "../module/alert-min.js";
import { read } from "../module/services/services-min.js";

document.addEventListener("DOMContentLoaded", async () => {
    const denied = validateVariable("denied");
    const _permission = validateVariable("_per");
    const data = await read("../app/controllers/ChartController.php?option=stockByStore");
    const dataActiveInactiveUsers = await read("../app/controllers/ChartController.php?option=activeInactiveUsers");
    const dataDistributionOfSalesByTypeOfDocument = await read("../app/controllers/ChartController.php?option=distributionOfSalesByTypeOfDocument");
    const dataComparisonOfSalesBetweenStores = await read("../app/controllers/ChartController.php?option=comparisonOfSalesBetweenStores");
    const downloadButton = document.querySelectorAll('.download-button');

    var ctxStockByStore = document.getElementById('stockByStore').getContext('2d');
    var ctxActiveInactiveUsers = document.getElementById('activeInactiveUsers').getContext('2d');
    var ctxDistributionOfSalesByTypeOfDocument = document.getElementById('distributionOfSalesByTypeOfDocument').getContext('2d');
    var ctxComparisonOfSalesBetweenStores = document.getElementById('comparisonOfSalesBetweenStores').getContext('2d');

    var colorPalette = [
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(255, 205, 86, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(217, 179, 174, 0.7)',
        'rgba(193, 225, 188, 0.7)',
        'rgba(222, 184, 135, 0.7)',
        'rgba(240, 128, 128, 0.7)',
        'rgba(255, 182, 193, 0.7)',
        'rgba(173, 216, 230, 0.7)',
        'rgba(144, 238, 144, 0.7)',
        'rgba(255, 228, 181, 0.7)',
        'rgba(255, 218, 185, 0.7)',
        'rgba(221, 160, 221, 0.7)',
        'rgba(255, 240, 245, 0.7)',
        'rgba(176, 224, 230, 0.7)',
        'rgba(245, 222, 179, 0.7)',
    ];

    var borderColorPalette = [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 205, 86, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(217, 179, 174, 1)',
        'rgba(193, 225, 188, 1)',
        'rgba(222, 184, 135, 1)',
        'rgba(240, 128, 128, 1)',
        'rgba(255, 182, 193, 1)',
        'rgba(173, 216, 230, 1)',
        'rgba(144, 238, 144, 1)',
        'rgba(255, 228, 181, 1)',
        'rgba(255, 218, 185, 1)',
        'rgba(221, 160, 221, 1)',
        'rgba(255, 240, 245, 1)',
        'rgba(176, 224, 230, 1)',
        'rgba(245, 222, 179, 1)',
    ];

    var stockByStore = new Chart(ctxStockByStore, {
        type: 'bar',
        data: {
            labels: data.wineries,
            datasets: [{
                label: 'Cantidad de productos por bodega',
                data: data.quantities,
                backgroundColor: colorPalette,
                borderColor: borderColorPalette,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            devicePixelRatio: 4
        }
    });

    var activeInactiveUsers = new Chart(ctxActiveInactiveUsers, {
        type: 'doughnut',
        data: {
            labels: dataActiveInactiveUsers.labels,
            datasets: [{
                label: 'Cantidad de usuarios activos y inactivos',
                data: dataActiveInactiveUsers.data,
                backgroundColor: colorPalette,
                borderColor: borderColorPalette,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            devicePixelRatio: 4
        }
    });

    var distributionOfSalesByTypeOfDocument = new Chart(ctxDistributionOfSalesByTypeOfDocument, {
        type: 'pie',
        data: {
            labels: dataDistributionOfSalesByTypeOfDocument.documents,
            datasets: [{
                label: 'Cantidad de ventas por tipo de documento',
                data: dataDistributionOfSalesByTypeOfDocument.quantity,
                backgroundColor: colorPalette,
                borderColor: borderColorPalette,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            devicePixelRatio: 4
        }
    });

    var comparisonOfSalesBetweenStores = new Chart(ctxComparisonOfSalesBetweenStores, {
        type: 'line',
        data: {
            labels: dataComparisonOfSalesBetweenStores.tienda,
            datasets: [{
                label: 'Total de ventas por bodega',
                data: dataComparisonOfSalesBetweenStores.total,
                backgroundColor: colorPalette,
                borderColor: borderColorPalette,
                borderWidth: 1,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            devicePixelRatio: 4
        }
    })

    validate();

    function validate() {
        if (denied.exists && !_permission.isEmpty) {
            if (_permission.exists && options.hasOwnProperty(_permission.value)) {
                const { title, message } = options[_permission.value];

                alert(title, message, "warning", "Ok", true);
            } else {
                alert("Error de permiso", "El permiso proporcionado no es válido.", "warning", "Ok", true);
            }
        }
    }

    downloadButton.forEach(btn => {
        btn.addEventListener("click", () => {
            let index = btn.getAttribute('data-chart-index');

            downloadChart(index);
        });
    })

    function downloadChart(chartID) {
        let { chart, size } = getChart(chartID);
        let image = chart.toBase64Image();

        let canvas = document.createElement('canvas');
        canvas.width = size.with;
        canvas.height = size.height;
        let ctx = canvas.getContext('2d');
        let img = new Image();
        img.src = image;

        img.onload = function () {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let downloadLink = document.createElement("a");
            downloadLink.href = canvas.toDataURL("image/png");
            downloadLink.download = "chart.png";
            downloadLink.click();
        };
    }

    function getChart(chartID) {
        let option = {
            chart: null,
            size: {
                with: 0,
                height: 0
            }
        };

        switch (parseInt(chartID)) {
            case 1:
                option.chart = stockByStore;
                option.size.with = 1920;
                option.size.height = 1080;
                break;
            case 2:
                option.chart = activeInactiveUsers;
                option.size.with = 1200;
                option.size.height = 1200;
                break;
            case 3:
                option.chart = distributionOfSalesByTypeOfDocument;
                option.size.with = 1200;
                option.size.height = 1200;
                break;
            case 4:
                option.chart = comparisonOfSalesBetweenStores;
                option.size.with = 1920;
                option.size.height = 1080;
                break;
        }

        return option;
    }
});
*/

import options from "./option-min.js";
import { validateVariable } from "../module/url-min.js";
import { alert } from "../module/alert-min.js";
import { read } from "../module/services/services-min.js";

document.addEventListener("DOMContentLoaded", async () => {
    // Cargar gráficos
    const denied = validateVariable("denied");
    const _permission = validateVariable("_per");
    const data = await read("../app/controllers/ChartController.php?option=stockByStore");
    const dataActiveInactiveUsers = await read("../app/controllers/ChartController.php?option=activeInactiveUsers");
    const dataDistributionOfSalesByTypeOfDocument = await read("../app/controllers/ChartController.php?option=distributionOfSalesByTypeOfDocument");
    const dataComparisonOfSalesBetweenStores = await read("../app/controllers/ChartController.php?option=comparisonOfSalesBetweenStores");
    const downloadButton = document.querySelectorAll('.download-button');

    var ctxStockByStore = document.getElementById('stockByStore').getContext('2d');
    var ctxActiveInactiveUsers = document.getElementById('activeInactiveUsers').getContext('2d');
    var ctxDistributionOfSalesByTypeOfDocument = document.getElementById('distributionOfSalesByTypeOfDocument').getContext('2d');
    var ctxComparisonOfSalesBetweenStores = document.getElementById('comparisonOfSalesBetweenStores').getContext('2d');

    var colorPalette = [
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(255, 205, 86, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(217, 179, 174, 0.7)',
        'rgba(193, 225, 188, 0.7)',
        'rgba(222, 184, 135, 0.7)',
        'rgba(240, 128, 128, 0.7)',
        'rgba(255, 182, 193, 0.7)',
        'rgba(173, 216, 230, 0.7)',
        'rgba(144, 238, 144, 0.7)',
        'rgba(255, 228, 181, 0.7)',
        'rgba(255, 218, 185, 0.7)',
        'rgba(221, 160, 221, 0.7)',
        'rgba(255, 240, 245, 0.7)',
        'rgba(176, 224, 230, 0.7)',
        'rgba(245, 222, 179, 0.7)',
    ];

    var borderColorPalette = [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 205, 86, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(217, 179, 174, 1)',
        'rgba(193, 225, 188, 1)',
        'rgba(222, 184, 135, 1)',
        'rgba(240, 128, 128, 1)',
        'rgba(255, 182, 193, 1)',
        'rgba(173, 216, 230, 1)',
        'rgba(144, 238, 144, 1)',
        'rgba(255, 228, 181, 1)',
        'rgba(255, 218, 185, 1)',
        'rgba(221, 160, 221, 1)',
        'rgba(255, 240, 245, 1)',
        'rgba(176, 224, 230, 1)',
        'rgba(245, 222, 179, 1)',
    ];

    var stockByStore = new Chart(ctxStockByStore, {
        type: 'bar',
        data: {
            labels: data.wineries,
            datasets: [{
                label: 'Cantidad de productos por bodega',
                data: data.quantities,
                backgroundColor: colorPalette,
                borderColor: borderColorPalette,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            devicePixelRatio: 4
        }
    });

    var activeInactiveUsers = new Chart(ctxActiveInactiveUsers, {
        type: 'doughnut',
        data: {
            labels: dataActiveInactiveUsers.labels,
            datasets: [{
                label: 'Cantidad de usuarios activos y inactivos',
                data: dataActiveInactiveUsers.data,
                backgroundColor: colorPalette,
                borderColor: borderColorPalette,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            devicePixelRatio: 4
        }
    });

    var distributionOfSalesByTypeOfDocument = new Chart(ctxDistributionOfSalesByTypeOfDocument, {
        type: 'pie',
        data: {
            labels: dataDistributionOfSalesByTypeOfDocument.documents,
            datasets: [{
                label: 'Cantidad de ventas por tipo de documento',
                data: dataDistributionOfSalesByTypeOfDocument.quantity,
                backgroundColor: colorPalette,
                borderColor: borderColorPalette,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            devicePixelRatio: 4
        }
    });

    var comparisonOfSalesBetweenStores = new Chart(ctxComparisonOfSalesBetweenStores, {
        type: 'line',
        data: {
            labels: dataComparisonOfSalesBetweenStores.tienda,
            datasets: [{
                label: 'Total de ventas por bodega',
                data: dataComparisonOfSalesBetweenStores.total,
                backgroundColor: colorPalette,
                borderColor: borderColorPalette,
                borderWidth: 1,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            devicePixelRatio: 4
        }
    });

    validate();

    function validate() {
        if (denied.exists && !_permission.isEmpty) {
            if (_permission.exists && options.hasOwnProperty(_permission.value)) {
                const { title, message } = options[_permission.value];

                alert(title, message, "warning", "Ok", true);
            } else {
                alert("Error de permiso", "El permiso proporcionado no es válido.", "warning", "Ok", true);
            }
        }
    }

    downloadButton.forEach(btn => {
        btn.addEventListener("click", () => {
            let index = btn.getAttribute('data-chart-index');

            downloadChart(index);
        });
    })

    function downloadChart(chartID) {
        let { chart, size } = getChart(chartID);
        let image = chart.toBase64Image();

        let canvas = document.createElement('canvas');
        canvas.width = size.with;
        canvas.height = size.height;
        let ctx = canvas.getContext('2d');
        let img = new Image();
        img.src = image;

        img.onload = function () {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let downloadLink = document.createElement("a");
            downloadLink.href = canvas.toDataURL("image/png");
            downloadLink.download = "chart.png";
            downloadLink.click();
        };
    }

    function getChart(chartID) {
        let option = {
            chart: null,
            size: {
                with: 0,
                height: 0
            }
        };

        switch (parseInt(chartID)) {
            case 1:
                option.chart = stockByStore;
                option.size.with = 1920;
                option.size.height = 1080;
                break;
            case 2:
                option.chart = activeInactiveUsers;
                option.size.with = 1200;
                option.size.height = 1200;
                break;
            case 3:
                option.chart = distributionOfSalesByTypeOfDocument;
                option.size.with = 1200;
                option.size.height = 1200;
                break;
            case 4:
                option.chart = comparisonOfSalesBetweenStores;
                option.size.with = 1920;
                option.size.height = 1080;
                break;
        }

        return option;
    }
});

// Agregar funcionalidad para cargar vistas sin recargar la página
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const content = document.querySelector('.content');

    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const url = link.getAttribute('href');
            const response = await fetch(url);
            const html = await response.text();
            content.innerHTML = html;
        });
    });
});
