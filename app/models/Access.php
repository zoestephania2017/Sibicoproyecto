<?php

require __DIR__ . '/../../connection/Connection.php';
require __DIR__ . '/../../app/utils/Session.php';
require __DIR__ . '/../../app/models/Model.php';

class Access extends Model
{
    protected $table = 'acceso';
    protected $connection;
    protected $session;

    public function __construct()
    {
        $this->session = new Session();
        $connection = new Connection();
        $this->connection = $connection->getConnection();
    }

    public function getAccesses()
    {
        $query = "SELECT codigo, nombre, direccion FROM $this->table ORDER BY codigo ASC";

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

    public function getAccessForProfile($profile)
    {
        $query = "SELECT ac.codigo AS codigo, ac.nombre as nombre FROM acceso as ac, perfil_acceso as per WHERE ac.codigo = per.codigo_acceso AND per.codigo_perfil = $profile";

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

    public function createAccessForProfileAccess($data): bool
    {
        try {
            $this->connection->autocommit(false);

            $profileID = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo_perfil']));
            $accessID = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo_acceso']));

            $query = "INSERT INTO perfil_acceso (codigo_perfil, codigo_acceso) VALUES ($profileID, $accessID)";

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

    public function createAccess($data): bool
    {
        try {
            $this->connection->autocommit(false);

            $name = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['nombre']));
            $address = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['direccion']));
            $id = $this->getNextId($this->table, $this->connection);

            $query = "INSERT INTO $this->table (codigo, nombre, direccion) VALUES ($id, '$name', '$address')";

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

    public function updateAccess($data): bool
    {
        try {
            $this->connection->autocommit(false);

            $id = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo']));
            $name = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['nombre']));
            $address = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['direccion']));

            $query = "UPDATE $this->table SET nombre= '$name', direccion= '$address' WHERE codigo= '$id'";

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

    public function deleteAccessForProfileAccess($data): bool
    {
        try {
            $this->connection->autocommit(false);

            $profileID = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo_perfil']));
            $accessID = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo_acceso']));

            $query = "DELETE FROM perfil_acceso WHERE codigo_perfil = $profileID AND codigo_acceso = $accessID";

            $result = mysqli_query($this->connection, $query);

            if (!$result) {
                throw new Exception(mysqli_error($this->connection));
            }

            $this->connection->commit();
            $this->connection->autocommit(true);

            $this->createLogbook($this->connection, "Acceso con codigo '$accessID' eliminado", "eliminación", "medio", "permitido", $this->session->getUserID());

            return true;
        } catch (Exception $e) {
            $this->connection->rollback();
            $this->connection->autocommit(true);

            $this->set($e, ['session_id' => $this->session->getSessionID()]);

            return false;
        }
    }

    public function deleteAccess($data): bool
    {
        try {
            $this->connection->autocommit(false);

            $id = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo']));

            $query = "DELETE FROM $this->table WHERE codigo = $id";

            $result = mysqli_query($this->connection, $query);

            if (!$result) {
                throw new Exception(mysqli_error($this->connection));
            }

            $this->connection->commit();
            $this->connection->autocommit(true);

            $this->createLogbook($this->connection, "Acceso con codigo '$id' eliminado", "eliminación", "medio", "permitido", $this->session->getUserID());

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
