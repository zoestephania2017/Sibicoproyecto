<?php

require __DIR__ . '/../utils/Log.php';

class Model extends Log
{
    public function getNextId($table, $connection, $field = 'codigo')
    {
        $query = "SELECT MAX($field) FROM $table";

        $result = mysqli_query($connection, $query);

        if (mysqli_num_rows($result) > 0) {
            return mysqli_fetch_assoc($result)['MAX(' . $field . ')'] + 1;
        }

        return 1;
    }

    public function createMask($code, $length = 6): string
    {
        return str_pad($code, $length, "0", STR_PAD_LEFT);
    }

    public function createLogbook($connection, $description, $type, $severity, $results, $userID)
    {
        $description = htmlspecialchars(mysqli_real_escape_string($connection, $description));
        $type = htmlspecialchars(mysqli_real_escape_string($connection, $type));
        $severity = htmlspecialchars(mysqli_real_escape_string($connection, $severity));
        $results = htmlspecialchars(mysqli_real_escape_string($connection, $results));
        $userID = htmlspecialchars(mysqli_real_escape_string($connection, $userID));
        $date = date('Y-m-d H:i:s', time());

        $query = "
            INSERT INTO bitacora (descripcion, fecha, usuario, tipo, nivel_gravedad, resultado) 
            VALUES ('$description', '$date', $userID, '$type', '$severity', '$results')
        ";

        $result = mysqli_query($connection, $query);

        return $result;
    }
}
