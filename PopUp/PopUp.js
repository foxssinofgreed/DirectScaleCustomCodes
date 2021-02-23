$(function (){
    new Splide( '#splide' ).mount();

    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.overflow = 'visible';
    container.style.zIndex = '9990';
    container.style.backgroundColor = 'rgb(242, 179, 174, 0.5)';

    var slider = document.createElement('div');
    slider.setAttribute('id', 'splide');
    slider.setAttribute('class', 'splide');

    this.contain = document.createElement('div');
    this.contain.setAttribute('class', 'splide__track');
    this.slider = document.createElement('ul');
    this.slider.setAttribute('class', 'splide__list');
    this.slideOne = document.createElement('li');
    this.slideOne.setAttribute('class', 'splide__slide');
    this.slideTwo = document.createElement('li');
    this.slideTwo.setAttribute('class', 'splide__slide');
    slider.appendChild(this.contain);
    this.contain.appendChild(this.slider);
    this.slider.appendChild(this.slideOne);
    this.slider.appendChild(this.slideTwo);

    container.appendChild(slider);

    function sliderJS(){
        var m = 0;
        $('.class')
    }

/*
<div class="splide__track">
        <ul class="splide__list">
            <li class="splide__slide">Slide 01</li>
            <li class="splide__slide">Slide 02</li>
            <li class="splide__slide">Slide 03</li>
        </ul>
</div>
*/

    document.body.appendChild(container); // At the end
});