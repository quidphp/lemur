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
    public static $config = [
        'path'=>[
            'en'=>'search',
            'fr'=>'recherche'],
        'match'=>[
            'role'=>['>'=>'user'],
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

            if($search !== null)
            $return = true;
        }

        return $return;
    }


    // canTrigger
    // la route peut être triggé
    final public function canTrigger():bool
    {
        return (parent::canTrigger() && $this->hasPermission('search'))? true:false;
    }


    // isSearchValueValid
    // retourne vrai si le terme de recherche est valide
    final protected function isSearchValueValid(string $value):bool
    {
        $return = false;
        $searchable = $this->searchable();

        if($searchable->isNotEmpty() && $searchable->isSearchTermValid($value))
        $return = true;

        return $return;
    }


    // trigger
    // lance la route search
    final public function trigger():string
    {
        $r = '';
        $search = $this->getSearchValue();
        $searchable = $this->searchable();
        $results = $searchable->search($search);
        $r .= $this->makeResults($results);

        if(empty($r))
        $r = Html::h3(static::langText('search/notFound'));

        return $r;
    }


    // makeResults
    // retourne les résultats de la recherche
    final protected function makeResults(array $array):string
    {
        $r = '';
        $tables = $this->db()->tables();
        $search = $this->getSearchValue();

        if(!empty($array))
        {
            $r .= Html::ulOp();

            foreach ($array as $key => $value)
            {
                if(is_array($value) && !empty($value))
                {
                    $table = $tables->get($key);
                    $count = count($value);
                    $route = General::make(['table'=>$table]);
                    $searchQuery = $route->getSearchQuery();
                    $uri = Base\Uri::changeQuery([$searchQuery=>$search],$route->uri());
                    $title = $route->title("% ($count)");

                    $r .= Html::liOp();
                    $r .= Html::a($uri,$title);
                    $r .= Html::liCl();
                }
            }

            $r .= Html::ulCl();
        }

        return $r;
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
            $data = ['keyupDelay'=>800,'required'=>true,'pattern'=>['minLength'=>$minLength]];

            $r .= $this->formOpen();
            $r .= Html::divOp(['data'=>['absolute-placeholder'=>true,'absolute-placeholder-height'=>true]]);
            $r .= Html::inputText(null,['name'=>$name,'placeholder'=>$lang->text('search/submit'),'data'=>$data]);
            $r .= Html::submit(true,['button','icon-solo','search']);
            $r .= Html::divCl();
            $r .= Html::div(null,'popup');
            $r .= Html::div($this->makeSearchIn($minLength,$tables),'search-in');
            $r .= Html::formClose();
        }

        return $r;
    }


    // makeSearchIn
    // génère le html pour le searchIn
    final protected function makeSearchIn(int $minLength,Orm\Tables $tables):string
    {
        $r = '';
        $lang = static::lang();
        $replace = ['count'=>$minLength];
        $note = $lang->plural($minLength,'search/config',$replace);

        $r .= Html::divOp('first');
        $r .= Html::span($lang->text('search/note').':');
        $r .= Html::span($note,'note');
        $r .= Html::divCl();
        $r .= Html::divOp('second');
        $r .= Html::span($lang->text('search/in').':');
        $r .= Html::span(implode(', ',$tables->pair('label')),'labels');
        $r .= Html::divCl();

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