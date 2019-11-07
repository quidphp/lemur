<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base;
use Quid\Core;

// request
// extended class for a column that manages a request object as a value
class Request extends Core\Col\Request
{
    // config
    public static $config = [];


    // onGet
    // sur onGet recrée l'objet request, si cms var export
    final protected function onGet($return,array $option)
    {
        $return = parent::onGet($return,$option);

        if(!empty($return) && !empty($option['context']) && $option['context'] === 'cms:specific')
        $return = Base\Debug::export($return->safeInfo());

        return $return;
    }
}

// init
Request::__init();
?>