<?php

require __DIR__ . '/../utils/Request.php';
require __DIR__ . '/../utils/Validator.php';
require __DIR__ . '/../models/Models.php';
require __DIR__ . '/../utils/Protection.php';

try {
    $request = new Request();
    $models = new Models();
    $permissions = $models->getSession()->get('access');

    if ($permissions === null || !is_array($permissions)) {
        echo json_encode([
            'success' => false,
            'message' => 'A ocurrido un error, por favor refresque la página.'
        ]);

        exit;
    }

    $protection = new Protection($permissions);

    if (!$protection->has('2') && !$protection->has('3') && !$protection->has('1')) {
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
            'nombre_modelo' => 'required',
            'codigo_marca' => 'required',
        ]);

        if (count($errors) > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $errors
            ]);

            exit;
        }

        $response = $models->createModel($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Modelo creado correctamente'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido crear el modelo.',
        ]);

        exit;
    }

    if ($request->isGet()) {
        $models = $models->getModels();

        echo json_encode($models);

        exit;
    }

    if ($request->isPut()) {
        $data = $request->getData();

        $validator = new Validator($data);

        $errors = $validator->validate([
            'codigo' => 'required',
            'nombre_modelo' => 'required',
            'codigo_marca' => 'required',
        ]);

        if (count($errors) > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $errors
            ]);

            exit;
        }

        $response = $models->updateModel($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Modelo actualizado correctamente'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido actualizar el modelo.',
        ]);

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

        $response = $models->deleteModel($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Modelo eliminado correctamente'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido eliminar el modelo.',
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
