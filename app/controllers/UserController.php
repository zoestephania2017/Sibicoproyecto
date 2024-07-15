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

    if (!$protection->has('5') && !$protection->has('7')) {
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
            'nombre' => 'required',
            'apellido' => 'required',
            'usuario' => 'required',
            'direccion' => 'required',
            'telefono_fijo' => 'required',
            'telefono_movil' => 'required',
            'perfil' => 'required',
        ]);

        if (count($errors) > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $errors
            ]);

            exit;
        }

        $response = $user->createUser($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Acceso creado correctamente'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido crear el acceso.',
        ]);

        exit;
    }

    if ($request->isPut()) {
        $data = $request->getData();

        $validator = new Validator($data);

        $errors = $validator->validate([
            'codigo' => 'required',
            'nombre' => 'required',
            'apellido' => 'required',
            'direccion' => 'required',
            'telefono_fijo' => 'required',
            'telefono_movil' => 'required',
            'perfil' => 'required',
        ]);

        if (count($errors) > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $errors
            ]);

            exit;
        }

        $response = $user->updateUser($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Acceso actualizado correctamente'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido actualizar el acceso.',
        ]);

        exit;
    }

    if ($request->isGet()) {
        $users = $user->getUsers();

        echo json_encode($users);

        exit;
    }

    if ($request->isDelete()) {
        $data = $request->getData();

        $validator = new Validator($data);

        $errors = $validator->validate([
            'codigo' => 'required',
        ]);

        if (count($errors) > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $errors
            ]);

            exit;
        }

        $response = $user->deleteUser($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Acceso eliminado correctamente'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido actualizar el acceso.',
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
