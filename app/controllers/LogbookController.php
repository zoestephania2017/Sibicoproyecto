<?php

require __DIR__ . '/../utils/Request.php';
require __DIR__ . '/../models/Logbook.php';

try {
    $request = new Request();
    $logbook = new Logbook();

    $request->addHeadersJSON();

    if ($request->isPost()) {
        $data = $request->getData();
        $description = $data['description'] ?? 'No hay descripción';
        $severity = $data['severity'] ?? 'No hay nivel de gravedad';
        $type = $data['type'] ?? 'No hay tipo';
        $results = $data['results'] ?? 'No hay resultados';
        $userID = $data['userID'];

        $logbook->createLogbook($description, $type, $severity, $results, $userID);

        exit;
    }

    if ($request->isGet()) {
        $response = $logbook->getLogbooks();

        echo json_encode($response);

        exit;
    }
} catch (\Throwable $th) {
    echo json_encode([
        'success' => false,
        'message' => $th->getMessage(),
    ]);

    exit;
}
