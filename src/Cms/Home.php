<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
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
    protected static array $config = [
        'match'=>[
            'session'=>'canAccess'],
        'popup'=>[
            'dbName','driver','serverVersion','connectionStatus','host','username',
            'charset','collation','classFqcn','classSyntax','classSchema','classTables','importantVariables'],
        'feedType'=>0
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
        $r .= $this->makeH1($this->makeH1Title());

        if($this->hasPermission('home','homeInfo'))
        $r .= $this->makeInfo();
        $r .= Html::divCl();

        return $r;
    }


    // makeH1Title
    // retourne le contenu du h1
    protected function makeH1Title():string
    {
        return static::boot()->typeLabel();
    }


    // makeInfo
    // génère les informations en haut de la page
    final protected function makeInfo():string
    {
        $r = '';
        $tables = $this->db()->tables();
        $closure = fn($table) => $table->hasPermission('view');
        $total = $tables->filter($closure)->total(true,true);
        $popup = $this->makeHomePopup();

        $attr = ['popup-trigger'];
        $tag = 'div';
        $title = Html::span($total['table'].' '.static::langPlural($total['table'],'lcf|common/table'));
        $title .= Html::span(',&nbsp;');
        $title .= Html::span($total['row'].' '.static::langPlural($total['row'],'lcf|common/row'));
        $title .= Html::span('&nbsp;'.static::langText('lcf|common/and').'&nbsp;');
        $title .= Html::span($total['col'].' '.static::langPlural($total['col'],'lcf|common/col'));

        if(!empty($popup))
        {
            $attr = Base\Arr::merge($attr,['with-popup','with-icon','data'=>['anchor-corner'=>true,'absolute-placeholder'=>true]]);
            $tag = 'button';
        }

        $r = Html::$tag($title,'popup-title');
        $r .= static::makeDivPopup($popup);
        $r = Html::div($r,$attr);

        return $r;
    }


    // makeHomePopup
    // génère le popup d'informations pour home
    final protected function makeHomePopup():?string
    {
        $return = null;

        if($this->hasPermission('popup','home','homePopup'))
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
    // ceci peut être étendu
    protected function mainTopRight():string
    {
        return '';
    }


    // mainBottom
    // génère la partie bottom de main
    protected function mainBottom():string
    {
        $r = '';
        $r .= Html::divCond($this->mainBottomLeft(),'left');
        $r .= Html::divCond($this->mainBottomRight(),'right');

        return $r;
    }


    // mainBottomLeft
    // génère la partie en bas à gauche de la page d'accueil
    protected function mainBottomLeft():string
    {
        return Html::divCond($this->makeHomeFeed(),['home-feed','block']);
    }


    // mainBottomRight
    // génère la partie en bas à droite de la page d'accueil
    protected function mainBottomRight():string
    {
        $r = '';

        if($this->hasPermission('home','homeOverview'))
        $r .= Html::divCond($this->makeHomeOverview(),['home-overview','block']);

        return $r;
    }


    // makeHomeFeed
    // génère le html pour le feed de la page d'accueil
    final protected function makeHomeFeed():string
    {
        $r = '';
        $segment = ['type'=>$this->getAttr('feedType')];
        $homeFeed = HomeFeed::make($segment);

        if($homeFeed->canTrigger())
        {
            $head = Html::h2(static::langText('home/feed'));
            $body = $homeFeed->trigger();
            $currentType = $homeFeed->segment('type');

            $reset = $homeFeed->a(null,['icon-solo','close','feed-reset']);
            $head .= Html::div($this->makeFeedFilter($currentType,$reset),'feed-filter');

            $r .= Html::div($head,'block-head');
            $r .= Html::div($body,'block-body');
        }

        return $r;
    }


    // makeFeedFilter
    // génère le contenu pourle filtre du feed, permet de choisir un utilisateur
    final protected function makeFeedFilter(int $type,string $after):string
    {
        $r = '';
        $route = HomeFeedRelation::make();
        if($route->canTrigger())
        {
            $attr = ['data'=>['absolute-placeholder'=>true,'anchor-corner'=>true]];
            $label = static::langText('home/feedFilter');

            $filter = $route->makeTableRelation($label,$after,'user-relation');
            $r .= Html::divCond($filter,$attr);
        }

        return $r;
    }


    // makeHomeOverview
    // génère le html pour le survol des tables
    final protected function makeHomeOverview():string
    {
        $r = '';
        $tables = $this->db()->tables();
        $tables = $tables->filter(fn($table) => $table->hasPermission('view','homeOverview'));
        $tables = $tables->sortBy('label');

        if($tables->isNotEmpty())
        {
            $body = '';
            foreach ($tables as $table)
            {
                $body .= Html::divCond($this->makeHomeOverviewTable($table),'table-element');
            }

            if(!empty($body))
            {
                $title = Html::h2(static::langText('home/overview'));
                $r .= Html::div($title,'block-head');
                $r .= Html::div($body,'block-body');
            }
        }

        return $r;
    }


    // makeHomeOverviewTable
    // génère le html pour une table
    final protected function makeHomeOverviewTable(Core\Table $table):string
    {
        $r = '';
        $session = static::session();
        $route = $session->routeTableGeneral($table);

        if($route->canTrigger())
        {
            $lang = static::lang();

            $r .= Html::h3($table->label());

            $total = $table->total(true,true);
            $count = Html::span($total['row'].' '.static::langPlural($total['row'],'lcf|common/row'));
            $count .= Html::span('&nbsp;'.static::langText('lcf|common/and').'&nbsp;');
            $count .= Html::span($total['col'].' '.static::langPlural($total['col'],'lcf|common/col'));
            $r .= Html::divCond($count,'count');

            $r = $route->a($r);

            $tools = '';
            $add = SpecificAdd::make($table);
            if($add->canTrigger())
            $tools .= $add->a(null,['icon-solo','add']);

            $isUpdateable = $table->hasPermission('update','lemurUpdate');
            $icon = ($isUpdateable === true)? 'modify':'view';
            $tooltip = ($isUpdateable === true)? 'tooltip/tableModify':'tooltip/tableView';
            $attr = ['icon-solo',$icon,'data-tooltip'=>$lang->text($tooltip)];
            $tools .= $route->a(null,$attr);

            $r .= Html::divCond($tools,'tools');
        }

        return $r;
    }
}

// init
Home::__init();
?>