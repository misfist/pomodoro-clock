$(document).ready(function() {

    // SET-UP

    // Element Variables
    var parentEl = $( '#pomodoro-clock' );
    var startButton = $( '#start-time' );
    var pauseButton = $( '#pause-time' );
    var timerDisplay = $( '#timer' );
    var workTimeField = $( '#work-time' );
    var breakTimeField = $( '#break-time' );

    // Hide pause button (until after timer started)
    pauseButton.hide();

    // Display minutes in timer
    updateTimerDisplay( formatTime( convertToSeconds( workTimeField.prop( 'value' ) ) ) );

    // Countdown function
    // Accepts minutes int, timer name string and callback function
    // Counts down time and displays time remaining at 1 second intervals until 0
    function startTimer( minutes, name, callback ) {

        console.log( 'startTimer started' );

        $( 'body' ).addClass( name );

        var seconds = convertToSeconds( minutes );
        // var milliseconds = convertToMilliseconds( minutes );
        //var seconds = 10; // for testing

        var interval = setInterval( function() {

            if( timerDisplay.hasClass( 'isPaused' ) ) {

                console.log( 'Paused' );

            } else {
                
                if( seconds === 0 ) {
                    clearInterval(interval);

                    callback();

                    return;
                }
                seconds--;

                $( '#timer' ).html( formatTime( seconds ) );

            }

        },
        1000 );
        return true;

    }



    // EVENT LISTENERS

    // Start action
    // Triggers start work timer, then start break timer
    startButton.click( function() {

        console.log( 'Start click event' );

        var workMins = workTimeField.prop( 'value' );

        // Disable the start button
        // Hide start button

        //startButton.prop( 'disabled', true );
        startButton.hide();

        // Show pause button
        pauseButton.show();

        // Disable the field selectors
        $( 'input' ).prop( 'disabled', true );

        var workMins = 1; // For testing
        var breakMins = 1;  // For testing

        startTimer( workMins, 'work-timer' , function() {
            startTimer( breakMins, 'break-timer' , function() {

                resetDisplay();

                return;
            } )
        } );
    
    } );

    // Pause action
    // Pauses counter
    pauseButton.click( function( event ) {

        console.log( 'Pause click event' );

        pauseDisplay( $(this) );

    } );

    // Change action
    // Updates display of work minutes
    workTimeField.on( 'change', function( event ) {

        console.log( $( this ).prop( 'value' ) );

        updateTimerDisplay( formatTime( convertToSeconds( $( this ).prop( 'value' ) ) ) );

    } );


    // HELPER FUNCTIONS

    // Reset
    // Sets display back to original state
    function resetDisplay() {

        // Display value of work time in timer
        updateTimerDisplay( formatTime( convertToSeconds( workTimeField.prop( 'value' ) ) ) );

        // Display start button
        startButton.show();

        // Hide pause button
        pauseButton.hide();

        // Reenable field selectors
        $( 'input' ).prop( 'disabled', false );

    }

    // Pause
    // Sets display to paused state
    function pauseDisplay( context ) {

        // Toggle class on timer
        timerDisplay.toggleClass( 'isPaused' );

        // Toggle pause button class
        context.toggleClass( 'isPaused' );
        
    }

    // Accept minutes
    // Return number of seconds
    // Given 15 expect 900
    // Given 22 expect 1320
    function convertToSeconds( minutes ) {

        console.log( 'convertToSeconds called' );

        minutes = parseInt( minutes );

        return minutes * 60;

    }

    // Accepts minutes
    // Return number of milliseconds
    // Given 15 expect 900000
    // Given 22 expect 1320000
    function convertToMilliseconds( minutes ) {

        console.log( 'convertToMilliseconds called' );

        minutes = parseInt( minutes );

        return minutes * 60000;

    }

    // Accept number of seconds
    // Returns formatted number and seconds, separated by colon, as string
    // Given 1260 expect 21:00
    // Given 713 expect 11:53
    // Given 2 expect :02
    function formatTime( seconds ) {

        console.log( 'formatTime called' );

        var minutes = ( Math.floor( seconds / 60 ).toString() > 0 ) ? Math.floor( seconds / 60 ).toString() : '';
        var seconds = seconds % 60;

        return minutes + ':' + ("0" + seconds).slice(-2);

    }

    // Accept time input
    // Render time to element
    function updateTimerDisplay( timeString ) {

        console.log( 'updateTimerDisplay called' );

        return timerDisplay.html( timeString );

    }


});