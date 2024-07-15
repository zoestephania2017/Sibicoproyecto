<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .form-container {
            border: 2px solid #f0ad4e; /* Color de borde similar al segundo diseño */
            padding: 20px;
            border-radius: 10px;
            background-color: #ffffff; /* Fondo blanco */
            max-width: 800px;
            margin: auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Sombra ligera */
        }
        .form-container h1 {
            text-align: center;
            color: #2c3e50; /* Título de color oscuro */
        }
        .form-group {
            display: flex;
            flex-direction: column;
            margin-bottom: 15px;
        }
        .form-group label {
            margin-bottom: 5px;
            font-weight: bold;
            color: #2c3e50; /* Texto de color oscuro */
        }
        .form-group input, .form-group select {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
        }
        .form-group input[type="file"] {
            padding: 3px;
        }
        .form-actions {
            text-align: center;
        }
        .form-actions button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        .form-actions button:hover {
            background-color: #0056b3;
        }
        .form-row {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }
        .form-row .form-group {
            flex: 1 1 calc(50% - 10px); /* 50% de ancho menos 10px de margen */
            margin: 5px;
        }
        @media (max-width: 600px) {
            .form-row .form-group {
                flex: 1 1 100%; /* 100% de ancho para dispositivos móviles */
            }
        }
    </style>
</head>
<body>
<div class="form-container">
    <h1>Cargo de Bienes</h1>
    <form action="CargoController.php" method="post" enctype="multipart/form-data">
        <div class="form-row">
            <div class="form-group">
                <label for="employeeName">Nombre de Empleado:</label>
                <select id="employeeName" name="employeeName">
                    <option>--Seleccione Empleado--</option>
                    <!-- Opciones de empleado -->
                </select>
            </div>
            <div class="form-group">
                <label for="itemID">ID de Mobiliario:</label>
                <select id="itemID" name="itemID">
                    <option>--Seleccione Mobiliario--</option>
                    <!-- Opciones de mobiliario -->
                </select>
            </div>
            <div class="form-group">
                <label for="itemBrand">Marca Mobiliario:</label>
                <input type="text" id="itemBrand" name="itemBrand">
            </div>
            <div class="form-group">
                <label for="itemModel">Modelo Mobiliario:</label>
                <input type="text" id="itemModel" name="itemModel">
            </div>
            <div class="form-group">
                <label for="inventoryNumber">Número de Inventario:</label>
                <input type="text" id="inventoryNumber" name="inventoryNumber">
            </div>
            <div class="form-group">
                <label for="itemSeries">Serie del Mobiliario:</label>
                <input type="text" id="itemSeries" name="itemSeries">
            </div>
            <div class="form-group">
                <label for="itemColor">Color de Mobiliario:</label>
                <input type="text" id="itemColor" name="itemColor">
            </div>
            <div class="form-group">
                <label for="itemState">Estado del Mobiliario:</label>
                <select id="itemState" name="itemState">
                    <option>--Estado de Mobiliario--</option>
                    <!-- Opciones de estado -->
                </select>
            </div>
            <div class="form-group">
                <label for="orderMadeBy">Orden Realizada por:</label>
                <select id="orderMadeBy" name="orderMadeBy">
                    <option>--Quien Hace la Orden--</option>
                    <!-- Opciones de quien hace la orden -->
                </select>
            </div>
            <div class="form-group">
                <label for="itemImage">Imagen de Mobiliario:</label>
                <input type="file" id="itemImage" name="itemImage">
            </div>
            <div class="form-group">
                <label for="description">Descripción:</label>
                <input type="text" id="description" name="description">
            </div>
        </div>
        <div class="form-actions">
            <button type="submit">Cargo</button>
        </div>
    </form>
</div>

</body>
</html>
