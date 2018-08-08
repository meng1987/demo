<?php

namespace App\Http\Controllers\Reception;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;

class ExamController extends Controller
{
    //首页列表
    public function exam_list()
    {
        return view('reception/examList');
    }
    //开始考试模块
    public function star_exam()
    {
        $data = \DB::table("scrolls")->get();
        return view('reception/starExamList',compact('data'));
    }
    public function star_scrolls(){
        //接受页面传过来的值
        $id = $_GET['id'];
        //查询scrolls表
        $data = \DB::table("scrolls")->where("scrolls_id",$id)->get()->toArray();
        $new_data = json_decode(json_encode($data),true);
        //根据查出来的数据获取其中的id
        $a = $new_data[0]["scrolls_id"];
        //根据其中的id查询派生表相对应的id
        $data = \DB::table("scrolls_question")->where("s_id",$a)->get()->toArray();
        $n_data = json_decode(json_encode($data),true);
        //取出需要的派生表中对应的试题库表的id并且转换为一位数组
        $ids = array_map('array_pop', $n_data);
        $question_id = implode(',',$ids);
        //根据其中的id查询试题库表相对应的id
        $user = \DB::select("select * from question where q_id in($question_id)");
        $op_data = json_decode(json_encode($user),true);


        print_r($op_data);die;
        $single = implode(',',$a);
        print_r($single);die;
        return view('reception/starExam');
    }
    //历史试题模块
    public function end_exam()
    {
        return view('reception/endExam');
    }
}
