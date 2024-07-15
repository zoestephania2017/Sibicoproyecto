<?php

require __DIR__ . '/../../connection/Connection.php';
require __DIR__ . '/../../app/utils/Session.php';
require __DIR__ . '/../../app/models/Model.php';
require __DIR__ . '/../../app/utils/Cache.php';

class Serie extends Model
{
    protected $connection;
    protected $session;
    protected $cache;

    public function __construct()
    {
        $this->cache = new Cache();
        $this->session = new Session();
        $connection = new Connection();
        $this->connection = $connection->getConnection();
    }

    public function getSeriesForProduct($product)
    {
        if ($this->cache->has('seriesForProduct' . $product)) {
            return $this->cache->get('seriesForProduct' . $product);
        }

        $query = "
            SELECT correlativo, codigo_producto, producto.nombre, serie,producto_serie.imagen, estado
            FROM producto_serie
            LEFT JOIN producto ON ( producto_serie.codigo_producto = producto.codigo ) 
            WHERE codigo_producto = '$product'
        ";

        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            $response = [];

            while ($row = mysqli_fetch_assoc($result)) {
                $response[] = $row;
            }

            $this->cache->set('seriesForProduct' . $product, $response);
            return $response;
        }

        return [];
    }

    public function getSeriesOnly()
    {
        $query = "
            SELECT correlativo, codigo_producto, producto.nombre, serie,producto_serie.imagen, estado
            FROM producto_serie
            LEFT JOIN producto ON ( producto_serie.codigo_producto = producto.codigo ) 
        ";

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

    public function createSerie($data): bool
    {
        try {
            $this->connection->autocommit(false);

            $id = $this->getNextId('producto_serie', $this->connection, 'correlativo');
            $productID = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo']));
            $serie = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['serie']));

            $query = "
                INSERT INTO producto_serie 
                    (correlativo, codigo_producto, serie, imagen, estado)
                VALUES ('$id', '$productID', '$serie', 'sinimagen.jpg', 'ACTIVO')
            ";

            $result = mysqli_query($this->connection, $query);

            if (!$result) {
                throw new Exception(mysqli_error($this->connection));
            }

            $this->connection->commit();
            $this->connection->autocommit(true);

            if ($this->cache->has('seriesForProduct' . $productID)) {
                $this->cache->delete('seriesForProduct' . $productID);
            }

            return true;
        } catch (Exception $e) {
            $this->connection->rollback();
            $this->connection->autocommit(true);

            $this->set($e, ['session_id' => $this->session->getSessionID()]);

            return false;
        }
    }

    public function deleteSerieForProduct($product, $serie)
    {
        try {
            $this->connection->autocommit(false);

            $query = "
                DELETE FROM producto_serie 
                WHERE codigo_producto = '$product' 
                    AND serie = '$serie'
            ";

            $result = mysqli_query($this->connection, $query);

            if (!$result) {
                throw new Exception(mysqli_error($this->connection));
            }

            $this->connection->commit();
            $this->connection->autocommit(true);

            if ($this->cache->has('seriesForProduct' . $product)) {
                $this->cache->delete('seriesForProduct' . $product);
            }

            $this->createLogbook($this->connection, "La serie '$serie' del producto '$product' ha sido eliminada.", "eliminación", "medio", "permitido", $this->session->getUserID());

            return true;
        } catch (Exception $e) {
            $this->connection->rollback();
            $this->connection->autocommit(true);

            $this->set($e, ['session_id' => $this->session->getSessionID()]);
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
