<?php

require __DIR__ . '/../../connection/Connection.php';
require __DIR__ . '/../../app/utils/Session.php';
require __DIR__ . '/../../app/models/Model.php';

class Profile extends Model
{
    protected $table = 'perfil';
    protected $access_table = 'acceso';
    protected $connection;
    protected $session;

    public function __construct()
    {
        $this->session = new Session();
        $connection = new Connection();
        $this->connection = $connection->getConnection();
    }

    public function getProfiles()
    {
        $query = "SELECT * FROM $this->table";
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

    public function getAccesses()
    {
        $query = "SELECT * FROM $this->access_table";

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

    public function createProfile(array $data = []): bool
    {
        try {
            $this->connection->autocommit(false); // Deshabilitar el autocommit

            $id = $this->getNextId($this->table, $this->connection);
            $name = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['nombre']));

            $query = "INSERT INTO $this->table (codigo, nombre) VALUES ('$id', '$name')";

            $result = mysqli_query($this->connection, $query);

            if (!$result) {
                throw new Exception(mysqli_error($this->connection));
            }

            $this->connection->commit(); // Confirmar la transacción
            $this->connection->autocommit(true); // Habilitar el autocommit nuevamente
            return true;
        } catch (Exception $e) {
            $this->connection->rollback();
            $this->connection->autocommit(true);

            $this->set($e, ['session_id' => $this->session->getSessionID()]);

            return false;
        }
    }

    public function updateProfile(array $data = []): bool
    {
        try {
            $this->connection->autocommit(false); // Deshabilitar el autocommit

            $code = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo']));
            $name = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['nombre']));

            $query = "UPDATE $this->table SET nombre = '$name' WHERE codigo = '$code'";

            $result = mysqli_query($this->connection, $query);

            if (!$result) {
                throw new Exception(mysqli_error($this->connection));
            }

            $this->connection->commit(); // Confirmar la transacción
            $this->connection->autocommit(true); // Habilitar el autocommit nuevamente
            return true;
        } catch (Exception $e) {
            $this->connection->rollback();
            $this->connection->autocommit(true);

            $this->set($e, ['session_id' => $this->session->getSessionID()]);

            return false;
        }
    }

    public function deleteProfile(array $data = []): bool
    {
        try {
            $this->connection->autocommit(false); // Deshabilitar el autocommit

            $code = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo']));

            $query = "DELETE FROM $this->table WHERE codigo = '$code'";

            $result = mysqli_query($this->connection, $query);

            if (!$result) {
                throw new Exception(mysqli_error($this->connection));
            }

            $this->connection->commit(); // Confirmar la transacción
            $this->connection->autocommit(true); // Habilitar el autocommit nuevamente

            $this->createLogbook($this->connection, "Perfil con codigo '$code' eliminado", "eliminación", "medio", "permitido", $this->session->getUserID());

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
