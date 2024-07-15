<?php

require __DIR__ . '/../utils/Request.php';
require __DIR__ . '/../utils/Validator.php';
require __DIR__ . '/../models/Proceeding.php';
require __DIR__ . '/../utils/Protection.php';

try {
    $request = new Request();
    $proceeding = new Proceeding();
    $permissions = $proceeding->getSession()->get('access');

    if ($permissions === null || !is_array($permissions)) {
        echo json_encode([
            'success' => false,
            'message' => 'A ocurrido un error, por favor refresque la página.'
        ]);

        exit;
    }

    $protection = new Protection($permissions);

    if (!$protection->has('16') && !$protection->has('11')) {
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
            'tipo' => 'required',
        ]);

        if (count($errors) > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $errors
            ]);

            exit;
        }
//crear acta
        $response = $proceeding->createProceeding($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Acta creada correctamente.'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido crear la acta.',
        ]);

        exit;
    }

    if ($request->isPut()) {
        $data = $request->getData();

        $validator = new Validator($data);

        $errors = $validator->validate([
            'codigo' => 'required',
            'nombre' => 'required',
            'tipo' => 'required',
        ]);

        if (count($errors) > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $errors
            ]);

            exit;
        }
//actualizar acta
        $response = $proceeding->updateProceeding($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Acta actualizada correctamente.'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido actualizar la acta.',
        ]);

        exit;
    }

    if ($request->isGet()) {
        $data = $request->getData();

        if (isset($data['winery'])) {
            $proceeding = $proceeding->getProceedingsForStore();

            echo json_encode($proceeding);

            exit;
        }

        $proceeding = $proceeding->getProceedings();

        echo json_encode($proceeding);

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
//eliminar acta
        $response = $proceeding->deleteProceeding($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Acta eliminada correctamente.'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido eliminar la acta.',
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
