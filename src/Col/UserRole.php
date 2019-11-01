<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/core/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Core;

// userRole
// class for the column which manages the role field for the user row
class UserRole extends Core\Col\UserRole
{
    // config
    public static $config = [
        'sortable'=>false
    ];
}

// init
UserRole::__init();
?>