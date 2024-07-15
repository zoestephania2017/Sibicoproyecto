<?php

require __DIR__ . '/../../connection/Connection.php';
require __DIR__ . '/../../app/utils/Session.php';
require __DIR__ . '/../../app/models/Model.php';

class Proceeding extends Model
{
    protected $table = 'acta';
    protected $connection;
    protected $session;

    public function __construct()
    {
        $this->session = new Session();
        $connection = new Connection();
        $this->connection = $connection->getConnection();
    }

    public function getProceedings()
    {
        $query = "SELECT codigo, nombre, tipo FROM $this->table ORDER BY codigo";

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

    public function getProceedingsForStore(): array
    {
        $wineryID = $this->session->get('winery');
        $wineryID = $wineryID['codigo'];

        $query = "SELECT ac.codigo AS codigo, ac.NOMBRE AS descripcion FROM tienda AS ti RIGHT JOIN acta ac ON (ac.tipo = ti.tipo) WHERE ti.codigo = '$wineryID'";

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

    public function getProceeding($id)
    {
        $query = "SELECT codigo, nombre, tipo FROM $this->table WHERE codigo = $id";

        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);

            return $row;
        }

        return [];
    }
    public function createProceeding($data)
    {
        try {
            $this->connection->autocommit(false); // Deshabilitar el autocommit

            $name = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['nombre']));
            $type = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['tipo']));
            $id = $this->getNextId($this->table, $this->connection);

            $query = "INSERT INTO $this->table (codigo, nombre, tipo, estado) VALUES ($id, '$name', '$type', ' ')";

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

    public function updateProceeding($data)
    {
        try {
            $this->connection->autocommit(false); // Deshabilitar el autocommit

            $code = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo']));
            $name = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['nombre']));
            $type = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['tipo']));

            $query = "UPDATE $this->table SET nombre = '$name', tipo = '$type' WHERE codigo = '$code'";

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

    public function deleteProceeding($data)
    {
        try {
            $this->connection->autocommit(false);

            $code = mysqli_real_escape_string($this->connection, $data['codigo']);

            $query = "DELETE FROM $this->table WHERE codigo = '$code'";

            $result = mysqli_query($this->connection, $query);

            if (!$result) {
                throw new Exception(mysqli_error($this->connection));
            }

            $this->connection->commit();
            $this->connection->autocommit(true);

            $this->createLogbook($this->connection, "Acta con codigo '$code' ha sido eliminada", "eliminación", "medio", "permitido", $this->session->getUserID());

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
