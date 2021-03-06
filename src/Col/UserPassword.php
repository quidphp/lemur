<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base\Html;
use Quid\Core;

// userPassword
// class for the column which manages the active field for the user row
class UserPassword extends Core\Col\UserPassword
{
    // config
    protected static array $config = [];


    // formComplex
    // génère le formulaire complex pour password
    final public function formComplex($value=true,?array $attr=null,?array $option=null):string
    {
        $return = '';
        $tag = $this->complexTag($attr);

        if(Html::isFormTag($tag))
        {
            $value = $this->value($value);
            $required = (empty($value));
            $inputs = $this->inputs($attr,$required);

            foreach ($inputs as $attr)
            {
                $return .= Html::inputPassword(null,$attr);
            }
        }

        else
        $return = $this->formComplexNothing();

        return $return;
    }
}

// init
UserPassword::__init();
?>