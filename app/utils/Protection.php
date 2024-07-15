<?php

class Protection
{
    protected $permissions;
    protected $messages = array(
        "1" => "El usuario intentó acceder al recurso/ruta Marca, el cual no tiene permisos.",
        "2" => "El usuario intentó acceder al recurso/ruta Modelo, el cual no tiene permisos.",
        "3" => "El usuario intentó acceder al recurso/ruta Año, el cual no tiene permisos.",
        "4" => "El usuario intentó acceder al recurso/ruta Cliente, el cual no tiene permisos.",
        "5" => "El usuario intentó acceder al recurso/ruta Usuario, el cual no tiene permisos.",
        "6" => "El usuario intentó acceder al recurso/ruta Tienda, el cual no tiene permisos.",
        "7" => "El usuario intentó acceder al recurso/ruta Perfil, el cual no tiene permisos.",
        "8" => "El usuario intentó acceder al recurso/ruta Acceso, el cual no tiene permisos.",
        "9" => "El usuario intentó acceder al recurso/ruta Actas de Consignación, el cual no tiene permisos.",
        "10" => "El usuario intentó acceder al recurso/ruta Actas de Entrada, el cual no tiene permisos.",
        "11" => "El usuario intentó acceder al recurso/ruta Actas de Entregas, el cual no tiene permisos.",
        "12" => "El usuario intentó acceder al recurso/ruta Devoluciones, el cual no tiene permisos.",
        "13" => "El usuario intentó acceder al recurso/ruta Inventario Inicial, el cual no tiene permisos.",
        "14" => "El usuario intentó acceder al recurso/ruta Existencias, el cual no tiene permisos.",
        "15" => "El usuario intentó acceder al recurso/ruta Reportes, el cual no tiene permisos.",
        "16" => "El usuario intentó acceder al recurso/ruta Actas, el cual no tiene permisos.",
        "17" => "El usuario intentó acceder al recurso/ruta Bitácora, el cual no tiene permisos."
    );

    public function __construct(array $permissions)
    {
        $this->permissions = $permissions;
    }

    public function check(): array
    {
        return $this->permissions;
    }

    public function get($accessCode): ?array
    {
        foreach ($this->permissions as $permission) {
            if ($permission['codigo_acceso'] === $accessCode) {
                return $permission;
            }
        }
        return null;
    }

    public function has($accessCode): bool
    {
        foreach ($this->permissions as $permission) {
            if ($permission['codigo_acceso'] === $accessCode) {
                return true;
            }
        }

        $this->setLogbook($accessCode);
        return false;
    }

    protected function setLogbook($accessCode)
    {
        $description = $this->messages[$accessCode] ?? "Descripción no disponible";
        $severity = 'alto';
        $results = 'acceso denegado';
        $userID = $_SESSION['user']['correlativo'];

        $url = url('app/controllers/LogbookController.php');

        $data = json_encode(array(
            'description' => $description,
            'type' => 'acceso',
            'severity' => $severity,
            'results' => $results,
            'userID' => $userID
        ));

        $curl = curl_init($url);

        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json'
        ));

        curl_exec($curl);
        curl_close($curl);
    }

    public function __destruct()
    {
        unset($this->permissions);
    }
}
