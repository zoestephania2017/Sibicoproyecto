<!DOCTYPE html>
<html lang="es">

<?php
include __DIR__ . '/../../app/utils/Helpers.php';
require __DIR__ . '/../../app/utils/Protection.php';
require __DIR__ . '/../../app/utils/Session.php';

$session = new Session();
$protection = new Protection($session->get('access') ?? []);

if (!isset($protection) || !$protection->has("6")) {
    header('Location: ../?denied=true&_per=' . urlencode("6"), true, 302);
    exit;
}
?>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#8B9EA8">
    <meta name="description" content="Asignar una bodega a un usuario.">
    <link rel="manifest" href="<?= url('manifest.json') ?>">
    <link rel="shortcut icon" href="<?= url('src/img/icon_192x192.webp') ?>" type="image/x-icon">
    <title>Almacenes Copeco - Usuarios</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css" rel="stylesheet" />
    <script src="https://kit.fontawesome.com/6cf319f10f.js" crossorigin="anonymous" defer></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css" />
    <link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.3.6/css/buttons.dataTables.min.css">
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
            <span class="sr-only">Abrir menu de navegación</span>
            <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z">
                </path>
            </svg>
        </button>
        <aside id="sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div class="h-full px-3 py-4 overflow-y-auto bg-slate-300">
                <div class="p-4 bg-white rounded-lg mb-8 shadow-lg">
                    <?php include __DIR__ . '/../components/box_data.php'; ?>
                </div>

                <ul class="space-y-4 font-medium">
                    <?php require_once __DIR__ . '/../components/sidebar.php'; ?>
                </ul>
            </div>
        </aside>
    </header>
    <main class="p-4 h-auto sm:ml-64">
        <div class="p-4  border-dashed rounded-lg">
            <div class="flex flex-col gap-4 w-full">
                <div class="w-full h-auto bg-slate-300 rounded p-4 text-black shadow-lg">
                    <h1 class="text-4xl font-bold">Asignar bodega a usuario</h1>
                </div>
                <div class="w-full h-auto bg-slate-300 rounded p-4 shadow-lg">
                    <div class="rounded-lg bg-gray-100 p-3 overflow-x-auto">
                        <table id="tblUsers" class="cell-border compact stripe"></table>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <button id="buttonModal" data-modal-target="modal" data-modal-toggle="modal" class="hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" type="button"></button>
    <div id="modal" tabindex="-1" data-modal-backdrop="static" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div class="relative w-full max-w-2xl max-h-full">
            <div class="relative bg-gray-300 rounded-lg shadow">
                <div class="flex items-start justify-between p-4 border-b rounded-t">
                    <h3 class="text-xl font-semibold" id="modalTitle"></h3>
                    <button type="button" class="text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-hide="modal" id="btnClose">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="sr-only">Cerrar ventana</span>
                    </button>
                </div>
                <form action="#" id="frmUser">
                    <div class="p-6 space-y-2">
                        <input type="hidden" id="txtCode">
                        <input type="hidden" id="txtAction">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="col-span-2">
                                <label for="txtStore" class="block mb-2 text-sm font-medium text-gray-900">Tienda</label>
                                <select name="txtStore" id="txtStore" class="block w-full px-4 py-2 text-gray-900 bg-gray-50 rounded-lg border border-gray-300">
                                    <option value="">Seleccione una opción</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                        <button data-modal-hide="modal" type="submit" id="btnModal" class="text-white bg-black hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center shadow-lg"></button>
                        <button data-modal-hide="modal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10" type="button" id="btnCancel">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.js" defer></script>
    <script src="<?= url('src/js/module/swal.min.js') ?>" defer></script>
    <script src="<?= url('src/js/module/jquery.min.js') ?>" defer></script>
    <script src="https://cdn.datatables.net/v/dt/jqc-1.12.4/dt-1.13.4/b-2.3.6/sl-1.6.2/datatables.min.js" defer></script>
    <script src="<?= url('src/js/module/axios/axios.min.js') ?>" defer></script>
    <script src="<?= url('src/js/maintenance/user_store/app-min.js') ?>" type="module" defer></script>
</body>

</html>