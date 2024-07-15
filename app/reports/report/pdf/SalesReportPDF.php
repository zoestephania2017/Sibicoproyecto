<?php

require __DIR__ . '/../../lib/fpdf/fpdf.php';

class SalesReportPDF extends FPDF
{
    protected $model;
    protected $totalPages;
    protected $pageLimit = 28;

    public function __construct($model)
    {
        parent::__construct();
        $this->model = $model;
    }

    public function header()
    {
        $this->SetMargins(8.5, 8.5, 8.5);
        $this->SetFont('Arial', 'B', 14);
        $this->Cell(0, 10, 'Reporte de Ventas', 0, 1, 'C');
    }

    public function generate($limit)
    {
        $data = $this->model->getSalesLimit($limit);

        $this->totalPages = ceil(count($data) / $this->pageLimit);

        $this->addTable($data);
    }

    public function addTable($data)
    {
        $headers = array(
            utf8_decode('Código factura'),
            'Numero',
            utf8_decode('Fecha de transacción'),
            'Fecha de vencimiento',
            'Articulo',
            'Cantidad',
            'Descuento',
            'Impuesto',
            'Subtotal',
            'Total'
        );

        $this->SetFillColor(255);
        $this->SetTextColor(0, 0, 0);
        $this->SetLineWidth(0.001);
        $this->SetFont('Arial', 'B', 9);

        $pageWidth = $this->GetPageWidth();
        $totalWidth = $pageWidth - $this->lMargin - $this->rMargin;

        $w = array(
            $totalWidth * 0.1,
            $totalWidth * 0.13,
            $totalWidth * 0.13,
            $totalWidth * 0.13,
            $totalWidth * 0.06,
            $totalWidth * 0.06,
            $totalWidth * 0.09,
            $totalWidth * 0.09,
            $totalWidth * 0.1,
            $totalWidth * 0.1,
            $totalWidth * 0.1
        );

        foreach ($headers as $header) {
            $this->Cell($w[array_search($header, $headers)], 8, $header, 1, 0, 'C', true);
        }
        $this->Ln();

        $this->SetFont('Arial', '', 9);

        foreach ($data as $row) {
            $this->Cell($w[0], 6, utf8_decode($row['codigo_factura']), 1);
            $this->Cell($w[1], 6, utf8_decode($row['numero']), 1);
            $this->Cell($w[2], 6, utf8_decode($row['fecha_transaccion']), 1);
            $this->Cell($w[3], 6, utf8_decode($row['fecha_vencimiento']), 1);
            $this->Cell($w[4], 6, utf8_decode($row['articulo']), 1);
            $this->Cell($w[5], 6, utf8_decode($row['cantidad']), 1);
            $this->Cell($w[6], 6, utf8_decode($row['descuento']), 1);
            $this->Cell($w[7], 6, utf8_decode($row['impuesto']), 1);
            $this->Cell($w[8], 6, utf8_decode($row['sub_total']), 1);
            $this->Cell($w[9], 6, utf8_decode($row['total']), 1);
            $this->Ln();
        }
    }

    public function Footer()
    {
        $this->Ln(4);
        $this->Cell(0, 10, utf8_decode('Página ') . $this->PageNo() . ' de ' . $this->totalPages, 0, 0, 'C');
    }
}
