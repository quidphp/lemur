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


    // config
    public static $configModule = [
        'match'=>[
            'cli'=>null,
            'role'=>['>='=>'admin']],
        'response'=>[
            'timeLimit'=>0],
        'group'=>'cli',
        'sitemap'=>false,
        'navigation'=>false,
        'cliHtmlOverload'=>true, // si ce n'est pas cli, les méthodes cli génèrent du html
        'logCron'=>Core\Row\LogCron::class // classe pour le logCron
    ];


    // trigger
    // génère le cli ou le template
    public function trigger()
    {
        return ($isCli = Base\Server::isCli())? $this->cli($isCli):$this->template();
    }


    // flushBeforeMain
    // flush le contenu avant main pour pouvoir utiliser le flush du cli dans un rendu html
    protected function flushBeforeMain():bool
    {
        return true;
    }


    // main
    // si c'est main, renvoie à cli
    protected function main()
    {
        return $this->cli(Base\Server::isCli());
    }


    // logCron
    // permet de logger des données dans la table log cron
    public function logCron(array $data):?Core\Row
    {
        $return = null;
        $class = $this->getAttr('logCron');

        if(!empty($class))
        $return = $class::log($this,$data);

        return $return;
    }
}
?>