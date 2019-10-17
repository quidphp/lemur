<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/core/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Core;

// redirection
// class to work with a row of the redirection table, with cms logic
class Redirection extends Core\Row\Redirection
{
    // config
    public static $config = [
        '@cms'=>array(
            'permission'=>array(
                'contributor'=>array('view'=>false),
                'editor'=>array('view'=>false),
                'subAdmin'=>array('export'=>true),
                'admin'=>array('export'=>true)))
    ];
}

// init
Redirection::__init();
?>