$(function (){

    var container = document.createElement('div');
    container.setAttribute('id', 'hoverBackgroundContainer');

    var containerForSlider = document.createElement('div');
    containerForSlider.setAttribute('id', 'popupContainerLA');

    container.appendChild(containerForSlider);

    containerForSlider.innerHTML = '';


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