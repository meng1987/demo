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

        $username = DB::table('student')->where('student_name',$_POST['student_name'])->get()->toArray();
        //print_r(md5(md5(123456).'7816'));die;
        if(!empty($username)){
            $name = json_decode(json_encode($username),true);
            if(md5(md5($_POST['password']).$name['0']['salt']) == $name['0']['password']){
                session(['student_name'=>$name[0]['student_name']]);
                session(['student_id'=>$name[0]['student_id']]);
                session(['student_class'=>$name[0]['class_student']]);
                $name = json_decode(json_encode(DB::table('major')->where('major_id',$name[0]['major_id'])->get()->toArray()),true);
                session(['major_name'=>$name[0]['major_name']]);
                echo "<script>alert('登陆成功');location.href='/exam/exam_list';</script>";
            }else{
                echo "<script>alert('密码输入错误');location.href='admin_show'</script>";
            }
        }else{
            echo "<script>alert('登陆失败');location.href='admin_show'</script>";
        }
    }

    //个人资料修改页面
    public  function  personal_data()
    {
        return view('reception/personal_data');
    }

    //修改个人密码
    public function up_password()
    {
        $data = DB::table('student')->where('student_id',session('student_id'))->get()->toArray();
        $n_data = json_decode(json_encode($data),true);
        //print_r(md5(md5(123456).'7816'));die;
        if(md5(md5($_POST['password']).$n_data[0]['salt']) == $n_data[0]['password'])
        {
            //echo 1;8838c4dddb3f048744511841cd3e30f6
            $n_salt = rand(1000,9999);
            $n_password = md5(md5($_POST['new_password']).$n_salt);
            $res = DB::table('student')->where('student_id',session('student_id'))->update(['password'=>$n_password,'salt'=>$n_salt]);
            if($res){
                echo "<script>alert('修改成功');location.href='/exam/exam_list';</script>";
            }else{
                echo "<script>alert('修改失败');location.href='/admin_login/personal_data';</script>";
            }
        }else{
            echo "<script>alert('原密码输入错误');location.href='/admin_login/personal_data';</script>";
        }
    }
}