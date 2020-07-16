<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Base;
use Quid\Main;

// _calendar
// trait that provides most methods to make a calendar route
trait _calendar
{
    // config
    protected static array $configCalendar = [
        'calendar'=>Main\Calendar::class // classe du calendrier
    ];


    // getTimestamp
    // retourne le timestamp
    final protected function getTimestamp():int
    {
        $return = null;
        $value = $this->segment('timestamp');

        if(is_string($value))
        {
            if(Base\Datetime::isFormat('ym',$value))
            $value = Base\Datetime::time($value,'ym');

            elseif(Base\Datetime::isFormat('dateToDay',$value))
            $value = Base\Datetime::time($value,'dateToDay');
        }

        if(!is_int($value))
        $value = null;

        $return = Base\Datetime::floorMonth($value);

        return $return;
    }


    // calendar
    // génère l'objet calendrier
    final protected function calendar():Main\Calendar
    {
        $class = $this->getAttr('calendar');

        if(empty($class))
        static::throw('noCalendarClassProvided');

        $timestamp = $this->getTimestamp();
        $return = $class::newOverload($timestamp);
        $timestamp = $return->timestamp();

        if($this->hasSegment('format'))
        {
            $format = $this->segment('format');
            if(!empty($format))
            $return->setFormat($format);
        }

        if($this->hasSegment('selected'))
        {
            $selected = $this->segment('selected');
            if(!empty($selected))
            $return->setSelected($selected);
        }

        $this->setCallback($return);

        return $return;
    }


    // setCallback
    // méthode abstraite pour ajouter des callback à l'objet calendrier
    abstract protected function setCallback(Main\Calendar $value):void;


    // html
    // génère le html pour la page
    final public function html()
    {
        return $this->calendar()->output();
    }


    // trigger
    // lance la route calendrier
    final public function trigger():string
    {
        return $this->html();
    }
}
?>