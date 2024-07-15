<?php

class Log
{
    protected $directory = __DIR__ . "/../cache/logs";
    protected $filename = "logs.log";

    public function __construct()
    {
        if (!file_exists($this->directory)) {
            mkdir($this->directory, 0777, true);
        }
    }

    public function set(Exception $exception, $additionalInfo = []): void
    {
        $dateTime = date('Y-m-d H:i:s');
        $message = $exception->getMessage();
        $trace = $exception->getTraceAsString();
        $location = $exception->getFile() . ':' . $exception->getLine();

        $logEntry = "[$dateTime] local.ERROR: $message at $location\n";
        $logEntry .= "Stack trace:\n$trace\n";

        foreach ($additionalInfo as $key => $value) {
            $logEntry .= "$key: $value\n";
        }

        $logEntry .= "\n";

        $logFilePath = $this->directory . '/' . $this->filename;
        file_put_contents($logFilePath, $logEntry, FILE_APPEND);
    }
}
