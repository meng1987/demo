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
        $id = input::all();
        $data = \DB::table("scrolls")->where("scrolls_id",$id['id'])->get();
        print_r($data);die;
        return view('reception/starExam');
    }
    //历史试题模块
    public function end_exam()
    {
        return view('reception/endExam');
    }
}
