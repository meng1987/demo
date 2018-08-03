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

Route::get('/', function () {
    return view('welcome');
});
Route::get('reception/admin_show', 'Reception\Admin_loginController@admin_show')->name('Admin_login');
Route::get('reception/exam_list', 'Reception\Admin_loginController@exam_list')->name('Exam');