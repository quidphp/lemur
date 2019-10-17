<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/core/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Core;

// logCron
// class to represent a row of the logCron table, with cms logic
class LogCron extends Core\Row\LogCron
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
LogCron::__init();
?>