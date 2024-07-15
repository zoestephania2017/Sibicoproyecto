<?php

require __DIR__ . '/../utils/Request.php';
require __DIR__ . '/../utils/Validator.php';
require __DIR__ . '/../models/Serie.php';
require __DIR__ . '/../utils/Protection.php';

try {
    $request = new Request();
    $serie = new Serie();
    $permissions = $serie->getSession()->get('access');

    if ($permissions === null || !is_array($permissions)) {
        echo json_encode([
            'success' => false,
            'message' => 'A ocurrido un error, por favor refresque la página.'
        ]);

        exit;
    }

    $protection = new Protection($permissions);

    if (!$protection->has('14')) {
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
            'serie' => 'required',
        ]);

        if (count($errors) > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $errors
            ]);

            exit;
        }

        $response = $serie->createSerie($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Serie creada correctamente'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido crear la serie.',
        ]);

        exit;
    }

    if ($request->isGet()) {
        $data = $request->getData();

        if (isset($data['product'])) {
            $series = $serie->getSeriesForProduct($data['product']);

            echo json_encode($series);

            exit;
        }
    }

    if ($request->isDelete()) {
        $data = $request->getData();

        $validator = new Validator($data);

        $errors = $validator->validate([
            'codigo' => 'required',
            'serie' => 'required'
        ]);

        if (count($errors) > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $errors
            ]);

            exit;
        }

        $response = $serie->deleteSerieForProduct($data['codigo'], $data['serie']);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Serie eliminada correctamente'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido eliminar la serie.',
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
