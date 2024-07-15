<?php

require __DIR__ . '/../utils/Request.php';
require __DIR__ . '/../utils/Validator.php';
require __DIR__ . '/../models/Repayment.php';
require __DIR__ . '/../utils/Protection.php';

try {
    $request = new Request();
    $repayment = new Repayment();
    $permissions = $repayment->getSession()->get('access');

    if ($permissions === null || !is_array($permissions)) {
        echo json_encode([
            'success' => false,
            'message' => 'A ocurrido un error, por favor refresque la página.'
        ]);

        exit;
    }

    $protection = new Protection($permissions);

    if (!$protection->has('12')) {
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
            'codigo_factura' => 'required',
            'cliente' => 'required',
            'responsable' => 'required',
            'fecha_transaccion' => 'required',
            'fecha_vencimiento' => 'required',
        ]);

        if (count($errors) > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $errors
            ]);

            exit;
        }

        $response = $repayment->createRepayment($data);

        if ($response) {
            echo json_encode([
                'success' => true,
                'message' => 'Devolución creada correctamente.'
            ]);

            exit;
        }

        echo json_encode([
            'success' => false,
            'message' => 'Al parecer no se ha podido crear la devolución.',
        ]);

        exit;
    }

    if ($request->isGet()) {
        $data = $request->getData();

        if (isset($data['id'])) {
            $response = $repayment->getRepayment($data['id']);

            echo json_encode($response);

            exit;
        }

        if (isset($data['repayment'])) {
            $repayments = $repayment->getRepaymentForInvoice($data['repayment']);

            echo json_encode($repayments);

            exit;
        }

        $repayments = $repayment->getRepayments();

        echo json_encode($repayments);

        exit;
    }

    if ($request->isPut()) {
        $data = $request->getData();

        $validator = new Validator($data);
    }

    if ($request->isDelete()) {
        $data = $request->getData();

        $validator = new Validator($data);
    }
} catch (\Throwable $th) {
    echo json_encode([
        'success' => false,
        'message' => $th->getMessage(),
    ]);

    exit;
}
