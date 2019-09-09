<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Core;
use Quid\Base;

// error
// extended class for a column that manages an error object as a value
class Error extends Core\Col\Error
{
    // config
    public static $config = [];


    // onGet
    // sur onGet recrée l'objet error si c'est du json, si cms var export
    public function onGet($return,array $option)
    {
        $return = parent::onGet($return,$option);

        if(!empty($return) && !empty($option['context']) && $option['context'] === 'cms:specific')
        $return = Base\Debug::export($return);

        return $return;
    }
}

// config
Error::__config();
?>