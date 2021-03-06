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
    Route::get('admin_login/personal_data', 'Admin_loginController@personal_data');
    Route::post('admin_login/up_password', 'Admin_loginController@up_password');
    Route::get('exam/exam_list', 'ExamController@exam_list');
    Route::get('exam/starExamList', 'ExamController@star_exam');
    Route::get('exam/star_scrolls', 'ExamController@star_scrolls');
    Route::get('exam/end_exam', 'ExamController@end_exam');
});
