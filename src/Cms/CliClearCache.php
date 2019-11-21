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
use Quid\Base;
use Quid\Base\Cli;
use Quid\Core;

// cliClearCache
// class for the cli route to remove all cached data
class CliClearCache extends Core\RouteAlias
{
    // trait
    use _cli;


    // config
    public static $config = [
        'path'=>['-clearcache'],
        'folders'=>['[storageCache]']
    ];


    // cli
    // méthode pour vider les caches
    final protected function cli(bool $cli)
    {
        Cli::neutral(static::label());
        $return = $this->clearCache();

        return $return;
    }


    // clearCache
    // vide le dossier de cache
    final protected function clearCache():array
    {
        $return = [];

        foreach ($this->getAttr('folders') as $path)
        {
            $path = Base\Finder::shortcut($path);
            $method = 'neg';
            $value = "! $path";

            if(Base\Symlink::is($path) && Base\Symlink::unset($path))
            {
                $method = 'pos';
                $value = "- $path";
            }

            elseif(Base\Dir::is($path) && Base\Dir::emptyAndUnlink($path))
            {
                $method = 'pos';
                $value = "x $path";
            }

            Cli::$method($value);
            $return[] = [$method=>$value];
        }

        return $return;
    }
}

// init
CliClearCache::__init();
?>