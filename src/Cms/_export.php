<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;

// _export
// trait that provides commonly used methods for exporting data from the CMS
trait _export
{
    // trait
    use _general;


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
    // retourne les segments à utiliser pour la création de l'objet sql de generalExport
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