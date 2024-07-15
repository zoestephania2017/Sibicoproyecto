<?php

class Request
{
    protected $params = [];
    protected $headers = [];
    private $method;
    private $uri;
    private $data;
    private $files;

    public function __construct()
    {
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->uri = $_SERVER['REQUEST_URI'];
        $this->headers = getallheaders();
        $this->params = $_GET;

        $this->parseRequestData();
    }

    private function parseRequestData()
    {
        switch ($this->method) {
            case 'GET':
                $this->data = $_GET;
                break;
            case 'POST':
                $this->data = $this->parsePostData();
                break;
            case 'PUT':
            case 'DELETE':
                $this->data = $this->parsePutDeleteData();
                break;
            default:
                $this->data = $_REQUEST;
                break;
        }

        $this->files = $_FILES;
    }

    private function parsePostData()
    {
        if (isset($this->headers['Content-Type']) && $this->headers['Content-Type'] === 'application/json') {
            $input = file_get_contents('php://input');
            return json_decode($input, true);
        } else {
            return $_POST;
        }
    }

    private function parsePutDeleteData()
    {
        if (isset($this->headers['Content-Type']) && $this->headers['Content-Type'] === 'application/json') {
            $input = file_get_contents('php://input');
            return json_decode($input, true);
        } else {
            parse_str($_SERVER['QUERY_STRING'], $data);
            return $data;
        }
    }

    public function getMethod()
    {
        return $this->method;
    }

    public function getUri()
    {
        return $this->uri;
    }

    public function getData()
    {
        return $this->data;
    }

    public function getFiles()
    {
        return $this->files;
    }

    public function getFile($key = null)
    {
        return $this->files[$key] ?? null;
    }

    public function getHeaders()
    {
        return $this->headers;
    }

    public function getParams()
    {
        return $this->params;
    }

    public function isPost(): bool
    {
        return $this->method === 'POST';
    }

    public function isGet(): bool
    {
        return $this->method === 'GET';
    }

    public function isPut(): bool
    {
        return $this->method === 'PUT';
    }

    public function isDelete(): bool
    {
        return $this->method === 'DELETE';
    }

    public function isPatch(): bool
    {
        return $this->method === 'PATCH';
    }

    public function isHead(): bool
    {
        return $this->method === 'HEAD';
    }

    public function addHeadersJSON()
    {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: http://localhost');
        header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    }

    public function __destruct()
    {
        $this->params = null;
        $this->headers = null;
        $this->method = null;
        $this->uri = null;
        $this->data = null;
        $this->files = null;
    }
}
