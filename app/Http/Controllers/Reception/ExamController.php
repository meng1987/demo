<?php

namespace App\Http\Controllers\Reception;

use App\Http\Controllers\Controller;

class ExamController extends Controller
{
    public function exam_list()
    {
        return view('reception/examList');
    }
}
	