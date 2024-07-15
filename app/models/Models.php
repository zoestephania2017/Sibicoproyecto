<?php

require __DIR__ . '/../../connection/Connection.php';
require __DIR__ . '/../../app/utils/Session.php';
require __DIR__ . '/../../app/models/Model.php';

class Models extends Model
{
    protected $table = 'modelo';
    protected $connection;
    protected $session;

    public function __construct()
    {
        $this->session = new Session();
        $connection = new Connection();
        $this->connection = $connection->getConnection();
    }

    public function getModels()
    {
        $query = "SELECT mo.codigo AS codigo_modelo,
                    mo.nombre_modelo AS nombre_modelo, 
                    ma.nombre_marca AS nombre_marca, 
                    mo.codigo_marca AS codigo_marca
                FROM $this->table mo, marca ma 
                WHERE ma.codigo = mo.codigo_marca 
                ORDER BY codigo_modelo ASC";

        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            $response = [];

            while ($row = mysqli_fetch_assoc($result)) {
                $response[] = $row;
            }

            return $response;
        }

        return [];
    }

    public function createModel($data): bool
    {
        try {
            $this->connection->autocommit(false);

            $id = $this->getNextId($this->table, $this->connection);
            $name = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['nombre_modelo']));
            $brandID = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo_marca']));

            $query = "INSERT INTO $this->table (codigo, nombre_modelo, codigo_marca) VALUES ('$id', '$name', '$brandID')";

            $result = mysqli_query($this->connection, $query);

            if (!$result) {
                throw new Exception(mysqli_error($this->connection));
            }

            $this->connection->commit();
            $this->connection->autocommit(true);
            return true;
        } catch (Exception $e) {
            $this->connection->rollback();
            $this->connection->autocommit(true);

            $this->set($e, ['session_id' => $this->session->getSessionID()]);

            return false;
        }
    }

    public function updateModel($data): bool
    {
        try {
            $this->connection->autocommit(false);

            $id = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo']));
            $name = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['nombre_modelo']));
            $brandID = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo_marca']));

            $query = "UPDATE $this->table SET nombre_modelo = '$name', codigo_marca = '$brandID' WHERE codigo = '$id'";

            $result = mysqli_query($this->connection, $query);

            if (!$result) {
                throw new Exception(mysqli_error($this->connection));
            }

            $this->connection->commit();
            $this->connection->autocommit(true);
            return true;
        } catch (Exception $e) {
            $this->connection->rollback();
            $this->connection->autocommit(true);

            $this->set($e, ['session_id' => $this->session->getSessionID()]);

            return false;
        }
    }

    public function deleteModel($data): bool
    {
        try {
            $this->connection->autocommit(false);

            $id = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo']));

            $query = "DELETE FROM $this->table WHERE codigo = '$id'";

            $result = mysqli_query($this->connection, $query);

            if (!$result) {
                throw new Exception(mysqli_error($this->connection));
            }

            $this->connection->commit();
            $this->connection->autocommit(true);

            $this->createLogbook($this->connection, "Modelo con codigo '$id' eliminado", "eliminación", "medio", "permitido", $this->session->getUserID());

            return true;
        } catch (Exception $e) {
            $this->connection->rollback();
            $this->connection->autocommit(true);

            $this->set($e, ['session_id' => $this->session->getSessionID()]);

            return false;
        }
    }

    public function getSession(): Session
    {
        return $this->session;
    }

    public function getConnection(): Connection
    {
        return $this->connection;
    }

    public function __destruct()
    {
        $this->connection->close();
    }
}
