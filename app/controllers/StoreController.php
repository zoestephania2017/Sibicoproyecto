<?php

require __DIR__ . '/../utils/Request.php';
require __DIR__ . '/../utils/Validator.php';
require __DIR__ . '/../models/Winery.php';
require __DIR__ . '/../utils/Protection.php';

try {
    $request = new Request();
    $winery = new Winery();
    $permissions = $winery->getSession()->get('access');

    if ($permissions === null || !is_array($permissions)) {
        echo json_encode([
            'success' => false,
            'message' => 'A ocurrido un error, por favor refresque la página.'
        ]);

        exit;
    }

    $protection = new Protection($permissions);

    if (!$protection->has('6')) {
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
            'direccion' => 'required',
            'rtn' => 'required',
            'telefono' => 'required',
            'fecha_limite_emision' => 'required',
            'cai' => 'required',
            'orden_compra' => 'required',
            'exoneraciones' => 'required',
            'agricultura' => 'required',
            'facturai' => 'required',
            'facturaf' => 'required',
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
        $response = $winery->createStore($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Tienda creado correctamente'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido crear la tienda.',
        ]);

        exit;
    }

    if ($request->isPut()) {
        $data = $request->getData();

        $validator = new Validator($data);

        $errors = $validator->validate([
            'codigo' => 'required',
            'nombre' => 'required',
            'direccion' => 'required',
            'rtn' => 'required',
            'telefono' => 'required',
            'fecha_limite_emision' => 'required',
            'cai' => 'required',
            'orden_compra' => 'required',
            'exoneraciones' => 'required',
            'agricultura' => 'required',
            'facturai' => 'required',
            'facturaf' => 'required',
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

        $response = $winery->updateStore($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Tienda actualizada correctamente'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido actualizar la tienda.',
        ]);

        exit;
    }

    if ($request->isGet()) {
        $wineries = $winery->getWineries();

        echo json_encode($wineries);

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

        $response = $winery->deleteStore($data);

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
