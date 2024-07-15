<?php

require __DIR__ . '/../lib/fpdf/fpdf.php';

class ConsignmentReport extends FPDF
{
    protected $model;

    public function __construct($model)
    {
        parent::__construct();
        $this->model = $model;
    }

    public function Header()
    {
        $this->SetMargins(8.5, 8.5, 8.5);
        $this->Image(__DIR__ . '/../../../src/img/logo_2_large.jpg', 85, 20, 30);
        $this->SetFont('Arial', 'B', 14);
        $this->Ln(32);
        $this->Cell(0, 2, utf8_decode(substr("SECRETARIA EN LOS DESPACHOS DE GESTIÓN DE RIESGOS", 0, 80)), 0, 0, 'C');
        $this->SetFont('Arial', 'B', 14);
        $this->Ln(5);
        $this->Cell(0, 2, substr("Y CONTINGENCIAS NACIONALES", 0, 80), 0, 0, 'C');
        $this->SetFont('Arial', 'B', 14);
        $this->Ln(5);
        $this->Cell(0, 2, substr("(COPECO)", 0, 60), 0, 0, 'C');
        $this->SetFont('Arial', 'B', 14);

        $this->Ln(1);
    }

    public function addContentForID($id)
    {
        $this->SetFont('Arial', '', 14);
        $this->Ln(5);

        $consignment = $this->model->getConsignment($id);
        $details = $consignment[0]['details'];
        $winery = $this->model->getSession()->get('winery');

        $this->SetFont('Arial', 'B', 14);
        $this->Cell(0, 2, utf8_decode('ACTA DE CONSIGNACIÓN'), 0, 0, 'C');
        $this->SetFont('Arial', 'B', 12);
        $this->Cell(0, 15, 'ACTA #', 0, 0, 'R');
        $this->Ln(9);
        $this->SetFont('Arial', '', 12);
        $this->Cell(0, 5, $consignment[0]['numero'], 0, 0, 'R');

        $this->Ln(2);
        $this->Cell(1);
        $this->SetFont('Arial', 'B', 9);
        $this->Cell(25, 5, utf8_decode('Fecha Emisión: '), 0, 0, 'L');
        $this->SetFont('Arial', '', 9);
        $this->Cell(2, 5, formatDate($consignment[0]['fecha_creacion']), 0, 0, 'L');
        $this->Ln(1);

        $this->Ln(3);
        $this->Cell(1);
        $this->SetFont('Arial', 'B', 9);
        $this->Cell(25, 5, 'Beneficiario: ', 0, 0, 'L');
        $this->SetFont('Arial', '', 9);
        $this->Cell(2, 5, utf8_decode($consignment[0]['cliente']), 0, 0, 'L');
        $this->Ln(3);

        $this->Ln(1);
        $this->Cell(1);
        $this->SetFont('Arial', 'B', 9);
        $this->Cell(25, 5, 'Responsable: ', 0, 0, 'L');
        $this->SetFont('Arial', '', 9);
        $this->Cell(2, 5, utf8_decode($consignment[0]['responsable']), 0, 0, 'L');
        $this->Ln(7);

        $this->addTable($details);

        $this->Ln(3);
        $this->Cell(1);
        $this->SetFont('Arial', 'B', 7);
        $this->Cell(7, 3, 'Nota: ', 0, 0, 'L');
        $this->Ln(3);
        $this->Cell(1);
        $this->SetFont('Helvetica', '', 7);
        $this->MultiCell(0, 3, utf8_decode($consignment[0]['nota']), 'C');

        $this->Ln(9);
        $this->SetFont('Arial', 'B', 9);
        $this->Cell(30, 3, 'Entrega Conforme', 0, 0, 'L');
        $this->Ln(1);

        $this->Ln(0);
        $this->SetFont('Arial', 'B', 9);
        $this->Cell(160, 3, 'Recibe Conforme', 0, 0, 'R');
        $this->Ln(1);

        $this->Ln(9);
        $this->SetFont('Arial', '', 8);
        $this->Cell(0, 0, 'Nombre: __________________________', 0, 0, 'L');

        $this->Ln(7);
        $this->SetFont('Arial', '', 8);
        $this->Cell(0, 0, 'Firma: ____________________________', 0, 0, 'L');

        $this->Ln(7);
        $this->SetFont('Arial', '', 8);
        $this->Cell(0, 0, 'Cargo: ____________________________', 0, 0, 'L');
        $this->Ln(12);

        $this->Ln(-26);
        $this->SetFont('Arial', '', 8);
        $this->Cell(0, 0, 'Nombre: __________________________', 0, 0, 'R');

        $this->Ln(7);
        $this->SetFont('Arial', '', 8);
        $this->Cell(0, 0, 'Firma: __________________________', 0, 0, 'R');

        $this->Ln(7);
        $this->SetFont('Arial', '', 8);
        $this->Cell(0, 0, 'Identidad: __________________________', 0, 0, 'R');

        $this->Ln(7);
        $this->SetFont('Arial', '', 8);
        $this->Cell(0, 0, utf8_decode('Teléfono: __________________________'), 0, 0, 'R');
        $this->Ln(3);

        $this->Ln(8);
        $this->SetFont('Arial', '', 8);
        $this->Cell(0, 9.5, '_______________________________________', 0, 0, 'C');

        $this->Ln(4);
        $this->SetFont('Arial', '', 8);
        $this->Cell(0, 9.5, $winery['cai'], 0, 0, 'C');

        $this->Ln(8);
        $this->SetFont('Arial', '', 8);
        $this->Cell(0, 2, 'JEFE BODEGA ', 20, 0, 'C');
    }

    public function addTable($details)
    {
        $headers = array('Cantidad', utf8_decode('Descripción'), 'Total');
        $this->SetFillColor(255);
        $this->SetTextColor(0, 0, 0);
        $this->SetLineWidth(0.001);
        $this->SetFont('Arial', 'B', 8);

        $pageWidth = $this->GetPageWidth();
        $totalWidth = $pageWidth - $this->lMargin - $this->rMargin;

        $w = array($totalWidth * 0.2, $totalWidth * 0.6, $totalWidth * 0.2);

        for ($i = 0; $i < count($headers); $i++) {
            $this->Cell($w[$i], 4, $headers[$i], 1, 0, 'C', true);
        }

        $this->Ln();
        $this->SetFont('Arial', '', 8);

        foreach ($details as $detail) {
            $this->Cell($w[0], 4, utf8_decode($detail['cantidad']), 'LR');
            $this->Cell($w[1], 4, utf8_decode($detail['descripcion']), 'LR');
            $this->Cell($w[2], 4, utf8_decode($detail['total']), 'LR', 1, 'R');
        }

        $this->Cell(array_sum($w), 0, '', 'T');
    }

    public function Footer()
    {
        $winery = $this->model->getSession()->get('winery');

        $this->Ln(2);
        $this->Ln(3);
        $this->SetY(-20);
        $this->SetFont('Arial', 'I', 6);
        $this->Cell(0, 10, $winery['direccion'], 0, 0, 'C');
        $this->SetY(-20);
        $this->SetFont('Arial', 'I', 6);
        $this->Cell(0, 17, 'PBX (504)' . $winery['telefono'], 0, 0, 'C');
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->Ln(4);
        $this->Cell(0, 10, 'Page ' . $this->PageNo(), 0, 0, 'C');
    }
}
