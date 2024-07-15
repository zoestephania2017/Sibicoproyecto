<?php
require_once 'models/Bien.php';

class BienesController {
    private $model;

    public function __construct() {
        $this->model = new Bien();
    }

    public function showView($view) {
        switch ($view) {
            case 'asignacion':
                require 'views/asignacion_view.php';
                break;
            case 'custodia':
                require 'views/custodia_view.php';
                break;
            case 'descargo':
                require 'views/descargo_view.php';
                break;
            case 'pase_salida':
                require 'views/pase_salida_view.php';
                break;
            default:
                require 'views/default_view.php';
                break;
        }
    }
}
