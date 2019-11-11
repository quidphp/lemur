<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
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
            'charset','collation','classFqcn','classSyntax','classSchema','classTables','importantVariables'
        ]
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
        $attr = ['popup-trigger',(!empty($popup))? ['with-popup','with-icon','anchor-corner']:null];

        $r .= Html::divOp($attr);
        $r .= Html::divOp('popup-title');
        $r .= Html::span($total['table'].' '.static::langPlural($total['table'],'lcf|common/table'));
        $r .= Html::span(',&nbsp;');
        $r .= Html::span($total['row'].' '.static::langPlural($total['row'],'lcf|common/row'));
        $r .= Html::span('&nbsp;'.static::langText('lcf|common/and').'&nbsp;');
        $r .= Html::span($total['col'].' '.static::langPlural($total['col'],'lcf|common/col'));
        $r .= Html::divCl();
        $r .= Html::div($popup,'popup');
        $r .= Html::divCl();

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
            $return = static::makeInfoPopup($values,$closure,false);
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
        $r .= $this->makeAbout();

        return $r;
    }


    // makeAbout
    // bouton vers la page à propos
    final protected function makeAbout():string
    {
        $r = '';
        $session = static::session();

        if($this->hasPermission('about'))
        {
            $route = About::make();
            $r .= $route->aDialog(['with-icon','help']);
        }

        return $r;
    }


    // mainBottom
    // génère la partie bottom de main
    final protected function mainBottom():string
    {
        $r = '';

        $r .= Html::divOp('search');
        $r .= Html::divCond($this->makeSearch(),'inner-centered');
        $r .= Html::divCl();

        return $r;
    }


    // makeSearch
    // génère le champ de recherche globale
    final protected function makeSearch():string
    {
        $r = '';

        if($this->hasPermission('homeSearch'))
        {
            $route = HomeSearch::make();
            $tables = $this->db()->tables();
            $searchable = $route->searchable();
            $lang = static::lang();

            if($searchable->isNotEmpty())
            {
                $minLength = $tables->searchMinLength();
                $data = ['keyupDelay'=>800,'required'=>true,'pattern'=>['minLength'=>$minLength]];
                $name = $route->getSearchName();

                $replace = ['count'=>$minLength];
                $note = $lang->plural($minLength,'home/searchNote',$replace);

                $r .= $route->formOpen();
                $r .= Html::inputText(null,['name'=>$name,'placeholder'=>static::langText('home/searchSubmit'),'data'=>$data]);
                $r .= Html::submit(true,['button','icon-solo','search']);
                $r .= Html::div(null,'popup');
                $r .= Html::formClose();

                $r .= Html::divOp('search-in');
                $r .= Html::divOp('first');
                $r .= Html::span($lang->text('home/note').':');
                $r .= Html::span($note,'note');
                $r .= Html::divCl();
                $r .= Html::divOp('second');
                $r .= Html::span($lang->text('home/searchIn').':');
                $r .= Html::span(implode(', ',$searchable->pair('label')),'labels');
                $r .= Html::divCl();
                $r .= Html::divCl();
            }
        }

        return $r;
    }
}

// init
Home::__init();
?>