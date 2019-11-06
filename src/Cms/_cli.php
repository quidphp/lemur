<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
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
    public static $configCliCms = [
        'match'=>[
            'cli'=>null]
    ];


    // trigger
    // génère le cli ou le template
    public function trigger()
    {
        return (Base\Server::isCli())? $this->cliWrap():$this->template();
    }


    // flushBeforeMain
    // flush le contenu avant main pour pouvoir utiliser le flush du cli dans un rendu html
    protected function flushBeforeMain():bool
    {
        return true;
    }


    // main
    // si c'est main, renvoie à cliWrap
    protected function main()
    {
        return $this->cliWrap();
    }
}
?>