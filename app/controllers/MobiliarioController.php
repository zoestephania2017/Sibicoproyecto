<?php

require_once 'models/MobiliarioModel.php';

class MobiliarioController {
    private $model;

    public function __construct($database) {
        $this->model = new MobiliarioModel($database);
    }

    public function index() {
        $mobiliarios = $this->model->getAllMobiliarios();
        require 'views/tabla_mobiliario.php';
    }

    public function create() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = [
                'nombre' => $_POST['textNombreMobiliario'],
                'cantidad' => $_POST['textCantidad'],
                'fecha_adq' => $_POST['textFechaAdqMobiliario'],
                'tipo' => $_POST['tipomob'],
                'valor' => $_POST['textvalorMobiliario'],
                'moneda' => $_POST['textTmonedaMobiliario'],
                'adquisicion' => $_POST['adqui'],
                'estado' => $_POST['estado']
            ];
            $this->model->addMobiliario($data);
            header('Location: index.php?action=index');
        } else {
            $tipos = $this->model->getTiposMobiliarios();
            $estados = $this->model->getEstados();
            require 'views/nuevo_mobiliario.php';
        }
    }
}
