<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="{{ csrf_token() }}; charset=utf-8" name="csrf-token"/>
<title>鸿博IT学生登录界面</title>
<link rel="stylesheet" type="text/css" href="{{ URL::asset('css/style.css') }}" />
<link rel="stylesheet" type="text/css" href="{{ URL::asset('css/body.css') }}"/> 
</head>
<body>
<div class="container">
	<section id="content">
		<form action="student_login" method="post">
			<h1>鸿博IT学生登录界面</h1>
			<div>
				<input type="text" placeholder="用户名" required="" id="username" name="student_name"/>
			</div>
			<div>
				<input type="password" placeholder="密码" required="" id="password" name="password"/>
			</div>
			 <div class="">
				<span class="help-block u-errormessage" id="js-server-helpinfo">&nbsp;</span>			</div> 
			<div>
				<!-- <input type="submit" value="Log in" /> -->
				<input type="submit" value="登录" class="btn btn-primary" id="js-btn-login"/>
				<a href="#">忘记密码?</a>
                <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
                <!-- <a href="#">Register</a> -->
			</div>
		</form><!-- form -->
		 <div class="button">
			<span class="help-block u-errormessage" id="js-server-helpinfo">&nbsp;</span>
		</div> <!-- button -->
	</section><!-- content -->
</div>
<!-- container -->


<br><br><br><br>
<div style="text-align:center;">
<p>来源:More Templates <a href="#" target="_blank" title="涛劝鑫强传媒有限公司">涛劝鑫强传媒有限公司</a>
</div>
</body>
</html>