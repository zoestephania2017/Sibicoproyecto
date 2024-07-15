<?php

require __DIR__ . '/../../connection/Connection.php';
require __DIR__ . '/../../app/utils/Session.php';
require __DIR__ . '/../../app/models/Model.php';
require __DIR__ . '/../utils/Hash.php';

class User extends Model
{
    protected $connection;
    protected $session;
    public $defaultPassword = 'copeco';
    private $table = 'usuario';
    private $tableProfile = 'perfil';

    public function __construct()
    {
        $this->session = new Session();
        $connection = new Connection();
        $this->connection = $connection->getConnection();
    }

    public function getUsers()
    {
        $query = "SELECT correlativo, usuario, nombre, apellido, direccion, telefono_fijo, telefono_movil, codigo_perfil, (SELECT nombre FROM $this->tableProfile WHERE codigo = codigo_perfil) AS perfil, estado FROM $this->table ORDER BY correlativo";

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

    public function getUserAuthenticated(): ?array
    {
        $user = $this->session->get('user')['correlativo'];

        $query = "SELECT correlativo, usuario, nombre, apellido, direccion, telefono_fijo, telefono_movil, codigo_perfil FROM $this->table WHERE correlativo = '$user'";

        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            return mysqli_fetch_assoc($result);
        }

        return null;
    }

