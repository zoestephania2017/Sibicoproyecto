<?php

require __DIR__ . '/../../connection/Connection.php';
require __DIR__ . '/../../app/utils/Session.php';
require __DIR__ . '/../../app/models/Model.php';

class Repayment extends Model
{
    protected $table = 'devolucion';
    protected $connection;
    protected $session;

    public function __construct()
    {
        $this->session = new Session();
        $connection = new Connection();
        $this->connection = $connection->getConnection();
    }

    public function getRepayments()
    {
        $wineryID = $this->session->get('winery');
        $wineryID = $wineryID['codigo'];

        $query = "SELECT correlativo, codigo_factura, fecha, estado FROM $this->table WHERE tienda = '$wineryID'  ORDER BY correlativo DESC";

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

    public function getRepayment($data): array
    {
        $id = mysqli_real_escape_string($this->connection, $data);

        $query = "SELECT * FROM $this->table WHERE correlativo = '$id'";

        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            $response = [];

            $response[0] = mysqli_fetch_assoc($result);
            $response[0]['details'] = $this->getRepaymentDetail($id);

            return $response;
        }

        return [];
    }

    public function getRepaymentDetail($id): array
    {
        $query = "
            SELECT dev.codigo_devolucion, 
                dev.correlativo_detalle_factura,
                fad.correlativo,
                fad.cantidad,
                fad.codigo_articulo,
                fad.descripcion,
                fad.precio_unidad,
                fad.total,
                fad.serie,
                fad.estado
            FROM devolucion_detalle dev
            LEFT JOIN factura_avanzada_detalle fad ON (dev.correlativo_detalle_factura= fad.correlativo) 
            WHERE dev.codigo_devolucion = '$id'
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

    public function createRepayment($data)
    {
        $code = htmlspecialchars(mysqli_real_escape_string($this->connection, $data['codigo_factura']));
        $id = $this->getNextId($this->table, $this->connection, 'correlativo');
        $wineryID = $this->session->get('winery');
        $wineryID = $wineryID['codigo'];

        $value = $this->getRepaymentDetailForInvoice($code);

        $invoice_id = $value[0]['codigo_factura_avanzada'];
        $items = $data['items'];
        $date = date('Y-m-d');

        if ($invoice_id) {
            $query = "
                INSERT INTO $this->table (correlativo, codigo_factura, fecha, estado, tienda) 
                VALUES ('$id', '$invoice_id', '$date', 'ACTIVO', '$wineryID')
            ";

            $result = mysqli_query($this->connection, $query);

            if ($result) {
                $resultChangeStatusForInvoice = $this->changeStatusForInvoice($code);

                if ($resultChangeStatusForInvoice) {
                    $resultCreateDetailsRepayment = $this->createDetailRepayment($items, $id);

                    return $resultCreateDetailsRepayment;
                }
            }
        }

        return false;
    }

    public function getRepaymentForInvoice($data): array
    {
        $id = mysqli_real_escape_string($this->connection, $data);

        $query = "SELECT * FROM factura_avanzada WHERE numero = '$id' AND estado = 'ACTIVO'";

        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            $response = [];

            $response[0] = mysqli_fetch_assoc($result);
            $response[0]['details'] = $this->getRepaymentDetailForInvoice($response[0]['codigo_factura']);

            return $response;
        }

        return [];
    }

