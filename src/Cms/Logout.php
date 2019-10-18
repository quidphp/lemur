<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Lemur;

// logout
// class for the logout route of the CMS
class Logout extends Lemur\Route\Logout
{
    // trait
    use _common;


    // config
    public static $config = [
        'match'=>[
            'role'=>['>='=>20]],
        'parent'=>Login::class
    ];
}

// init
Logout::__init();
?>