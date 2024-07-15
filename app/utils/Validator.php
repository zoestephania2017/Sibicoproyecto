<?php

class Validator
{
    protected $data;
    protected $errors = [];

    public function __construct(array $data = [])
    {
        $this->data = $data;
    }

    public function validate(array $rules): array
    {
        $this->errors = [];

        foreach ($rules as $field => $rule) {
            $value = $this->data[$field] ?? null;
            $this->validateRule($field, $value, $rule);
        }

        return $this->errors;
    }

    public function validateInArray(array $rules): array
    {
        foreach ($this->data as $field => $values) {
            if (array_key_exists($field, $rules)) {
                $rule = $rules[$field];
                $this->validateRule($field, $values, $rule);
            }
        }

        return $this->errors;
    }

    protected function validateRule(string $field, $value, string $rule)
    {
        switch ($rule) {
            case 'required':
                if (!strlen(trim($value)) > 0) {
                    $this->addError($field, 'El campo ' . ucfirst($field) . ' es requerido.');
                }
                break;
            case 'email':
                if (!filter_var(trim($value), FILTER_VALIDATE_EMAIL)) {
                    $this->addError($field, 'El campo ' . ucfirst($field) . ' debe ser un email válido.');
                }
                break;
            case 'numeric':
                if (!is_numeric(trim($value))) {
                    $this->addError($field, 'El campo ' . ucfirst($field) . ' debe ser un número.');
                }
                break;
            case 'min':
                $minLength = isset($params[0]) ? intval($params[0]) : null;
                if ($minLength !== null && strlen(trim($value)) < $minLength) {
                    $this->addError($field, 'El campo ' . ucfirst($field) . ' debe contener al menos ' . $minLength . ' caracteres.');
                }
                break;
            case 'max':
                $maxLength = isset($params[0]) ? intval($params[0]) : null;
                if ($maxLength !== null && strlen(trim($value)) > $maxLength) {
                    $this->addError($field, 'El campo ' . ucfirst($field) . ' debe contener máximo ' . $maxLength . ' caracteres.');
                }
                break;
        }
    }

    protected function addError(string $field, string $errorMessage)
    {
        $this->errors[$field][] = $errorMessage;
    }

    public function __destruct()
    {
        $this->data = null;
        $this->errors = null;
    }
}
