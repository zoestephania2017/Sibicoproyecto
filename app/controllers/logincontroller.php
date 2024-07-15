<?php

require __DIR__ . '/../utils/Request.php';
require __DIR__ . '/../utils/Validator.php';
require __DIR__ . '/../models/Login.php';

try {
    $request = new Request();

    $request->addHeadersJSON();

    if ($request->isPost()) {
        $data = $request->getData();

        $validator = new Validator($data);
        $errors = $validator->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        if (count($errors) > 0) {
            header('Location: ../../?status=error', true, 302);
        }

        $login = new Login();

        $response = $login->login($data['username'], $data['password']);

        if ($response) {
            header('Location: ../../winery.php', true, 302);

            exit;
        } else {
            header('Location: ../../?status=invalid', true, 302);

            exit;
        }

        header('Location: ../../?status=invalid', true, 302);

        exit;
    } else {
        header('Location: ../../?status=error', true, 302);

        exit;
    };
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ]);

    exit;
}
