<?php

require_once __DIR__ . '/../connection/Connection.php';

class CargoModel
{
    private $connection;

    public function __construct()
    {
        $this->connection = (new Connection())->getConnection();
    }

    public function getAllCargos()
    {
        $sql = "SELECT * FROM cargos";
        $result = $this->connection->query($sql);

        $cargos = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $cargos[] = $row;
            }
        }

        return $cargos;
    }
}
