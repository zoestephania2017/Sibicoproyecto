<?php

require __DIR__ . '/../../connection/Connection.php';
require __DIR__ . '/../utils/Hash.php';
require __DIR__ . '/../utils/Session.php';
require __DIR__ . '/../../app/models/Model.php';

class Login extends Model
{
    private $table = 'usuario';
    protected $connection;
    protected $session;

    public function __construct()
    {
        $this->session = new Session();
        $connection = new Connection();
        $this->connection = $connection->getConnection();
    }

    public function login($username, $password)
    {
        $username = htmlspecialchars(mysqli_real_escape_string($this->connection, $username));
        $password = htmlspecialchars(mysqli_real_escape_string($this->connection, $password));
        $password = Hash::encrypt($password);

        $query = "SELECT correlativo, usuario, nombre, apellido, direccion, telefono_fijo, telefono_movil, codigo_perfil FROM $this->table WHERE usuario = '$username' AND clave = '$password' AND estado = 'ACTIVO'";

        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            $data = mysqli_fetch_array($result);

            $this->session->set('user', $data);
            $this->session->set('logged', true);
            $this->session->set('access', $this->getAccessForUser());

            return true;
        } else $this->session->set('logged', false);

        return false;
    }

    public function getAccessForUser()
    {
        $user = $this->session->get('user');
        $profileID = $user['codigo_perfil'];

        $query = "SELECT PA.codigo_perfil, PA.codigo_acceso, A.nombre, A.direccion  FROM perfil_acceso PA JOIN acceso A ON (A.codigo= PA.codigo_acceso) WHERE PA.codigo_perfil = $profileID  ORDER BY PA.codigo_acceso, A.direccion ASC ";

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

    public function __destruct()
    {
        $this->connection->close();
    }
}
