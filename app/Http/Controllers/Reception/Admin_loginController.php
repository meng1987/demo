<?php

namespace App\Http\Controllers\Reception;

use App\Http\Controllers\Controller;

class Admin_loginController extends Controller
{
	//otected $redirectTo = '/Reception';
	public function admin_show()
    {
        return view('reception/admin_show');
    }
}
	
