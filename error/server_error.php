<!DOCTYPE html>
<html lang="es">
<?php
include __DIR__ . '/../app/utils/Helpers.php';
include __DIR__ . '/../app/utils/Log.php';

$log = new Log();

$previousUrl = isset($_COOKIE['old_url']) ? $_COOKIE['old_url'] : '';

try {
    $httpCode = http_response_code();

    $errorMessage = 'Error interno del servidor, actualmente no se puede acceder a esta página debido a un error de servidor, por favor 
    recargue la página y vuelva a intentarlo más tarde.';

    throw new Exception($errorMessage, $httpCode);
} catch (Exception $exception) {
    $log->set($exception, [
        'location' => $exception->getFile() . ':' . $exception->getLine(),
        'previous' => $previousUrl,
        'path' => $_SERVER['REQUEST_URI']
    ]);
}
?>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#8B9EA8">
    <meta name="description" content="Pagina para mostrar el error 500 (Internal Server Error).">
    <link rel="manifest" href="<?= url('manifest.json') ?>">
    <link rel="shortcut icon" href="<?= url('src/img/icon_192x192.webp') ?>" type="image/x-icon">
    <title>Almacenes Copeco - Error interno del servidor</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css" rel="stylesheet" />
    <script src="https://kit.fontawesome.com/6cf319f10f.js" crossorigin="anonymous" defer></script>
    <link rel="stylesheet" href="<?= url('src/css/style.css') ?>">
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/BodegaCopeco/service-worker.js');
        }
    </script>
</head>

<body class="bg-gray-100">
    <main class="p-4 h-screen flex items-center justify-center">
        <div class="container h-full">
            <div class="flex justify-center items-center w-full h-full">
                <div class="flex flex-col items-center">
                    <img src="<?= url('src/img/logo_2.jpg') ?>" alt="Logo Copeco" class="w-64">
                    <h1 class="text-4xl font-bold text-center mt-4">Error 500</h1>
                    <h2 class="text-2xl font-bold text-center mt-4">Error interno del servidor</h2>
                    <div class="mt-6">
                        <a class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" href="<?= url('dashboard/') ?>">Ir a Inicio</a>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.js" defer></script>
</body>

</html>