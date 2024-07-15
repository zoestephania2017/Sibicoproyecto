<!DOCTYPE html>
<html>
<head>
    <title>Pases de Salida</title>
    <link rel="stylesheet" type="text/css" href="css/estilo_1.css">
</head>
<body>
    <div class="container">
        <form action="ImprimirActasS.php" method="POST">
            <h2>Pases de Salida</h2>
            <fieldset>
                <label for="textidemp">Nombre de Empleado:</label>
                <select id="textidemp" name="textidemp">
                    <option value=" ">--Seleccione Empleado--</option>
                    <?php
                    require_once 'models/Bien.php';
                    $model = new Bien();
                    $employees = $model->getEmployees();
                    foreach ($employees as $employee) {
                        echo '<option value="'.$employee.'">'.$employee.'</option>';
                    }
                    ?>
                </select>
                <label for="idempord">Orden Realizada por:</label>
                <select id="idempord" name="idempord" required>
                    <option value=" ">--Quien Hace la Orden--</option>
                    <?php
                    $deptEmployees = $model->getDepartmentEmployees();
                    foreach ($deptEmployees as $employee) {
                        echo '<option value="'.$employee.'">'.$employee.'</option>';
                    }
                    ?>
                </select><br><br>
                <label for="textFechapas">Fecha del Pase:</label>
                <input id="textFechapas" type="date" name="textFechapas" required><br><br>
            </fieldset><br>
            <input type="submit" value="Pase de Salida"><br>
        </form>
    </div>
</body>
</html>
