<?php

require_once __DIR__ . '/../models/CargoModel.php';

class CargoController
{
    private $cargoModel;

    public function __construct()
    {
        $this->cargoModel = new CargoModel();
    }

    public function index()
    {
        $cargos = $this->cargoModel->getAllCargos();
        require_once __DIR__ . '/../views/cargo_view.php';
    }
}

