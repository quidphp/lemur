<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base;
use Quid\Core;
use Quid\Lemur;
use Quid\Orm;

// crypt
// extended class for a column with crypted data
class Crypt extends Core\ColAlias
{
    // config
    protected static array $config = [
        'cell'=>Lemur\Cell\Crypt::class,
        'tag'=>'inputText',
        'secretKey'=>null
    ];


    // onGet
    // logique onGet pour un champ crypt
    protected function onGet($return,?Orm\Cell $cell=null,array $option)
    {
        if(!empty($cell))
        $return = $cell->value();

        if(is_string($return) && strlen($return))
        {
            $secret = $this->getSecretKey();
            $return = Base\Crypt::opensslDecrypt($return,$secret);
        }

        return $return;
    }


    // onSet
    // gère la logique onSet pour crypt
    // si la valeur est une string vide, utilise la valeur courant de la cell
    protected function onSet($return,?Orm\Cell $cell=null,array $row,array $option)
    {
        if(is_string($return))
        {
            if(strlen($return))
            {
                $secret = $this->getSecretKey();
                $return = Base\Crypt::openssl($return,$secret);
            }

            elseif(!empty($cell))
            $return = $cell->value();
        }

        return $return;
    }


    // formComplex
    // génère le formulaire complex pour crypt
    final public function formComplex($value=true,?array $attr=null,?array $option=null):string
    {
        $return = parent::formComplex(null,$attr,$option);

        if($value instanceof Orm\Cell)
        $return .= $value->makeCryptStatus();

        return $return;
    }


    // getSecretKey
    // retourne le secret à utiliser pour la génération du cryptage
    final public function getSecretKey():string
    {
        return $this->getAttr('secret') ?: static::boot()->getSecretKey();
    }
}

// init
Crypt::__init();
?>