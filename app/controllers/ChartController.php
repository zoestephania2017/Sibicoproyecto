<?php
require __DIR__ . '/../utils/Request.php';
require __DIR__ . '/../models/Chart.php';

try {
    $request = new Request();
    $chart = new Chart();

    $request->addHeadersJSON();

    if ($request->isGet()) {
        $data = $request->getData();
        $option = $data['option'] ?? null;

        switch ($option) {
            case 'stockByStore':
                $stocksByStore = $chart->stockByStore();

                echo json_encode($stocksByStore);

                exit;
            case 'activeInactiveUsers':
                $activeInactiveUsers = $chart->getActiveInactiveUserCount();

                echo json_encode($activeInactiveUsers);

                exit;
            case 'distributionOfSalesByTypeOfDocument':
                $distributionOfSalesByTypeOfDocument = $chart->distributionOfSalesByTypeOfDocument();

                echo json_encode($distributionOfSalesByTypeOfDocument);

                exit;
            case 'comparisonOfSalesBetweenStores':
                $comparisonOfSalesBetweenStores = $chart->comparisonOfSalesBetweenStores();

                echo json_encode($comparisonOfSalesBetweenStores);

                exit;
        }
    }
} catch (\Throwable $th) {
    echo json_encode([
        'success' => false,
        'message' => $th->getMessage(),
    ]);

    exit;
}
