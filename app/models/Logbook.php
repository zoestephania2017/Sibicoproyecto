<?php

require __DIR__ . '/../../connection/Connection.php';

class Logbook
{
    protected $table = 'bitacora';
    protected $connection;

    public function __construct()
    {
        $connection = new Connection();
        $this->connection = $connection->getConnection();
    }

    public function getLogbooks(): array
    {
        $query = "
            SELECT 
                CONCAT('[', fecha, '] [', tipo, '] [', usuario.usuario, '] [', nivel_gravedad, '] [', resultado, '] ', descripcion) AS log
            FROM 
                $this->table
            INNER JOIN
                usuario
            ON 
                usuario.correlativo = $this->table.usuario
            ORDER BY 
                id DESC
        ";

        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            $response = [];

            while ($row = mysqli_fetch_assoc($result)) {
                $response[] = $row['log'];
            }

            return $response;
        }

        return [];
    }

    public function createLogbook($description, $type, $severity, $results, $userID)
    {
        $description = htmlspecialchars(mysqli_real_escape_string($this->connection, $description));
        $type = htmlspecialchars(mysqli_real_escape_string($this->connection, $type));
        $severity = htmlspecialchars(mysqli_real_escape_string($this->connection, $severity));
        $results = htmlspecialchars(mysqli_real_escape_string($this->connection, $results));
        $userID = htmlspecialchars(mysqli_real_escape_string($this->connection, $userID));
        $date = date('Y-m-d H:i:s', time());

        $query = "
            INSERT INTO $this->table (descripcion, fecha, usuario, tipo, nivel_gravedad, resultado) 
            VALUES ('$description', '$date', '$userID', '$type', '$severity', '$results')
        ";

        $result = mysqli_query($this->connection, $query);

        return $result;
    }

    public function __destruct()
    {
        $this->connection->close();
    }
}
