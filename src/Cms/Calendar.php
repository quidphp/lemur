<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;
use Quid\Main;

// calendar
// class for the calendar route of the CMS
class Calendar extends Core\RouteAlias
{
    // trait
    use _common;
    use Lemur\Route\_calendar;
    use Lemur\Segment\_timestampMonth;
    use Lemur\Segment\_str;
    use Lemur\Segment\_selected;


    // config
    protected static array $config = [
        'path'=>[
            'en'=>'calendar/[timestamp]/[format]/[selected]',
            'fr'=>'calendrier/[timestamp]/[format]/[selected]'],
        'segment'=>[
            'timestamp'=>'structureSegmentTimestampMonth',
            'format'=>'structureSegmentStr',
            'selected'=>'structureSegmentSelected'],
        'history'=>false,
        'match'=>[
            'ajax'=>true,
            'session'=>'canAccess'],
        'group'=>'popup'
    ];


    // setCallback
    // change les callback pour le calendrier
    final public function setCallback(Main\Calendar $value):void
    {
        $value
        ->setCallback('prev',fn(int $value) => $this->changeSegments(['timestamp'=>$value])->a(null,['ajax','prev']))
        ->setCallback('next',fn(int $value) => $this->changeSegments(['timestamp'=>$value])->a(null,['ajax','next']))
        ->setCallback('day',function(int $value,int $timestamp,array $attr) {
            $attr = ($this->isDayDisabled($value,$timestamp))? ['disabled'=>true]:null;
            return Html::button($value,$attr);
        });
    }


    // isDayDisabled
    // permet de désactiver une journée
    public function isDayDisabled(int $value,int $timestamp):bool
    {
        return false;
    }
}

// init
Calendar::__init();
?>