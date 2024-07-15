<?php

require __DIR__ . '/../../connection/Connection.php';
require __DIR__ . '/../../app/utils/Session.php';
require __DIR__ . '/../../app/models/Model.php';

class Client extends Model
{
    protected $table = 'clientes';
    protected $connection;
    protected $session;

    public function __construct()
    {
        $this->session = new Session();
        $connection = new Connection();
        $this->connection = $connection->getConnection();
    }

    public function getClients()
    {
        $query = "SELECT codigo, nombre, apellido, direccion, correo, telefono_fijo, telefono_movil FROM $this->table ORDER BY codigo";

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

    public function createClient(array $data = []): bool
    {
        try {
            $this->connection->autocommit(false);

            $name = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['nombre']));
            $surname = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['apellido']));
            $address = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['direccion']));
            $email = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['correo']));
            $phone_fixed = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['telefono_fijo']));
            $phone_mobile = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['telefono_movil']));
            $id = $this->getNextId($this->table, $this->connection);

            $query = "INSERT INTO $this->table (codigo, nombre, apellido, direccion, correo, telefono_fijo, telefono_movil) VALUES ($id,'$name', '$surname', '$address', '$email', '$phone_fixed', '$phone_mobile')";

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


    public function getClientsForInstitution(): array
    {
        $query = "SELECT codigo, CONCAT(nombre, ' ', apellido) AS descripcion FROM $this->table";

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

    public function updateClient(array $data = []): bool
    {
        try {
            $this->connection->autocommit(false);

            $code = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo']));
            $name = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['nombre']));
            $surname = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['apellido']));
            $address = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['direccion']));
            $email = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['correo']));
            $phone_fixed = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['telefono_fijo']));
            $phone_mobile = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['telefono_movil']));

            $query = "UPDATE $this->table SET nombre = '$name', apellido = '$surname', direccion = '$address', correo = '$email', telefono_fijo = '$phone_fixed', telefono_movil = '$phone_mobile' WHERE codigo = '$code'";

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

    public function deleteClient(array $data = []): bool
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

            $this->createLogbook($this->connection, "Cliente con codigo '$code' ha sido eliminado", "eliminación", "medio", "permitido", $this->session->getUserID());

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
