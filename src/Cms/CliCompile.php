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
use Quid\Base\Cli;
use Quid\Core;

// cliCompile
// class for a cli route to compile assets (js and css)
class CliCompile extends Core\Route\CliCompile
{
    // trait
    use _cli;


    // config
    protected static array $config = [];
}

// init
CliCompile::__init();
?>