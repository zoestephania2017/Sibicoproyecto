<?php

class MobiliarioModel {
    private $db;

    public function __construct($database) {
        $this->db = $database;
    }

    public function getAllMobiliarios() {
        $query = "SELECT * FROM mobiliarios WHERE Actividad_Mobiliario = '0'";
        $result = mysqli_query($this->db, $query);
        return mysqli_fetch_all($result, MYSQLI_ASSOC);
    }

    public function addMobiliario($data) {
        $nombre = $data['nombre'];
        $cantidad = $data['cantidad'];
        $fecha_adq = $data['fecha_adq'];
        $tipo = $data['tipo'];
        $valor = $data['valor'];
        $moneda = $data['moneda'];
        $adquisicion = $data['adquisicion'];
        $estado = $data['estado'];

        $query = "INSERT INTO mobiliarios (Nombre_Mobiliario, Cantidad, FechaAdq_Mobiliario, ID_TipoMobiliario, ValorUnd_Mobiliario, Tmoneda_Mobiliario, Adquisicion_Mobilario, ID_Estado) 
                  VALUES ('$nombre', '$cantidad', '$fecha_adq', '$tipo', '$valor', '$moneda', '$adquisicion', '$estado')";

        return mysqli_query($this->db, $query);
    }

    public function getTiposMobiliarios() {
        $query = "SELECT * FROM tiposmobiliarios";
        $result = mysqli_query($this->db, $query);
        return mysqli_fetch_all($result, MYSQLI_ASSOC);
    }

    public function getEstados() {
        $query = "SELECT * FROM estados";
        $result = mysqli_query($this->db, $query);
        return mysqli_fetch_all($result, MYSQLI_ASSOC);
    }
}
