<!DOCTYPE html>
<html>
<head>
    <title>Tabla de Mobiliarios</title>
    <link rel="stylesheet" type="text/css" href="assets/css/estilo_1.css">
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
            color: #000;
        }
        tr:hover {background-color: #f5f5f5;}
    </style>
</head>
<body>
    <img src="assets/images/COPECO_small.jpg"><br>
    <h2>Tabla de Mobiliarios</h2><hr><br>
    <table>
        <tr class="titulo">
            <th>Clave:</th>
            <th>Nombre:</th>
            <th>Fecha Adquisición:</th>
            <th>Tipo Mobiliario:</th>
            <th>Valor:</th>
            <th>Moneda:</th>
            <th>Cantidad:</th>
            <th>Adquirido:</th>
            <th>Estado:</th>
        </tr>
        <?php if (!empty($mobiliarios)): ?>
            <?php foreach ($mobiliarios as $mobiliario): ?>
            <tr>
                <td><?php echo $mobiliario['ID_Mobiliario']; ?></td>
                <td><?php echo $mobiliario['Nombre_Mobiliario']; ?></td>
                <td><?php echo $mobiliario['FechaAdq_Mobiliario']; ?></td>
                <td><?php echo $mobiliario['ID_TipoMobiliario']; ?></td>
                <td><?php echo $mobiliario['ValorUnd_Mobiliario']; ?></td>
                <td><?php echo $mobiliario['Tmoneda_Mobiliario']; ?></td>
                <td><?php echo $mobiliario['Cantidad_Mobiliario']; ?></td>
                <td><?php echo $mobiliario['Adquisicion_Mobilario']; ?></td>
                <td><?php echo $mobiliario['ID_Estado']; ?></td>
            </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr>
                <td colspan="9">No hay mobiliarios registrados</td>
            </tr>
        <?php endif; ?>
    </table><br><br><hr><br><br>
    <a href="Bienes.php">Volver</a>
</body>
</html>
