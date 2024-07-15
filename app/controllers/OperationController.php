<?php

require __DIR__ . '/../utils/Request.php';
require __DIR__ . '/../utils/Validator.php';
require __DIR__ . '/../models/User.php';
require __DIR__ . '/../utils/Protection.php';

try {
    $request = new Request();
    $user = new User();
    $permissions = $user->getSession()->get('access');

    if ($permissions === null || !is_array($permissions)) {
        echo json_encode([
            'success' => false,
            'message' => 'A ocurrido un error, por favor refresque la página.'
        ]);

        exit;
    }

    $protection = new Protection($permissions);

    if (!$protection->has('5')) {
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
            'codigo' => 'required',
            'codigo_tienda' => 'required',
        ]);

        if (count($errors) > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $errors
            ]);

            exit;
        }

        $response = $user->assignStoreToUser($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Tienda asignada correctamente'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido asignar la tienda.',
        ]);

        exit;
    }

    if ($request->isPut()) {
        $data = $request->getData();

        $validator = new Validator($data);

        $errors = $validator->validate([
            'codigo' => 'required',
            'operation' => 'required',
        ]);

        if (count($errors) > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $errors
            ]);

            exit;
        }

        $operation = $data['operation'];

        switch ($operation) {
            case 'rstpwd':
                $response = $user->resetPassword($data);

                if ($response) {
                    echo json_encode([
                        'success' => true,
                        'message' => 'Contraseña restablecida correctamente'
                    ]);

                    exit;
                }

                echo json_encode([
                    'success' => false,
                    'message' => 'Al parecer no se ha podido actualizar la contraseña.',
                ]);

                exit;
            case 'atvusr':
                $response = $user->activateUser($data);

                if ($response) {
                    echo json_encode([
                        'success' => true,
                        'message' => 'Usuario activado correctamente'
                    ]);

                    exit;
                }

                echo json_encode([
                    'success' => false,
                    'message' => 'Al parecer no se ha podido activar el usuario.',
                ]);

                exit;
            default:
                echo json_encode([
                    'success' => false,
                    'message' => 'Operación no valida',
                ]);

                exit;
        }
    }

    if ($request->isGet()) {
        $data = $request->getData();

        if (isset($data['code'])) {
            $response = $user->getStoreFromUser($data['code']);

            echo json_encode($response);

            exit;
        }

        echo json_encode([]);

        exit;
    }

    if ($request->isDelete()) {
        $data = $request->getData();

        $validator = new Validator($data);

        $errors = $validator->validate([
            'codigo' => 'required',
            'codigo_tienda' => 'required',
        ]);

        if (count($errors) > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $errors
            ]);

            exit;
        }

        $response = $user->deleteStoreFromUser($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Tienda eliminada correctamente'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido eliminar la tienda.',
        ]);

        exit;
    }
} catch (\Throwable $th) {
    echo json_encode([
        'success' => false,
        'message' => $th->getMessage(),
    ]);

    exit;
}
