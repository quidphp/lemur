<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Core;

// registerSubmit
// class for the register submit route of the CMS
class RegisterSubmit extends Core\Route\RegisterSubmit
{
    //  config
    public static $config = [
        'parent'=>Register::class
    ];
}

// init
RegisterSubmit::__init();
?>