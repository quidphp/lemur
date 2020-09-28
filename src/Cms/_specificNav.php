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

// _specificNav
// trait that provides a method for the specific navigation
trait _specificNav
{
    // makeSpecificNav
    // génère la nav à partir d'un objet route vers general
    final protected function makeSpecificNav(Core\Route $general,Core\Row $row,string $segment,?string $highlightSegment=null,?array $attr=null):array
    {
        $return = [];
        $sql = $general->sql();
        $specific = $sql->specific($row);
        $attributes = [];
        $lang = static::lang();

        foreach (['first','prev','count','next','last','back'] as $v)
        {
            $attributes[$v] = [$v];

            if(!empty($attr[$v]))
            $attributes[$v] = Base\Attr::append($attr[$v],$attributes[$v]);
        }

        if(!empty($specific))
        {
            if(!empty($specific['first']))
            {
                $route = $this->changeSegment($segment,$specific['first']);
                $return['first'] = $route->a($lang->text('common/first'),$attributes['first']);
            }

            if(!empty($specific['prev']))
            {
                $route = $this->changeSegment($segment,$specific['prev']);
                $return['prev'] = $route->a($lang->text('common/prev'),$attributes['prev']);
            }

            if(!empty($specific['position']) && !empty($specific['total']))
            {
                $return['countArray'] = [$specific['position'],$lang->text('lc|common/on'),$specific['total']];
                $return['count'] = Html::span(implode(' ',$return['countArray']),$attributes['count']);
            }

            if(!empty($specific['next']))
            {
                $route = $this->changeSegment($segment,$specific['next']);
                $return['next'] = $route->a($lang->text('common/next'),$attributes['next']);
            }

            if(!empty($specific['last']))
            {
                $route = $this->changeSegment($segment,$specific['last']);
                $return['last'] = $route->a($lang->text('common/last'),$attributes['last']);
            }
        }

        $page = (!empty($specific['page']))? $specific['page']:1;
        if(is_int($page))
        {
            $segments = ['page'=>$page];

            if(is_string($highlightSegment))
            $segments[$highlightSegment] = $row;

            $back = $general->changeSegments($segments);
            $return['back'] = $back->a($lang->text('common/back'),$attributes['back']);
        }

        return $return;
    }
}
?>