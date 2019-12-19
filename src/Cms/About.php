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
use Quid\Base\Html;
use Quid\Core;

// about
// class for the about popup route of the CMS
class About extends Core\RouteAlias
{
    // trait
    use _modal;


    // config
    public static $config = [
        'path'=>[
            'en'=>'about',
            'fr'=>'a-propos']
    ];


    // canTrigger
    // retourne vrai si la route peut être trigger
    final public function canTrigger():bool
    {
        return (parent::canTrigger() && $this->hasPermission('about'))? true:false;
    }


    // trigger
    // html pour la page à propos
    final public function trigger()
    {
        return $this->output();
    }


    // getContentReplaceArray
    // retourne le tableau de remplacement
    final protected function getContentReplaceArray():array
    {
        $return = [];
        $boot = static::boot();
        $return = $boot::quidCredit(false);
        $return['bootLabel'] = $boot->label();
        $return['authorLink'] = Html::a($return['email'],$return['author']);
        $return['websiteLink'] = Html::a($return['website'],$return['framework']);
        $return['licenseLink'] = Html::a($return['licenseUrl'],$return['licenseType']);

        return $return;
    }


    // output
    // génère le output html pour le popup about
    final protected function output():string
    {
        $r = '';
        $boot = static::boot();
        $replace = $this->getContentReplaceArray();

        $r .= Html::h1(static::label());
        $r .= Html::h2($boot->label());
        $r .= Html::h3($boot->typeLabel());
        $r .= Html::divCond(static::langText('about/content',$replace),'content');

        return $r;
    }


    // framework
    // retourne le lien web pour le framework
    final public static function framework($attr=null):string
    {
        return Html::a(static::langText('about/uri'),static::langText('about/framework'),$attr);
    }


    // authorEmail
    // retourne le lien email de l'auteur
    final public static function authorEmail():string
    {
        return Html::a(static::langText('about/email'),true);
    }
}

// init
About::__init();
?>