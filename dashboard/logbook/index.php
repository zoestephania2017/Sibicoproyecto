<!DOCTYPE html>
<html lang="es">

<?php
include __DIR__ . '/../../app/utils/Helpers.php';
require __DIR__ . '/../../app/utils/Protection.php';
require __DIR__ . '/../../app/utils/Session.php';

$session = new Session();
$protection = new Protection($session->get('access') ?? []);

if (!isset($protection) || !$protection->has("17")) {
    header('Location: ../?denied=true&_per=' . urlencode("17"), true, 302);
    exit;
}
?>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#8B9EA8">
    <meta name="description" content="Bitácora de las operaciones realizadas por los usuarios de la aplicación.">
    <link rel="manifest" href="<?= url('manifest.json') ?>">
    <link rel="shortcut icon" href="<?= url('src/img/icon_192x192.webp') ?>" type="image/x-icon">
    <title>Almacenes Copeco - Bitácora</title>
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
    <main class="p-4 h-full sm:ml-64">
        <div class="p-4 border-dashed rounded-lg h-full">
            <div class="flex flex-col gap-4 w-full h-full">
                <div class="w-full h-full bg-slate-300 rounded p-4 text-black shadow-lg">
                    <h1 class="text-4xl font-bold">Bitácora</h1>
                </div>
                <div class="w-full bg-slate-300 rounded p-4 shadow-lg">
                    <div class="p-1">
                        <div class="w-full max-h-[75vh] overflow-x-auto overflow-y-auto p-6 rounded-lg bg-black border border-green-600">
                            <pre class="whitespace-pre-wrap text-white text-sm" id="logbook">
Registros de la bitácora

                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.js" defer></script>
    <script src="<?= url('src/js/module/swal.min.js') ?>" defer></script>
    <script src="<?= url('src/js/module/jquery.min.js') ?>" defer></script>
    <script src="https://cdn.datatables.net/v/dt/jqc-1.12.4/dt-1.13.4/b-2.3.6/sl-1.6.2/datatables.min.js" defer></script>
    <script src="<?= url('src/js/module/axios/axios.min.js') ?>" defer></script>
    <script src="<?= url('src/js/logbook/app-min.js') ?>" type="module" defer></script>
</body>

</html>