<?php

require __DIR__ . '/../../connection/Connection.php';
require __DIR__ . '/../../app/utils/Session.php';
require __DIR__ . '/../../app/models/Model.php';

class Winery extends Model
{
    protected $table = 'tienda';
    protected $connection;
    protected $session;

    public function __construct()
    {
        $this->session = new Session();
        $connection = new Connection();
        $this->connection = $connection->getConnection();
    }

    public function winery($winery)
    {
        $winery = mysqli_real_escape_string($this->connection, $winery);

        $winery = $this->getWinery($winery);

        if (!$winery) {
            return false;
        }

        $this->session->set('winery', $winery);
        return true;
    }

    protected function getWinery($id)
    {
        if (!$this->isUserHasWinery($id)) {
            return false;
        }

        $query = "SELECT * FROM $this->table WHERE codigo = '$id'";
        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            return mysqli_fetch_assoc($result);
        }

        return null;
    }

    public function getWineryFromUser()
    {
        $user = $this->session->get('user');
        $userID = isset($user['correlativo']) ? $user['correlativo'] : null;
        $query = "
            SELECT codigo, nombre 
            FROM $this->table 
            WHERE codigo IN 
                (SELECT codigo_tienda 
                    FROM usuario_tienda 
                    WHERE codigo_usuario = 
                        (SELECT correlativo 
                            FROM usuario 
                            WHERE correlativo = '$userID' LIMIT 1)
                        )
        ";

        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            return mysqli_fetch_all($result);
        }

        return [];
    }

    private function isUserHasWinery($winery)
    {
        $user = $this->session->get('user');
        $userID = isset($user['usuario']) ? $user['usuario'] : null;
        $query = "
            SELECT codigo, nombre 
            FROM $this->table 
            WHERE codigo = '$winery' 
                AND codigo IN 
                    (SELECT codigo_tienda 
                        FROM usuario_tienda 
                        WHERE codigo_usuario = 
                            (SELECT correlativo 
                                FROM usuario 
                                WHERE usuario = '$userID' LIMIT 1)
                            )
        ";

        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            return true;
        }

        return false;
    }

    public function getWineries()
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

    public function createStore(array $data = []): bool
    {
        try {
            $this->connection->autocommit(false);

            $id = $this->getNextId($this->table, $this->connection);
            $name = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['nombre']));
            $address = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['direccion']));
            $rtn = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['rtn']));
            $phone = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['telefono']));
            $emission_limit_date = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['fecha_limite_emision']));
            $winery_manager = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['cai']));
            $order = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['orden_compra']));
            $exonerations = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['exoneraciones']));
            $agriculture = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['agricultura']));
            $invoiceInit = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['facturai']));
            $invoiceFinal = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['facturaf']));
            $type = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['tipo']));

            $query = "INSERT INTO $this->table (codigo, nombre, direccion, rtn, telefono, fecha_limite_emision, cai, orden_compra, exoneraciones, agricultura, facturai, facturaf, tipo, estado) VALUES 
                ($id, '$name', '$address', '$rtn', '$phone', '$emission_limit_date', '$winery_manager', '$order', '$exonerations', '$agriculture', '$invoiceInit', '$invoiceFinal', '$type', 'ACTIVO')";

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

    public function updateStore(array $data = []): bool
    {
        try {
            // Iniciar transacción
            $this->connection->autocommit(false);

            $id = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo']));
            $name = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['nombre']));
            $address = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['direccion']));
            $rtn = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['rtn']));
            $phone = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['telefono']));
            $emission_limit_date = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['fecha_limite_emision']));
            $winery_manager = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['cai']));
            $order = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['orden_compra']));
            $exonerations = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['exoneraciones']));
            $agriculture = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['agricultura']));
            $invoiceInit = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['facturai']));
            $invoiceFinal = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['facturaf']));
            $type = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['tipo']));

            $query = "UPDATE $this->table SET nombre= '$name', direccion= '$address', rtn= '$rtn', telefono= '$phone', fecha_limite_emision= '$emission_limit_date', cai= '$winery_manager', orden_compra= '$order', exoneraciones= '$exonerations', agricultura= '$agriculture', facturai= '$invoiceInit', facturaf= '$invoiceFinal', tipo= '$type' WHERE codigo= '$id'";

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

    public function deleteStore(array $data = []): bool
    {
        try {
            $id = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo']));

            $query = "UPDATE $this->table SET estado= 'INACTIVO' WHERE codigo= '$id'";

            $result = mysqli_query($this->connection, $query);

            if ($result) {
                $this->createLogbook($this->connection, "Tienda con codigo '$id' eliminada", "eliminación", "medio", "permitido", $this->session->getUserID());

                return true;
            }

            return false;
        } catch (Exception $e) {
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
