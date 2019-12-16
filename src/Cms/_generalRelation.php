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
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;

// _generalRelation
// trait that provides methods to make a filter from a relation
trait _generalRelation
{
    // trait
    use _colRelation;


    // config
    public static $configGeneralRelation = [
        'showCount'=>false, // affiche le total pour chaque filtre
        'showEmptyNotEmpty'=>false, // offre le choix de filtrer par vide/pas vide
    ];


    // getRoute
    // retourne la route à utiliser
    abstract protected function getRoute():Core\Route;


    // col
    // retourne l'objet colonne
    final public function col():Core\Col
    {
        return $this->segment('col');
    }


    // trigger
    // lance la route generalRelation
    final public function trigger():string
    {
        $r = '';
        $grab = $this->relationGrab();
        $emptyNotEmpty = $this->showEmptyNotEmpty();

        if(!empty($grab))
        {
            ['result'=>$results,'count'=>$count] = $grab;
            $selected = $this->segment('selected');

            if(!empty($selected))
            {
                $selected = $this->prepareSelected($selected,$emptyNotEmpty);
                $r .= $this->makeResults($selected,'selected-list');
            }

            if(is_array($results) && !empty($results))
            {
                if($emptyNotEmpty === true && $this->isFirstPage() && !$this->hasSearchValue())
                $results = $this->addEmptyNotEmpty($results,$selected);

                $r .= $this->makeResults($results,null,$count);
            }
        }

        $r = Html::divCond($r,'relation-wrap');

        if(empty($r))
        $r .= Html::h3(static::langText('common/nothing'));

        return $r;
    }


    // relationSearchNot
    // retourne le not à utiliser pour relationSearch
    final protected function relationSearchNot()
    {
        return $this->segment('selected');
    }


    // prepareSelected
    // prépare les éléments sélectionnés, ajoute les empty not empty au besoin
    final protected function prepareSelected(array $value,bool $emptyNotEmpty):array
    {
        $return = [];

        if($emptyNotEmpty === true)
        {
            $emptyNotEmptyArray = $this->getEmptyNotEmptyKeyValue();

            foreach ($value as $v)
            {
                if(is_string($v) && array_key_exists($v,$emptyNotEmptyArray))
                $return[$v] = $emptyNotEmptyArray[$v];
            }
        }

        $return = Base\Arr::append($return,$this->relationKeyValue($value));

        return $return;
    }


    // addEmptyNotEmpty
    // ajoute les empty not empty non sélectionnés dans le tableau de résultat
    final protected function addEmptyNotEmpty(array $array,array $selected):array
    {
        $return = [];
        $not = array_keys($selected);
        $emptyNotEmpty = $this->getEmptyNotEmptyKeyValue($not);
        $return = Base\Arr::append($emptyNotEmpty,$array);

        return $return;
    }


    // getEmptyNotEmptyKeyValue
    // retourn le tableau key value des empty not empty
    // possible de retirer un élément sélectionné
    final protected function getEmptyNotEmptyKeyValue(?array $not=null):array
    {
        $return = [];

        foreach (['00'=>'isEmpty','01'=>'isNotEmpty'] as $key => $label)
        {
            if($not === null || !in_array($key,$not,true))
            {
                $label = static::langText(['common',$label]);
                $label = "-- $label --";
                $return[$key] = $label;
            }
        }

        return $return;
    }


    // makeRoutes
    // retourne un tableau avec toutes les routes de filtre à afficher
    final protected function makeRoutes(array $array):array
    {
        $return = [];

        if(!empty($array))
        {
            foreach ($array as $key => $label)
            {
                if(is_scalar($label))
                {
                    $label = Base\Str::cast($label);
                    $return[$key] = $this->makeOneRoute($key,$label);
                }
            }
        }

        return $return;
    }


