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
use Quid\Core;

// _cli
// trait that provides some initial configuration for a CMS cli route
trait _cli
{
    // trait
    use _template;
    use Core\Route\_cli;


    // config
    protected static array $configCliCms = [
        'match'=>[
            'cli'=>null],
        'history'=>false
    ];


    // canTrigger
    // retourne vrai si la route peut être trigger
    final public function canTrigger():bool
    {
        return parent::canTrigger() && $this->hasPermission('cli');
    }


    // trigger
    // génère le cli ou le template
    final public function trigger()
    {
        return (Base\Server::isCli())? $this->cliWrap():$this->template();
    }


    // flushBeforeMain
    // flush le contenu avant main pour pouvoir utiliser le flush du cli dans un rendu html
    final protected function flushBeforeMain():bool
    {
        return true;
    }


    // main
    // si c'est main, renvoie à cliWrap
    final protected function main()
    {
        return $this->cliWrap();
    }
}
?>