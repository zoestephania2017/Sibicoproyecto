<?php

function url($path = '')
{
    $base_route = '/BodegaCopeco';
    $base_url = ($_SERVER['REQUEST_SCHEME'] ?? 'http') . '://' . $_SERVER['HTTP_HOST'] . $base_route;

    $trimmed_path = trim($path, '/');

    $full_url = $base_url;
    if ($trimmed_path) {
        $full_url .= '/' . $trimmed_path;
    }

    return $full_url;
}

function isRoute($route)
{
    $currentUrl = $_SERVER['REQUEST_URI'];
    $routeUrl = url($route);

    $parsedCurrentUrl = parse_url($currentUrl, PHP_URL_PATH);
    $parsedRouteUrl = parse_url($routeUrl, PHP_URL_PATH);

    if ($parsedCurrentUrl === $parsedRouteUrl) {
        return true;
    }

    return false;
}

function formatDate($date)
{
    $dateObject = DateTime::createFromFormat('Y-m-d', $date);
    return $dateObject ? $dateObject->format('d-m-Y') : $date;
}

function formatDateToMySql($date)
{
    $dateObject = DateTime::createFromFormat('d-m-Y', $date);
    return $dateObject ? $dateObject->format('Y-m-d') : $date;
}
