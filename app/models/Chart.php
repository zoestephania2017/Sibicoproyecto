<?php

require __DIR__ . '/../../connection/Connection.php';
require __DIR__ . '/../../app/utils/Session.php';
require __DIR__ . '/../../app/models/Model.php';

class Chart extends Model
{
    protected $connection;
    protected $session;

    public function __construct()
    {
        $this->session = new Session();
        $connection = new Connection();
        $this->connection = $connection->getConnection();
    }

    public function stockByStore()
    {
        $query = "
            SELECT t.nombre AS tienda, COUNT(p.codigo) AS cantidad_productos
            FROM tienda t
            LEFT JOIN producto p ON t.codigo = p.tienda
            GROUP BY t.nombre
        ";

        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            $wineries = [];
            $quantities = [];
            $response = [];

            while ($row = mysqli_fetch_assoc($result)) {
                $wineries[] = $row['tienda'];
                $quantities[] = $row['cantidad_productos'];
            }

            $response['wineries'] = $wineries;
            $response['quantities'] = $quantities;

            return $response;
        }

        return [];
    }

    public function getProductByTypeProduct()
    {
        $query = "
            SELECT tp.nombre_tipo_producto AS tipo_producto, COUNT(p.codigo) AS cantidad_productos
            FROM tipo_producto tp
            LEFT JOIN producto p ON tp.codigo_tipo_producto = p.tipo_producto
            GROUP BY tp.nombre_tipo_producto
        ";

        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            $response = [];
            $productType = [];
            $quantityProduct = [];

            while ($row = mysqli_fetch_assoc($result)) {
                $productType[] = $row['tipo_producto'];
                $quantityProduct[] = $row['cantidad_productos'];
            }

            $response['productType'] = $productType;
            $response['quantityProduct'] = $quantityProduct;

            return $response;
        }

        return [];
    }

    public function salesByBrand()
    {
        $wineryID = $this->session->get('winery');
        $wineryID = $wineryID['codigo'];

        $query = "
            SELECT 
                Mar.nombre_marca AS marca,
                SUM(TR.cantidad) AS total_ventas
            FROM producto AS PR
            LEFT JOIN transaccion AS TR ON PR.codigo = TR.codigo_producto
            LEFT JOIN anio AS An ON PR.anio = An.codigo
            LEFT JOIN modelo AS Mo ON An.codigo_modelo = Mo.codigo
            LEFT JOIN marca AS Mar ON Mo.codigo_marca = Mar.codigo
            WHERE PR.tienda = '$wineryID'
            GROUP BY marca
            ORDER BY total_ventas DESC
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

    public function getInventoryByYear()
    {
        $wineryID = $this->session->get('winery');
        $wineryID = $wineryID['codigo'];

        $query = "
            SELECT 
                An.nombre AS anio,
                SUM(TR.cantidad_acum) AS total_inventario
            FROM producto AS PR
            LEFT JOIN (
                SELECT codigo_producto, MAX(correlativo) AS max_correlativo
                FROM transaccion
                GROUP BY codigo_producto
            ) AS MaxTR ON PR.codigo = MaxTR.codigo_producto
            LEFT JOIN transaccion AS TR ON PR.codigo = TR.codigo_producto AND TR.correlativo = MaxTR.max_correlativo
            LEFT JOIN anio AS An ON PR.anio = An.codigo
            WHERE PR.tienda = '$wineryID'
            GROUP BY anio
            ORDER BY anio
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

    public function getActiveInactiveUserCount()
    {
        $queryActive = "SELECT COUNT(*) AS active_users FROM usuario WHERE estado = 'ACTIVO'";
        $queryInactive = "SELECT COUNT(*) AS inactive_users FROM usuario WHERE estado = 'INACTIVO'";

        $resultActive = mysqli_query($this->connection, $queryActive);
        $resultInactive = mysqli_query($this->connection, $queryInactive);

        if (mysqli_num_rows($resultActive) > 0 && mysqli_num_rows($resultInactive) > 0) {
            $resultActive = mysqli_fetch_assoc($resultActive);
            $resultInactive = mysqli_fetch_assoc($resultInactive);
        }

        $activeUsers = $resultActive['active_users'];
        $inactiveUsers = $resultInactive['inactive_users'];

        return [
            'labels' => ['Usuarios Activos', 'Usuarios Inactivos'],
            'data' => [$activeUsers, $inactiveUsers]
        ];
    }

    public function totalSalesValuePerMonth()
    {
        $wineryID = $this->session->get('winery');
        $wineryID = $wineryID['codigo'];

        $query = "
            SELECT DATE_FORMAT(fecha_transaccion, '%Y-%m') AS mes, SUM(precio_unidad * cantidad) AS valor_total
            FROM transaccion
            WHERE tienda = '$wineryID'
            GROUP BY mes
            ORDER BY mes
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

    public function top10BestSellingItems()
    {
        $wineryID = $this->session->get('winery');
        $wineryID = $wineryID['codigo'];

        $query = "
            SELECT PR.nombre AS nombre_articulo, SUM(TR.cantidad) AS cantidad_vendida
            FROM producto AS PR
            JOIN transaccion AS TR ON PR.codigo = TR.codigo_producto
            WHERE PR.tienda = '$wineryID'
            GROUP BY PR.nombre
            ORDER BY cantidad_vendida DESC
            LIMIT 10
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

    public function distributionOfSalesByTypeOfDocument()
    {
        $wineryID = $this->session->get('winery');
        $wineryID = $wineryID['codigo'];

        $query = "
            SELECT nombre_tipo_documento, COUNT(*) AS cantidad
            FROM transaccion
                JOIN tipo_documento ON transaccion.tipo_documento = tipo_documento.codigo_tipo_documento
            WHERE tienda = '$wineryID'
                GROUP BY tipo_documento
        ";

        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            $response = [];
            $documents = [];
            $quantity = [];

            while ($row = mysqli_fetch_assoc($result)) {
                $documents[] = $row['nombre_tipo_documento'];
                $quantity[] = $row['cantidad'];
            }

            $response['documents'] = $documents;
            $response['quantity'] = $quantity;

            return $response;
        }

        return [];
    }

    public function itemPriceHistory($article)
    {
        $query = "
            SELECT fecha_transaccion, precio_unidad
            FROM transaccion
            WHERE codigo_producto = '$article'
            ORDER BY fecha_transaccion
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

    public function totalValueOfDiscountsPerMonth()
    {
        $wineryID = $this->session->get('winery');
        $wineryID = $wineryID['codigo'];

        $query = "
            SELECT DATE_FORMAT(fecha_transaccion, '%Y-%m') AS mes, SUM(descuento) AS valor_total_descuentos
            FROM transaccion
            WHERE tienda = '$wineryID'
            GROUP BY mes
            ORDER BY mes
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

    public function top10CustomerSwitchMostPurchases()
    {
        $wineryID = $this->session->get('winery');
        $wineryID = $wineryID['codigo'];

        $query = "
            SELECT usuario, SUM(precio_unidad * cantidad) AS valor_total_compras
            FROM transaccion
            WHERE tienda = '$wineryID'
            GROUP BY usuario
            ORDER BY valor_total_compras DESC
            LIMIT 10
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

    public function salesAnalysisByBrandOrModel()
    {
        $wineryID = $this->session->get('winery');
        $wineryID = $wineryID['codigo'];

        $query = "
            SELECT Mar.nombre_marca AS marca, Mo.nombre_modelo AS modelo, SUM(precio_unidad * cantidad) AS valor_total_ventas
            FROM transaccion AS TR
            JOIN producto AS PR ON TR.codigo_producto = PR.codigo
            LEFT JOIN anio AS An ON PR.anio = An.codigo
            LEFT JOIN modelo AS Mo ON An.codigo = Mo.codigo
            LEFT JOIN marca AS Mar ON Mo.codigo = Mar.codigo
            WHERE PR.tienda = '$wineryID'
            GROUP BY marca, modelo
            ORDER BY valor_total_ventas DESC
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

    public function comparisonOfSalesBetweenStores()
    {
        $query = "
            SELECT T.nombre AS nombre_tienda, ROUND(SUM(TT.precio_unidad * TT.cantidad), 2) AS valor_total_ventas
            FROM transaccion AS TT
            JOIN tienda AS T ON TT.tienda = T.codigo
            GROUP BY T.nombre
            ORDER BY valor_total_ventas DESC
        ";

        $result = mysqli_query($this->connection, $query);

        if (mysqli_num_rows($result) > 0) {
            $response = [];
            $winery = [];
            $total = [];

            while ($row = mysqli_fetch_assoc($result)) {
                $winery[] = $row['nombre_tienda'];
                $total[] = $row['valor_total_ventas'];
            }

            $response['tienda'] = $winery;
            $response['total'] = $total;

            return $response;
        }

        return [];
    }

    public function inventoryGrowthTrend($article)
    {
        $query = "
            SELECT DATE_FORMAT(fecha_transaccion, '%Y-%m') AS mes, SUM(cantidad) AS cantidad_total
            FROM transaccion
            WHERE codigo_producto = '$article'
            GROUP BY mes
            ORDER BY mes
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

    public function __destruct()
    {
        $this->connection->close();
    }
}
