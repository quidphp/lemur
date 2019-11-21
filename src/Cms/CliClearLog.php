<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base;
use Quid\Base\Cli;
use Quid\Core;

// cliClearLog
// class for the cli route to remove all log data
class CliClearLog extends Core\Route\CliClearLog
{
    // trait
    use _cli;


    // config
    public static $config = [
        'logCron'=>null
    ];
}

// init
CliClearLog::__init();
?>