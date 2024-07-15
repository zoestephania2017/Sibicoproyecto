<!DOCTYPE html>
<html lang="es">

<?php
include __DIR__ . '/../app/utils/Helpers.php';
require __DIR__ . '/../app/utils/Protection.php';
require __DIR__ . '/../app/utils/Session.php';

$session = new Session();
?>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#8B9EA8">
    <meta name="description" content="Pagina principal del dashboard.">
    <link rel="manifest" href="<?= url('manifest.json') ?>">
    <link rel="shortcut icon" href="<?= url('src/img/icon_192x192.webp') ?>" type="image/x-icon">
    <title>Almacenes Copeco - Dashboard</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css" rel="stylesheet" />
    <script src="https://kit.fontawesome.com/6cf319f10f.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>
    <link rel="stylesheet" href="<?= url('src/css/style.css') ?>">
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/BodegaCopeco/service-worker.js');
        }
    </script>
</head>

<body class="bg-gray-100">
    <header>
        <button data-drawer-target="sidebar" data-drawer-toggle="sidebar" aria-controls="sidebar-multi-level-sidebar" type="button" class="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-800 rounded-lg sm:hidden hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-800">
            <span class="sr-only">Abrir Menu de Navegación</span> 
               
            <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z">
                </path>
            </svg>
        </button>
        <aside id="sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div class="h-full px-3 py-4 overflow-y-auto bg-slate-300">
                <div class="p-4 bg-white rounded-lg mb-8 shadow-lg">
                    <?php include __DIR__ . '/components/box_data.php'; ?>
                </div>

                <ul class="space-y-4 font-medium">
                    <?php require_once __DIR__ . '/components/sidebar.php'; ?>
                </ul>
            </div>
        </aside>
    </header>
    <main class="p-4 min-h-screen sm:ml-64">
        <!-- This content is mostly due to some styles that do not load correctly. -->
        <div>
            <span class="text-emerald-500"></span>
            <span class="text-gray-500"></span>
            <span class="text-blue-500"></span>
            <span class="text-yellow-500"></span>
            <span class="text-orange-500"></span>
            <span class="text-red-500"></span>
            <span class="text-purple-500"></span>
            <span class="text-rose-500"></span>
            <span class="text-indigo-500"></span>
            <span class="text-amber-500"></span>
        </div>
        
        <div class="p-4 h-full rounded-lg">
                <div class="w-full h-auto bg-slate-300 rounded p-4 text-black shadow-lg">
                    <h1 class="text-4xl font-bold">COMISION PERMANENTE DE CONTINGENCIAS</h1>

                    <div class="col-span-1 md:col-span-3 w-full h-auto">
                        <div class="w-full h-map bg-slate-300 rounded p-4 text-white shadow-lg">
                            <div id="loading-map" class="h-full flex justify-center items-center">
                                <p class="text-gray-600 text-lg">Cargando Mapa</p>
                            </div>
                            <iframe class="w-full rounded hidden" id="iframe-content" name="iframe-content" frameborder="0" vspace="0px" hspace="0" marginwidth="0" marginheight="0" scrolling="yes" style="height: 100%; width: 100%;" loading="lazy">
                            </iframe>
                            
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="col-span-1 md:col-span-2 w-full h-auto bg-slate-300 rounded p-4 text-black shadow-lg">
                        <div class="flex flex-row justify-between items-center mb-4">
                            <span class="font-bold text-2xl" title="Cantidad de existencias por tienda">Gráfico de Existencias Por Almacen</span>
                            <button title="Descargar gráfico en png" class="download-button text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 transition-colors" type="button" data-chart-index="1">
                                <i class="fa-solid fa-download"></i>
                            </button>
                        </div>
                        <canvas class="w-full" id="stockByStore"></canvas>
                    </div>
                    <div class="col-span-1 md:col-span-1 w-full h-auto bg-slate-300 rounded p-4 text-black shadow-lg">
                        <div class="flex flex-row justify-between items-center mb-4">
                            <span class="font-bold text-2xl" title="Cantidad de usuarios inactivos">Gráfico de Usuarios</span>
                            <button title="Descargar gráfico en png" class="download-button text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 transition-colors" type="button" data-chart-index="2">
                                <i class="fa-solid fa-download"></i>
                            </button>
                        </div>

                      <canvas class="w-full" id="activeInactiveUsers"></canvas>
                    
                    </div>
                    
                     
                         <div class="col-span-1 md:col-span-1 w-full h-auto bg-slate-300 rounded p-4 text-black shadow-lg">
                         <div class="flex flex-row justify-between items-center mb-4">
                            <span class="font-bold text-2xl" title="Cantidad de ventas por tipo de documento">Gráfico por Tipo de Documentacion</span>
                            <button title="Descargar gráfico en png" class="download-button text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 transition-colors" type="button" data-chart-index="3">
                                <i class="fa-solid fa-download"></i> 
                            </button>
                        </div>
                        <canvas class="w-full" id="distributionOfSalesByTypeOfDocument"></canvas> 
                    </div>
                    <div class="col-span-1 md:col-span-2 w-full h-auto bg-slate-300 rounded p-4 text-black shadow-lg">
                        <div class="flex flex-row justify-between items-center mb-4">
                            <span class="font-bold text-2xl" title="Cantidad de ventas por marca">Gráfico de Comparación Por Almacenes</span>
                            <button title="Descargar gráfico en png" class="download-button text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 transition-colors" type="button" data-chart-index="4">
                                <i class="fa-solid fa-download"></i>
                            </button>
                        </div>
                        <canvas class="w-full" id="comparisonOfSalesBetweenStores"></canvas>
                    </div>
                </div>
            </div>
        </div> 
    </main>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.js" defer></script>
    <script src="<?= url('src/js/module/swal.min.js') ?>" defer></script>
    <script src="<?= url('src/js/module/axios/axios.min.js') ?>" defer></script>
    <script src="<?= url('src/js/dashboard/app-min.js') ?>" type="module" defer></script>
    <script>
        window.addEventListener("load", function() {
            var iframe = document.getElementById("iframe-content");

            setTimeout(function() {
                iframe.src = "http://geonode.copeco.gob.hn/maps/new?layer=geonode:Bodegas_COPECO&view=True";

                iframe.classList.remove("hidden");
                document.querySelector("#loading-map").classList.add("hidden");
            }, 1500);
        });
    </script>
</body>
</body>

</html>