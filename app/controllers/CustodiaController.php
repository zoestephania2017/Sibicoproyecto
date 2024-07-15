<?php

require_once __DIR__ . '/../models/CustodiaModel.php';

class CustodiaController
{
    private $custodiaModel;

    public function __construct()
    {
        $this->custodiaModel = new CustodiaModel();
    }

    public function index()
    {
        $custodias = $this->custodiaModel->getAllCustodias();
        require_once __DIR__ . '/../views/custodia_view.php';
    }
}
