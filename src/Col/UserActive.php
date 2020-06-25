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

// userActive
// class for the column which manages the active field for the user row
class UserActive extends Core\Col\UserActive
{
    // config
    protected static array $config = [];


    // formComplex
    // génère le formComplex pour userActive
    // retourne un input plain si c'est l'utilisateur courant
    final public function formComplex($value=true,?array $attr=null,?array $option=null):string
    {
        $return = null;
        $session = static::boot()->session();
        $user = $session->user();

        if($value instanceof Core\Cell && $value->row()->primary() === $user->primary())
        $attr = Base\Arr::plus($attr,['tag'=>'div']);

        $return = parent::formComplex($value,$attr,$option);

        return $return;
    }
}

// init
UserActive::__init();
?>