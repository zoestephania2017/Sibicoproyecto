<?php
if (!$session->get('logged')) {
    header('Location: ../?status=not_logged', true, 302);
    exit;
}

$user = $session->get('user');
$winery = $session->get('winery');

if (!$winery) {
    header('Location: ../winery.php?status=not_winery', true, 302);
    exit;
}

?>

<div class="flex items-center justify-center mb-4">
    <img class="w-40 h-40" src="<?= url('src/img/logocopeco2.png') ?>" alt="Copeco logo">
</div>

<div class="text-center mb-2">
    <h5 class="text-lg font-bold"><span class="font-bold" title="Nombre y apellido del usuario"><?= $user['nombre'] . ' ' . $user['apellido'] ?></span></h5>
</div>
<div class="text-center">
    <h5 class="text-lg font-bold"><span class="font-normal" title="Bodega asignada"><?= $winery['nombre'] ?></span></h5>
</div>