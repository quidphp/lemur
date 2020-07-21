<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base\Cli;
use Quid\Core;

// cliCompile
// class for a cli route to compile assets (js and css)
class CliCompile extends Core\Route\CliCompile
{
    // trait
    use _cli;


    // config
    protected static array $config = [
        'template'=>false
    ];
}

// init
CliCompile::__init();
?>