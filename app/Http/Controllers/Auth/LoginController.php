<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\ThrottlesLogins;

class LoginController extends Controller
{

    use ThrottlesLogins;

    private function failureResponse ($request) 
    {
        $this->incrementLoginAttempts($request);
        return response()->json(['status' => 'failure',
            'message' => 'Incorrect username and/or password.']);
    }

    public function loginSession(Request $request) 
    {
        $credentials = $request->validate([
            $this->username() => 'required|string', 
            'password' => 'required|string']);

        if ($this->hasTooManyLoginAttempts($request)) 
        {
            return $this->sendLockoutResponse($request);
        }

        if (Auth::attempt($credentials)) 
        {
            $user = Auth::user();
            $this->clearLoginAttempts($request);
            return response()->json([
                'status' => 'login',
                'user_id' => $user->id,
                'username' => $user->name
            ]);
        } else {
            return $this->failureResponse($request);
        }
    }

    public function loginApp(Request $request) 
    {
        //TODO mobile login
    }

    public function logoutSession(Request $request) 
    {
        Auth::logout();
        return response()->json([
            'loggedOut' => true
        ]);
    }

    public function logoutApp(Request $request) 
    {
        //TODO mobile logout
    }

    public function username()
    {
        //Required to use ThrottlesLogins trait
        return 'email';
    }
}
