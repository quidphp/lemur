<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Core;
use Quid\Lemur;

// activatePassword
// abstract class for a route that activates a password that was previously reset
abstract class ActivatePassword extends Core\RouteAlias
{
    // trait
    use Lemur\Segment\_primary;
    use Lemur\Segment\_str;


    // config
    public static $config = [
        'path'=>[
            'fr'=>'mot-de-passe/activation/[primary]/[hash]',
            'en'=>'password/activate/[primary]/[hash]'],
        'segment'=>[
            'primary'=>'structureSegmentPrimary',
            'hash'=>'structureSegmentStr'],
        'match'=>[
            'role'=>'nobody'],
        'parent'=>Login::class,
        'sitemap'=>false,
        'row'=>null // à spécifier dans la classe qui étend
    ];


    // trigger
    // lance la route activatePassword
    public function trigger()
    {
        $user = $this->segment('primary');
        $primary = $user->primary();
        $hash = $this->segment('hash');
        $user::activatePasswordProcess($primary,$hash,['com'=>true]);

        return;
    }


    // onAfter
    // donne la route vers le parent
    protected function onAfter():Lemur\Route
    {
        return static::makeParentOverload();
    }
}

// init
ActivatePassword::__init();
?>