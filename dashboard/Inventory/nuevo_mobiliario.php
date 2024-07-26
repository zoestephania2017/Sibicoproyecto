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
    <title>Nuevo Mobiliario</title>
    <link rel="stylesheet" type="text/css" href="assets/css/estilo_1.css">
    <style>
        .form-container {
            width: 50%;
            margin: auto;
            padding: 20px;
            border: 1px solid #FFA500; /* Orange border */
            border-radius: 5px;
            background-color: #fff;
        }
        .form-container h2 {
            text-align: center;
            color: #000;
        }
        .form-container label {
            display: block;
            margin-top: 10px;
            color: #000;
        }
        .form-container input[type="text"],
        .form-container input[type="date"],
        .form-container select {
            width: 48%;
            padding: 10px;
            margin-top: 5px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
        }
        .form-container input[type="submit"] {
            width: 100%;
            background-color: #1E90FF; /* Blue background */
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .form-container input[type="submit"]:hover {
            background-color: #FFA500; /* Orange on hover */
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
                <div class="form-container w-full">
        <h2>Nuevo Mobiliario</h2>
        <form action="index.php?action=create" method="POST">
            <label for="textNombreMobiliario">Nombre del Mobiliario:</label>
            <input type="text" name="textNombreMobiliario" required>

            <label for="textCantidad">Cantidad Mobiliario:</label>
            <input type="text" name="textCantidad" required>

            <label for="textFechaAdqMobiliario">Fecha de Adquisición:</label>
            <input type="date" name="textFechaAdqMobiliario" required>

            <label for="tipomob">Uso del Mobiliario:</label>
            <select name="tipomob" required>
                <option value="">--Tipo de Mobiliario--</option>
                <?php foreach ($tipos as $tipo): ?>
                    <option value="<?php echo $tipo['ID_TipoMobiliario']; ?>"><?php echo $tipo['Nombre_TipoMobiliario']; ?></option>
                <?php endforeach; ?>
            </select>

            <label for="textvalorMobiliario">Valor unitario:</label>
            <input type="text" name="textvalorMobiliario" required>

            <label for="textTmonedaMobiliario">Cambios de Moneda:</label>
            <select name="textTmonedaMobiliario" required>
                <option value="">--Tipo de Moneda--</option>
                <option value="Lempiras">Lempiras</option>
                <option value="Dólares">Dólares</option>
                <option value="Euros">Euros</option>
            </select>

            <label for="adqui">Adquisición de Mobiliario:</label>
            <select name="adqui" required>
                <option value="">--Adquisición--</option>
                <option value="Compra">Compra</option>
                <option value="Donación">Donación</option>
            </select>

            <label for="estado">Estado del Mobiliario:</label>
            <select name="estado" required>
                <option value="">--Estado de Mobiliario--</option>
                <?php foreach ($estados as $estado): ?>
                    <option value="<?php echo $estado['ID_Estado']; ?>"><?php echo $estado['Nombre_Estado']; ?></option>
                <?php endforeach; ?>
            </select>

            <input type="submit" value="Guardar">
        </form>
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
