<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Role;
use Quid\Core;

// nobody
// extended class that issues cms default configuration for the nobody role
class Nobody extends Core\Role\Nobody
{
    // config
    public static $config = [
        '@cms'=>[
            'db'=>[
                '*'=>[
                    'view'=>false]]
        ]
    ];
}

// init
Nobody::__init();
?>