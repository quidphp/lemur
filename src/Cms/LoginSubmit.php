<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Lemur;

// loginSubmit
// class for the login submit route of the CMS
class LoginSubmit extends Lemur\Route\LoginSubmit
{
    // trait
    use _common;


    // config
    public static $config = [
        'parent'=>Login::class
    ];


    // routeSuccess
    // retourne la route vers laquelle redirigé en cas de succès par défaut, si rien dans la mémoire
    final public function routeSuccessDefault():Lemur\Route
    {
        return Home::make();
    }
}

// init
LoginSubmit::__init();
?>