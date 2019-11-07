<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Lemur;

// activatePassword
// class for activating the password in the CMS
class ActivatePassword extends Lemur\Route\ActivatePassword
{
    // config
    public static $config = [];
}

// init
ActivatePassword::__init();
?>