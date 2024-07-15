<?php


require_once __DIR__ . '/../config/env.php';

class Connection
{
    protected $connection;

    public function __construct()
    {
        $this->connect();
    }

    protected function connect()
    {
        try {
            $this->connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

            if ($this->connection->connect_errno) {
                throw new Exception($this->connection->connect_error);
            }
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function getConnection()
    {
        return $this->connection;
    }

    public function close()
    {
        $this->connection->close();
    }
}
