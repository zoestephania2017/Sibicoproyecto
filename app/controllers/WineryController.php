<?php

require_once __DIR__ . '/../utils/Request.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../models/Winery.php';
require_once __DIR__ . '/../utils/Session.php';

try {
    $request = new Request();
    $session = new Session();

    $request->addHeadersJSON();

    if ($request->isPost()) {
        if (!$session->has('logged') && !$session->get('logged')) {
            header('Location: ../../?status=not_logged', true, 302);
            exit;
        }

        $data = $request->getData();

        $validator = new Validator($data);
        $errors = $validator->validate([
            'winery' => 'required'
        ]);

        if (count($errors) > 0) {
            header('Location: ../../winery.php?status=error', true, 302);
        }

        $winery = new Winery($data);

        $response = $winery->winery($data['winery']);

        if ($response) {
            header('Location: ../../dashboard/', true, 302);
            exit;
        } else {
            header('Location: ../../winery.php?status=invalid', true, 302);
            exit;
        }
    }

    header('Location: ../../winery?status=error', true, 302);
    exit;
} catch (\Throwable $th) {
    echo json_encode([
        'success' => false,
        'message' => $th->getMessage(),
    ]);

    exit;
}