    public function getRepaymentDetailForInvoice($id): array
    {
        $query = "
            SELECT * 
            FROM factura_avanzada_detalle  
            WHERE estado = 'ACTIVO' 
                AND codigo_factura_avanzada = '$id'
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

    private function changeStatusForInvoice($id): bool
    {
        $query = "
            UPDATE factura_avanzada 
                SET estado='DEVOLUCION' 
            WHERE codigo_factura = '$id';
        ";

        $result = mysqli_query($this->connection, $query);

        return $result;
    }

    private function createDetailRepayment($items, $repaymentID): bool
    {
        $id = $this->getNextId('devolucion_detalle', $this->connection, 'correlativo');
        $date = date('Y-m-d');
        $isOK = true;

        foreach ($items as $item) {
            $invoiceID = $item['codigo_articulo'];
            $repaymentType = $item['tipo_devolucion'];

            $query = "
                INSERT INTO devolucion_detalle (correlativo, codigo_devolucion, correlativo_detalle_factura) 
                VALUES ('$id', '$repaymentID', '$invoiceID');
            ";

            $result = mysqli_query($this->connection, $query);

            if (!$result) {
                $isOK = false;

                break;
            }

            $this->changeStatusForAdvancedInvoice($invoiceID);

            if ($repaymentType == 'PRODUCTO') {
                $this->createTransaction($item['cantidad'], $item['precio_unidad'], $date, $invoiceID, $item['descripcion'], 1, -1, 0);

                if ($item['serie'] <> '-1') {
                    $this->changeStatusSerie($invoiceID, $item['serie']);
                }
            } else {
                $this->createTransactionCash($item['cantidad'], $item['precio_unidad'], $date, $invoiceID, $item['descripcion'], 6, ((int) $invoiceID - 1), 0);
            }

            $id++;
        }

        return $isOK;
    }

    private function changeStatusSerie($articleID, $serie): bool
    {
        $query = "
            UPDATE producto_serie  
                SET  estado= 'VENDIDO' 
            WHERE codigo_producto = '$articleID' 
                AND serie = '$serie'  
                AND estado= 'ACTIVO'
        ";

        $result = mysqli_query($this->connection, $query);

        return $result;
    }

    private function changeStatusForAdvancedInvoice($id): bool
    {
        $query = "
            UPDATE factura_avanzada_detalle  
                SET  estado= 'DEVOLUCION' 
            WHERE correlativo = '$id'
        ";

        $result = mysqli_query($this->connection, $query);

        return $result;
    }

    private function createTransaction($quantity, $price, $date, $article, $description, $documentType, $documentID, $discount): bool
    {
        $wineryID = $this->session->get('winery');
        $wineryID = $wineryID['codigo'];
        $id = $this->getNextId('transaccion', $this->connection, 'correlativo');
        $quantityAccumulated = $this->getAccumulatedValue($article);
        $total = $quantityAccumulated * $price;
        $totalAccumulatedValue = $this->getTotalAccumulatedValue($article) + $total;
        $valueUnitAccumulated = ($quantityAccumulated !== 0) ? $totalAccumulatedValue / $quantityAccumulated : 0;

        $query = "
            INSERT INTO transaccion (
                correlativo, cantidad, precio_unidad, fecha_transaccion, codigo_producto, 
                codigo_documento, tipo_documento, observaciones, cantidad_acum, valor_unidad_acum, 
                valor_total_acum, descuento, precio_compra, tienda
            ) VALUES (
                '$id', '$quantity', '$price', '$date', '$article', '$documentID', '$documentType', 
                '$description', '$quantityAccumulated', '$valueUnitAccumulated', '$totalAccumulatedValue', 
                '$discount', '$price', '$wineryID'
            )
        ";

        $result = mysqli_query($this->connection, $query);

        return $result;
    }

    private function createTransactionCash($quantity, $price, $date, $article, $description, $documentType, $documentID, $discount): bool
    {
        $wineryID = $this->session->get('winery');
        $wineryID = $wineryID['codigo'];
        $id = $this->getNextId('transaccion', $this->connection, 'correlativo');
        $quantityAccumulated = $this->getAccumulatedValue($article);
        $total = $quantityAccumulated * $price;
        $totalAccumulatedValue = $this->getTotalAccumulatedValue($article) + $total;
        $valueUnitAccumulated = ($quantityAccumulated !== 0) ? $totalAccumulatedValue / $quantityAccumulated : 0;

        $query = "
            INSERT INTO transaccion (
                correlativo, cantidad, precio_unidad, fecha_transaccion, codigo_producto, 
                codigo_documento, tipo_documento, observaciones, cantidad_acum, valor_unidad_acum, 
                valor_total_acum, descuento, precio_compra, tienda
            ) VALUES (
                '$id', '$quantity', '$price', '$date', '$article', '$documentID', '$documentType', 
                '$description', '$quantityAccumulated', '$valueUnitAccumulated', '$totalAccumulatedValue', 
                '$discount', '$price', '$wineryID'
            )
        ";

        $result = mysqli_query($this->connection, $query);

        return $result;
    }

    private function getAccumulatedValue($article): int
    {
        $query = "
            SELECT ts1.cantidad_acum AS acumulado
            FROM transaccion AS ts1
            WHERE ts1.correlativo = (
                SELECT MAX(correlativo)
                FROM transaccion
                WHERE codigo_producto = '$article'
            )
        ";

        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            $value = mysqli_fetch_assoc($result)['acumulado'];
            return $value;
        }

        return 0;
    }

    private function getTotalAccumulatedValue($article): int
    {
        $query = "
            SELECT ts1.valor_total_acum AS acumulado
            FROM transaccion AS ts1
            WHERE ts1.correlativo = (
                SELECT MAX(correlativo)
                FROM transaccion
                WHERE codigo_producto = '$article'
            )
        ";

        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            $value = mysqli_fetch_assoc($result)['acumulado'];
            return $value;
        }

        return 0;
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
