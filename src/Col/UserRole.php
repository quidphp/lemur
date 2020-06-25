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

// userRole
// class for the column which manages the role field for the user row
class UserRole extends Core\Col\UserRole
{
    // config
    protected static array $config = [
        'sortable'=>false,
        'complex'=>'radio', // ici possible de mettre checkbox pour multiples roles
        'preValidate'=>['setMaxCount'=>1]
    ];


    // formComplex
    // génère le formComplex pour userRole
    // retourne un input plain si c'est l'utilisateur courant
    final public function formComplex($value=true,?array $attr=null,?array $option=null):string
    {
        $return = null;
        $session = $current = static::boot()->session();
        $user = $session->user();

        if($value instanceof Core\Cell && $value->row()->primary() === $user->primary())
        $attr = Base\Arr::plus($attr,['tag'=>'div']);

        $return = parent::formComplex($value,$attr,$option);

        return $return;
    }
}

// init
UserRole::__init();
?>