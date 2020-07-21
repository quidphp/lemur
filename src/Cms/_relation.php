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

// _relation
// trait that provides some initial configuration for a CMS relation route
trait _relation
{
    // trait
    use Lemur\Route\_searchGet;


    // config
    protected static array $configRelationCms = [
        'limit'=>20,
         'query'=>['s'],
        'history'=>false,
        'match'=>[
            'ajax'=>true,
            'session'=>'canAccess'],
        'group'=>'relation',
        'order'=>true,
        'orderSelect'=>true
    ];


    // relation
    // retourne l'objet relation
    abstract public function relation():Orm\Relation;


    // relationSearchRequired
    // retourne vrai si la recherche est requise
    final public function relationSearchRequired():bool
    {
        return false;
    }


    // limit
    // retourne la limite à utiliser
    // public car utilisé via d'autres routes
    final public function limit():int
    {
        return $this->getAttr('limit');
    }


    // hasPage
    // retourne vrai si la route gère les pages
    final public function hasPage():bool
    {
        return $this->hasSegment('page');
    }


    // isFirstPage
    // retourne vrai si c'est la première page
    final public function isFirstPage():bool
    {
        return $this->hasPage() && $this->segment('page') === 1;
    }


    // pageNext
    // retourne la prochaine page si existante
    final public function pageNext():?int
    {
        $return = null;

        if($this->hasPage())
        {
            $page = ($this->segment('page') + 1);
            $limit = $this->limit();
            $limit = [$page=>$limit];
            $option = ['limit'=>$limit];

            $relation = $this->relationGrab($option);

            if(!empty($relation['result']))
            $return = $page;
        }

        return $return;
    }


    // relationSearchNot
    // retourne le not à utiliser pour relationSearch
    final protected function relationSearchNot()
    {
        return;
    }


    // loadMore
    // génère le html pour loadMore si relation a page
    final protected function loadMore(?int $total=null):string
    {
        $r = '';
        $pageNext = $this->pageNext();

        if(is_int($pageNext))
        {
            $page = $this->segment('page');
            $limit = $this->limit();
            $total = (is_int($total))? $total:$this->relation()->size();
            $from = (($page * $limit) + 1);
            $to = ($pageNext * $limit);
            $to = ($to > $total)? $total:$to;

            $replace = ['from'=>$from,'to'=>$to,'total'=>$total];
            $route = $this->changeSegment('page',$pageNext);
            $text = static::langText('relationFeed/loadMore',$replace);

            $text = Html::span($text,'text');
            $r .= $route->a($text,'load-more');
            $r = Html::li($r);
        }

        return $r;
    }


    // hasOrder
    // retourne vrai si la route gère l'ordre
    final public function hasOrder():bool
    {
        return $this->hasSegment('order') && $this->getAttr('order') === true && $this->relation()->size() > 0;
    }


    // hasOrderSelect
    // retourne vrai s'il faut mettre le order select
    final public function hasOrderSelect():bool
    {
        return $this->getAttr('orderSelect') === true;
    }


    // currentOrder
    // retourne l'ordre courant de la route
    final public function currentOrder():?int
    {
        $return = null;

        if($this->hasOrder())
        {
            $return = $this->segment('order');

            if(!is_int($return))
            $return = $this->relation()->defaultOrderCode();
        }

        return $return;
    }


    // orderSelect
    // génère le menu de sélection pour le choix d'ordre
    final public function orderSelect():string
    {
        $return = '';
        $order = $this->currentOrder();
        $relation = $this->relation();
        $orders = static::validOrders($relation);

        if(is_int($order) && is_array($orders) && !empty($orders))
        {
            $select = Html::select($orders,['name'=>true],['selected'=>$order]);
            $return = Html::divCond($select,'order');
        }

        return $return;
    }


