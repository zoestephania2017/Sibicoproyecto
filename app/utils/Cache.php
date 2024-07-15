<?php

class Cache
{
    protected $directory = __DIR__ . "/../cache/.cache/";
    protected $defaultExpire = 86400;
    protected $log;

    public function __construct()
    {
        $this->log = new Log();

        if (!is_dir($this->directory)) {
            mkdir($this->directory, 0777, true);
        }
    }

    public function set($key, $value, $expire = null): void
    {
        try {
            $filePath = $this->getFilePath($key);
            $expire = $expire ?? $this->defaultExpire;

            $serializedValue = json_encode($value);

            file_put_contents($filePath, $serializedValue);

            touch($filePath, time() + $expire);
        } catch (Exception $e) {
            $this->log->set($e, [
                'location' => $e->getFile() . ':' . $e->getLine(),
                'message' => $e->getMessage()
            ]);

            return;
        }
    }

    public function get($key): ?array
    {
        try {
            $filePath = $this->getFilePath($key);

            if (file_exists($filePath) && filemtime($filePath) > time()) {
                $serializedValue = file_get_contents($filePath);
                return json_decode($serializedValue, true);
            }

            return null;
        } catch (Exception $e) {
            $this->log->set($e, [
                'location' => $e->getFile() . ':' . $e->getLine(),
                'message' => $e->getMessage()
            ]);

            return null;
        }
    }

    public function has($key): bool
    {
        try {
            return file_exists($this->getFilePath($key));
        } catch (\Exception $th) {
            $this->log->set($th, [
                'location' => $th->getFile() . ':' . $th->getLine(),
                'message' => $th->getMessage()
            ]);

            return false;
        }
    }

    public function delete($key): bool
    {
        try {
            $filePath = $this->getFilePath($key);

            if (file_exists($filePath)) {
                return unlink($filePath);
            }

            return false;
        } catch (\Exception $th) {
            $this->log->set($th, [
                'location' => $th->getFile() . ':' . $th->getLine(),
                'message' => $th->getMessage()
            ]);

            return false;
        }
    }

    public function clear(): bool
    {
        try {
            $success = true;

            $files = glob($this->directory . '*');

            foreach ($files as $file) {
                if (is_file($file)) {
                    $success = $success && unlink($file);
                }
            }

            return $success;
        } catch (Exception $e) {
            $this->log->set($e, [
                'location' => $e->getFile() . ':' . $e->getLine(),
                'message' => $e->getMessage()
            ]);

            return false;
        }
    }

    protected function isExpired($filePath): bool
    {
        try {
            return filemtime($filePath) + $this->defaultExpire < time();
        } catch (Exception $e) {
            $this->log->set($e, [
                'location' => $e->getFile() . ':' . $e->getLine(),
                'message' => $e->getMessage()
            ]);

            return false;
        }
    }

    protected function getFilePath($key): string
    {
        return $this->directory . md5($key);
    }
}
