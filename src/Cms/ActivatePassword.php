<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Lemur;

// activatePassword
// class for activating the password in the CMS
class ActivatePassword extends Lemur\Route\ActivatePassword
{
    // config
    protected static array $config = [
        'parent'=>Login::class
    ];
}

// init
ActivatePassword::__init();
?>