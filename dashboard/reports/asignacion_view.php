<!DOCTYPE html>
<html>
<head>
    <title>Actas de Asignacion</title>
    <link rel="stylesheet" type="text/css" href="css/estilo_1.css">
</head>
<body>
    <div class="container">
        <form action="ImprimirActas.php" method="POST">
            <h2>Actas de Asignacion</h2>
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
                <label for="textFechasig">Fecha de la Asignacion:</label>
                <input id="textFechasig" type="date" name="textFechasig" required><br><br>
            </fieldset><br>
            <input type="submit" value="Imprimir Acta de Asignacion"><br>
        </form>
    </div>
</body>
</html>
