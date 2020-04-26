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
use Quid\Lemur;

// cliPreload
// class for a cli route to generate the preload PHP script
class CliPreload extends Core\Route\CliPreload
{
    // trait
    use _cli;


    // config
    public static array $config = [
        'compile'=>[
            'closure'=>[
                'from'=>[
                    Lemur::class=>['closure'=>true]]]]
    ];
}

// init
CliPreload::__init();
?>