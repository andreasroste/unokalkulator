<?php

$data = json_decode(file_get_contents('php://input'), true);

print_r($data);

$fil = json_decode(file_get_contents('spill.json'), true);
array_push($fil, json_decode($data['spill'], true));
file_put_contents('spill.json', json_encode($fil));