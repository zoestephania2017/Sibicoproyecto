<?php

class GeneralReportPDF extends FPDF
{
    protected $model;
    protected $totalPages;
    protected $pageLimit = 29;

    public function __construct($model)
    {
        parent::__construct();
        $this->model = $model;
    }

    public function header()
    {
        $this->SetMargins(5.5, 5.5, 5.5);
        $this->SetFont('Arial', 'B', 14);
        $this->Cell(0, 10, 'Reporte general', 0, 1, 'C');
    }

    public function generate($number = null, $date = null, $expiration = null, $status = null)
    {
        $data = $this->model->getGenerals($number, $date, $expiration, $status);

        $this->totalPages = ceil(count($data) / $this->pageLimit);

        $this->addTable($data);
        $this->Ln(1);
        $this->Cell(0, 6, 'Total: ' . $this->getSumTotals($data), 0, 1, 'R');
    }

    public function addTable($data)
    {
        $headers = array(
            utf8_decode('Código factura'),
            'Numero',
            utf8_decode('Fecha de transacción'),
            'Cliente',
            'Responsable',
            'Estado',
            'Descuento',
            'Impuesto',
            'Subtotal',
            'Total'
        );

        $this->SetFillColor(255);
        $this->SetTextColor(0, 0, 0);
        $this->SetLineWidth(0.001);
        $this->SetFont('Arial', 'B', 8);

        $pageWidth = $this->GetPageWidth();
        $totalWidth = $pageWidth - $this->lMargin - $this->rMargin;

        $w = array(
            $totalWidth * 0.08,
            $totalWidth * 0.12,
            $totalWidth * 0.13,
            $totalWidth * 0.16,
            $totalWidth * 0.16,
            $totalWidth * 0.08,
            $totalWidth * 0.07,
            $totalWidth * 0.07,
            $totalWidth * 0.07,
            $totalWidth * 0.07
        );

        foreach ($headers as $header) {
            $this->Cell($w[array_search($header, $headers)], 8, $header, 1, 0, 'C', true);
        }
        $this->Ln();

        $this->SetFont('Arial', '', 8);

        foreach ($data as $row) {
            $this->Cell($w[0], 6, utf8_decode($row['codigo_factura']), 1);
            $this->Cell($w[1], 6, utf8_decode($row['numero']), 1);
            $this->Cell($w[2], 6, utf8_decode($row['fecha_transaccion']), 1);

            $cliente = $this->capitaliceString(utf8_decode($row['cliente']));

            if (strlen($cliente) > 20) {
                $cliente = substr($cliente, 0, 25) . '...';
            }
            $this->Cell($w[3], 6, $cliente, 1);

            $responsable = $this->capitaliceString(utf8_decode($row['responsable']));
            if (strlen($responsable) > 20) {
                $responsable = substr($responsable, 0, 25) . '...';
            }
            $this->Cell($w[4], 6, $responsable, 1);

            $this->Cell($w[5], 6, utf8_decode($row['estado']), 1);
            $this->Cell($w[6], 6, utf8_decode($row['descuento']), 1);
            $this->Cell($w[7], 6, utf8_decode($row['impuesto']), 1);
            $this->Cell($w[8], 6, utf8_decode($row['sub_total']), 1);
            $this->Cell($w[9], 6, utf8_decode($row['total']), 1);
            $this->Ln();
        }
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

    public function capitaliceString($string)
    {
        return ucwords(strtolower($string));
    }

    public function Footer()
    {
        $this->Ln(4);
        $this->Cell(0, 10, utf8_decode('Página ') . $this->PageNo() . ' de ' . $this->totalPages, 0, 0, 'C');
    }
}
