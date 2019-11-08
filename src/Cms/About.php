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
use Quid\Core;

// about
// class for the about popup route of the CMS
class About extends Core\RouteAlias
{
    // trait
    use _common;
    use _modal;


    // config
    public static $config = [
        'path'=>[
            'en'=>'about',
            'fr'=>'a-propos']
    ];


    // trigger
    // html pour la page à propos, qui est accessible à tous peu importe le role
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

        $return['bootLabel'] = $boot->label();
        $return['version'] = $boot->version(true);
        $return['author'] = $this->authorLink();
        $return['supportEmail'] = $this->authorEmail();

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
        $r = Html::div($r,'inner-centered');

        return $r;
    }


    // aDialog
    // retourne le lien dialog
    final public function aDialog(?array $attr=null):string
    {
        return $this->aTitle(null,Base\Attr::append($attr,['data'=>['modal'=>static::name()]]));
    }
}

// init
About::__init();
?>