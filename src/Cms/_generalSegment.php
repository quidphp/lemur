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
use Quid\Core;
use Quid\Lemur;
use Quid\Orm;

// _generalSegment
// trait that provides some methods for a general navigation page
trait _generalSegment
{
    // trait
    use Lemur\Route\_searchGet;


    // config
    public static array $configGeneralSegment = [
        'maxPerPage'=>100,
        'query'=>['s']
    ];


    // hasTablePermission
    // méthode utilisé pour certaines requêtes de permissions
    final protected function hasTablePermission(string ...$types):bool
    {
        return $this->table()->hasPermission(...$types);
    }


    // generalSegments
    // retourne les segments à utiliser pour la création de l'objet sql
    abstract protected function generalSegments():array;


    // sql
    // crée et conserve l'objet sql à partir des segments fournis par generalSegments
    // les segments dont la table n'a pas la permission sont effacés
    final public function sql():Orm\Sql
    {
        return $this->cache(__METHOD__,function() {
            $return = null;
            $table = $this->table();
            $array = $this->generalSegments();

            if(!array_key_exists('where',$array))
            {
                $where = $table->where();
                if(!empty($where))
                $array['where'] = $where;
            }

            if(array_key_exists('limit',$array) && !is_int($array['limit']))
            $array['limit'] = $table->limit();

            $array['search'] = $this->getSearchValue();

            foreach ($array as $key => $value)
            {
                if(!$this->hasTablePermission($key))
                unset($array[$key]);
            }

            $return = $table->sql($array);

            return $return;
        });
    }


    // rows
    // retourne les rows de la route
    final public function rows():Core\Rows
    {
        return $this->sql()->triggerRows();
    }


    // rowsVisible
    // retourne les rows visible de la route
    final public function rowsVisible():Core\Rows
    {
        return $this->rows()->filter(fn($row) => $row->isVisible());
    }


    // isSearchValueValid
    // retourne vrai si la valeur de recherche est valide
    final protected function isSearchValueValid(string $value):bool
    {
        return $this->table()->isSearchTermValid($value);
    }


    // canReset
    // retourne vrai si la bouton reset peut s'afficher
    final protected function canReset(?string $search=null,$not=null):bool
    {
        $return = false;
        $default = static::getDefaultSegment();

        if(is_string($search))
        $return = true;

        else
        {
            $not = (array) $not;

            $segments = $this->segments();
            $notSegment = Base\Arr::gets($not,$segments);
            $segments = Base\Arr::keysStrip($not,$segments);
            $segments = Base\Obj::cast($segments);

            $new = static::make($notSegment);
            $newSegments = $new->segments();
            $newSegments = Base\Arr::keysStrip($not,$newSegments);
            $newSegments = Base\Obj::cast($newSegments);

            if($segments !== $newSegments)
            $return = true;
        }

        return $return;
    }
}
?>