<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base;
use Quid\Base\Html;
use Quid\Base\Cli;
use Quid\Core;

// about
// class for the about popup route of the CMS
class About extends Core\RouteAlias
{
    // trait
    use _common;


    // config
    public static $config = [
        'path'=>[
            '-v',
            '-version',
            '-about',
            'en'=>'about',
            'fr'=>'a-propos'],
        'group'=>'dialog'
    ];


    // trigger
    // html pour la page à propos, qui est accessible à tous peu importe le role
    public function trigger()
    {
        $r = '';
        
        if(Base\Server::isCli())
        $r .= $this->outputCli();
        
        else
        $r .= $this->outputHtml();
        
        return $r;
    }

    
    // getContentReplaceArray
    // retourne le tableau de remplacement
    protected function getContentReplaceArray():array
    {
        $return = array();
        $boot = static::boot();

        $return['bootLabel'] = $boot->label();
        $return['version'] = $boot->version(true);
        $return['author'] = $this->authorLink();
        $return['supportEmail'] = $this->authorEmail();
        
        return $return;
    }
    
    
    // outputHtml
    // génère le output html pour le popup about
    protected function outputHtml():string 
    {
        $r = '';
        $boot = static::boot();
        $replace = $this->getContentReplaceArray();

        $r .= Html::divtableOpen();
        $r .= Html::h1(static::label());
        $r .= Html::h2($boot->label());
        $r .= Html::h3($boot->typeLabel());
        $r .= Html::divCond(static::langText('about/content',$replace),'content');
        $r .= Html::divtableClose();
        
        return $r;
    }
    
    
    // outputCli
    // génère le output du cli
    protected function outputCli():string 
    {
        $r = '';
        $boot = static::boot();
        $replace = $this->getContentReplaceArray();
        
        $r .= static::cliArt();
        $r .= Cli::pos(static::label());
        $r .= Cli::pos($boot->label());
        $r .= Cli::pos($boot->typeLabel());
        $r .= Cli::neutral(static::langText('about/content',$replace));
        
        return $r;
    }
    
    
    // cliArt
    public static function cliArt():string 
    {
return '
 .d88888b.           d8b      888 8888888b.  888    888 8888888b.  
d88P" "Y88b          Y8P      888 888   Y88b 888    888 888   Y88b 
888     888                   888 888    888 888    888 888    888 
888     888 888  888 888  .d88888 888   d88P 8888888888 888   d88P 
888     888 888  888 888 d88" 888 8888888P"  888    888 8888888P"  
888 Y8b 888 888  888 888 888  888 888        888    888 888        
Y88b.Y8b88P Y88b 888 888 Y88b 888 888        888    888 888        
 "Y888888"   "Y88888 888  "Y88888 888        888    888 888        
       Y8b                                                                                                                
';
    }
    
    
    // aDialog
    // retourne le lien dialog
    public function aDialog(?array $attr=null):string
    {
        return $this->aTitle(null,Base\Attr::append($attr,['data'=>['modal'=>static::name()]]));
    }
}

// init
About::__init();
?>