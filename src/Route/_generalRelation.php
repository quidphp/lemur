<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
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
    public function col():Core\Col
    {
        return $this->segment('col');
    }


    // trigger
    // lance la route generalRelation
    public function trigger():string
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

        $r = Html::divCond($r,'relationWrap');

        if(empty($r))
        $r .= Base\Html::h3(static::langText('common/nothing'));

        return $r;
    }


    // relationSearchNot
    // retourne le not à utiliser pour relationSearch
    protected function relationSearchNot()
    {
        return $this->segment('selected');
    }


    // prepareSelected
    // prépare les éléments sélectionnés, ajoute les empty not empty au besoin
    protected function prepareSelected(array $value,bool $emptyNotEmpty):array
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
    protected function addEmptyNotEmpty(array $array,array $selected):array
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
    protected function getEmptyNotEmptyKeyValue(?array $not=null):array
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
    protected function makeRoutes(array $array):array
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
    protected function makeOneRoute($key,string $label):array
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

            if(static::showCount() === true)
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
    protected function makeResults(array $array,$attr=null,?int $loadMore=null):string
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
                        $value .= $plus->a(null,['icon','plus']);

                        elseif(!empty($minus))
                        $value .= $minus->a(null,['icon','minus']);

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
    protected function makeShowCount(Core\Route $route):string
    {
        $r = '';
        $sql = $route->sql();
        $count = $sql->triggerWhatCount();
        $r .= Html::div($count,'label-count');

        return $r;
    }


    // makeFilter
    // construit un input filter
    public static function makeFilter(Core\Col $col,Core\Route $currentRoute,$filter,$class=null,$closeAttr=null,?string $label=null):string
    {
        $r = '';
        $html = '';
        $name = $col->name();
        $table = $col->table();
        $relation = $col->relation();
        $size = $relation->size();
        $active = false;
        $selected = null;
        $after = null;

        if(is_array($filter) && array_key_exists($name,$filter))
        {
            $active = true;
            $selected = $filter[$name];
            $class[] = 'filtering';
            $closeFilter = Base\Arr::unset($name,$filter);
            $closeRoute = $currentRoute->changeSegments(['filter'=>$closeFilter]);
            $after = $closeRoute->a(null,$closeAttr);
        }

        $route = static::make(['table'=>$table,'col'=>$col,'selected'=>$selected]);
        $limit = $route->limit();
        $query = static::getSearchQuery();
        $data = ['query'=>$query,'separator'=>static::getDefaultSegment(),'char'=>static::getReplaceSegment()];
        if($route->hasOrder())
        $route = $route->changeSegment('order',true);
        $data['href'] = $route;
        $order = $route->orderSelect();

        if($size > $limit)
        {
            $searchMinLength = $col->searchMinLength();
            $html .= Html::divOp('top');
            $placeholder = static::langText('common/filter')." ($size)";
            $html .= Html::inputText(null,['name'=>true,'data-pattern'=>['minLength'=>$searchMinLength],'placeholder'=>$placeholder]);

            if(!empty($order))
            {
                $html .= Html::div(null,'spacing');
                $html .= $order;
            }

            $html .= Html::divCl();
        }

        elseif($size > 1 && !empty($order))
        {
            $html .= Html::divOp('top');
            $html .= $route->orderSelect();
            $html .= Html::divCl();
        }

        $html .= Html::div(null,'results');
        $r .= Html::clickOpen($html,$label,$after,[$class,'data'=>$data]);

        return $r;
    }


    // showEmptyNotEmpty
    // retourne vrai s'il faut afficher le empty not empty
    public function showEmptyNotEmpty():bool
    {
        return (static::$config['showEmptyNotEmpty'] === true && $this->segment('col')->isFilterEmptyNotEmpty())? true:false;
    }


    // showCount
    // retourne vrai s'il faut afficher le count
    public static function showCount():bool
    {
        return static::$config['showCount'] ?? false;
    }
}
?>