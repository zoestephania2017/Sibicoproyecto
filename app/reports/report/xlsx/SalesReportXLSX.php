<?php

require __DIR__ . '/../../../../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class SalesReportXLSX
{
    protected $model;
    protected $xlsx;
    protected $spreadsheet;
    protected $sheet;

    public function __construct($model)
    {
        $this->model = $model;
        $this->spreadsheet = new Spreadsheet();
        $this->sheet = $this->spreadsheet->getActiveSheet();
    }

    public function generate($limit)
    {
        $data = $this->model->getSalesLimit($limit);

        $headers = array_keys((array) $data[0]);

        $this->sheet->fromArray([$headers], NULL, 'A1');

        $this->sheet->getStyle('A1:' . $this->sheet->getHighestColumn() . '1')
            ->getFont()->setBold(true);

        $this->sheet->getStyle('A1:' . $this->sheet->getHighestColumn() . '1')
            ->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);

        $this->sheet->fromArray($data, NULL, 'A2');

        foreach (range('A', $this->sheet->getHighestColumn()) as $column) {
            $this->sheet->getColumnDimension($column)->setAutoSize(true);
        }

        $this->xlsx = new Xlsx($this->spreadsheet);

        ob_start();
        $this->xlsx->save('php://output');
        $xlsxContent = ob_get_clean();

        $this->addHeadersXLSX();
        echo $xlsxContent;
    }

    public function addHeadersXLSX()
    {
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="Reporte_de_ventas.xlsx"');
    }
}
