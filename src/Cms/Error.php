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

// error
// class for the error route of the CMS
class Error extends Core\Route\Error
{
    // trait
    use _templateAlias;


    // config
    public static array $config = [];


    // trigger
    // trigge la route error du cms
    final public function trigger()
    {
        return $this->output('template');
    }


    // main
    // génère la page erreur dans la balise main
    final protected function main():string
    {
        return $this->outputHtml();
    }
}

// init
Error::__init();
?>