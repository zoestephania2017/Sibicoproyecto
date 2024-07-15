<?php

include_once __DIR__ . '/Helpers.php';

class Session
{
    protected $directory = __DIR__ . "/../cache/sessions";
    protected $sessionLifetime = 1800;

    public function __construct()
    {
        try {
            if (session_status() !== PHP_SESSION_ACTIVE) {
                if (!file_exists($this->directory)) {
                    mkdir($this->directory, 0777, true);
                }

                session_save_path($this->directory);
                ini_set('session.gc_probability', 1);
                ini_set('session.gc_divisor', 100);
                ini_set('session.gc_maxlifetime', $this->sessionLifetime);

                session_start();
                $this->checkExpiration();
            }
        } catch (\Throwable $th) {
            header('Location: ' . url() . '?status=not_logged', true, 302);

            exit;
        }
    }

    public function set($key, $value): void
    {
        $this->resetExpiration();
        $_SESSION[$key] = $value;
    }

    public function get($key)
    {
        $this->resetExpiration();
        return $_SESSION[$key] ?? null;
    }

    public function has($key): bool
    {
        $this->resetExpiration();
        return isset($_SESSION[$key]);
    }

    private function checkExpiration(): void
    {
        if (isset($_SESSION['last_activity']) && time() - $_SESSION['last_activity'] > $this->sessionLifetime) {
            $this->destroy();
            header('Location: ' . url() . '?status=not_logged', true, 302);
            exit;
        }

        $_SESSION['last_activity'] = time();
    }

    private function resetExpiration(): void
    {
        if (isset($_SESSION['last_activity'])) {
            $_SESSION['last_activity'] = time();
        }
    }

    public function getUserID(): string
    {
        return $this->get('user')['correlativo'];
    }

    public function getSessionID(): string
    {
        return "sess_" . session_id();
    }

    public function destroy(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            $sessionFile = $this->directory . '/sess_' . session_id();

            if (file_exists($sessionFile)) {
                unlink($sessionFile);
            }

            session_unset();
            session_destroy();
        }
    }

    public function __destruct()
    {
        session_commit();
    }
}
