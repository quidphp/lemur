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
            'role'=>['>='=>20]],
        'popup'=>[
            'dbName','driver','serverVersion','connectionStatus','host','username',
            'charset','collation','classFqcn','classTables','importantVariables'
        ]
    ];


    // main
    // génère main pour home
    public function main():string
    {
        $r = Html::divCond($this->mainTop(),'top');
        $r .= Html::divCond($this->mainBottom(),'bottom');

        return $r;
    }


    // mainTop
    // génère la partie top de main
    protected function mainTop():string
    {
        $r = '';

        $r .= Html::divCond($this->mainTopLeft(),'left');
        $r .= Html::divCond($this->mainTopRight(),'right');

        return $r;
    }


    // mainTopLeft
    // génère le html pour la partie en haut à gauche de la page d'accueil
    protected function mainTopLeft():string
    {
        $r = '';
        $r .= $this->makeH1(static::boot()->typeLabel());

        if($this->hasPermission('homeInfo'))
        $r .= $this->makeInfo();

        return $r;
    }


    // makeInfo
    // génère les informations en haut de la page
    protected function makeInfo():string
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
        $r .= $popup;
        $r .= Html::divCl();

        return $r;
    }


    // makeHomePopup
    // génère le popup d'informations pour home
    protected function makeHomePopup():?string
    {
        $return = null;

        if($this->hasPermission('popup','homeInfoPopup'))
        {
            $values = static::$config['popup'];
            $closure = $this->infoPopupClosure();
            $return = static::makeInfoPopup($values,$closure,false);
        }

        return $return;
    }


    // infoPopupClosure
    // callback pour le popup d'informations de la page d'accueil
    protected function infoPopupClosure():\Closure
    {
        return function(string $key) {
            $return = [static::langText(['popup','home',$key])];
            $value = null;
            $db = $this->db();

            if($key === 'classTables')
            $value = $db->tables()->classFqcn();

            else
            $value = $db->$key();

            $return[] = $value;

            return $return;
        };
    }


    // mainTopRight
    // génère le html pour la partie en haut à droite de la page d'accueil
    protected function mainTopRight():string
    {
        $r = '';
        $r .= $this->makeAbout();

        return $r;
    }


    // makeAbout
    // bouton vers la page à propos
    protected function makeAbout():string
    {
        $r = '';
        $session = static::session();

        if($this->hasPermission('about'))
        {
            $route = About::makeOverload();
            $r .= $route->aDialog(['submit','help','icon','padLeft']);
        }

        return $r;
    }


    // mainBottom
    // génère la partie bottom de main
    protected function mainBottom():string
    {
        $r = '';
        $r .= Html::divCond($this->makeTask(),'task');

        $r .= Html::divOp('search');
        $r .= Html::divtableOpen();
        $r .= $this->makeSearch();
        $r .= Html::divtableClose();
        $r .= Html::divCl();

        return $r;
    }


    // makeTask
    // génère les tâches, simples liens qui apparaissent en haut de la page home
    protected function makeTask():string
    {
        $r = '';
        $tables = $this->db()->tables();

        foreach ($tables->filter(['attrNotEmpty'=>true],'homeTask') as $table)
        {
            if($table->hasPermission('view','insert','lemurInsert'))
            $r .= SpecificAdd::makeOverload($table)->aTitle();
        }

        return $r;
    }


    // makeSearch
    // génère le champ de recherche globale
    public function makeSearch():string
    {
        $r = '';

        if($this->hasPermission('homeSearch'))
        {
            $route = HomeSearch::makeOverload();
            $tables = $this->db()->tables();
            $searchable = $route->searchable(false);
            $lang = static::lang();

            if($searchable->isNotEmpty())
            {
                $minLength = $tables->searchMinLength();
                $data = ['query'=>'s','required'=>true,'keyupDelay'=>800,'pattern'=>['minLength'=>$minLength]];

                $replace = ['count'=>$minLength];
                $note = $lang->plural($minLength,'home/searchNote',$replace);

                $r .= $route->formOpen();
                $r .= Html::inputText(null,['name'=>true,'placeholder'=>static::langText('home/searchSubmit'),'data'=>$data]);
                $r .= Html::submit(true,['button','solo','icon','search']);
                $r .= Html::div(null,'popup');
                $r .= Html::formClose();

                $r .= Html::divOp('in');
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