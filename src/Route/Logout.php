<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Core;

// logout
// abstract class for a logout route
abstract class Logout extends Core\RouteAlias
{
    // config
    public static $config = [
        'path'=>[
            'en'=>'logout',
            'fr'=>'deconnexion'],
        'match'=>[
            'role'=>['>'=>'nobody']],
        'parent'=>Login::class,
        'sitemap'=>false,
        'redirectable'=>false,
        'group'=>'account',
        'com'=>true
    ];


    // onLogout
    // callback sur logout
    protected function onLogout():void
    {
        return;
    }


    // onAfter
    // renvoie vers le parent
    final protected function onAfter()
    {
        return static::makeParent();
    }


    // trigger
    // lance la route logout, redirige vers le parent
    final public function trigger()
    {
        static::session()->logoutProcess(['com'=>true]);
        $this->onLogout();

        return;
    }
}

// init
Logout::__init();
?>