<?php

class Hash
{
    public static function encrypt($password)
    {
        return md5($password);
    }
}
