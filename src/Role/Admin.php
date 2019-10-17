<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Role;
use Quid\Core;

// admin
// extended class which contains the cms default configuration for the admin role
class Admin extends Core\Role\Admin
{
    // config
    public static $config = [
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
Admin::__init();
?>