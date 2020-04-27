<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
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