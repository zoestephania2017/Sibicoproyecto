<?php

require __DIR__ . '/../utils/Session.php';

try {
    $session = new Session();
    $session->destroy();
    session_destroy();
    session_unset();
    header('Location: ../../', true, 302);
} catch (\Throwable $th) {
    echo json_encode([
        'success' => false,
        'message' => $th->getMessage(),
    ]);

    exit;
}
