<!DOCTYPE html>
<html><head>
    <meta charset="utf-8">
    <title>鸿博考试系统</title>

    <meta name="description" content="Dashboard">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!--Basic Styles-->
    <link href="{{URL::asset('/home/style/bootstrap.css')}}" rel="stylesheet">
    <link href="{{URL::asset('/home/style/font-awesome.css')}}" rel="stylesheet">
    <link href="{{URL::asset('/home/style/weather-icons.css')}}" rel="stylesheet">

    <!--Beyond styles-->
    <link id="beyond-link" href="{{URL::asset('/home/style/beyond.css')}}" rel="stylesheet" type="text/css">
    <link href="{{URL::asset('/home/style/demo.css')}}" rel="stylesheet">
    <link href="{{URL::asset('/home/style/typicons.css')}}" rel="stylesheet">
    <link href="{{URL::asset('/home/style/animate.css')}}" rel="stylesheet">

</head>
<body>
<!-- 头部 -->

<div class="navbar">
    <div class="navbar-inner">
        <div class="navbar-container">
            <div class="navbar-header pull-left">
                <a href="#" class="navbar-brand">
                    <div class="navbar-header pull-left">
                        <a href="#" class="navbar-brand">
                            <small>
                                <i class="icon-leaf"></i>
                                <span>鸿博在线考试系统</span>
                            </small>
                        </a><!-- /.brand -->
                    </div><!-- /.navbar-header -->
                    {{--<small>--}}
                        {{--<img src="{{URL::asset('/home//images/logo.png')}}" alt="">--}}
                        {{--&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;--}}
                        {{--<span style="text-align: center;">鸿博在线考试系统</span>--}}
                    {{--</small>--}}
                </a>
            </div>
            <!-- /Navbar Barnd -->
            <!-- Sidebar Collapse -->
            <div class="sidebar-collapse" id="sidebar-collapse">
                <i class="collapse-icon fa fa-bars"></i>
            </div>
            <!-- /Sidebar Collapse -->
            <!-- Account Area and Settings -->
            <div class="navbar-header pull-right">
                <div class="navbar-account">
                    <ul class="account-area">
                        <li>
                            <a class="login-area dropdown-toggle" data-toggle="dropdown">
                                <div class="avatar" title="View your public profile">
                                    <img src="{{URL::asset('/home//images/421624.jpg')}}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </div>
                                <section>
                                    <h2><span class="profile"><span> 欢迎（{{session('name')}}）登录 </span></span></h2>
                                </section>
                            </a>
                            <!--Login Area Dropdown-->
                            <ul class="pull-right dropdown-menu dropdown-arrow dropdown-login-area">
                                <li class="username"><a>David Stevenson</a></li>
                                <li class="dropdown-footer">
                                    <a href="/admin_login/admin_show">
                                        退出登录
                                    </a>
                                </li>
                                <li class="dropdown-footer">
                                    <a href="/admin_login/personal_data">
                                        修改密码
                                    </a>
                                </li>
                                <li class="dropdown-footer">
                                    <a href="{:url('index/changePwd')}">
                                        设置&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </a>
                                </li>
                            </ul>
                            <!--/Login Area Dropdown-->
                        </li>
                    </ul>
                </div>
            </div>
            <!-- /Account Area and Settings -->
        </div>
    </div>
</div>

<!-- /左部 -->
<div class="main-container container-fluid">
    <div class="page-container">
        <!-- Page Sidebar -->
        <div class="page-sidebar" id="sidebar">
            <!-- Page Sidebar Header-->
            <div class="sidebar-header-wrapper">
                <input class="searchinput" type="text">
                <i class="searchicon fa fa-search"></i>
                <div class="searchhelper">Search Reports, Charts, Emails or Notifications</div>
            </div>
            <!-- /Page Sidebar Header -->
            <!-- Sidebar Menu -->
            <ul class="nav sidebar-menu">
                <!--Dashboard-->
                <li>
                    <a href="#" class="menu-dropdown">
                        <i class="menu-icon fa fa-user"></i>
                        <span class="menu-text">在线考试</span>
                        <i class="menu-expand"></i>
                    </a>
                    <ul class="submenu">
                        <li>
                            <a href="{{URL::asset('exam/star_exam')}}">
                                    <span class="menu-text">
                                        开始考试                                   </span>
                                <i class="menu-expand"></i>
                            </a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#" class="menu-dropdown">
                        <i class="menu-icon fa fa-file-text"></i>
                        <span class="menu-text">历史试卷</span>
                        <i class="menu-expand"></i>
                    </a>
                    <ul class="submenu">
                        <li>
                            <a href="{{URL::asset('exam/end_exam')}}">
                                    <span class="menu-text">
                                        历史试题                                  </span>
                                <i class="menu-expand"></i>
                            </a>
                        </li>
                    </ul>
                </li>


            </ul>
            <!-- /Sidebar Menu -->
        </div>

<!-- /Page Sidebar -->
<!-- Page Content -->
<div class="page-content">
    <!-- Page Breadcrumb -->
    <div class="page-breadcrumbs">
        <ul class="breadcrumb">
            <li class="active">在线考试</li>
        </ul>
    </div>
    <!-- /Page Breadcrumb -->

    <!-- Page Body -->
    <div class="page-body">

        <div style="text-align:center; line-height:1000%; font-size:24px;">

            <p style="color:#f00;">鸿博在线考试系统</div>
    </div>


</div>
<!-- /Page Body -->
</div>
<!-- /Page Content -->
</div>
</div>

<!--Basic Scripts-->
<script src="{{URL::asset('/home/style/jquery_002.js')}}"></script>
<script src="{{URL::asset('/home/style/bootstrap.js')}}"></script>
<script src="{{URL::asset('/home/style/jquery.js')}}"></script>
<!--Beyond Scripts-->
<script src="{{URL::asset('/home/style/beyond.js ')}}"></script>



</body></html>