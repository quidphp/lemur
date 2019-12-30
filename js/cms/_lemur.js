/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// lemur
// script of common behaviours for all pages of the CMS

// initial mount
// comportements bindés une seule fois au tout début
ael(document,'doc:mountInitial',function(event,body) {
    // background
    const background = qs(body,"> .background");
    trigSetup(Component.Background.call(background));
    
    // modal
    const modal = qs(body,"> .modal");
    trigSetup(Component.Modal.call(modal));
    
    // specificComponents
    trigSetup(Component.SpecificComponents.call(this));
});


// doc:mountCommon
// événement appelé pour faire les bindings globaux
// après le chargement d'une page ou d'un modal
ael(document,'doc:mountCommon',function(event,node) {
    
    // input
    const input = qsa(node,Dom.selectorInput(false));
    Component.Input.call(input);

    // form
    const form = qsa(node,"form");
    trigSetup(Component.Form.call(form));
    
    // select
    const select = qsa(node,"select");
    trigSetup(Component.FakeSelect.call(select));
    
    // autre
    const anchorCorner = qsa(node,"[data-anchor-corner='1']");
    const absolutePlaceholder = qsa(node,"[data-absolute-placeholder='1']");
    const aConfirm = qsa(node,"a[data-confirm]");
    const popupTrigger = qsa(node,".popup-trigger.with-popup:not(.with-ajax)");
    const popupTriggerAjax = qsa(node,".popup-trigger.with-popup.with-ajax");
    const backToTop = qs(node,"footer .back-to-top");
    
    // anchorCorner
    trigSetup(Component.AnchorCorner.call(anchorCorner));
    
    // absolutePlaceholder
    trigSetup(Component.AbsolutePlaceholder.call(absolutePlaceholder));
    
    // aConfirm
    Component.Confirm.call(aConfirm,'click');
    
    // popupTrigger
    trigSetup(Component.ClickOpenTrigger.call(popupTrigger,{trigger: ".popup-title", target: ".popup"}));
    
    // popupTriggerAjax
    trigSetup(Component.ClickOpenAjaxAnchor.call(popupTriggerAjax,{trigger: ".popup-title", target: ".popup"}));
    
    // backToTop
    trigSetup(Component.BackToTop.call(backToTop));
    
    // modalMailto
    trigSetup(Component.ModalMailto.call(node));
});


// doc:unmountCommon
// événement appelé pour enlever des bindings globaux
ael(document,'doc:unmountCommon',function(event,node) {
    const anchorCorner = qsa(node,"[data-anchor-corner]");
    const absolutePlaceholder = qsa(node,"[data-absolute-placeholder]");
    
    trigTeardown(anchorCorner);
    trigTeardown(absolutePlaceholder);
});


// mount page
// comportements utilisés pour toutes les pages du CMS
ael(document,'doc:mountPage',function(event,node) {
    const burger = qsa(node,"header .burger-menu, .nav-fixed .nav-close");
    const com = qs(node,"main > .inner > .com");
    const subMenu = qsa(node,".with-submenu");
    const carousel = qsa(node,".with-carousel");
    const mainSearch = qs(node,"header .top form");
    
    // burger
    trigSetup(Component.Burger.call(burger));
    
    // com
    trigSetup(Component.Com.call(com));
    
    // carousel
    trigSetup(Component.Carousel.call(carousel,{trigger: ".trigger", target: ".target"}));
    
    // subMenu
    trigSetup(Component.ClickOpenTrigger.call(subMenu,{trigger: ".trigger", target: ".popup", background: "submenu"}));
    
    // mainSearch
    trigSetup(Component.SearchAutoInfo.call(mainSearch,{target: ".popup"}));
});


// document ajax progress
ael(document,'doc:ajaxProgress',function(event,percent,progressEvent) {
    const body = qs(this,"body");
    const progress = qs(body,".loading-progress");
    const html = (percent >= 0 && percent < 100)? "<div class='percent'>"+percent+"%"+"</div>":"";
    setHtml(progress,html);
});


// nobody
// comportement pour les pages nobody, login, resetPassword et register
ael(document,'group:nobody',function(event,node) {
    const browscap = qs(this,"main .browscap");
    const form = qs(this,"main form");
    const cookieDisabled = qs(browscap,".cookie-disabled");
    const unsupportedBrowser = qs(browscap,".unsupported-browser");
    
    trigHdlr(form,'form:focusFirst');
    toggleClass(cookieDisabled,'show',!Browser.allowsCookie());
    toggleClass(unsupportedBrowser,'hide',!Browser.isUnsupported());
});


// changePassword
// comportement pour le popup changer mon mot de passe
ael(document,'modal:accountChangePassword',function(event,modal) {
    const form = qs(modal,"form");
    trigHdlr(form,'form:focusFirst');
});


