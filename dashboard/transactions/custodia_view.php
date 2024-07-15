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
    </style>
</head>
<body>
<div class="form-container">
    <h1>Custodia por Empleado</h1>
    <form action="CustodiaController.php" method="post">
        <div class="form-group">
            <label for="employeeName">Nombre Completo de Empleado:</label>
            <select id="employeeName" name="employeeName">
                <option>--Seleccione Empleado--</option>
                <!-- Opciones de empleado -->
            </select>
        </div>
        <div class="form-actions">
            <button type="submit">Buscar</button>
        </div>
    </form>
</div>

</body>
</html>
