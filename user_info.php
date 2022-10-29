<?php
   echo $name = $_POST['name'];
   echo $email = $_POST['email'];
   echo $subject = $_POST['subject'];
   echo $message = $_POST['message'];
   
   $connection = mysqli_connect('localhost','root','','potpolio') or die("connection fell");
   $request = " insert into user_info(name, email, subject, message) values('{$name}','{$email}','{$subject}','{$message}')";
   mysqli_query($connection, $request);
   header('location:index.php'); 
   mysqli_close($connection);
   
?>  
