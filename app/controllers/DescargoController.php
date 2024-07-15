<?php

require_once __DIR__ . '/../models/DescargoModel.php';

class DescargoController
{
    private $descargoModel;

    public function __construct()
    {
        $this->descargoModel = new DescargoModel();
    }

    public function index()
    {
        $descargos = $this->descargoModel->getAllDescargos();
        require_once __DIR__ . '/../views/descargo_view.php';
    }
}