    // makeOneRoute
    // méthode utilisé pour générer le tableau d'une route
    final protected function makeOneRoute($key,string $label):array
    {
        $return = [];

        if(Base\Arr::isKey($key))
        {
            $col = $this->segment('col');
            $name = $col->name();
            $route = $this->getRoute();
            $selected = $this->segment('selected');
            $current = $route->segment('filter');
            $current = (is_array($current))? $current:[];
            $currentName = (array_key_exists($name,$current))? $current[$name]:null;

            $label = $col->valueExcerpt($label);

            $label = Html::div($label,'label-content');
            $active = (in_array($key,$selected,true))? true:false;
            $filter = $current;

            $filter[$name] = [$key];
            $route = $route->changeSegments(['filter'=>$filter,'page'=>1]);
            $plus = null;
            $minus = null;

            if(!empty($current) && !empty($currentName))
            {
                $filter = $current;

                if(!array_key_exists($name,$filter) || !is_array($filter[$name]))
                $filter[$name] = [];

                if(in_array($key,$filter[$name],true) && $active === true)
                {
                    $filter[$name] = Base\Arr::valueStrip($key,$filter[$name]);
                    $minus = $route->changeSegments(['filter'=>$filter,'page'=>1]);
                }

                else
                {
                    $filter[$name][] = $key;
                    $plus = $route->changeSegments(['filter'=>$filter,'page'=>1]);
                }
            }

            if($this->showCount() === true)
            $label .= $this->makeShowCount($route);

            $return['label'] = $label;
            $return['active'] = $active;
            $return['route'] = $route;
            $return['plus'] = $plus;
            $return['minus'] = $minus;
        }

        else
        static::throw();

        return $return;
    }


    // makeResults
    // génère les résultats d'affichage de la relation
    final protected function makeResults(array $array,$attr=null,?int $loadMore=null):string
    {
        $r = '';
        $routes = $this->makeRoutes($array);
        $col = $this->segment('col');

        if(!empty($routes))
        {
            foreach ($routes as $key => $value)
            {
                if(is_array($value))
                {
                    $label = $value['label'] ?? null;
                    $selected = $value['active'] ?? null;
                    $route = $value['route'] ?? null;
                    $plus = $value['plus'] ?? null;
                    $minus = $value['minus'] ?? null;

                    if(is_string($label) && strlen($label) && $route instanceof Core\Route && is_bool($selected))
                    {
                        $liAttr = [];
                        $class = ($selected === true)? 'selected':null;
                        $value = $route->a($label,[$class,'replace']);
                        if(!empty($plus) || !empty($minus))
                        $liAttr[] = 'has-icon';

                        if(!empty($plus))
                        $value .= $plus->a(null,['icon-solo','plus']);

                        elseif(!empty($minus))
                        $value .= $minus->a(null,['icon-solo','minus']);

                        $r .= Html::li($value,$liAttr);
                    }

                    else
                    static::throw('invalid',$key);
                }
            }

            if(!empty($r) && is_int($loadMore))
            $r .= $this->loadMore($loadMore);

            $r = Html::ulCond($r,$attr);
        }

        return $r;
    }


    // makeShowCount
    // fait le html pour le count
    final protected function makeShowCount(Core\Route $route):string
    {
        $r = '';
        $sql = $route->sql();
        $count = $sql->triggerWhatCount();
        $r .= Html::div($count,'label-count');

        return $r;
    }


    // makeGeneralRelation
    // construit un input filter
    final public static function makeGeneralRelation(Core\Col $col,Core\Route $currentRoute,$filter,array $attr,$closeAttr=null,?string $label=null):string
    {
        $r = '';
        $name = $col->name();
        $table = $col->table();
        $relation = $col->relation();
        $selected = null;
        $after = null;

        if(is_array($filter) && array_key_exists($name,$filter))
        {
            $selected = $filter[$name];
            $attr[] = 'filtering';
            $closeFilter = Base\Arr::unset($name,$filter);
            $closeRoute = $currentRoute->changeSegments(['filter'=>$closeFilter]);
            $after = $closeRoute->a(null,$closeAttr);
        }

        $route = static::make(['table'=>$table,'col'=>$col,'selected'=>$selected]);
        [$html,$data] = static::commonInsideClickOpen($relation,$route);
        $attr = Base\Attr::append($attr,['data'=>$data]);
        $r .= static::makeClickOpen($html,$label,$after,$attr);

        return $r;
    }


    // showEmptyNotEmpty
    // retourne vrai s'il faut afficher le empty not empty
    final protected function showEmptyNotEmpty():bool
    {
        return ($this->getAttr('showEmptyNotEmpty') === true && $this->segment('col')->isFilterEmptyNotEmpty())? true:false;
    }


    // showCount
    // retourne vrai s'il faut afficher le count
    final protected function showCount():bool
    {
        return $this->getAttr('showCount') ?? false;
    }
}
?>