<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Cms;
use Quid\Core;

// cliClearLog
// class for a cli route to remove all log data
class CliClearLog extends Core\RouteAlias
{
    // trait
    use _cli;
    use Core\Route\_cliClear;


    // config
    protected static array $config = [
        'path'=>['-clearlog'],
        'clear'=>[
            '[storageLog]',
            '[storageError]',
            Core\Row\Log::class,
            Core\Row\LogCron::class,
            Core\Row\LogEmail::class,
            Core\Row\LogError::class,
            Core\Row\LogHttp::class,
            Core\Row\LogSql::class],
        'logCron'=>null
    ];
}

// init
CliClearLog::__init();
?>