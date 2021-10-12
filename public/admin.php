<?php

$data = json_decode(file_get_contents('php://input'), true);

print_r($data);

// if(!isset($data['passord']) || $data['passord'] != "sommer") die("feil passord");


if($data['mode'] == 'add' && isset($data['navn'])){
    $fil = file_get_contents('spillere.json');
    $fil = json_decode($fil, true);
    $fil[count($fil)] = $data['navn'];
    file_put_contents('spillere.json', json_encode($fil));
}