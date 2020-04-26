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
use Quid\Core;

// error
// extended class for a column that manages an error object
class Error extends Core\Col\Error
{
    // config
    public static array $config = [];


    // onGet
    // sur onGet recrée l'objet error si c'est du json, si cms var export
    final protected function onGet($return,array $option)
    {
        $return = parent::onGet($return,$option);

        if(!empty($return) && !empty($option['context']) && $option['context'] === 'cms:specific')
        $return = Base\Debug::export($return);

        return $return;
    }
}

// init
Error::__init();
?>