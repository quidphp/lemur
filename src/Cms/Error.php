<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
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
    protected static array $config = [];


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