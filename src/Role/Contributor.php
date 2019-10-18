<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Role;
use Quid\Core;

// contributor
// class which contains the cms default configuration for the contributor role (disabled per default)
class Contributor extends Core\RoleAlias
{
    // config
    public static $config = [
        'ignore'=>true,
        'permission'=>50
    ];
}

// init
Contributor::__init();
?>