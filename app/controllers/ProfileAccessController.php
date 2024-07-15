<?php

require __DIR__ . '/../utils/Request.php';
require __DIR__ . '/../utils/Validator.php';
require __DIR__ . '/../models/Access.php';
require __DIR__ . '/../utils/Protection.php';

try {
    $request = new Request();
    $access = new Access();
    $permissions = $access->getSession()->get('access');

    if ($permissions === null || !is_array($permissions)) {
        echo json_encode([
            'success' => false,
            'message' => 'A ocurrido un error, por favor refresque la página.'
        ]);

        exit;
    }

    $protection = new Protection($permissions);

    if (!$protection->has('8')) {
        echo json_encode([
            'success' => false,
            'message' => 'Acceso denegado.'
        ]);

        exit;
    }

    $request->addHeadersJSON();

    if ($request->isPost()) {
        $data = $request->getData();

        $validator = new Validator($data);

        $errors = $validator->validate([
            'codigo_perfil' => 'required',
            'codigo_acceso' => 'required',
        ]);

        if (count($errors) > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $errors
            ]);

            exit;
        }

        $response = $access->createAccessForProfileAccess($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Acceso asignado correctamente'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido asignar el acceso.',
        ]);

        exit;
    }

    if ($request->isDelete()) {
        $data = $request->getData();

        $validator = new Validator($data);

        $errors = $validator->validate([
            'codigo_acceso' => 'required',
            'codigo_perfil' => 'required',
        ]);

        if (count($errors) > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $errors
            ]);

            exit;
        }

        $response = $access->deleteAccessForProfileAccess($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Acceso eliminado correctamente'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido eliminar el acceso.',
        ]);

        exit;
    }

    if ($request->isGet()) {
        $data = $request->getData();

        if (isset($data['profile'])) {
            $accesses = $access->getAccessForProfile($data['profile']);

            echo json_encode($accesses);

            exit;
        }

        $accesses = $access->getAccesses();

        echo json_encode($accesses);

        exit;
    }
} catch (\Throwable $th) {
    echo json_encode([
        'success' => false,
        'message' => $th->getMessage(),
    ]);

    exit;
}
