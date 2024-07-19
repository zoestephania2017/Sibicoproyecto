<!DOCTYPE html>
<html lang="es">
<?php
include __DIR__ . '/../../app/utils/Helpers.php';
require __DIR__ . '/../../app/utils/Protection.php';
require __DIR__ . '/../../app/utils/Session.php';

$session = new Session();
$protection = new Protection($session->get('access') ?? []);

if (!isset($protection) || !$protection->has("8")) {
    header('Location: ../?denied=true&_per=' . urlencode("8"), true, 302);
    exit;
}
?>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .form-container {
            border: 2px solid #f0ad4e;
            /* Color de borde similar al segundo diseño */
            padding: 20px;
            border-radius: 10px;
            background-color: #ffffff;
            /* Fondo blanco */
            max-width: 800px;
            margin: auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            /* Sombra ligera */
        }

        .form-container h1 {
            text-align: center;
            color: #2c3e50;
            /* Título de color oscuro */
        }

        .form-group {
            display: flex;
            flex-direction: column;
            margin-bottom: 15px;
        }

        .form-group label {
            margin-bottom: 5px;
            font-weight: bold;
            color: #2c3e50;
            /* Texto de color oscuro */
        }

        .form-group input,
        .form-group select {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
        }

        .form-group input[type="file"] {
            padding: 3px;
        }

        .form-actions {
            text-align: center;
        }

        .form-actions button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }

        .form-actions button:hover {
            background-color: #0056b3;
        }

        .form-row {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }

        .form-row .form-group {
            flex: 1 1 calc(50% - 10px);
            /* 50% de ancho menos 10px de margen */
            margin: 5px;
        }

        @media (max-width: 600px) {
            .form-row .form-group {
                flex: 1 1 100%;
                /* 100% de ancho para dispositivos móviles */
            }
        }
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
    <div class="form-container">
        <header>
            <button data-drawer-target="sidebar" data-drawer-toggle="sidebar"
                aria-controls="sidebar-multi-level-sidebar" type="button"
                class="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-800 rounded-lg sm:hidden hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-800">
                <span class="sr-only">Abrir menu de navegación</span>
                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path clip-rule="evenodd" fill-rule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z">
                    </path>
                </svg>
            </button>
            <aside id="sidebar"
                class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
                aria-label="Sidebar">
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
        <main class="p-4 h-auto sm:ml-32">
            <div class="p-4 border-dashed rounded-lg">
                <div class="flex flex-col gap-4 w-full">
                    <div class="w-full h-auto bg-slate-300 rounded p-4 text-black shadow-lg">
                        <h1 class="text-4xl font-bold">Cargo de Bienes</h1>
                    </div>
                 
                </div>
            </div>
        </main>
    <div class="top-0 left-0 right-0 z-50 w-full p-4  overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <form action="CargoController.php" method="post" enctype="multipart/form-data">
            <div class="form-row">
                <div class="form-group">
                    <label for="employeeName">Nombre de Empleado:</label>
                    <select id="employeeName" name="employeeName">
                        <option>--Seleccione Empleado--</option>
                        <!-- Opciones de empleado -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="itemID">ID de Mobiliario:</label>
                    <select id="itemID" name="itemID">
                        <option>--Seleccione Mobiliario--</option>
                        <!-- Opciones de mobiliario -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="itemBrand">Marca Mobiliario:</label>
                    <input type="text" id="itemBrand" name="itemBrand">
                </div>
                <div class="form-group">
                    <label for="itemModel">Modelo Mobiliario:</label>
                    <input type="text" id="itemModel" name="itemModel">
                </div>
                <div class="form-group">
                    <label for="inventoryNumber">Número de Inventario:</label>
                    <input type="text" id="inventoryNumber" name="inventoryNumber">
                </div>
                <div class="form-group">
                    <label for="itemSeries">Serie del Mobiliario:</label>
                    <input type="text" id="itemSeries" name="itemSeries">
                </div>
                <div class="form-group">
                    <label for="itemColor">Color de Mobiliario:</label>
                    <input type="text" id="itemColor" name="itemColor">
                </div>
                <div class="form-group">
                    <label for="itemState">Estado del Mobiliario:</label>
                    <select id="itemState" name="itemState">
                        <option>--Estado de Mobiliario--</option>
                        <!-- Opciones de estado -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="orderMadeBy">Orden Realizada por:</label>
                    <select id="orderMadeBy" name="orderMadeBy">
                        <option>--Quien Hace la Orden--</option>
                        <!-- Opciones de quien hace la orden -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="itemImage">Imagen de Mobiliario:</label>
                    <input type="file" id="itemImage" name="itemImage">
                </div>
                <div class="form-group">
                    <label for="description">Descripción:</label>
                    <input type="text" id="description" name="description">
                </div>
            </div>
            <div class="form-actions">
                <button type="submit">CARGOS LISTOS</button>
            </div>
        </form>
    </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.js" defer></script>
    <script src="<?= url('src/js/module/swal.min.js') ?>" defer></script>
    <script src="<?= url('src/js/module/jquery.min.js') ?>" defer></script>
    <script src="<?= url('src/js/module/axios/axios.min.js') ?>" defer></script>
    <script src="<?= url('src/js/maintenance/access/1/app-min.js') ?>" type="module" defer></script>
</body>

</html>