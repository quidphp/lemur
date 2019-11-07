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

// email
// extended class for a column managing email
class Email extends Core\Col\Email
{
    // config
    public static $config = [
        '@cms'=>[
            'generalExcerptMin'=>null]
    ];


    // onGet
    // sur onGet retourne le courriel dans un lien a:mailto
    final protected function onGet($return,array $option)
    {
        $return = $this->value($return);
        $option['context'] = (empty($option['context']))? null:$option['context'];

        if(is_string($return) && !empty($return) && $option['context'] !== 'noHtml')
        {
            if($option['context'] === 'cms:general' && empty($option['excerpt']))
            $option['excerpt'] = 30;

            $title = true;
            if(!empty($option['excerpt']))
            $title = Base\Str::excerpt($option['excerpt'],$return);

            $return = Base\Html::a($return,$title);
        }

        return $return;
    }
}

// init
Email::__init();
?>