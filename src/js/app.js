/*jslint white: true */

$(document).ready( function() {

    // SET-UP

    // Element Variables
    var parentEl = $( '#pomodoro-clock' );
    var startButton = $( '#start-time' );
    var pauseButton = $( '#pause-time' );
    var resetButton = $( '#reset-time' );

    var timerDisplay = $( '#timer' );

    var workTimeField = $( '#work-time' );
    var breakTimeField = $( '#break-time' );


    // HELPER FUNCTIONS

    // Accept minutes
    // Return number of seconds
    // Given 15 expect 900
    // Given 22 expect 1320
    function convertToSeconds( minutes ) {

        //console.log( 'convertToSeconds called' );

        minutes = parseInt( minutes, 10 );

        return minutes * 60;

    }

    // Accept number of seconds
    // Returns formatted number and seconds, separated by colon, as string
    // Given 1260 expect 21:00
    // Given 713 expect 11:53
    // Given 2 expect :02
    function formatTime( seconds ) {

        //console.log( 'formatTime called' );

        var minutes = ( Math.floor( seconds / 60 ).toString() > 0 ) ? Math.floor( seconds / 60 ).toString() : '';
        var seconds = seconds % 60;

        return minutes + ':' + ("0" + seconds).slice(-2);

    }

    // Accept time input
    // Render time to element
    function updateTimerDisplay( timeString ) {

        //console.log( 'updateTimerDisplay called' );

        return timerDisplay.html( timeString );

    }

    // Play audio
    function playAudio() {

       var audio = document.getElementById( 'audio' );

       audio.play();

    }

    // Percent complete
    // totalTime = 10, spentTime = 5 expect 50%
    // totalTime = 12, spentTime = 3 expect 75%
    function percentRemaining( totalTime, spentTime ) {

        var timeRemaining = totalTime - spentTime;

        return (timeRemaining / totalTime) * 100;

    }

    // Update timer percent display
    function updatePercentDisplay( percentRemaining ) {

        $( '#timer-inner' ).css( 'height', percentRemaining + '%' );

    }

    // Add field styling
    function fieldStyling( name, min, max ) {
        $("input[name='" + name + "']").TouchSpin({
            buttondown_class: "btn btn-link",
            buttonup_class: "btn btn-link",
            min: min,
            max: max
        });
    }

    // DISPLAY FUNCTIONS

    // Reset
    // Sets display back to original state
    function resetDisplay() {

        // Display formatted work minutes displayed in timer
        updateTimerDisplay( formatTime( convertToSeconds( workTimeField.prop( 'value' ) ) ) );

        $( '#timer-inner' ).css( 'height', 0 + '%' );

        // Display start button
        startButton.show();

        // Hide pause button
        pauseButton.hide();

        // Hide reset button
        resetButton.hide();

        // Reenable field selectors
        $( 'input' ).prop( 'disabled', false );

        // Apply field styling (bootstrap-touchspin.js)
        fieldStyling( 'work-time', 15, 30 );
        fieldStyling( 'break-time', 5, 10 );


    }

    // Pause
    // Sets display to paused state
    function pauseDisplay( context ) {

        // Toggle class on timer
        timerDisplay.toggleClass( 'isPaused' );

        // Toggle pause button class
        context.toggleClass( 'isPaused btn-danger' );
        
    }

    // Countdown
    // Sets display to timer counting down state
    function countdownDisplay() {

        // Hide start button
        startButton.hide();

        // Show pause button
        pauseButton.show();

        // Show reset button
        resetButton.show();

        // Disable the field selectors
        $( 'input' ).prop( 'disabled', true );

    }


    // Countdown function
    // Accepts minutes int, timer name string and callback function
    // Counts down time and displays time remaining at 1 second intervals until 0
    function startTimer( minutes, name, callback ) {

        console.log( 'startTimer started' );

        // Add timer name to body class for styling purposes
        $( 'body' ).addClass( name );

        var seconds = convertToSeconds( minutes );

        var interval = setInterval( function() {

            resetButton.click( function( event ) {

                clearInterval( interval );
                resetDisplay();

            } );

            // If the timer has the isPaused class, don't run interval
            if( timerDisplay.hasClass( 'isPaused' ) ) {

                console.log( 'Paused' );

            } else {
                
                if( seconds === 0 ) {
                    clearInterval( interval );

                    playAudio();

                    callback();

                    return;
                }
                seconds--;

                updateTimerDisplay( formatTime( seconds ) );

                updatePercentDisplay( percentRemaining( convertToSeconds( minutes ), seconds ) );

                //console.log( percentRemaining( convertToSeconds( minutes ), seconds ) );
                
            }

        },
        1000 );
        return true;

    }

    // SET UP
    resetDisplay();


    // EVENT LISTENERS

    // Start action
    // Triggers start work timer, then start break timer
    startButton.click( function() {

        //console.log( 'Start click event' );

        // Capture minute values of the work time and break time fields
        var workMins = workTimeField.prop( 'value' );
        var breakMins = breakTimeField.prop( 'value' );

        // Set display to countdown state
        countdownDisplay();

        // Start the work countdown
        startTimer( workMins, 'work-timer' , function() {

            // Start the break countdown
            startTimer( breakMins, 'break-timer' , function() {

                // Reset display to intial state
                resetDisplay();

                return;
            } );
        } );
    
    } );

    // Pause action
    // Pauses counter
    pauseButton.click( function( event ) {

        //console.log( 'Pause click event' );

        // Set display to pause state
        pauseDisplay( $(this) );

    } );

    // Change action
    // Updates display of work minutes
    workTimeField.on( 'change', function( event ) {

        //console.log( $( this ).prop( 'value' ) );

        // Update formatted work minutes displayed in timer
        updateTimerDisplay( formatTime( convertToSeconds( $( this ).prop( 'value' ) ) ) );

    } );




});