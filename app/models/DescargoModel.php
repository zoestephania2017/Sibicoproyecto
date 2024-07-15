<?php

require_once __DIR__ . '/../connection/Connection.php';

class DescargoModel
{
    private $connection;

    public function __construct()
    {
        $this->connection = (new Connection())->getConnection();
    }

    public function getAllDescargos()
    {
        $sql = "SELECT * FROM descargos";
        $result = $this->connection->query($sql);

        $descargos = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $descargos[] = $row;
            }
        }

        return $descargos;
    }
}
