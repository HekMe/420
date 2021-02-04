<?php 
  $DB_password = "TKppYIiVW9kiUzXMjB";
  $DB_user = "hektrack_4-2-0";
  $DB_server = "localhost";
  $DB_name = "hektrack_4-2-0";

  $sql = new mysqli($DB_server, $DB_user, $DB_password, $DB_name);
  
  if ($sql->connection_error) {
    # code...
    die("Connection failed: " . $sql->connect_error);
  }
  
  if(isset($_COOKIE["GUID"])){
    #sleep(5);
    $query = 'SELECT 1 FROM `joint_join` WHERE `user` LIKE "' . $_COOKIE["GUID"] . '"';
    $res = $sql->query($query);
    if(mysqli_num_rows($res) == 0) {
      setcookie("GUID", "", "0");
      header("Refresh:0; url=".$_SERVER['PHP_SELF']);
    }
  }

  function GUID()
  {
    if (function_exists('com_create_guid') === true)
    {
      return trim(com_create_guid(), '{}');
    } 
    return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
  }
  
  function joinJoint($sql)
  {
    if(!isset($_COOKIE["GUID"])){ 
      $file = "count.txt";
      $f = file_get_contents($file);;
      if(!empty($f)){
        file_put_contents($file, intval($f)+1);
      }else{
        file_put_contents($file, 1);
      };
      fclose($f);
      $GUID = GUID();
      $query = "INSERT INTO `joint_join` (user) VALUES (\"". $GUID ."\")";
      setcookie("GUID", $GUID, time()+62*60);
      if ($sql->query($query) !== TRUE) {
        echo "Error: " . $query . "<br>" . $sql->error;
      }
    } else {
      echo "<script type='text/javascript'>alert('You\'ve already joined!');</script>";
    }
    $sql->close();
  }

  if($_GET['joinJoint']){
    if(!isset($_COOKIE["GUID"])){
      joinJoint($sql);
      sleep(2);
      header("Refresh:0; url=".$_SERVER['PHP_SELF']);
    } else {
      echo "<script type='text/javascript'>alert('You\'ve already joined!');</script>";
    }
  }
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>3xp3rim3n741</title>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.26/moment-timezone.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.26/moment-timezone-with-data.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/p5.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/addons/p5.dom.min.js"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css">
    <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
    <script type="text/javascript" src="http://www.webglearth.com/v2/api.js"></script>
    <script src='https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'></script>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="main.css"/>  
  </head>
  <body>
    <canvas id="canvasRegn"></canvas>
    <div id="1">
      <div>
        <p id="" class="text">Time in your timezone</p>
        <p id="localtime" class="time"></p>
        <p id="" class="text">Time until your next local 4:20</p>
        <p id="localcountdown" class="time"></p>
        <p id="tztimetext" class="text"></p>
        <p id="tztime" class="time"></p>
        <p id="tzcountdowntext" class="text"></p>
        <p id="tzcountdown" class="time"></p>
      </div>
      <div id="joint_join">
        <button id="joinJoint" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick='location.href+="?joinJoint=1"'>
            Button
        </button>
        <button is='google-cast-button'></button>
      </div>
      <div id="cast">
      </div>
      <div id="earth_div"></div>
      <div id="weather_info">
        <?php 
          echo "<h5>".$_COOKIE["GUID"]."</h5>" 
        ?>
        <p id="temp"></p>
        <p id="humidity"></p>
        <p id="weather"></p>
      </div>
    </div>
  </body>
  <script src="main.js"></script>
</html>