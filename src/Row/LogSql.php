<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/core/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Core;

// logSql
// class to represent a row of the logSql table, with cms logic
class LogSql extends Core\Row\LogSql
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
LogSql::__init();
?>