<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/site/blob/master/LICENSE
 * Readme: https://github.com/quidphp/site/blob/master/README.md
 */

namespace Quid\Lemur\Route;
use Quid\Core;
use Quid\Orm;

// _specificSlug
// trait with methods to work with a specific resource represent by a URI slug
trait _specificSlug
{
    // canTrigger
    // si la route peut être lancé
    final public function canTrigger():bool
    {
        return (parent::canTrigger() && $this->rowExists() && $this->row()->isVisible())? true:false;
    }


    // rowExists
    // retourne vrai si la route existe
    final public function rowExists():bool
    {
        return ($this->segment('slug') instanceof Core\Row)? true:false;
    }


    // row
    // retourne la row
    final public function row():Core\Row
    {
        return $this->segment('slug');
    }


    // makeTitle
    // fait le titre de la route
    final protected function makeTitle(?string $lang=null)
    {
        $return = null;
        $row = $this->row();
        $name = $row->cellName();

        if(!empty($name))
        {
            $str = $name->name();
            $pattern = Orm\ColSchema::stripPattern($str) ?? $str;
            $return = $row->cellPattern($pattern,$lang);

            if(empty($return))
            $return = $name;
        }

        return $return;
    }


    // allSegment
    // génère tous les combinaisons possibles pour le sitemap
    final public static function allSegment()
    {
        $return = [];
        $class = static::rowClass();

        foreach ($class::grabVisible() as $row)
        {
            if($row->inAllSegment() && !in_array($row,$return,true))
            $return[] = $row;
        }

        return $return;
    }
}
?>