<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Role;
use Quid\Core;

// user
// extended class that contains the cms default configuration for the user role (disabled per default)
class User extends Core\Role\User
{
    // config
    public static $config = [
        'ignore'=>true
    ];
}

// config
User::__config();
?>