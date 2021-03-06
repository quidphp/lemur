<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;

// date
// extended class for a date column, supports many date formats
class Date extends Core\Col\Date
{
    // config
    protected static array $config = [
        'anchorCorner'=>true,
        'absolutePlaceholder'=>true,
        'onComplex'=>true,
        'calendarFormat'=>'dateToDay',
        '@cms'=>[
            'route'=>['calendar'=>Lemur\Cms\Calendar::class]]
    ];


    // formComplex
    // génère le formulaire complex pour date
    // un petit calendrier apparaît en popup
    final public function formComplex($value=true,?array $attr=null,?array $option=null):string
    {
        $return = '';
        $tag = $this->complexTag($attr);

        if(Html::isFormTag($tag,true))
        {
            $this->checkFormatCalendar();
            $value = $this->valueComplex($value);
            $format = $this->date(true);
            $placeholder = Base\Datetime::placeholder($format);
            $timestamp = Base\Datetime::now();

            if(is_int($value))
            $timestamp = $value;

            elseif(is_string($value))
            {
                $v = Base\Datetime::time($value,$format);
                if(is_int($v))
                $timestamp = $v;
            }

            $route = static::route('calendar',['timestamp'=>true,'format'=>$format]);

            $formatCalendar = strtolower(Base\Datetime::placeholder($this->attr['calendarFormat']));
            $placeholderMaxLength = strlen($placeholder);
            $attr = Base\Attr::append($attr,['placeholder'=>$placeholder,'maxlength'=>$placeholderMaxLength]);
            $return .= $this->form($value,$attr,$option);

            $data = ['char'=>$route::getReplaceSegment(),'format'=>$formatCalendar,'current'=>$timestamp,'href'=>$route];
            $popup = Html::div(null,['calendar','data'=>$data]);
            $return .= Html::div($popup,'calendar-popup');
        }

        else
        $return .= parent::formComplex($value,$attr,$option);

        return $return;
    }
}

// init
Date::__init();
?>