    // validOrders
    // retourne les ordres valables pour la route
    final public static function validOrders(object $relation):array
    {
        $return = [];
        $lang = static::lang();
        $allowed = $relation->allowedOrdering();

        if(!empty($allowed['key']))
        $return = $lang->take('relationOrder/key');

        if(!empty($allowed['value']))
        $return = Base\Arr::replace($return,$lang->take('relationOrder/value'));

        return $return;
    }


    // isValidOrder
    // retourne vrai si l'ordre est valable pour la route
    final public static function isValidOrder($value,object $relation):bool
    {
        $orders = static::validOrders($relation);
        return is_scalar($value) && !empty($orders) && array_key_exists((int) $value,$orders);
    }


    // relationGrab
    // lance la recherche de relation ou retourne all si pas de recherche
    final protected function relationGrab(?array $option=null):?array
    {
        $return = null;
        $method = $this->getAttr('method');
        $base = ['limit'=>$this->limit(),'not'=>$this->relationSearchNot(),'method'=>$method,'order'=>$this->currentOrder(),'searchTermValid'=>false];
        $base = Base\Arr::clean($base);
        $option = Base\Arr::plus($base,$option);
        $search = $this->getSearchValue();
        $relation = $this->relation();
        $required = $this->relationSearchRequired();

        if($this->hasPage() && is_int($option['limit']))
        {
            $page = $this->segment('page');
            $option['limit'] = [$page=>$option['limit']];
        }

        if($required === false || $search !== null)
        {
            $array = null;
            $count = 0;
            $optionCount = Base\Arr::plus($option,['limit'=>null]);

            if(is_string($search))
            {
                $count = $relation->searchCount($search,$optionCount);
                $array = $relation->search($search,$option);
            }

            elseif($search === null)
            {
                $array = $relation->all(false,$option);
                $count = $relation->size(true,$optionCount);
            }

            if(is_array($array))
            $return = ['count'=>$count,'result'=>$array];
        }

        return $return;
    }


    // commonInsideClickOpen
    // méthode commune utilisé pour générer l'intérieur d'un clickOpen
    protected static function commonInsideClickOpen(Orm\Relation $relation,Core\Route $route)
    {
        $html = '';
        $data = [];

        if($route->canTrigger())
        {
            $searchMinLength = $relation->searchMinLength();

            $limit = $route->limit();
            $query = $route->getSearchQuery();
            $data = ['query'=>$query,'separator'=>static::getDefaultSegment(),'char'=>static::getReplaceSegment()];
            if($route->hasOrder())
            $route = $route->changeSegment('order',true);
            $data['href'] = $route;

            $order = null;
            if($route->hasOrderSelect())
            $order = $route->orderSelect();

            $size = $relation->size();
            if($size > $limit)
            {
                $placeholder = static::langText('common/filter')." ($size)";

                $searchHtml = Html::inputText(null,['name'=>true,'data-pattern'=>['minLength'=>$searchMinLength],'placeholder'=>$placeholder,'inputmode'=>'search']);
                $searchHtml .= Html::button(null,['icon-solo','search']);
                $topHtml = Html::div($searchHtml,'input-search');

                if(!empty($order))
                {
                    $topHtml .= Html::div(null,'spacing');
                    $topHtml .= $order;
                }

                $html .= Html::div($topHtml,'top');
            }

            elseif($size > 1 && !empty($order))
            $html .= Html::div($order,'top');

            $html .= Html::div(null,'results');
        }

        return [$html,$data];
    }


    // makeClickOpen
    // génère une balise clickOpen, qui contient un container
    // est la base pour un fakeSelect
    final public static function makeClickOpen(?string $value=null,?string $title=null,?string $after=null,$attr=null,?array $option=null):string
    {
        $r = '';
        $r .= Html::button($title,'trigger');
        $r .= Html::div($value,['popup','tabindex'=>0]);

        if(is_string($after))
        $r .= $after;

        return Html::div($r,$attr);
    }
}
?>