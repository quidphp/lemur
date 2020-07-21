<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Core;

// cliClearAll
// class for a cli route to remove all cached and logged data
class CliClearAll extends Core\RouteAlias
{
    // trait
    use _cli;
    use Core\Route\_cliClear;


    // config
    protected static array $config = [
        'path'=>['-clearall'],
        'clear'=>[
            '[storageLog]',
            '[storageError]',
            '[storageCache]',
            '[publicCss]',
            '[publicJs]',
            '[publicMedia]',
            '[publicStorage]',
            Core\Row\Log::class,
            Core\Row\LogCron::class,
            Core\Row\LogEmail::class,
            Core\Row\LogError::class,
            Core\Row\LogHttp::class,
            Core\Row\LogSql::class,
            Core\Row\QueueEmail::class,
            Core\Row\CacheRoute::class],
        'template'=>false
    ];
}

// init
CliClearAll::__init();
?>