<?php

class CutReportXML
{
    protected $model;
    protected $xml;

    public function __construct($model)
    {
        $this->model = $model;
        $this->xml = new XMLWriter();
    }

    public function generate($date = null)
    {
        $data = $this->model->getCuts($date);

        $this->addHeadersXML();
        $this->xml->openUri('php://output');
        $this->xml->startDocument('1.0', 'UTF-8');
        $this->xml->setIndent(true);
        $this->xml->setIndentString('    ');

        $this->xml->startElement('cortes_diarios');

        foreach ($data as $row) {
            $this->xml->startElement('corte_diario');

            foreach ($row as $key => $value) {
                $this->xml->startElement($key);
                $this->xml->text($value);
                $this->xml->endElement();
            }

            $this->xml->endElement();
        }

        $this->xml->endElement();
        $this->xml->endDocument();
        $this->xml->flush();
    }

    public function addHeadersXML()
    {
        header('Content-Type: text/xml');
        header('Content-Disposition: attachment; filename="Reporte_corte_diario.xml"');
    }

    public function __destruct()
    {
        unset($this->xml);
    }
}
