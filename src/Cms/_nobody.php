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
use Quid\Base;
use Quid\Base\Html;
use Quid\Lemur;

// _nobody
// trait which provides commonly used methods for routes where the user is not logged in the CMS
trait _nobody
{
    // trait
    use _templateAlias;
    use Lemur\Route\_browscap;


    // config
    public static array $configNobody = [
        'mainNav'=>false,
        'docOpen'=>[
            'body'=>['background-image'=>'%background%']]
    ];


    // makeButtons
    // fait les boutons sous le formulaire
    abstract protected function makeButtons():string;


    // onReplace
    // change le background de la route
    final protected function onReplace(array $return):array
    {
        $return['background'] = static::boot()->getOption('background');

        return $return;
    }


    // header
    // header seulement le logo
    final public function header()
    {
        $r = '';
        $boot = static::boot();
        $img = Html::ImgCond($boot->getOption('logo'),$boot->label());
        $type = $boot->typePrimary();

        if(!empty($img))
        $r .= Html::a($boot->schemeHost(true,$type),$img,'logo');

        return $r;
    }


    // main
    // fait main pour une page nobody
    final public function main():string
    {
        $r = '';
        $boot = static::boot();

        $route = Login::make();
        $anchor = $route->a($boot->label());
        $buttons = $this->makeButtons();

        $r .= Html::divOp('box');

        $r .= Html::divOp('hgroup');
        $r .= Html::h1($anchor);
        $r .= Html::h2($boot->typeLabel());
        $r .= Html::h3(static::label());
        $r .= Html::divCond($this->makeInfo(),'info');
        $r .= Html::divCl();

        $r .= Html::divCond($this->browscap(),'browscap');
        $r .= Html::div($this->makeForm(),'form');
        $buttons = Base\Arr::clean($buttons);

        if(!empty($buttons))
        {
            $r .= Html::divOp('buttons');

            foreach ($buttons as $key => $value)
            {
                $r .= Html::div($value,'button');
            }

            $r .= Html::divCl();
        }

        $r .= Html::divCl();

        return $r;
    }


    // makeInfo
    // retourne le message d'information
    protected function makeInfo():string
    {
        return '';
    }


    // makeRegister
    // bouton vers la page register, si permis
    final protected function makeRegister():string
    {
        $r = '';

        $route = Register::make();
        if($route->canTrigger())
        $r .= $route->aTitle();

        return $r;
    }


    // makeLogin
    // bouton vers la page login
    final protected function makeLogin():string
    {
        $r = '';

        $route = Login::make();
        if($route->canTrigger())
        $r .= $route->aTitle();

        return $r;
    }


    // makeResetPassword
    // bouton pour regnérer le mot de passe
    final protected function makeResetPassword():string
    {
        $r = '';

        $route = ResetPassword::make();
        if($route->canTrigger())
        $r .= $route->a(static::langText('resetPassword/forgot'));

        return $r;
    }
}
?>