<?php

namespace App\Http\Controllers\Reception;

use App\Http\Controllers\Controller;
use DB;

class Admin_loginController extends Controller
{
	public function admin_show()
    {
        return view('reception/admin_show');
    }

    public function student_login()
    {
        $username = DB::table("admin")->where('name',$_POST['name'])->get()->toArray();

        if(!empty($username)){
            $name = json_decode(json_encode($username),true);
            if(md5(md5($_POST['password']).$name['0']['salt']) == $name['0']['password']){
                echo "<script>alert('登陆成功');location.href='/reception/exam';</script>";
            }else{
                echo "<script>alert('密码输入错误');location.href='admin_show'</script>";
            }
        }else{
            echo "<script>alert('登陆失败');location.href='admin_show'</script>";
        }
    }


}