// home
// comportement pour la page d'accueil du CMS une fois connecté
ael(document,'route:home',function(event,node) {
    
    const feed = qs(node,"main .home-feed");
    const feedTogglers = qsa(feed,".block-head .feed-togglers > a");
    const feedBody = qs(feed,".block-body");
    
    // feedBody
    trigSetup(Component.Feed.call(feedBody));
    
    // feedTogglers
    Component.AjaxBlock.call(feedTogglers,{autoUnbind: true});
    
    setHdlr(feedTogglers,'ajaxBlock:getStatusNode',function(event) {
        return feedBody;
    });
    
    ael(feedTogglers,'ajaxBlock:before',function() {
        setAttr(feedTogglers,'data-selected',0);
        trigEvt(feedBody,'ajaxBlock:unmountContent');
        setAttr(this,'data-selected',1);
    });
    
    ael(feedTogglers,'ajaxBlock:success',function() {
        trigEvt(feedBody,'feed:bind');
    });
});


// general
// comportement pour la page de navigation
ael(document,'route:general',function(event,node) {
    
    const main = qs(node,"main");
    const scroller = qs(main,".container .scroller");
    const search = qs(main,".left > .search");
    const pageLimit = qsa(main,"input[name='limit'],input[name='page']");
    const table = qs(scroller,"table");
    const filter = qsa(table,"th.filterable .filter-outer");
    const colsSorter = qs(table,"th.action");
    const filesSlider = qsa(table,"td[data-group='media'] .slider");
    const quickEdit = qsa(table,"td[data-quick-edit='1'] a.quick-edit");
    const highlight = qsa(table,"tr.highlight");
    
    // page + limit
    Component.InputNumericHref.call(pageLimit);
    
    // search
    trigSetup(Component.SearchSlide.call(search,{inputTarget: "> .form input[type='text']", infoTarget: "> .in"}));
    
    // rowsChecker
    trigSetup(Component.RowsChecker.call(main));
    
    // colsSorter
    trigSetup(Component.ColsSorter.call(colsSorter));
    
    // filter
    trigSetup(Component.Filter.call(filter,{trigger: ".trigger", target: ".popup"}));
    
    // quickEdit
    trigSetup(Component.QuickEdit.call(quickEdit));
    
    // highlight 
    ael(highlight,'mouseover',function(event) {
        toggleClass(this,'highlight',false);
    });
    
    // dragScroll
    trigSetup(Component.ScrollDrag.call(scroller,{selector: 'tbody',targetTag: 'div'}));

    // filesSlider
    trigSetup(Component.TabsNav.call(filesSlider,{target: ".slider-element", prev: ".prev", next: ".next"}));
    
    // unmount
    aelOnce(this,'route:general:unmount',function(event,node) {
        trigHdlrs(quickEdit,'quickEdit:revert');
    });
});


// specificForm mount
// permet de faire tous les bindings des champs (simples et complexes)
ael(document,'specificForm:mount',function(event,node) {
    trigEvt(this,'specificForm:bindMount',node);
    trigEvt(this,'specificForm:bindView',node);
});


// bindMount
// ces champs seront bindés au chargement de la page
ael(document,'specificForm:bindMount',function(event,node) {
    const elements = qsa(node,".form-element");
    trigHdlr(this,'specificComponents:setup',elements,false);
});


// bindView
// ces champs seront bindés à l'initialisation du panneau, lorsqu'ils sont visibles
ael(document,'specificForm:bindView',function(event,node) {
    const elements = qsa(node,".form-element");
    trigHdlr(this,'specificComponents:setup',elements,true);
    
    // anchorCorner
    const anchorCorner = qsa(node,"[data-anchor-corner]");
    trigHdlrs(anchorCorner,'anchorCorner:refresh');
    
    // absolutePlaceholder
    const absolutePlaceholder = qsa(node,"[data-absolute-placeholder]");
    trigHdlrs(absolutePlaceholder,'absolutePlaceholder:refresh');
});


// specificForm unmount
// permet démonter les champs du formulaire
ael(document,'specificForm:unmount',function(event,node) {
    const elements = qsa(node,".form-element");
    trigHdlr(this,'specificComponents:teardown',elements);
});


// specific
// comportement communs pour les pages spécifiques
ael(document,'group:specific',function(event,node) {
    
    const form = qs(node,"main .inner > .specific-form");
    const panel = qsa(form,".panel");

    // champs simples
    trigEvt(this,'specificForm:bindMount',form);
    
    // avec panel
    if(Arr.length(panel) > 1)
    trigSetup(Component.SpecificPanel.call(form),true);
    
    else
    trigEvt(this,'specificForm:bindView',form);
    
    // unmount
    aelOnce(this,'group:specific:unmount',function(event,node) {
        trigEvt(this,'specificForm:unmount',form);
    });
});


// specificMulti
// comportement pour la page de modification multiple
ael(document,'route:specificMulti',function(event) {
    
    const form = qs(this,"main .inner > form.specific-form");
    trigSetup(Component.SpecificMulti.call(form));
});