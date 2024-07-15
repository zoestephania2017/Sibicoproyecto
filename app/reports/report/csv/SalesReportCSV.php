<?php

require __DIR__ . '/../../../../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Csv;

class SalesReportCSV
{
    protected $model;
    protected $csv;
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
        $this->sheet->fromArray($headers, NULL, 'A1');

        $rowIndex = 2;
        foreach ($data as $row) {
            $rowData = array_values((array) $row);
            $this->sheet->fromArray($rowData, NULL, 'A' . $rowIndex);
            $rowIndex++;
        }

        $this->csv = new Csv($this->spreadsheet);
        $this->csv->setUseBOM(true);
        $this->csv->setDelimiter(';');
        $this->csv->setEnclosure('"');
        $this->csv->setLineEnding("\r\n");
        $this->csv->setOutputEncoding('UTF-8');

        $this->addHeadersCSV();

        $this->csv->save('php://output');
    }

    public function addHeadersCSV()
    {
        header('Content-Type: application/csv');
        header('Content-Disposition: attachment; filename="Reporte_de_ventas.csv"');
    }
}
