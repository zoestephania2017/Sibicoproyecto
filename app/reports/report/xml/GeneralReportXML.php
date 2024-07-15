<?php

class GeneralReportXML
{
    protected $model;
    protected $xml;

    public function __construct($model)
    {
        $this->model = $model;
        $this->xml = new XMLWriter();
    }

    public function generate($number = null, $date = null, $expiration = null, $status = null)
    {
        $data = $this->model->getGenerals($number, $date, $expiration, $status);

        $this->addHeadersXML();
        $this->xml->openUri('php://output');
        $this->xml->startDocument('1.0', 'UTF-8');
        $this->xml->setIndent(true);
        $this->xml->setIndentString('    ');

        $this->xml->startElement('registros');

        foreach ($data as $row) {
            $this->xml->startElement('registro');

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
        header('Content-Disposition: attachment; filename="Reporte_general.xml"');
    }

    public function __destruct()
    {
        unset($this->xml);
    }
}
