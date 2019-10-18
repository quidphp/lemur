<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Role;
use Quid\Core;

// editor
// class which contains the cms default configuration for the editor role
class Editor extends Core\RoleAlias
{
    // config
    public static $config = [
        'permission'=>60
    ];
}

// init
Editor::__init();
?>