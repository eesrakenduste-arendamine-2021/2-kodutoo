<?php
    var_dump($_POST);
    if(isset($_POST["save"]) && !empty($_POST["save"])) {
        file_put_contents("database.txt", $_POST["save"] .", ", FILE_APPEND);
    }
?>