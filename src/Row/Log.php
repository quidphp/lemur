<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/core/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Core;

// log
// class to represent a row of the log table, with cms logic
class Log extends Core\Row\Log
{
    // config
    public static $config = [
        '@cms'=>array(
            'permission'=>array(
                'contributor'=>array('view'=>false),
                'editor'=>array('view'=>false),
                'subAdmin'=>array('add'=>false),
                'admin'=>array('add'=>false,'empty'=>true)))
    ];
}

// init
Log::__init();
?>