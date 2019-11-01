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
use Quid\Orm;

// _relation
// trait that provides common methods related to a relation route
trait _relation
{
    // trait
    use _searchGet;


    // config
    public static $configRelation = [
        'limit'=>20,
        'order'=>null, // ordre par défaut
        'query'=>['s']
    ];


    // relation
    // retourne l'objet relation
    abstract public function relation():Orm\Relation;


    // relationSearchRequired
    // retourne vrai si la recherche est requise
    public function relationSearchRequired():bool
    {
        return false;
    }


    // limit
    // retourne la limite à utiliser
    // public car utilisé via d'autres routes
    public function limit():int
    {
        return $this->getAttr('limit');
    }


    // hasPage
    // retourne vrai si la route gère les pages
    public function hasPage():bool
    {
        return ($this->hasSegment('page'))? true:false;
    }


    // isFirstPage
    // retourne vrai si c'est la première page
    public function isFirstPage():bool
    {
        return ($this->hasPage() && $this->segment('page') === 1)? true:false;
    }


    // pageNext
    // retourne la prochaine page si existante
    public function pageNext():?int
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
    protected function relationSearchNot()
    {
        return;
    }


    // loadMore
    // génère le html pour loadMore si relation a page
    protected function loadMore(?int $total=null):string
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
            $data = ['href'=>$route];
            $text = static::langText('common/loadMore',$replace);

            $r .= Html::liOp(['load-more','data'=>$data]);
            $r .= Html::div($text,'text');
            $r .= Html::liCl();
        }

        return $r;
    }


    // hasOrder
    // retourne vrai si la route gère l'ordre
    public function hasOrder():bool
    {
        $return = false;
        $relation = $this->relation();

        if($this->hasSegment('order') && $this->getAttr('order') === true && $relation->size() > 1)
        $return = true;

        return $return;
    }


    // currentOrder
    // retourne l'ordre courant de la route
    public function currentOrder():?int
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
    public function orderSelect():string
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
    public static function validOrders(object $relation):array
    {
        $return = [];
        $lang = static::lang();
        $allowed = $relation->allowedOrdering();

        if(!empty($allowed['key']))
        $return = $lang->take('relationOrder/key');

        if(!empty($allowed['value']))
        $return = Base\Arr::append($return,$lang->take('relationOrder/value'));

        return $return;
    }


    // isValidOrder
    // retourne vrai si l'ordre est valable pour la route
    public static function isValidOrder($value,object $relation):bool
    {
        $return = false;
        $orders = static::validOrders($relation);

        if(is_scalar($value) && !empty($orders) && array_key_exists((int) $value,$orders))
        $return = true;

        return $return;
    }


    // relationGrab
    // lance la recherche de relation ou retourne all si pas de recherche
    protected function relationGrab(?array $option=null):?array
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
}
?>