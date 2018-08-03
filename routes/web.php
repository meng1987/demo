<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group(['namespace' => 'Reception'], function () {
    Route::post('admin_login/student_login', 'Admin_loginController@student_login');
    Route::get('admin_login/admin_show', 'Admin_loginController@admin_show');
    Route::get('exam/exam_list', 'ExamController@exam_list');
    Route::get('exam/star_exam', 'ExamController@star_exam');
    Route::get('exam/end_exam', 'ExamController@end_exam');
});