<?php

require_once __DIR__ . '/../connection/Connection.php';

class CustodiaModel
{
    private $connection;

    public function __construct()
    {
        $this->connection = (new Connection())->getConnection();
    }

    public function getAllCustodias()
    {
        $sql = "SELECT * FROM custodias";
        $result = $this->connection->query($sql);

        $custodias = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $custodias[] = $row;
            }
        }

        return $custodias;
    }
}

