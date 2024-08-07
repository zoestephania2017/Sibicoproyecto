<!DOCTYPE html>
<html>
<head>
    
<?php
include __DIR__ . '/../../app/utils/Helpers.php';
require __DIR__ . '/../../app/utils/Protection.php';
require __DIR__ . '/../../app/utils/Session.php';

$session = new Session();
$protection = new Protection($session->get('access') ?? []);

if (!isset($protection) || !$protection->has("7")) {
    header('Location: ../?denied=true&_per=' . urlencode("7"), true, 302);
    exit;
}
?>
    <title>Tabla de Mobiliarios</title>
    <link rel="stylesheet" type="text/css" href="assets/css/estilo_1.css">
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
            color: #000;
        }
        tr:hover {background-color: #f5f5f5;}
    </style>
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
                    <h1 class="text-4xl font-bold">Perfiles</h1>
                </div>
                <div class="w-full h-auto bg-slate-300 rounded p-4 shadow-lg">
                    <div class="rounded-lg bg-gray-100 p-3 overflow-x-auto">
                    <img src="assets/images/COPECO_small.jpg"><br>
    <h2>Tabla de Mobiliarios</h2><hr><br>
    <table>
        <tr class="titulo">
            <th>Clave:</th>
            <th>Nombre:</th>
            <th>Fecha Adquisición:</th>
            <th>Tipo Mobiliario:</th>
            <th>Valor:</th>
            <th>Moneda:</th>
            <th>Cantidad:</th>
            <th>Adquirido:</th>
            <th>Estado:</th>
        </tr>
        <?php if (!empty($mobiliarios)): ?>
            <?php foreach ($mobiliarios as $mobiliario): ?>
            <tr>
                <td><?php echo $mobiliario['ID_Mobiliario']; ?></td>
                <td><?php echo $mobiliario['Nombre_Mobiliario']; ?></td>
                <td><?php echo $mobiliario['FechaAdq_Mobiliario']; ?></td>
                <td><?php echo $mobiliario['ID_TipoMobiliario']; ?></td>
                <td><?php echo $mobiliario['ValorUnd_Mobiliario']; ?></td>
                <td><?php echo $mobiliario['Tmoneda_Mobiliario']; ?></td>
                <td><?php echo $mobiliario['Cantidad_Mobiliario']; ?></td>
                <td><?php echo $mobiliario['Adquisicion_Mobilario']; ?></td>
                <td><?php echo $mobiliario['ID_Estado']; ?></td>
            </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr>
                <td colspan="9">No hay mobiliarios registrados</td>
            </tr>
        <?php endif; ?>
    </table><br><br><hr><br><br>
    <a href="Bienes.php">Volver</a>
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
    <script src="<?= url('src/js/maintenance/profile/app-min.js') ?>" type="module" defer></script>
</body>
</html>
