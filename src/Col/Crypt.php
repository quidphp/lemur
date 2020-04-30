<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Col;
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Orm;

// crypt
// extended class for a column with crypted data
class Crypt extends Core\ColAlias
{
    // config
    protected static array $config = [
        'tag'=>'inputText',
        'check'=>['kind'=>'char'],
        'secretKey'=>null
    ];


    // onGet
    // logique onGet pour un champ crypt
    protected function onGet($return,?Orm\Cell $cell=null,array $option)
    {
        $return = parent::onGet($return,$cell,$option);

        if(!empty($cell) && !empty($option['context']) && is_string($option['context']) && strpos($option['context'],':general') !== false)
        $return = $this->makeCryptStatus($cell);

        else
        {
            if(!empty($cell))
            $return = $cell->value();

            if(is_string($return) && strlen($return))
            {
                $secret = $this->getSecretKey();
                $return = Base\Crypt::opensslDecrypt($return,$secret);
            }
        }

        return $return;
    }


    // onSet
    // gère la logique onSet pour crypt
    // si la valeur est une string vide, utilise la valeur courant de la cell
    protected function onSet($return,?Orm\Cell $cell=null,array $row,array $option)
    {
        $return = parent::onSet($return,$cell,$row,$option);

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
        $return .= $this->makeCryptStatus($value);

        return $return;
    }


    // makeCryptStatus
    // génère la balise pour donner le statut sur le cryptage
    final protected function makeCryptStatus(Orm\Cell $value):string
    {
        $return = '';
        $value = $value->get();
        $lang = $this->db()->lang();
        $status = (!empty($value))? 'valid':'invalid';
        $label = $lang->text(['crypt',$status]);
        $return .= Html::div($label,['crypt-status',"crypt-$status"]);

        return $return;
    }


    // getSecretKey
    // retourne le secret à utiliser pour la génération du cryptage
    final public function getSecretKey():string
    {
        $return = $this->getAttr('secret');

        if(empty($return))
        $return = static::boot()->getSecretKey();

        return $return;
    }
}

// init
Crypt::__init();
?>