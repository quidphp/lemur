<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Main;

// contact
// class to work with a row of the contact table, stores contact messages
abstract class Contact extends Core\RowAlias
{
    // config
    public static $config = [
        'cols'=>[
            'context'=>true,
            'name'=>['required'=>true],
            'phone'=>['required'=>true,'general'=>true],
            'email'=>['required'=>true],
            'message'=>['required'=>true,'validate'=>['strLatin']]],
        'emailModel'=>[ // custom, modele de courriel
            'contactAdmin'=>null,
            'contactConfirm'=>null],
        'formWrap'=>'br', // utilisé comme séparateur de form
        'fields'=>['name','phone','email','message'] // colonnes à afficher pour le formulaire
    ];


    // getAdminEmail
    // retourne le email de l'administrateur
    abstract public function getAdminEmail():array;


    // contactAdminEmailModel
    // retourne le modele de courriel pour envoyer à l'administrateur si existant
    final public function contactAdminEmailModel():?Main\Contract\Email
    {
        $return = null;
        $key = $this->getAttr('emailModel/contactAdmin');

        if(!empty($key))
        $return = Core\Row\Email::find($key);

        return $return;
    }


    // contactConfirmEmailModel
    // retourne le modele de courriel pour envoyer au visiteur si existant
    final public function contactConfirmEmailModel():?Main\Contract\Email
    {
        $return = null;
        $key = $this->getAttr('emailModel/contactConfirm');

        if(!empty($key))
        $return = Core\Row\Email::find($key);

        return $return;
    }


    // hasEmailName
    // retourne vrai si le visiteur dans l'entrée de contact a un courriel et un nom
    final public function hasEmailName()
    {
        return ($this->cellName()->isNotEmpty() && $this->email()->is('email'))? true:false;
    }


    // email
    // retourne la cellule du email
    final public function email(...$args)
    {
        return $this->cell('email')->pair(...$args);
    }


    // toEmail
    // retourne email=>name lors de l'envoie dans un email
    final public function toEmail():?array
    {
        $return = null;

        if($this->hasEmailName())
        {
            $email = $this->email()->value();
            $name = $this->cellName()->value();
            $return = [$email=>$name];
        }

        return $return;
    }


    // onInserted
    // lors de l'insertion d'un nouveau contact, envoie le email
    final protected function onInserted(array $option)
    {
        $this->sendEmail($option);

        return;
    }


    // sendEmail
    // envoie les courriels de confirmation à l'administrateur et au visiteur
    final protected function sendEmail(?array $option=null):int
    {
        $return = 0;
        $option = Base\Arr::plus(['method'=>'dispatch'],$option);

        $replace = $this->getReplaceEmail();
        $method = $option['method'];
        $adminEmail = $this->getAdminEmail();
        $contactAdmin = $this->contactAdminEmailModel();
        $contactConfirm = $this->contactConfirmEmailModel();

        if(!empty($contactConfirm))
        {
            $send = $contactConfirm->$method(null,$this,$replace);

            if($send === true)
            $return++;
        }

        if(!empty($contactAdmin) && !empty($adminEmail))
        {
            $send = $contactAdmin->$method(null,$adminEmail,$replace);

            if($send === true)
            $return++;
        }

        return $return;
    }


    // getReplaceEmail
    // retourne le tableau de remplacement pour les courriels
    final protected function getReplaceEmail():array
    {
        $return = [];
        $boot = static::boot();
        $option = ['context'=>'noHtml'];
        $cells = $this->cells()->gets(...static::getCols());
        $model = '%label%: %get%';

        $return['name'] = $boot->label();
        $return['host'] = $boot->schemeHost(true,'app');
        $return['link'] = $this->route('cms')->uriAbsolute();
        $return['data'] = implode(PHP_EOL,$cells->htmlStr($model,false,$option));

        return $return;
    }


    // makeForm
    // génère le formulaire de contact
    final public static function makeForm(?array $flash=null):string
    {
        $r = '';
        $table = static::tableFromFqcn();
        $formWrap = static::$config['formWrap'];

        foreach($table->cols(...static::getCols()) as $col)
        {
            $name = $col->name();
            $value = (is_array($flash) && array_key_exists($name,$flash))? $flash[$name]:null;

            $r .= Html::divOp(['field',$col]);
            $r .= $col->formWrap($formWrap,null,$value);
            $r .= Html::divCl();
        }

        return $r;
    }


    // getCols
    // retourne les colonnes à mettre dans le formulaire
    final protected static function getCols():array
    {
        return static::$config['fields'];
    }
}

// init
Contact::__init();
?>