<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Role;
use Quid\Core;

// subAdmin
// class that contains the cms default configuration for the subAdmin role (disabled per default)
class SubAdmin extends Core\RoleAlias
{
    // config
    public static $config = [
        'ignore'=>true,
        'permission'=>70,
        'can'=>[
            'login'=>['cms'=>true]],
        '@cms'=>[
            'can'=>[
                'userPopup'=>true,
                'bootPopup'=>true,
                'home'=>[
                    'infoPopup'=>true]]
        ]
    ];
}

// init
SubAdmin::__init();
?>