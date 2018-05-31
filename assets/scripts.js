const carpet = (function () {
    'use strict';

    const CONFIG = {
        itemsToShow: 4,
        firstStart: 1000,
        interval: 3000,
        classes: {
            itemContainer: 'carpet__container'
        }
    };

    let lastNumber,
        imagePool = [],
        allContainers;

    /**
     * References dom objects.
     */
    const setupDomReferences = function () {
        allContainers = document.getElementsByClassName(CONFIG.classes.itemContainer);
    };

    /**
     * Returns a random visible container.
     * @param min
     * @param max
     */
    const getRandomContainer = function (min, max) {
        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * (max - min)) + min;
        } while (randomNumber === lastNumber);
        lastNumber = randomNumber;
        return allContainers[randomNumber];
    };

    /**
     * Generates initial an global image pool and removes from dom
     * containers and images that are in the image pool.
     */
    const generateImagePoolAndRemoveContainers = function () {
        let counter;
        for (counter = (allContainers.length - 1); counter >= CONFIG.itemsToShow; counter--) {
            imagePool.push(allContainers[counter].children[0]);
            allContainers[counter].remove();
        }
        imagePool.reverse();
    };

    /**
     * Update image pool array by removing first image
     * and append removed image to the end.
     * @param imageToRemove
     */
    const updateImagePool = function (imageToRemove) {
        imagePool.shift();
        imagePool.push(imageToRemove);
    };

    /**
     * Fades a image from a random visible containers out.
     */
    const fadeOutAndRemoveImage = function () {
        let containerToReplaceImage = getRandomContainer(0, CONFIG.itemsToShow);
        let imageToRemove = containerToReplaceImage.children[0];
        imageToRemove.style.opacity = '1';
        (function fade() {
            if ((imageToRemove.style.opacity -= 0.01) < 0) {
                imageToRemove.style.display = 'none';
                containerToReplaceImage.innerHTML = '';

                setNewImageAndFadeIn(containerToReplaceImage);
                updateImagePool(imageToRemove);
            } else {
                requestAnimationFrame(fade);
            }
        })();
    };

    /**
     * Sets first image from image pool to container
     * where image has been removed and fades it in.
     * @param containerToReplaceImage
     */
    const setNewImageAndFadeIn = function (containerToReplaceImage) {
        let imageToAdd = imagePool[0];
        imageToAdd.style.opacity = 0;
        imageToAdd.style.display = 'block';
        containerToReplaceImage.appendChild(imageToAdd);
        (function fade() {
            let value = parseFloat(imageToAdd.style.opacity);
            if (!((value += 0.01) > 1)) {
                imageToAdd.style.opacity = value;
                requestAnimationFrame(fade);
            }
        })();
        setTimeout(fadeOutAndRemoveImage, CONFIG.interval);
    };

    /**
     * Initialize java script.
     */
    const init = function () {
        setupDomReferences();
        generateImagePoolAndRemoveContainers();
        setTimeout(fadeOutAndRemoveImage, CONFIG.firstStart);
    };

    return {
        init: init()
    }

})();

carpet.init;
