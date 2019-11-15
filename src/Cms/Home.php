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
        $tag = 'div';
        $title = Html::span($total['table'].' '.static::langPlural($total['table'],'lcf|common/table'));
        $title .= Html::span(',&nbsp;');
        $title .= Html::span($total['row'].' '.static::langPlural($total['row'],'lcf|common/row'));
        $title .= Html::span('&nbsp;'.static::langText('lcf|common/and').'&nbsp;');
        $title .= Html::span($total['col'].' '.static::langPlural($total['col'],'lcf|common/col'));

        if(!empty($popup))
        {
            $attr = Base\Arr::append($attr,['with-popup','with-icon','data'=>['anchor-corner'=>true,'absolute-placeholder'=>true]]);
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
    // ceci peut être étendu
    final protected function mainTopRight():string
    {
        return '';
    }


    // mainBottom
    // génère la partie bottom de main
    final protected function mainBottom():string
    {
        $r = '';
        $r .= Html::divCond($this->mainBottomLeft(),'left');
        $r .= Html::divCond($this->mainBottomRight(),'right');
        
        return $r;
    }
    
    
    // mainBottomLeft
    // génère la partie en bas à gauche de la page d'accueil
    final protected function mainBottomLeft():string
    {
        return Html::divCond($this->makeHomeFeed(),array('home-feed','block'));
    }
    
    
    // mainBottomRight
    // génère la partie en bas à droite de la page d'accueil
    final protected function mainBottomRight():string
    {
        $r = '';
        
        if($this->hasPermission('homeOverview'))
        $r .= Html::divCond($this->makeHomeOverview(),array('home-overview','block'));
        
        return $r;
    }
    
    
    // makeHomeFeed
    // génère le html pour le feed de la page d'accueil
    final protected function makeHomeFeed():string 
    {
        $r = '';
        $segment = array('type'=>$this->getAttr('feedType'));
        $homeFeed = HomeFeed::make($segment);
        
        if($homeFeed->canTrigger())
        {
            $head = Html::h2(static::langText('home/feed'));
            $body = $homeFeed->trigger();
            $currentType = $homeFeed->segment('type');
            
            $toggler = '';
            foreach ($homeFeed::getFeedTypesRelation() as $type => $label) 
            {
                $route = $homeFeed->changeSegment('type',$type);
                $selected = ($type === $currentType)? 'selected':null;
                $toggler .= $route->a($label,array($selected,'toggler-element','data'=>array('type'=>$type)));
            }
            
            $head .= Html::div($toggler,'feed-togglers');
            
            $r .= Html::div($head,'block-head');
            $r .= Html::div($body,'block-body');
        }
        
        return $r;
    }
    
    
    // makeHomeOverview
    // génère le html pour le survol des tables
    final protected function makeHomeOverview():string 
    {
        $r = '';
        $tables = $this->db()->tables();
        $tables = $tables->filter(array('hasPermission'=>true),'view','homeOverview');
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
        $tools .= $add->a(null,array('icon-solo','add'));
        
        $icon = ($table->hasPermission('update','lemurUpdate'))? 'modify':'view';
        $tools .= $route->a(null,array('icon-solo',$icon));
        
        $r .= Html::divCond($tools,'tools');
        
        return $r;
    }
}

// init
Home::__init();
?>