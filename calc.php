<?php

$object = new StdClass();

try {
    $input = $_POST["input"];
    $input = (array)json_decode($input);
    $answer = findNumbers($input['name'], $input['day'], $input['month'], $input['year']);
    $object->allNumbers = implode(" ", $answer);
    $object->mainNumber = $answer[4];
    $object->mainNumberMeaning = getMainNumberMeaning($object->mainNumber);
} catch (Exception $ex) {
    $object->error = "something went wrong!";
}

echo json_encode($object);

function getMainNumberMeaning($number) {
    $all = file_get_contents('meanings.json');
    $all = json_decode($all);
    return $all->$number;
}


function findNumbers($name, $day, $month, $year) {

    $namenumbers = getVocalAndConsonantNumbers($name);
    $birthday = $day + $month + $year;

    $answer = [];
    $answer[0] = crosssum($namenumbers['vocalNumber']);
    $answer[1] = crosssum($namenumbers['consonantNumber']);
    $answer[2] = crosssum($namenumbers['vocalNumber'] + $namenumbers['consonantNumber']);
    $answer[3] = crosssum($day);
    $answer[4] = crosssum($birthday);
    $answer[5] = crosssum($day + $month);

    return $answer;

}

function crosssum($n) {
    $sum = $n % 9;
    if ($sum === 0) {
        if ($n > 0)
            return 9;
    }
    return $sum;
}

function getVocalAndConsonantNumbers($word) {

    $word = strtolower($word);
    $word = str_replace(" ", "", $word);

    $vocals = [
        1 => "aä",
        2 => "",
        3 => "uü",
        4 => "",
        5 => "e",
        6 => "oõö",
        7 => "",
        8 => "",
        9 => "i",
    ];


    $consonants = [
        1 => "js",
        2 => "bkt",
        3 => "cl",
        4 => "dmv",
        5 => "nw",
        6 => "fx",
        7 => "gp",
        8 => "hqz",
        9 => "ry",
    ];


    $answer = [
        "vocalNumber" => 0,
        "consonantNumber" => 0,
    ];

    $wordToParts = str_split($word);
    foreach ($wordToParts as $letter) {
        foreach ($vocals as $weight => $singleVocals) {
            foreach (str_split($singleVocals) as $singleVocal) {
                if ($letter === $singleVocal) {
                    $answer['vocalNumber'] = $answer['vocalNumber'] + $weight;
                }
            }
        }
        foreach ($consonants as $weight => $singleConsonants) {
            foreach (str_split($singleConsonants) as $singleConsonant) {
                if ($letter === $singleConsonant) {
                    $answer['consonantNumber'] = $answer['consonantNumber'] + $weight;
                }
            }
        }
    }
    return $answer;
}



?>
