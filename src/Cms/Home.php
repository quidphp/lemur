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

// home
// class for the home route of the CMS
class Home extends Core\Route\Home
{
    // trait
    use _templateAlias;


    // config
    public static $config = [
        'match'=>[
            'role'=>['>'=>'user']],
        'popup'=>[
            'dbName','driver','serverVersion','connectionStatus','host','username',
            'charset','collation','classFqcn','classSyntax','classSchema','classTables','importantVariables']
    ];


    // main
    // génère main pour home
    final protected function main():string
    {
        $r = Html::divCond($this->mainTop(),'top');
        $r .= Html::divCond($this->mainBottom(),'bottom');

        return $r;
    }


    // mainTop
    // génère la partie top de main
    final protected function mainTop():string
    {
        $r = '';

        $r .= Html::divCond($this->mainTopLeft(),'left');
        $r .= Html::divCond($this->mainTopRight(),'right');

        return $r;
    }


    // mainTopLeft
    // génère le html pour la partie en haut à gauche de la page d'accueil
    final protected function mainTopLeft():string
    {
        $r = '';

        $r .= Html::divOp('title');
        $r .= $this->makeH1(static::boot()->typeLabel());

        if($this->hasPermission('homeInfo'))
        $r .= $this->makeInfo();
        $r .= Html::divCl();

        return $r;
    }


    // makeInfo
    // génère les informations en haut de la page
    final protected function makeInfo():string
    {
        $r = '';
        $tables = $this->db()->tables();
        $total = $tables->filter(['hasPermission'=>true],'view')->total(true,true);
        $popup = $this->makeHomePopup();

        $attr = ['popup-trigger'];
        if(!empty($popup))
        $attr = Base\Arr::append($attr,['with-popup','with-icon','tabindex'=>-1,'data'=>['anchor-corner'=>true,'absolute-placeholder'=>true]]);

        $r .= Html::span($total['table'].' '.static::langPlural($total['table'],'lcf|common/table'));
        $r .= Html::span(',&nbsp;');
        $r .= Html::span($total['row'].' '.static::langPlural($total['row'],'lcf|common/row'));
        $r .= Html::span('&nbsp;'.static::langText('lcf|common/and').'&nbsp;');
        $r .= Html::span($total['col'].' '.static::langPlural($total['col'],'lcf|common/col'));

        $r = Html::button($r,'popup-title');
        $r .= Html::div($popup,'popup');
        $r = Html::div($r,$attr);

        return $r;
    }


    // makeHomePopup
    // génère le popup d'informations pour home
    final protected function makeHomePopup():?string
    {
        $return = null;

        if($this->hasPermission('popup','homePopup'))
        {
            $values = $this->getAttr('popup');
            $closure = $this->infoPopupClosure();
            $return = static::makeInfoPopup($values,$closure);
        }

        return $return;
    }


    // infoPopupClosure
    // callback pour le popup d'informations de la page d'accueil
    final protected function infoPopupClosure():\Closure
    {
        return function(string $key) {
            $return = [static::langText(['popup','home',$key])];
            $value = null;
            $db = $this->db();

            if($key === 'classTables')
            $value = $db->tables()::classFqcn();

            elseif($key === 'classSyntax')
            $value = $db->getSyntax();

            elseif($key === 'classSchema')
            $value = $db->schema()::classFqcn();

            else
            $value = $db->$key();

            $return[] = $value;

            return $return;
        };
    }


    // mainTopRight
    // génère le html pour la partie en haut à droite de la page d'accueil
    final protected function mainTopRight():string
    {
        $r = '';

        return $r;
    }


    // mainBottom
    // génère la partie bottom de main
    final protected function mainBottom():string
    {
        $r = '';

        return $r;
    }
}

// init
Home::__init();
?>