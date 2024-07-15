<?php

require __DIR__ . '/../utils/Request.php';
require __DIR__ . '/../utils/Validator.php';
require __DIR__ . '/../models/User.php';

try {
    $request = new Request();
    $user = new User();

    $request->addHeadersJSON();

    if ($request->isPut()) {
        $data = $request->getData();

        if (isset($data['type'])) {
            switch ($data['type']) {
                case 'account':
                    $validator = new Validator($data);

                    $errors = $validator->validate([
                        'nombre' => 'required',
                        'apellido' => 'required',
                        'direccion' => 'required',
                        'telefono_fijo' => 'required',
                        'telefono_movil' => 'required',
                    ]);

                    if (count($errors) > 0) {
                        echo json_encode([
                            'success' => false,
                            'message' => 'Error de validación',
                            'errors' => $errors
                        ]);

                        exit;
                    }

                    $response = $user->updateAccount($data);

                    if ($response) {
                        echo json_encode([
                            'success' => true,
                            'message' => 'Información de usuario actualizada correctamente.'
                        ]);

                        exit;
                    }

                    echo json_encode([
                        'success' => false,
                        'message' => 'Al parecer no se ha podido actualizar la información de usuario.',
                    ]);

                    exit;
                case 'change':
                    $validator = new Validator($data);

                    $errors = $validator->validate([
                        'clave_actual' => 'required',
                        'clave_nueva' => 'required',
                        'clave_confirmar' => 'required',
                    ]);

                    if (count($errors) > 0) {
                        echo json_encode([
                            'success' => false,
                            'message' => 'Error de validación',
                            'errors' => $errors
                        ]);

                        exit;
                    }

                    if (!$user->isCurrentPassword($data)) {
                        echo json_encode([
                            'success' => false,
                            'message' => 'La contraseña actual es incorrecta.',
                        ]);

                        exit;
                    }

                    if ($data['clave_nueva'] !== $data['clave_confirmar']) {
                        echo json_encode([
                            'success' => false,
                            'message' => 'Las contraseñas no coinciden.',
                        ]);

                        exit;
                    }

                    $response = $user->changePassword($data);

                    if ($response) {
                        echo json_encode([
                            'success' => true,
                            'message' => 'Contraseña actualizada correctamente.'
                        ]);

                        exit;
                    }

                    echo json_encode([
                        'success' => false,
                        'message' => 'Al parecer no se ha podido actualizar la información de usuario.',
                    ]);

                    exit;
                default:
                    echo json_encode([
                        'success' => false,
                        'message' => 'Error de validación',
                    ]);

                    exit;
            }
        }
    }

    if ($request->isGet()) {
        $users = $user->getUserAuthenticated();

        echo json_encode($users);

        exit;
    }
} catch (\Throwable $th) {
    echo json_encode([
        'success' => false,
        'message' => $th->getMessage(),
    ]);

    exit;
}
