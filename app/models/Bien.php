<?php

class Bien {
    // Aquí puedes poner la lógica de conexión a la base de datos y otros métodos comunes
    public function getEmployees() {
        require("validar_coneccion.php");
        $query = "SELECT Nombre_Empleado FROM empleados WHERE Estado_Empleado ='0'";
        $result = mysqli_query($conectar, $query);
        $employees = [];
        while ($row = mysqli_fetch_array($result)) {
            $employees[] = $row["Nombre_Empleado"];
        }
        return $employees;
    }

    public function getDepartmentEmployees() {
        require("validar_coneccion.php");
        $query = "SELECT Nombre_Empleado FROM empleados WHERE ID_Departamento ='Direccion Administrativa y Financiera Bienes Nacionales' AND Estado_Empleado = '0'";
        $result = mysqli_query($conectar, $query);
        $employees = [];
        while ($row = mysqli_fetch_array($result)) {
            $employees[] = $row["Nombre_Empleado"];
        }
        return $employees;
    }
}