    public function createUser($data): bool
    {
        try {
            $this->connection->autocommit(false);

            $id = $this->getNextId($this->table, $this->connection, 'correlativo');
            $name = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['nombre']));
            $surname = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['apellido']));
            $user = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['usuario']));
            $address = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['direccion']));
            $landlinePhone = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['telefono_fijo']));
            $mobilePhone = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['telefono_movil']));
            $profile = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['perfil']));
            $password = Hash::encrypt($this->defaultPassword);

            $query = "INSERT INTO $this->table (correlativo, usuario, nombre, apellido, direccion, telefono_fijo, telefono_movil, clave, codigo_perfil, estado) VALUES ('$id', '$user', '$name', '$surname', '$address', '$landlinePhone', '$mobilePhone', '$password', '$profile', 'ACTIVO')";

            $result = mysqli_query($this->connection, $query);

            if ($result) {
                $this->connection->commit();
                $this->connection->autocommit(true);

                return true;
            } else {
                throw new Exception(mysqli_error($this->connection));
            }
        } catch (Exception $e) {
            $this->connection->rollback();
            $this->connection->autocommit(true);

            $this->set($e, ['session_id' => $this->session->getSessionID()]);
            return false;
        }
    }

    public function updateUser($data): bool
    {
        try {
            // Iniciar transacción
            $this->connection->autocommit(false);

            $id = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo']));
            $name = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['nombre']));
            $surname = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['apellido']));
            $user = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['usuario']));
            $address = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['direccion']));
            $landlinePhone = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['telefono_fijo']));
            $mobilePhone = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['telefono_movil']));
            $profile = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['perfil']));

            $query = "UPDATE $this->table SET nombre = '$name', apellido = '$surname', usuario = '$user', direccion = '$address', telefono_fijo = '$landlinePhone', telefono_movil = '$mobilePhone', codigo_perfil = '$profile' WHERE correlativo = '$id'";

            $result = mysqli_query($this->connection, $query);

            if ($result) {
                // Confirmar la transacción
                $this->connection->commit();
                $this->connection->autocommit(true);

                return true;
            } else {
                throw new Exception(mysqli_error($this->connection));
            }
        } catch (Exception $e) {
            // Realizar rollback en caso de error
            $this->connection->rollback();
            $this->connection->autocommit(true);

            // Registrar el error y retornar false
            $this->set($e, ['session_id' => $this->session->getSessionID()]);
            return false;
        }
    }

    public function updateAccount($data): bool
    {
        try {
            // Iniciar transacción
            $this->connection->autocommit(false);

            $id = $this->session->get('user')['correlativo'];
            $name = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['nombre']));
            $surname = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['apellido']));
            $address = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['direccion']));
            $landlinePhone = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['telefono_fijo']));
            $mobilePhone = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['telefono_movil']));

            $query = "UPDATE $this->table SET nombre = '$name', apellido = '$surname', direccion = '$address', telefono_fijo = '$landlinePhone', telefono_movil = '$mobilePhone' WHERE correlativo = '$id'";

            $result = mysqli_query($this->connection, $query);

            if ($result) {
                // Confirmar la transacción
                $this->connection->commit();
                $this->connection->autocommit(true);

                return true;
            } else {
                throw new Exception(mysqli_error($this->connection));
            }
        } catch (Exception $e) {
            // Realizar rollback en caso de error
            $this->connection->rollback();
            $this->connection->autocommit(true);

            // Registrar el error y retornar false
            $this->set($e, ['session_id' => $this->session->getSessionID()]);
            return false;
        }
    }

    public function deleteUser($data): bool
    {
        try {
            // Iniciar transacción
            $this->connection->autocommit(false);

            $id = mysqli_real_escape_string($this->connection, $data['codigo']);

            $query = "UPDATE $this->table SET estado = 'INACTIVO' WHERE correlativo = '$id'";

            $result = mysqli_query($this->connection, $query);

            if ($result) {
                // Confirmar la transacción
                $this->connection->commit();
                $this->connection->autocommit(true);

                return true;
            } else {
                throw new Exception(mysqli_error($this->connection));
            }
        } catch (Exception $e) {
            // Realizar rollback en caso de error
            $this->connection->rollback();
            $this->connection->autocommit(true);

            // Registrar el error y retornar false
            $this->set($e, ['session_id' => $this->session->getSessionID()]);
            return false;
        }
    }

    public function resetPassword($data): bool
    {
        try {
            // Iniciar transacción
            $this->connection->autocommit(false);

            $id = mysqli_real_escape_string($this->connection, $data['codigo']);
            $password = Hash::encrypt($this->defaultPassword);

            $query = "UPDATE $this->table SET clave = '$password' WHERE correlativo = '$id'";

            $result = mysqli_query($this->connection, $query);

            if ($result) {
                // Confirmar la transacción
                $this->connection->commit();
                $this->connection->autocommit(true);

                return true;
            } else {
                throw new Exception(mysqli_error($this->connection));
            }
        } catch (Exception $e) {
            // Realizar rollback en caso de error
            $this->connection->rollback();
            $this->connection->autocommit(true);

            // Registrar el error y retornar false
            $this->set($e, ['session_id' => $this->session->getSessionID()]);
            return false;
        }
    }

    public function changePassword($data): bool
    {
        try {
            $this->connection->autocommit(false);

            $id = $this->session->get('user')['correlativo'];
            $newPassword = Hash::encrypt($data['clave_nueva']);

            $query = "UPDATE $this->table SET clave = '$newPassword' WHERE correlativo = '$id'";

            $result = mysqli_query($this->connection, $query);

            if ($result) {
                $this->connection->commit();
                $this->connection->autocommit(true);

                return true;
            } else {
                throw new Exception(mysqli_error($this->connection));
            }
        } catch (Exception $e) {
            $this->connection->rollback();
            $this->connection->autocommit(true);

            $this->set($e, ['session_id' => $this->session->getSessionID()]);
            return false;
        }
    }

    public function isCurrentPassword($data): bool
    {
        $id = $this->session->get('user')['correlativo'];
        $password = Hash::encrypt($data['clave_actual']);

        $query = "SELECT clave FROM $this->table WHERE correlativo = '$id' AND clave = '$password'";

        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            return true;
        }

        return false;
    }

    public function activateUser($data): bool
    {
        $id = mysqli_real_escape_string($this->connection, $data['codigo']);

        $query = "UPDATE $this->table SET estado = 'ACTIVO' WHERE correlativo = '$id'";

        $result = mysqli_query($this->connection, $query);

        return $result;
    }

    public function getStoreFromUser($id)
    {
        $query = "SELECT ti.codigo AS codigo, ti.nombre as nombre FROM tienda as ti, usuario_tienda as uti WHERE ti.codigo = uti.codigo_tienda AND uti.codigo_usuario = '$id'";

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

    public function assignStoreToUser($data): bool
    {
        $id = mysqli_real_escape_string($this->connection, $data['codigo']);
        $store = mysqli_real_escape_string($this->connection, $data['codigo_tienda']);

        $query = "INSERT INTO usuario_tienda (codigo_usuario, codigo_tienda) VALUES ('$id', '$store')";

        $result = mysqli_query($this->connection, $query);

        return $result;
    }

    public function deleteStoreFromUser($data): bool
    {
        try {
            $this->connection->autocommit(false);

            $id = mysqli_real_escape_string($this->connection, $data['codigo']);
            $store = mysqli_real_escape_string($this->connection, $data['codigo_tienda']);

            $query = "DELETE FROM usuario_tienda WHERE codigo_usuario = '$id' AND codigo_tienda = '$store'";

            $result = mysqli_query($this->connection, $query);

            if ($result) {
                $this->connection->commit();
                $this->connection->autocommit(true);

                $this->createLogbook($this->connection, "Tienda con codigo '$store' ha sido eliminada del usuario con codigo '$id'", "eliminación", "medio", "permitido", $this->session->getUserID());

                return true;
            } else {
                throw new Exception(mysqli_error($this->connection));
            }
        } catch (Exception $e) {
            // Realizar rollback en caso de error
            $this->connection->rollback();
            $this->connection->autocommit(true);

            // Registrar el error y retornar false
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
