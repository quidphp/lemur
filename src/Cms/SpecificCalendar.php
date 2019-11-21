<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Cms;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;
use Quid\Main;

// specificCalendar
// class for the calendar route of the CMS
class SpecificCalendar extends Core\RouteAlias
{
    // trait
    use _common;
    use Lemur\Route\_calendar;
    use Lemur\Segment\_timestampMonth;
    use Lemur\Segment\_str;
    use Lemur\Segment\_selected;


    // config
    public static $config = [
        'path'=>[
            'en'=>'specific/calendar/[timestamp]/[format]/[selected]',
            'fr'=>'specifique/calendrier/[timestamp]/[format]/[selected]'],
        'segment'=>[
            'timestamp'=>'structureSegmentTimestampMonth',
            'format'=>'structureSegmentStr',
            'selected'=>'structureSegmentSelected'],
        'history'=>false,
        'match'=>[
            'ajax'=>true,
            'role'=>['>'=>'user']],
        'parent'=>Specific::class,
        'group'=>'specific'
    ];


    // setCallback
    // change les callback pour le calendrier de specific
    final public function setCallback(Main\Calendar $return):Main\Calendar
    {
        $return->setCallback('prev',function(int $value) {
            $route = $this->changeSegments(['timestamp'=>$value]);
            return $route->a(null,['ajax','prev']);
        })
        ->setCallback('next',function(int $value) {
            $route = $this->changeSegments(['timestamp'=>$value]);
            return $route->a(null,['ajax','next']);
        })
        ->setCallback('day',function(int $value,int $timestamp,array $attr) {
            return Html::button($value);
        });

        return $return;
    }
}

// init
SpecificCalendar::__init();
?>