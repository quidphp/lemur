<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Core;
use Quid\Main;
use Quid\Lemur;

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
            'fr'=>'specifique/calendrier/[timestamp]/[format]/[selected]',
            'en'=>'specific/calendar/[timestamp]/[format]/[selected]'],
        'segment'=>[
            'timestamp'=>'structureSegmentTimestampMonth',
            'format'=>'structureSegmentStr',
            'selected'=>'structureSegmentSelected'],
        'match'=>[
            'ajax'=>null,
            'role'=>['>='=>20]]
    ];


    // setCallback
    // change les callback pour le calendrier de specific
    public function setCallback(Main\Calendar $return):Main\Calendar
    {
        $return->setCallback('prev',function(int $value) {
            $route = $this->changeSegments(['timestamp'=>$value]);
            return $route->a(null,['ajax','prev','white','icon','solo']);
        });
        $return->setCallback('next',function(int $value) {
            $route = $this->changeSegments(['timestamp'=>$value]);
            return $route->a(null,['ajax','next','white','icon','solo']);
        });

        return $return;
    }
}

// init
SpecificCalendar::__init();
?>