<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Core;

// cliClearCache
// class for a cli route to remove all cached data
class CliClearCache extends Core\RouteAlias
{
    // trait
    use _cli;
    use Core\Route\_cliClear;


    // config
    protected static array $config = [
        'path'=>['-clearcache'],
        'priority'=>8002,
        'parent'=>CliClearAll::class,
        'clear'=>[
            '[storageCache]',
            '[publicCss]',
            '[publicJs]',
            '[publicMedia]',
            '[publicStorage]',
            Core\Row\CacheRoute::class],
        'template'=>false
    ];
}

// init
CliClearCache::__init();
?>