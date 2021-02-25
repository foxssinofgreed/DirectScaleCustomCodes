$(function (){
    if(window.location.href === 'https://office2.businessbombshells.team/app.html#/Home') {

        var container = document.createElement('div');
        container.setAttribute('id', 'hoverBackgroundContainer');

        var clickAwayContainer = document.createElement('div');
        clickAwayContainer.setAttribute('id', 'clickAwayContainer');

        var containerForSlider = document.createElement('div');
        containerForSlider.setAttribute('id', 'popupContainerLA');

        /*var xClickContainer = document.createElement('div');
        xClickContainer.setAttribute('id', 'clickawayX');*/

        container.appendChild(containerForSlider);
        container.appendChild(clickAwayContainer);

        containerForSlider.innerHTML = '' +
            '<div class="carousel-wrapper">\n' +
            '    <div class="carousel">\n' +
            '\n' +
            '      <img class="carousel__photo initial" src="https://az708413.vo.msecnd.net/bombshells/resources/2fd74432-504f-4e67-b41b-6d64b7248615/ground.png">\n' +
            '      <img class="carousel__photo" src="https://az708413.vo.msecnd.net/bombshells/resources/2fd74432-504f-4e67-b41b-6d64b7248615/ground.png">\n' +
            '      <img class="carousel__photo" src="https://az708413.vo.msecnd.net/bombshells/resources/2fd74432-504f-4e67-b41b-6d64b7248615/ground.png">\n' +
            '      <img class="carousel__photo" src="https://az708413.vo.msecnd.net/bombshells/resources/2fd74432-504f-4e67-b41b-6d64b7248615/ground.png">\n' +
            '      <img class="carousel__photo" src="https://az708413.vo.msecnd.net/bombshells/resources/2fd74432-504f-4e67-b41b-6d64b7248615/ground.png">\n' +
            '\n' +/*
            '      <button class="carousel__button--next"></button>\n' +
            '      <button class="carousel__button--prev"></button>\n' +*/
            '<div class="carousel__controler">\n' +
            '        <a class="carousel__button--prev">❮</a>\n' +
            '        <a class="carousel__button--next">❯</a>\n' +
            '    </div>' +
            '\n' +
            '    </div>\n' +
            '<div id="clickawayX"></div>' +
            '</div>';

        setInterval(function (){
            if(window.location.href === 'https://office2.businessbombshells.team/app.html#/Home' && !document.getElementById('notificationButtonPopup')) {
                setTimeout(function () {
                    var notificationButtonPopup = document.createElement('div');
                    notificationButtonPopup.setAttribute('id', 'notificationButtonPopup');
                    var notificationIconPopup = document.createElement('img');
                    notificationIconPopup.setAttribute('src', 'https://az708413.vo.msecnd.net/bombshells/resources/bfcb41a0-4922-4b85-a0b8-20a571a53210/stack(1).svg');
                    notificationIconPopup.style.width = '24px';
                    notificationIconPopup.style.height = '24px';
                    notificationButtonPopup.appendChild(notificationIconPopup);
                    var headerNotificationsPopup = document.getElementsByClassName('header__right');
                    headerNotificationsPopup[0].insertBefore(notificationButtonPopup, headerNotificationsPopup[0].getElementsByTagName('div')[0]);

                    document.getElementById('notificationButtonPopup').onclick = function popUpClickAway() {
                        document.getElementById('hoverBackgroundContainer').style.visibility = 'visible';
                    }
                }, 1000);
            }
        }, 2000);



        /*
        HTML should look like this:

       <div class="PUcarousel-wrapper">
        <div class="PUcarousel">

          <img class="PUcarousel__photo initial" src="http://placekitten.com/1600/900">
          <img class="PUcarousel__photo" src="http://placekitten.com/g/1600/900">
          <img class="PUcarousel__photo" src="http://placekitten.com/1600/900">
          <img class="PUcarousel__photo" src="http://placekitten.com/1600/900">
          <img class="PUcarousel__photo" src="http://placekitten.com/1600/900">

          <div class="PUcarousel__button--next"></div>
          <div class="PUcarousel__button--prev"></div>

        </div>
      </div>

        */

        document.body.appendChild(container); // At the end

        var itemClassName = "carousel__photo";
        items = document.getElementsByClassName(itemClassName),
            totalItems = items.length,
            slide = 0,
            moving = true;

        // To initialise the carousel we'll want to update the DOM with our own classes
        function setInitialClasses() {

            // Target the last, initial, and next items and give them the relevant class.
            // This assumes there are three or more items.
            items[totalItems - 1].classList.add("prev");
            items[0].classList.add("active");
            items[1].classList.add("next");
        }

        // Set click events to navigation buttons

        function setEventListeners() {
            var next = document.getElementsByClassName('carousel__button--next')[0],
                prev = document.getElementsByClassName('carousel__button--prev')[0];

            next.addEventListener('click', moveNext);
            prev.addEventListener('click', movePrev);
        }

        // Disable interaction by setting 'moving' to true for the same duration as our transition (0.5s = 500ms)
        function disableInteraction() {
            moving = true;

            setTimeout(function () {
                moving = false
            }, 500);
        }

        function moveCarouselTo(slide) {

            // Check if carousel is moving, if not, allow interaction
            if (!moving) {

                // temporarily disable interactivity
                disableInteraction();

                // Preemptively set variables for the current next and previous slide, as well as the potential next or previous slide.
                var newPrevious = slide - 1,
                    newNext = slide + 1,
                    oldPrevious = slide - 2,
                    oldNext = slide + 2;

                // Test if carousel has more than three items
                if ((totalItems - 1) > 3) {

                    // Checks if the new potential slide is out of bounds and sets slide numbers
                    if (newPrevious <= 0) {
                        oldPrevious = (totalItems - 1);
                    } else if (newNext >= (totalItems - 1)) {
                        oldNext = 0;
                    }

                    // Check if current slide is at the beginning or end and sets slide numbers
                    if (slide === 0) {
                        newPrevious = (totalItems - 1);
                        oldPrevious = (totalItems - 2);
                        oldNext = (slide + 1);
                    } else if (slide === (totalItems - 1)) {
                        newPrevious = (slide - 1);
                        newNext = 0;
                        oldNext = 1;
                    }

                    // Now we've worked out where we are and where we're going, by adding and removing classes, we'll be triggering the carousel's transitions.

                    // Based on the current slide, reset to default classes.
                    items[oldPrevious].className = itemClassName;
                    items[oldNext].className = itemClassName;

                    // Add the new classes
                    items[newPrevious].className = itemClassName + " prev";
                    items[slide].className = itemClassName + " active";
                    items[newNext].className = itemClassName + " next";
                }
            }
        }

        // Next navigation handler
        function moveNext() {

            // Check if moving
            if (!moving) {

                // If it's the last slide, reset to 0, else +1
                if (slide === (totalItems - 1)) {
                    slide = 0;
                } else {
                    slide++;
                }

                // Move carousel to updated slide
                moveCarouselTo(slide);
            }
        }

        // Previous navigation handler
        function movePrev() {

            // Check if moving
            if (!moving) {

                // If it's the first slide, set as the last slide, else -1
                if (slide === 0) {
                    slide = (totalItems - 1);
                } else {
                    slide--;
                }

                // Move carousel to updated slide
                moveCarouselTo(slide);
            }
        }

        // Initialise carousel
        function initCarousel() {
            setInitialClasses();
            setEventListeners();

            // Set moving to false now that the carousel is ready
            moving = false;
        }

        // make it rain
        initCarousel();


        document.getElementById('clickawayX').onclick = function popUpClickAway() {
            document.getElementById('hoverBackgroundContainer').style.visibility = 'hidden';
        }
        document.getElementById('clickAwayContainer').onclick = function popUpClickAway() {
            document.getElementById('hoverBackgroundContainer').style.visibility = 'hidden';
        }
    }
});

/*  ------------------------------------------------------------------------------  */
