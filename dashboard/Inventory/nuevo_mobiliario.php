<!DOCTYPE html>
<html>
<head>
    <title>Nuevo Mobiliario</title>
    <link rel="stylesheet" type="text/css" href="assets/css/estilo_1.css">
    <style>
        .form-container {
            width: 50%;
            margin: auto;
            padding: 20px;
            border: 1px solid #FFA500; /* Orange border */
            border-radius: 5px;
            background-color: #fff;
        }
        .form-container h2 {
            text-align: center;
            color: #000;
        }
        .form-container label {
            display: block;
            margin-top: 10px;
            color: #000;
        }
        .form-container input[type="text"],
        .form-container input[type="date"],
        .form-container select {
            width: 48%;
            padding: 10px;
            margin-top: 5px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
        }
        .form-container input[type="submit"] {
            width: 100%;
            background-color: #1E90FF; /* Blue background */
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .form-container input[type="submit"]:hover {
            background-color: #FFA500; /* Orange on hover */
        }
    </style>
</head>
<body>
    <div class="form-container">
        <h2>Nuevo Mobiliario</h2>
        <form action="index.php?action=create" method="POST">
            <label for="textNombreMobiliario">Nombre del Mobiliario:</label>
            <input type="text" name="textNombreMobiliario" required>

            <label for="textCantidad">Cantidad Mobiliario:</label>
            <input type="text" name="textCantidad" required>

            <label for="textFechaAdqMobiliario">Fecha de Adquisición:</label>
            <input type="date" name="textFechaAdqMobiliario" required>

            <label for="tipomob">Uso del Mobiliario:</label>
            <select name="tipomob" required>
                <option value="">--Tipo de Mobiliario--</option>
                <?php foreach ($tipos as $tipo): ?>
                    <option value="<?php echo $tipo['ID_TipoMobiliario']; ?>"><?php echo $tipo['Nombre_TipoMobiliario']; ?></option>
                <?php endforeach; ?>
            </select>

            <label for="textvalorMobiliario">Valor unitario:</label>
            <input type="text" name="textvalorMobiliario" required>

            <label for="textTmonedaMobiliario">Cambios de Moneda:</label>
            <select name="textTmonedaMobiliario" required>
                <option value="">--Tipo de Moneda--</option>
                <option value="Lempiras">Lempiras</option>
                <option value="Dólares">Dólares</option>
                <option value="Euros">Euros</option>
            </select>

            <label for="adqui">Adquisición de Mobiliario:</label>
            <select name="adqui" required>
                <option value="">--Adquisición--</option>
                <option value="Compra">Compra</option>
                <option value="Donación">Donación</option>
            </select>

            <label for="estado">Estado del Mobiliario:</label>
            <select name="estado" required>
                <option value="">--Estado de Mobiliario--</option>
                <?php foreach ($estados as $estado): ?>
                    <option value="<?php echo $estado['ID_Estado']; ?>"><?php echo $estado['Nombre_Estado']; ?></option>
                <?php endforeach; ?>
            </select>

            <input type="submit" value="Guardar">
        </form>
    </div>
</body>
</html>
