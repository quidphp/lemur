<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Route;
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;

// contact
// abstract class for a contact form route
abstract class Contact extends Core\RouteAlias
{
    // config
    public static $config = [
        'path'=>[
            'en'=>'contact-us',
            'fr'=>'nous-joindre'],
        'row'=>Lemur\Row\Contact::class,
        'formWrap'=>'br',
        'pattern'=>null,
        'captcha'=>null
    ];


    // canTrigger
    // retourne vrai si la route peut trigger
    public function canTrigger():bool
    {
        $row = static::rowClass();
        return (!empty($row) && parent::canTrigger() && static::db()->hasTable($row) && $row::canSendEmail());
    }


    // submitRoute
    // route à utiliser pour submit
    public function submitRoute():Lemur\Route\ContactSubmit
    {
        return ContactSubmit::make();
    }


    // submitAttr
    // attribut pour le bouton submit
    public function submitAttr()
    {
        return;
    }


    // getFormData
    // retourne les données par défaut du formulaire, moins prioritaire que flash
    public function getFormData():array
    {
        return [];
    }


    // makeForm
    // génère le formulaire de contact
    protected function makeForm():string
    {
        $r = '';
        $route = $this->submitRoute();
        $submit = static::langText('contact/submit');

        $r .= $route->formOpen();
        $r .= Html::div($this->makeFormRow(),'fields');
        $r .= Html::divCond($this->makeCaptcha(),'captcha');

        $attr = $this->submitAttr();
        $r .= Html::divOp('action');
        $r .= Html::submit($submit,$attr);
        $r .= Html::divCl();

        $r .= Html::formCl();

        return $r;
    }


    // makeFormRow
    // génère la partie du formulaire qui se fait via la row
    final protected function makeFormRow():string
    {
        $r = '';
        $route = $this->submitRoute();
        $row = static::rowClass();
        $flash = Base\Arr::replace($this->getFormData(),static::session()->flash()->get($route));
        $r .= $row::makeForm($this->getAttr('formWrap'),$this->getAttr('pattern'),$flash);

        return $r;
    }


    // makeCaptcha
    // génère le html pour le captcha
    final protected function makeCaptcha():string
    {
        $r = '';
        $captcha = $this->getAttr('captcha');

        if(!empty($captcha))
        {
            $font = $captcha['font'] ?? null;
            $options = $captcha['options'] ?? [];
            $formWrap = $captcha['formWrap'] ?? 'br';
            $label = $captcha['label'] ?? 'common/captcha';

            if(!empty($font))
            {
                $label = static::langText($label);
                $captcha = [true,$font,'captcha',null,$options];
                $r .= Html::captchaFormWrap($label,'br',$captcha);
            }
        }

        return $r;
    }
}

// init
Contact::__init();
?>