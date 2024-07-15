<?php

require __DIR__ . '/../../../../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class CutReportXLSX
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

    public function generate($date = null)
    {
        $data = $this->model->getCuts($date);

        $headers = array_keys((array) $data[0]);

        $this->sheet->fromArray([$headers], NULL, 'A1');

        $this->sheet->getStyle('A1:' . $this->sheet->getHighestColumn() . '1')
            ->getFont()
            ->setBold(true);

        $this->sheet->getStyle('A1:' . $this->sheet->getHighestColumn() . '1')
            ->getAlignment()
            ->setHorizontal(Alignment::HORIZONTAL_LEFT);

        $this->sheet->fromArray($data, NULL, 'A2');

        foreach (range('A', $this->sheet->getHighestColumn()) as $column) {
            $this->sheet->getColumnDimension($column)
                ->setAutoSize(true);
        }

        $total = $this->getSumTotals($data);

        $lastRow = $this->sheet->getHighestRow();

        $this->sheet->setCellValue('A' . ($lastRow + 1), 'Total:');
        $this->sheet->setCellValue('B' . ($lastRow + 1), $total);

        $style = array(
            'font' => array(
                'bold' => true,
            ),
            'alignment' => array(
                'horizontal' => Alignment::HORIZONTAL_RIGHT,
            ),
        );

        $this->sheet->getStyle('A' . ($lastRow + 1) . ':B' . ($lastRow + 1))->applyFromArray($style);

        $this->sheet->getColumnDimension('A')->setAutoSize(true);
        $this->sheet->getColumnDimension('B')->setAutoSize(true);

        $this->sheet->getStyle('B' . ($lastRow + 1))->getNumberFormat()->setFormatCode('#,##0.00');

        $this->xlsx = new Xlsx($this->spreadsheet);

        ob_start();
        $this->xlsx->save('php://output');
        $xlsxContent = ob_get_clean();

        $this->addHeadersXLSX();
        echo $xlsxContent;
    }

    public function getSumTotals($data)
    {
        $total = 0;

        foreach ($data as $row) {
            $total += floatval($row['total']);
        }

        $total = number_format($total, 2, '.', '');

        return $total;
    }

    public function addHeadersXLSX()
    {
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="Reporte_corte_diario.xlsx"');
    }
}
