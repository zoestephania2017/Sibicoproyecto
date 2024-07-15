<!DOCTYPE html>
<html lang="es">

<?php
include __DIR__ . '/app/utils/Helpers.php';
include __DIR__ . '/app/utils/Session.php';

$session = new Session();

if ($session->has('logged') && $session->get('logged')) {
    header('Location: ./winery.php');
    exit;
}
?>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#8B9EA8">
    <meta name="description" content="Inicio de sesión de usuarios para la aplicación de Almacenes Copeco.">
    <link rel="manifest" href="<?= url('manifest.json') ?>">
    <link rel="shortcut icon" href="<?= url('src/img/icon_192x192.webp') ?>" type="image/x-icon">
    <title>Almacenes Copeco - Login</title>
    <link rel="stylesheet" href="<?= url('src/css/style.css') ?>">
    <script src="https://kit.fontawesome.com/6cf319f10f.js" crossorigin="anonymous" defer></script>
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/BodegaCopeco/service-worker.js');
        }
    </script>
</head>

<body class="p-0 m-0">
    <main>
    <center><img  src="src/img/logogobierno.png" width="200" class="img-responsive" alt="User Image"></center>
    <body style="background: url(src/img/fondologincopeco.png) no-repeat; background-size: cover"></body>
        <div class=" h-screen overflow-hidden flex items-center justify-center">
            <div class="bg-gray-300 lg:w-5/12 md:6/12 w-10/12 shadow-lg rounded-lg">
                <div class="bg-white overflow-hidden absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 md:p-8 shadow-lg">
                    <img class="w-40 h-40" src="<?= url('src/img/logo_160x160.webp') ?>" alt="Copeco logo">
                </div>
                <form action="<?= url('app/controllers/LoginController.php', false) ?>" class="p-12 md:p-24 mt-14" method="POST" id="frmLogin">
                    <div class="flex items-center text-lg mb-6 md:mb-8">
                        <i class="absolute ml-3 fa-solid fa-user fa-sm"></i>
                        <input type="text" id="username" class="bg-gray-100 pl-12 py-2 md:py-4 focus:outline-none w-full rounded-md" placeholder="Usuario" name="username" />
                    </div>
                    <div class="flex items-center text-lg mb-6 md:mb-8">
                        <i class="absolute ml-3 fa-solid fa-lock fa-sm"></i>
                        <input type="password" id="password" class="bg-gray-100 pl-12 py-2 md:py-4 focus:outline-none w-full rounded-md" placeholder="Contraseña" name="password" />
                    </div>
                    <button class="bg-black text-white hover:bg-gray-600 transition duration-300 font-medium p-2 md:p-4 uppercase w-full rounded-md">Ingresar</button>
                </form>
            </div>
        </div>
    </main>
    <script src="<?= url('src/js/module/swal.min.js') ?>" defer></script>
    <script src="<?= url('src/js/login/app-min.js') ?>" type="module" defer></script>
</body>

</html>