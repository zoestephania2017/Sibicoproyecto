<!DOCTYPE html>
<html lang="es">

<?php
include __DIR__ . '/app/utils/Helpers.php';
include __DIR__ . '/app/models/Winery.php';
$winery = new Winery();

$wineries = $winery->getWineryFromUser();
?>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#8B9EA8">
    <meta name="description" content="Seleccionar una bodega.">
    <link rel="manifest" href="<?= url('manifest.json') ?>">
    <link rel="shortcut icon" href="<?= url('src/img/icon_192x192.webp') ?>" type="image/x-icon">
    <title>Almacenes Copeco - Bodegas</title>
    <link rel="stylesheet" href="<?= url('src/css/style.css') ?>">
    <script src="https://kit.fontawesome.com/6cf319f10f.js" crossorigin="anonymous" defer></script>
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/BodegaCopeco/service-worker.js');
        }
    </script>
</head>

<body>
    <main>
    <center><img  src="src/img/logogobierno.png" width="200" class="img-responsive" alt="User Image"></center>
    <body style="background: url(src/img/fondologincopeco.png) no-repeat; background-size: cover"></body>
        <div class="h-screen overflow-hidden flex items-center justify-center">
            <div class="bg-gray-300 lg:w-5/12 md:6/12 w-10/12 shadow-lg rounded-lg">
                <div class="bg-white overflow-hidden absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 md:p-8 shadow-lg">
                    <img class="w-40 h-40" src="<?= url('src/img/logocopeco2.png') ?>" alt="Copeco logo">
                </div>
                <form action="<?= url('app/controllers/WineryController.php') ?>" class="p-12 md:p-24 mt-14" method="POST" id="frmWinery">
                    <div class="flex items-center mb-4 md:mb-8">
                        <i class="absolute ml-3 fas fa-boxes fa-sm"></i>
                        <select class="bg-gray-100 pl-12 py-2 md:py-4 focus:outline-none w-full rounded-md" name="winery" id="winery">
                            <option value="">Seleccione una Bodega</option>
                            <?php if (count($wineries) > 0) : ?>
                                <?php for ($i = 0; $i < count($wineries); $i++) : ?>
                                    <option value="<?= $wineries[$i][0] ?>"><?= $wineries[$i][1] ?></option>
                                <?php endfor; ?>
                            <?php endif; ?>
                        </select>
                    </div>
                    <button class="bg-black hover:bg-gray-600 transition duration-300 font-medium p-2 md:p-4 text-white uppercase w-full rounded-md">Entrar</button>
                </form>
            </div>
        </div>
    </main>
    <script src="<?= url('src/js/module/swal.min.js') ?>" defer></script>
    <script src="<?= url('src/js/login/winery-min.js') ?>" type="module" defer></script>
</body>

</html>