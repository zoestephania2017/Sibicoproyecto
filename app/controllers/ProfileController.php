<?php

require __DIR__ . '/../utils/Request.php';
require __DIR__ . '/../utils/Validator.php';
require __DIR__ . '/../models/Profile.php';
require __DIR__ . '/../utils/Protection.php';

try {
    $request = new Request();
    $profile = new Profile();
    $permissions = $profile->getSession()->get('access');

    if ($permissions === null || !is_array($permissions)) {
        echo json_encode([
            'success' => false,
            'message' => 'A ocurrido un error, por favor refresque la página.'
        ]);

        exit;
    }

    $protection = new Protection($permissions);

    if (!$protection->has('7')) {
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
        ]);

        if (count($errors) > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $errors
            ]);

            exit;
        }

        $response = $profile->createProfile($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Perfil creadao correctamente.'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido crear el perfil.',
        ]);

        exit;
    }

    if ($request->isPut()) {
        $data = $request->getData();

        $validator = new Validator($data);

        $errors = $validator->validate([
            'codigo' => 'required',
            'nombre' => 'required',
        ]);

        if (count($errors) > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $errors
            ]);

            exit;
        }

        $response = $profile->updateProfile($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Perfil actualizado correctamente.'
            ]);

            exit;
        }
    }

    if ($request->isGet()) {
        $profile = $profile->getProfiles();

        echo json_encode($profile);

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

        $response = $profile->deleteProfile($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Perfil eliminado correctamente.'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido eliminar el perfil.',
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
