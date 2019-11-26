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
use Quid\Lemur;

// _export
// trait that provides commonly used methods for exporting data from the CMS
trait _export
{
    // trait
    use _common;
    use _general;
    use _generalSegment;
    use Lemur\Segment\_table;
    use Lemur\Segment\_order;
    use Lemur\Segment\_direction;
    use Lemur\Segment\_filter;
    use Lemur\Segment\_primaries;


    // canTrigger
    // vérifie que l'utilisateur a la permission pour exporter la table et qu'il y a des rows à exporter
    final public function canTrigger():bool
    {
        $return = false;
        $table = $this->table();

        if(parent::canTrigger() && !empty($table) && $table->hasPermission('export'))
        {
            $sql = $this->sql();
            $total = $sql->triggerRowCount();

            if($total > 0)
            $return = true;
        }

        return $return;
    }


    // generalSegments
    // retourne les segments à utiliser pour la création de l'objet sql de export
    final protected function generalSegments():array
    {
        return $this->segment(['order','direction','filter','in','notIn']);
    }


    // isType
    // retourne vrai si la valeur est un type valide
    final public static function isType($value):bool
    {
        return (is_string($value) && in_array($value,static::getTypes(),true))? true:false;
    }


    // getTypes
    // retourne les types permis
    final public static function getTypes():array
    {
        return ['format','raw'];
    }


    // defaultType
    // retourne le type par défaut à utiliser
    final public static function defaultType():string
    {
        return current(static::getTypes());
    }
}
?>