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
use Quid\Lemur;
use Quid\Orm;

// search
// class for the global search route of the CMS
class Search extends Core\RouteAlias
{
    // trait
    use _common;
    use Lemur\Route\_searchPost;


    // config
    protected static array $config = [
        'path'=>[
            'en'=>'search',
            'fr'=>'recherche'],
        'match'=>[
            'session'=>'canAccess',
            'method'=>'post',
            'ajax'=>true,
            'csrf'=>false,
            'genuine'=>true,
            'post'=>['search'=>true]],
        'group'=>'submit',
        'history'=>false
    ];


    // onBefore
    // avant le trigger de la route, vérifie si la recherche est possible
    final protected function onBefore()
    {
        $return = false;

        if(parent::onBefore())
        {
            $search = $this->getSearchValue();
            $return = ($search !== null);
        }

        return $return;
    }


    // canTrigger
    // la route peut être triggé
    final public function canTrigger():bool
    {
        return parent::canTrigger() && $this->hasPermission('search');
    }


    // isSearchValueValid
    // retourne vrai si le terme de recherche est valide
    final protected function isSearchValueValid(string $value):bool
    {
        $searchable = $this->searchable();
        return $searchable->isNotEmpty() && $searchable->isSearchTermValid($value);
    }


    // trigger
    // lance la route search
    final public function trigger():string
    {
        $r = '';
        $search = $this->getSearchValue();
        $searchable = $this->searchable();
        $results = $searchable->search($search);
        $lang = static::lang();
        $r .= $this->makeResults($results);

        if(empty($r))
        $r = Html::h3($lang->text('search/notFound'));

        return $r;
    }


    // makeResults
    // retourne les résultats de la recherche
    final protected function makeResults(array $array):string
    {
        $r = '';
        $tables = $this->db()->tables();
        $search = $this->getSearchValue();

        foreach ($array as $key => $value)
        {
            if(is_array($value) && !empty($value))
            {
                $table = $tables->get($key);
                $count = count($value);

                if($count === 1)
                {
                    $primary = current($value);
                    $route = Specific::make(['table'=>$table,'primary'=>$primary]);
                    $uri = $route->uri();
                    $title = $route->title();
                }

                else
                {
                    $route = General::make(['table'=>$table]);
                    $searchQuery = $route->getSearchQuery();
                    $uri = Base\Uri::changeQuery([$searchQuery=>$search],$route->uri());
                    $title = $route->title("% ($count)");
                }

                $liHtml = Html::a($uri,$title);
                $r .= Html::li($liHtml);
            }
        }

        return Html::ulCond($r);
    }


    // makeForm
    // génère le form pour le formulaire de recherche
    final public function makeForm():string
    {
        $r = '';
        $tables = $this->db()->tables()->searchable();

        if($tables->isNotEmpty())
        {
            $lang = static::lang();
            $minLength = $tables->searchMinLength();
            $name = $this->getSearchName();
            $data = ['required'=>true,'pattern'=>['minLength'=>$minLength]];

            $r .= $this->formOpen();
            $searchHtml = Html::inputText(null,['name'=>$name,'placeholder'=>$lang->text('search/submit'),'data'=>$data,'inputmode'=>'search']);
            $searchHtml .= Html::submit(true,['button','icon-solo','search']);
            $r .= Html::div($searchHtml,['data'=>['absolute-placeholder'=>true,'only-height'=>true]]);

            $r .= Html::div(null,'popup');
            $r .= Html::div($this->makeSearchInfo($minLength,$tables),'search-info');
            $r .= Html::formCl();
        }

        return $r;
    }


    // makeSearchInfo
    // génère le html pour le searchInfo
    final protected function makeSearchInfo(int $minLength,Orm\Tables $tables):string
    {
        $r = '';
        $lang = static::lang();
        $replace = ['count'=>$minLength];
        $note = $lang->plural($minLength,'search/config',$replace);

        $firstHtml = Html::span($lang->text('search/note').':');
        $firstHtml .= Html::span($note,'note');
        $r .= Html::div($firstHtml,'first');

        $secondHtml = Html::span($lang->text('search/in').':');
        $secondHtml .= Html::span(implode(', ',$tables->pair('label')),'labels');
        $r .= Html::div($secondHtml,'second');

        return $r;
    }


    // searchable
    // retourne les tables cherchables et ayant les permission
    // est public car utilisé dans template
    final public function searchable():Orm\Tables
    {
        return $this->db()->tables()->searchable()->hasPermission('search','view');
    }
}

// init
Search::__init();
?>